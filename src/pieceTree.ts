import NodePiece, { Piece, Line, PieceType, determinePieceType } from './piece'
import PieceTreeBase from './pieceTreebase'
import PieceTreeNode, { SENTINEL } from './pieceTreeNode'
import {
  DocumentChange,
  InsertChange,
  createInsertChange,
  DeleteChange,
  createDeleteChange,
  FormatChange,
  createFormatChange,
  PiecePatch,
  ChangeStack,
} from './change'
import { PieceMeta, mergeMeta } from './meta'
import { Diff } from './diff'
import StringBuffer from './stringBuffer'
import { CharCode } from 'charCode'
import { applyPatches } from 'immer'
import cloneDeep from 'lodash.clonedeep'

export const EOL = '\n'

export interface PieceTreeConfig {
  initialLines?: Line[]
}

/**
 * Piece Tree Implementation
 *
 * Fundenmental Data Structure To Manage Pieces
 *
 *
 * view ---> operation ---> diff
 *   |<-----------------------|
 *
 * /n - piece1 - piece2 - /n - piece3 - piece4 - /n
 *  |
 * start
 *
 * Every Line Start with a line feed symbol.
 *
 */
export class PieceTree extends PieceTreeBase {
  // A Stack to manage the changes
  private changeHistory: ChangeStack

  constructor(config: PieceTreeConfig = {}, history: ChangeStack) {
    super()

    this.changeHistory = history

    const { initialLines } = config

    // Defaultly add a eol
    this.initByLines(initialLines)
  }

  initByLines(lines?: Line[]) {
    if (lines) {
      const lineBreakStringBuffer = new StringBuffer(EOL)
      this.buffers.push(lineBreakStringBuffer)
      const linBreakBufferindex = this.buffers.length - 1
      let node = this.root
      for (const line of lines) {
        const lbPiece = new NodePiece(linBreakBufferindex, 0, 1, 1, line.meta)
        node = this.insertFixedRight(node, lbPiece)

        for (const ipiece of line.pieces) {
          const { text, length, meta } = ipiece

          let bufferIndex = -1
          if (text) {
            const buffer = new StringBuffer(text)
            this.buffers.push(buffer)
            bufferIndex = this.buffers.length - 1
          }

          const nodePiece = new NodePiece(bufferIndex, 0, length, 0, meta)
          node = this.insertFixedRight(node, nodePiece)
        }
      }
    } else {
      const lineBreakStringBuffer = new StringBuffer(EOL)
      this.buffers.push(lineBreakStringBuffer)
      const linBreakBufferindex = this.buffers.length - 1
      const lbPiece = new NodePiece(linBreakBufferindex, 0, 1, 1)
      this.insertFixedRight(this.root, lbPiece)
    }
  }

  resetByLines(lines?: Line[]) {
    this.freeAll()
    if (lines) {
      this.initByLines(lines)
    }
  }

  /**
   * Actual Operation to undo the change
   * @param change
   */
  doUndo(change: DocumentChange): DocumentChange {
    let diffs: Diff[] = []
    switch (change.type) {
      case 'insert':
        const insertChange = change as InsertChange
        this.deleteInner(insertChange.startOffset, insertChange.length)
        diffs = change.diffs.map(diff => {
          if (diff.type === 'insert') {
            diff.type = 'remove'
          }
          return diff
        })
        break
      case 'delete':
        {
          const deleteChange = change as DeleteChange

          let offset = deleteChange.startOffset

          const nodePosition = this.findByOffset(offset)
          // Start of node
          if (nodePosition.startOffset === offset) {
            let node = nodePosition.node.predecessor()

            if (node === SENTINEL) {
              for (const piece of deleteChange.pieces) {
                this.insertFixedLeft(nodePosition.node, piece)
              }
            } else {
              for (const piece of deleteChange.pieces) {
                this.insertFixedRight(node, piece)
                node = node.successor()
              }
            }
          }
          // End of node
          else if (nodePosition.reminder === nodePosition.node.piece.length) {
            let node = nodePosition.node
            for (const piece of deleteChange.pieces) {
              this.insertFixedRight(node, piece)
              node = node.successor()
            }
          }
        }

        // Change 'remove' to 'insert'
        diffs = change.diffs.map(diff => {
          if (diff.type === 'remove') {
            diff.type = 'insert'
          }
          return diff
        })
        break
      case 'format':
        const formatChange = change as FormatChange
        if (formatChange.piecePatches.length > 0) {
          for (const patch of formatChange.piecePatches) {
            const { startOffset, inversePatches } = patch
            let offset = startOffset

            let { node, reminder } = this.findByOffset(offset)

            if (reminder === node.piece.length) node = node.successor()
            node.piece.meta = applyPatches(node.piece.meta || {}, inversePatches)
          }
        }
        return change
    }

    return { ...change, diffs }
  }

