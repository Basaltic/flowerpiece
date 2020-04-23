import NodePiece, { Piece, Line } from './piece'
import PieceTreeBase from './pieceTreebase'
import PieceTreeNode, { SENTINEL } from './pieceTreeNode'
import Change, {
  InsertChange,
  createInsertChange,
  DeleteChange,
  createDeleteChange,
  FormatChange,
  createFormatChange,
  PiecePatch,
  ChangeStack,
} from './change'
import { IPieceMeta, mergeMeta } from './meta'
import { Diff } from './diff'
import StringBuffer from './stringBuffer'
import { CharCode } from 'charCode'
import { applyPatches } from 'immer'
import cloneDeep from 'lodash.clonedeep'

const EOL = '\n'

/**
 * Piece Tree Implementation
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
  private changeStack: ChangeStack = new ChangeStack()

  constructor(pieces?: Piece[]) {
    super()

    this.insertLineBreak(0)

    // Defaultly add a eol
    if (pieces) {
      for (const piece of pieces) {
        if (piece.text) {
          const buffer = new StringBuffer(piece.text)
          this.buffers.push(buffer)
          this.insertRightest(new NodePiece(this.buffers.length - 1, 0, buffer.length, computeLineFeedCnt(piece.text), piece.meta))
        }
      }
    }
  }

  /**
   * Init the piece tree
   * @param pieces
   */
  initialize(pieces: Piece[]) {
    this.freeAll()
    for (const piece of pieces) {
      if (piece.text) {
        const buffer = new StringBuffer(piece.text)
        this.buffers.push(buffer)
        this.insertRightest(new NodePiece(this.buffers.length - 1, 0, buffer.length, computeLineFeedCnt(piece.text), piece.meta))
      }
    }
  }

  // ------------- Change -------------- //

  /**
   * Change.
   * @param callback
   */
  change(callback: (...args: any) => void) {
    this.startChange()

    try {
      callback()
    } catch (e) {}

    this.endChange()
  }

  /**
   * Mark as operation started
   * operations between start and end will redo\undo in same operation
   */
  startChange() {
    this.changeStack.startChange()
  }

  /**
   * Mark as operation end
   */
  endChange() {
    this.changeStack.endChange()
  }

  /**
   * Redo the operation
   */
  redo(): Diff[] {
    console.log('redo')
    return this.changeStack.applayRedo(change => this.doRedo(change))
  }

  /**
   * Undo the operation
   */
  undo(): Diff[] {
    return this.changeStack.applayUndo(change => this.doUndo(change))
  }

  /**
   * Actual Operation to undo the change
   * @param change
   */
  private doUndo(change: Change): Diff[] {
    switch (change.type) {
      case 'insert':
        const insertChange = change as InsertChange
        this.delete(insertChange.startOffset, insertChange.length, true)
        return change.diffs.map(diff => {
          if (diff.type === 'insert') {
            diff.type = 'remove'
          }
          return diff
        })
      case 'delete':
        {
          const deleteChange = change as DeleteChange

          let offset = deleteChange.startOffset
          if (offset <= 0) {
            offset = 1
          } else {
            offset += 1
          }

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
        return change.diffs.map(diff => {
          if (diff.type === 'remove') {
            diff.type = 'insert'
          }
          return diff
        })
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
        return change.diffs
    }
  }

  /**
   * Actual Operation to redo the change
   * @param change
   */
  private doRedo(change: Change): Diff[] {
    switch (change.type) {
      case 'insert':
        const { startOffset, text, meta } = change as InsertChange
        const txt = this.getTextInBuffer(text[0], text[1], text[2])
        return this.insert(startOffset, txt, meta, true)
      case 'delete':
        const deleteChange = change as DeleteChange
        return this.delete(deleteChange.startOffset, deleteChange.length, true)
      case 'format':
        const formatChange = change as FormatChange
        console.log(formatChange)
        return this.format(formatChange.startOffset, formatChange.length, formatChange.meta, true)
    }
  }

  // ---------------- Extra Operations To Make Life Easier --------------- //

  /**
   * Break The Content into two lines
   * @param offset
   * @param meta
   */
  insertLineBreak(offset: number, meta: IPieceMeta | null = null): Diff[] {
    return this.insert(offset, EOL, meta)
  }

  /**
   * Insert A Complete new Line in Offset
   * @param offset
   * @param meta
   */
  insertLine(offset: number, meta: IPieceMeta | null = null): Diff[] {
    const diff1 = this.insertLineBreak(offset, null)
    const diff2 = this.insert(offset, '', meta)
    const diff3 = this.insertLineBreak(offset + 2, null)
    return [...diff1, ...diff2, ...diff3]
  }

  /**
   * Insert Plain Text
   * @param offset
   * @param text
   * @param meta
   */
  insertText(offset: number, text: string, meta: IPieceMeta | null = null): Diff[] {
    if (text === '') {
      throw new Error('cannot pass empty text')
    }

    return this.insert(offset, text, meta)
  }

  /**
   * Insert Non Text
   * @param offset
   * @param meta
   */
  insertNonText(offset: number, meta: IPieceMeta) {
    this.insert(offset, '', meta)
  }

  /**
   * Format Specific Line
   * @param lineNumber
   * @param meta
   */
  formatLine(lineNumber: number, meta: IPieceMeta): Diff[] {
    const { startOffset } = this.findByLineNumber(lineNumber)
    return this.format(startOffset - 1, 1, meta)
  }

  // ------------------- Atomic Operation ---------------------- //

  /**
   * Insert Content Which will cause offset change, piece increment, piece split
   * 1. Always create a new piece while having meta
   * 2. Coninuesly input only text, append to same node
   * 3. LineBreak(\n) will in a new piece which used to store line data
   */
  insert(offset: number, text: string = '', meta?: any, disableChange?: boolean): Diff[] {
    const diffs: Diff[] = []

    const addBuffer = this.buffers[0]

    const isEmptyMeta = meta === undefined || meta === null

    if (offset <= 0) {
      offset = 1
    } else {
      offset += 1
    }

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
        if (lineFeedCnt === 0) {
          if (isContinousInput && isEmptyMeta && isNotLinkBreak && txt) {
            addBuffer.buffer += txt
            node.piece.length += txt.length
            node.updateMetaUpward()
          } else if (txt || !isEmptyMeta) {
            node = this.insertFixedRight(node, this.createPiece(txt, meta, 0))
          }
        } else if (txt) {
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

    if (!disableChange && text.length > 0) {
      const change: InsertChange = createInsertChange(offset - 1, [0, addBuffer.length - text.length, text.length], meta, diffs)
      this.changeStack.push(change)
    }

    return diffs
  }

  /**
   * Delete Content
   */
  delete(offset: number, length: number, disableChange?: boolean): Diff[] {
    const pieceChange: NodePiece[] = []
    const originalLength = length

    if (offset <= 0) {
      offset = 1
    } else {
      offset += 1
    }

    // delete
    const startNodePosition = this.findByOffset(offset)
    let { node, startOffset, startLineFeedCnt } = startNodePosition
    if (offset !== startOffset) {
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
      else if (length >= node.piece.length) {
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
        node.piece.lineFeedCnt = this.recomputeLineFeedsCntInPiece(node.piece)

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
    if (!disableChange && pieceChange.length > 0) {
      const change: DeleteChange = createDeleteChange(offset - 1, originalLength, pieceChange, diffs)
      this.changeStack.push(change)
    }
    return diffs
  }

  /**
   * Format The Content. Only change the meta
   */
  format(offset: number, length: number, meta: IPieceMeta, disableChange: boolean = false): Diff[] {
    const piecePatches: PiecePatch[] = []
    const originalOffset = offset
    const originalLength = length

    if (offset <= 0) {
      offset = 1
    } else {
      offset += 1
    }

    // format
    let { node, startOffset, startLineFeedCnt } = this.findByOffset(offset)
    if (offset !== startOffset) {
      const reminder = offset - startOffset
      const [leftNode, rightNode] = this.splitNode(node, reminder)
      node = rightNode
      startLineFeedCnt += leftNode.piece.lineFeedCnt
    }

    let lineFeedCnt: number = 0
    while (length > 0) {
      if (length >= node.piece.length) {
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
    if (!disableChange) {
      const change: FormatChange = createFormatChange(originalOffset, originalLength, meta, piecePatches, diffs)
      this.changeStack.push(change)
    }

    return diffs
  }

  // ----------------------- Iterate ------------------------------- //

  /**
   * Iterate the line in this piece tree
   * @param callback
   */
  forEachLine(callback: (line: Line, lineNumber: number) => void) {
    let node = this.root.findMin()
    let line: Line = []
    let lineNumber: number = 1

    node = node.successor()
    while (node.isNotNil) {
      const { piece } = node
      const { meta, length } = piece

      if (piece.lineFeedCnt === 0) {
        const text = this.getTextInPiece(piece)
        line.push({ text, length, meta })
      } else {
        callback(line, lineNumber)

        line = []
        lineNumber++
      }

      node = node.successor()
    }

    // Empty Line
    if (line.length === 0) {
      line = [{ text: '', length: 0, meta: null }]
    }

    callback(line, lineNumber)
  }

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

  // ---- Fetch Operation ---- //

  /**
   * Get the Whole Text
   */
  getAllText(): string {
    let txt = ''
    this.forEachPiece(piece => {
      txt += piece.text
    })
    return txt
  }

  /**
   * get piece list of some line
   * @param lineNumber
   */
  getLine(lineNumber: number): Line {
    const line: Line = []

    let { node } = this.findByLineNumber(lineNumber)
    node = node.successor()

    while (node !== SENTINEL && node.piece.lineFeedCnt <= 0) {
      line.push({ text: this.getTextInPiece(node.piece), length: node.piece.length, meta: node.piece.meta })
      node = node.successor()
    }

    if (line.length === 0) {
      line.push({ text: '', length: 0, meta: null })
    }

    return line
  }

  /**
   * Get All the pieces of this tree
   */
  getPieces(): Piece[] {
    const pieces: Piece[] = []
    this.forEachPiece(piece => {
      pieces.push(piece)
    })

    return pieces
  }

  // ---- Fetch Operation End ---- //

  /**
   * Get Actual Text in piece
   *
   * @param piece
   */
  protected getTextInPiece(piece: NodePiece) {
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
  protected getTextInBuffer(bufferIndex: number, start: number, length: number) {
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
  protected createPiece(text: string, meta: IPieceMeta | null, lineFeedCnt: number): NodePiece {
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
    const leftStr = this.buffers[bufferIndex].buffer.substring(start, start + reminder)
    const leftLineFeedsCnt = computeLineFeedCnt(leftStr)

    const leftPiece = new NodePiece(bufferIndex, start, reminder, leftLineFeedsCnt, meta ? cloneDeep(meta) : meta)

    node.piece.start += reminder
    node.piece.length -= reminder
    node.piece.lineFeedCnt -= leftLineFeedsCnt

    const leftNode = this.insertFixedLeft(node, leftPiece)
    return [leftNode, node]
  }

  /**
   * Recompute how much line feeds in passed piece
   * @param piece
   */
  protected recomputeLineFeedsCntInPiece(piece: NodePiece) {
    const { bufferIndex, start, length } = piece
    if (bufferIndex < 0 || bufferIndex > this.buffers.length - 1) return 0

    const str = this.buffers[bufferIndex].buffer.substring(start, start + length)
    const cnt = computeLineFeedCnt(str)
    return cnt
  }
}

// ---------- Utils ------------ //

/**
 * 计算字符串中的换行符数量
 * @param str
 */
export function computeLineFeedCnt(str: string) {
  const matches = str.match(/\n/gm)
  if (matches) {
    return matches.length
  }
  return 0
}