  /**
   * Actual Operation to redo the change
   * @param change
   */
  doRedo(change: DocumentChange): DocumentChange {
    switch (change.type) {
      case 'insert':
        const { startOffset, text, meta } = change as InsertChange
        const txt = this.getTextInBuffer(text[0], text[1], text[2])
        this.insertInner(startOffset, txt, meta)
        break
      case 'delete':
        const deleteChange = change as DeleteChange
        this.deleteInner(deleteChange.startOffset, deleteChange.length)
        break
      case 'format':
        const formatChange = change as FormatChange
        this.formatInner(formatChange.startOffset, formatChange.length, formatChange.meta)
        break
    }

    return change
  }

  /**
   * Insert Content
   * @param offset
   * @param text
   * @param meta
   */
  insertInner(offset: number, text: string = '', meta?: any): DocumentChange {
    const diffs: Diff[] = []

    const addBuffer = this.buffers[0]

    const isEmptyMeta = meta === undefined || meta === null

    const nodePosition = this.findByOffset(offset)
    let { node, reminder, startOffset, startLineFeedCnt } = nodePosition

    if (startOffset === offset) {
      node = node.predecessor()
    } else if (offset > startOffset && offset < startOffset + node.piece.length) {
      const [leftNode] = this.splitNode(node, reminder)
      node = leftNode
    } else {
      startLineFeedCnt += node.piece.lineFeedCnt
    }

    const isNotLinkBreak = node.piece.lineFeedCnt <= 0
    const isContinousInput = node.isNotNil && node.piece.bufferIndex === 0 && addBuffer.length === node.piece.start + node.piece.length

    let txt = ''
    let lineFeedCnt = 0

    for (let i = 0, length = text.length; i < length; i++) {
      let charCode = text.charCodeAt(i)
      if (charCode === CharCode.LineFeed) {
        if (lineFeedCnt === 0 && isContinousInput && isEmptyMeta && isNotLinkBreak && txt) {
          addBuffer.buffer += txt
          node.piece.length += txt.length
          node.updateMetaUpward()
        } else if (txt || (txt && !isEmptyMeta)) {
          node = this.insertFixedRight(node, this.createPiece(txt, meta, 0))
        }

        node = this.insertFixedRight(node, this.createPiece(EOL, meta, 1))

        txt = ''
        lineFeedCnt++
      } else {
        txt += text[i]
      }
    }

    if (lineFeedCnt === 0) {
      if (isContinousInput && isEmptyMeta && isNotLinkBreak && txt) {
        addBuffer.buffer += txt
        node.piece.length += txt.length
        node.updateMetaUpward()
      } else if (txt || !isEmptyMeta) {
        this.insertFixedRight(node, this.createPiece(txt, meta, 0))
      }
    } else if (txt) {
      this.insertFixedRight(node, this.createPiece(txt, meta, 0))
    }

    // Create Diffs
    for (let i = 0; i <= lineFeedCnt; i++) {
      if (i === 0) {
        diffs.push({ type: 'replace', lineNumber: startLineFeedCnt })
      } else {
        diffs.push({ type: 'insert', lineNumber: startLineFeedCnt + i })
      }
    }

    const change: InsertChange = createInsertChange(offset, [0, addBuffer.length - text.length, text.length], meta, diffs)
    this.changeHistory.push(change)

    return change
  }

  /**
   * Delete Content
   * @param offset
   * @param length
   */
  deleteInner(offset: number, length: number): DocumentChange | null {
    if (this.isEmpty()) {
      return null
    }

    if (offset >= this.getLength()) {
      return null
    }

    const pieceChange: NodePiece[] = []
    const originalLength = length

    // delete
    const startNodePosition = this.findByOffset(offset)
    let { node, startOffset, startLineFeedCnt } = startNodePosition

    if (startOffset === 0) {
      node = node.successor()
      startLineFeedCnt = 1
      startOffset = 1
    } else if (offset !== startOffset) {
      const reminder = offset - startOffset
      if (reminder === node.piece.length) {
        node = node.successor()
      } else {
        const [, rightNode] = this.splitNode(node, reminder)
        node = rightNode
      }
    }

    let lineFeedCnt = 0

    while (length > 0) {
      // 1. The length is actually same as the node length. just delete this node
      if (length === node.piece.length) {
        this.deleteNode(node)
        length -= node.piece.length
        lineFeedCnt += node.piece.lineFeedCnt

        // record the delete change
        pieceChange.push(node.piece)
      }
      // 2. The length is larger than node length. just delete this ndoe and go deeper
      else if (length > node.piece.length) {
        const currentNode = node
        node = node.successor()

        this.deleteNode(currentNode)
        length -= currentNode.piece.length
        lineFeedCnt += currentNode.piece.lineFeedCnt

        // record the delete change
        pieceChange.push(currentNode.piece)
      }
      // 3. The length is smaller than node length. delete part of node
      else {
        const originalStart = node.piece.start
        const originalLineFeedCnt = node.piece.lineFeedCnt

        node.piece.start += length
        node.piece.length -= length
        node.piece.lineFeedCnt = 0

        lineFeedCnt += originalLineFeedCnt - node.piece.lineFeedCnt

        // record the delete change
        pieceChange.push(new NodePiece(node.piece.bufferIndex, originalStart, length, originalLineFeedCnt - node.piece.lineFeedCnt))

        // set to 0 to force the recursive end
        length = 0
      }
    }

    // diffs
    const diffs: Diff[] = []
    for (let i = 0; i <= lineFeedCnt; i++) {
      if (i === 0) diffs.push({ type: 'replace', lineNumber: startLineFeedCnt + i })
      else diffs.push({ type: 'remove', lineNumber: startLineFeedCnt + i })
    }

    // changes
    const change: DeleteChange = createDeleteChange(offset, originalLength, pieceChange, diffs)
    this.changeHistory.push(change)

    return change
  }

  /**
   * Format Content
   * @param offset
   * @param length
   * @param meta
   * @param type
   */
  formatInner(offset: number, length: number, meta: PieceMeta, type: PieceType = PieceType.ALL): DocumentChange {
    const piecePatches: PiecePatch[] = []
    const originalOffset = offset
    const originalLength = length

    // format
    let { node, startOffset, startLineFeedCnt, reminder } = this.findByOffset(offset)

    if (reminder === node.piece.length) {
      node = node.successor()
      startLineFeedCnt += node.piece.lineFeedCnt
    } else if (reminder > 0 && reminder < node.piece.length) {
      const reminder = offset - startOffset
      const [leftNode, rightNode] = this.splitNode(node, reminder)
      node = rightNode
      startLineFeedCnt += leftNode.piece.lineFeedCnt
    }

    let lineFeedCnt: number = 0
    while (length > 0) {
      // skip according to piece type
      if (type !== PieceType.ALL) {
        const determinedType = determinePieceType(node.piece)
        if (determinedType !== type) {
          length -= node.piece.length
          offset += node.piece.length

          node = node.successor()

          continue
        }
      }

      if (length >= node.piece.length) {
        lineFeedCnt += node.piece.lineFeedCnt
        const mergeResult = mergeMeta(node.piece.meta, meta)
        if (mergeResult !== null) {
          const [target, inversePatches] = mergeResult
          node.piece.meta = target
          piecePatches.push({ startOffset: offset, length: node.piece.length, inversePatches })
        }

        length -= node.piece.length
        offset += node.piece.length

        node = node.successor()
      } else {
        const [leftNode] = this.splitNode(node, length)
        node = leftNode

        // Line feeds counting. Meta Merge
        lineFeedCnt += node.piece.lineFeedCnt
        const mergeResult = mergeMeta(node.piece.meta, meta)
        if (mergeResult !== null) {
          const [target, inversePatches] = mergeResult
          node.piece.meta = target
          piecePatches.push({ startOffset: offset, length: node.piece.length, inversePatches })
        }

        length -= node.piece.length
        offset += node.piece.length
      }
    }

    // diffs
    const diffs: Diff[] = []
    for (let i = 0; i <= lineFeedCnt; i++) {
      diffs.push({ type: 'replace', lineNumber: startLineFeedCnt + i })
    }

    // changes
    const change: FormatChange = createFormatChange(originalOffset, originalLength, meta, piecePatches, diffs)
    this.changeHistory.push(change)

    return change
  }

  // ----------------------- Iterate ------------------------------- //

  /**
   * Interate all the pieces
   * @param callback
   */
  forEachPiece(callback: (piece: Piece, index: number) => void) {
    let node = this.root.findMin()
    node = node.successor()
    if (node === SENTINEL) return

    let index = 0
    while (node.isNotNil) {
      const { length, meta } = node.piece
      const text = this.getTextInPiece(node.piece)
      callback({ text, length, meta }, index)
      node = node.successor()
      index++
    }
  }

  // ----------------------- Iterate End ------------------------ //

  /**
   * Get Actual Text in piece
   *
   * @param piece
   */
  getTextInPiece(piece: NodePiece) {
    const { bufferIndex, start, length } = piece
    return this.getTextInBuffer(bufferIndex, start, length)
  }

  /**
   * Get Actual Text in TextBuffer
   *
   * @param bufferIndex
   * @param start
   * @param length
   */
  getTextInBuffer(bufferIndex: number, start: number, length: number) {
    if (bufferIndex < 0) return ''
    const buffer = this.buffers[bufferIndex]
    const value = buffer.buffer.substring(start, start + length)
    return value
  }

  /**
   * Create New Piece
   * @param type
   * @param meta
   */
  protected createPiece(text: string, meta: PieceMeta | null, lineFeedCnt: number): NodePiece {
    if (text) {
      const start = this.buffers[0].length
      const length = text.length
      const piece = new NodePiece(0, start, length, lineFeedCnt, meta ? cloneDeep(meta) : meta)

      this.buffers[0].buffer += text

      return piece
    } else {
      const piece = new NodePiece(-1, 0, 1, 0, meta ? cloneDeep(meta) : meta)
      return piece
    }
  }

  /**
   * Split One Node into two nodes
   * @param node
   * @param reminder
   */
  protected splitNode(node: PieceTreeNode, reminder: number) {
    const { bufferIndex, start, meta } = node.piece

    const leftPiece = new NodePiece(bufferIndex, start, reminder, 0, meta ? cloneDeep(meta) : meta)

    node.piece.start += reminder
    node.piece.length -= reminder
    node.piece.lineFeedCnt -= 0

    const leftNode = this.insertFixedLeft(node, leftPiece)
    return [leftNode, node]
  }
}
