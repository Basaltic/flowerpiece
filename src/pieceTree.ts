import { LineNodePosition } from './common'
import Piece, { IPiece } from './piece'
import PieceTreeBase from './pieceTreebase'
import PieceTreeNode, { SENTINEL } from './pieceTreeNode'
import Change, { InsertChange, createInsertChange, DeleteChange, createDeleteChange } from './change'

const EOL = '\n'

/**
 * Piece Tree Implementation
 */
export class PieceTree extends PieceTreeBase {
  private changes: Change[] = []
  private changeIndex: number = 0

  constructor() {
    super()
  }

  /**
   * Redo the operation
   */
  redo() {
    const change = this.changes[this.changeIndex]
    if (change) {
      switch (change.type) {
        case 'insert':
          const { start, text, meta } = change as InsertChange
          const txt = this.getTextInBuffer(text[0], text[1], text[2])
          this.insert(start, txt, meta, true)
          this.changeIndex += 1
          return
        case 'delete':
          const deleteChange = change as DeleteChange
          this.delete(deleteChange.start, deleteChange.length)
          this.changeIndex += 1
          return
        case 'format':
          return
      }
    }
  }

  /**
   * Undo the operation
   */
  undo() {
    const change = this.changes[this.changeIndex - 1]
    console.log(this.changeIndex, change, this.changes)
    if (change) {
      switch (change.type) {
        case 'insert':
          const insertChange = change as InsertChange
          this.delete(insertChange.start, insertChange.length, true)
          this.changeIndex -= 1
          return
        case 'delete':
          const deleteChange = change as DeleteChange
          const nodePosition = this.findByOffset(deleteChange.start)
          // Start of node
          if (nodePosition.startOffset === deleteChange.start) {
            let node = nodePosition.node.predecessor()
            if (node === SENTINEL) {
              for (const piece of deleteChange.pieces) {
                this.insertFixedLeft(nodePosition.node, piece)
                node = node.successor()
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

          return
        case 'format':
          return
      }
    }
  }

  // ---- Atomic Operation ---- //

  /**
   * Insert Content Which will cause offset change, piece increment, piece split
   * 1. Always create a new piece while having meta
   * 2. Coninuesly input only text, append to same node
   */
  insert(offset: number, text: string, meta?: any, disableChange?: boolean) {
    const nodePosition = this.findByOffset(offset)
    let { node, reminder, startOffset } = nodePosition

    const addBuffer = this.buffers[0]
    // 1. Start of Node
    if (startOffset === offset) {
      const preNode = node.predecessor()
      if (
        text &&
        !meta &&
        preNode.isNotNil &&
        preNode.piece.bufferIndex === 0 &&
        addBuffer.length === preNode.piece.start + preNode.piece.length
      ) {
        addBuffer.buffer += text
        preNode.piece.length += text.length
        preNode.updateMetaUpward()
      } else {
        const piece = this.createPiece(text, meta)
        this.insertFixedLeft(node, piece)
      }
    }

    // 2. Middle of the Node
    else if (startOffset + node.piece.length > offset) {
      // 2.1 Split to two node
      const strBuffer = this.buffers[node.piece.bufferIndex]

      const leftStr = strBuffer.buffer.substring(node.piece.start, reminder)
      const leftLineFeedCnt = computeLineFeedCnt(leftStr)

      const rightPiece = new Piece(
        node.piece.bufferIndex,
        node.piece.start + reminder,
        node.piece.length - reminder,
        node.piece.lineFeedCnt - leftLineFeedCnt,
        node.piece.meta,
      )

      node.piece.length = reminder
      node.piece.lineFeedCnt = leftLineFeedCnt

      this.insertFixedRight(node, rightPiece)

      const middlePieces = this.createPiece(text, meta)
      this.insertFixedRight(node, middlePieces)
    }

    // 3. End of Node
    else {
      if (
        text &&
        !meta &&
        node.piece.bufferIndex === 0 &&
        startOffset + node.piece.length === offset &&
        addBuffer.length === node.piece.start + node.piece.length
      ) {
        addBuffer.buffer += text
        node.piece.length += text.length
        node.piece.lineFeedCnt += computeLineFeedCnt(text)
        node.updateMetaUpward()
      } else {
        const piece = this.createPiece(text, meta)
        this.insertFixedRight(node, piece)
      }
    }

    if (!disableChange && text.length > 0) {
      const change: InsertChange = createInsertChange(offset, [0, addBuffer.length - text.length, text.length], meta)
      this.changes.push(change)
      this.changeIndex += 1
    }
  }

  /**
   * Delete Content
   */
  delete(start: number, length: number, disableChange?: boolean) {
    const pieceChange: Piece[] = []

    const startNodePosition = this.findByOffset(start)

    let { node, startOffset } = startNodePosition
    this.deleteInner(start, length, startOffset, node, pieceChange)

    startNodePosition.node.updateMetaUpward()

    if (!disableChange && pieceChange.length > 0) {
      const change: DeleteChange = createDeleteChange(start, length, pieceChange)
      this.changes.push(change)
      this.changeIndex += 1
    }
  }

  private deleteInner(start: number, length: number, startOffset: number, node: PieceTreeNode, pieceChange: Piece[]) {
    if (length <= 0) {
      return
    }
    // Start of the piece node
    if (start === startOffset) {
      if (length === node.piece.length) {
        this.deleteNode(node)
        length -= node.piece.length

        // record the delete change
        pieceChange.push(node.piece)
      } else if (length >= node.piece.length) {
        const currentNode = node
        node = node.successor()

        this.deleteNode(currentNode)
        length -= currentNode.piece.length

        // record the delete change
        pieceChange.push(currentNode.piece)
      } else {
        const originalStart = node.piece.start
        const originalLineFeedCnt = node.piece.lineFeedCnt

        node.piece.start += length
        node.piece.length -= length
        node.piece.lineFeedCnt = this.recomputeLineFeedsCntInPiece(node.piece)

        length = 0

        // record the delete change
        pieceChange.push(new Piece(node.piece.bufferIndex, originalStart, length, originalLineFeedCnt - node.piece.lineFeedCnt))
      }

      this.deleteInner(start, length, start, node, pieceChange)
    } else {
      const reminder = start - startOffset
      if (reminder === node.piece.length) {
      } else {
        this.splitNodeRight(node, reminder)
      }
      node = node.successor()

      this.deleteInner(start, length, start, node, pieceChange)
    }
  }

  /**
   * Format The Content. Only change the meta
   */
  format(start: number, length: number, meta: any) {
    const startNodePosition = this.findByOffset(start)

    let { node, startOffset } = startNodePosition

    this.formatInner(start, length, startOffset, node, meta)
  }

  private formatInner(start: number, length: number, startOffset: number, node: PieceTreeNode, meta: any) {
    if (length <= 0) {
      return
    }

    if (start === startOffset) {
      if (length >= node.piece.length) {
        node.piece.meta = mergeMeta(node.piece.meta, meta)
        length -= node.piece.length
        start += node.piece.length

        node = node.successor()
      } else {
        this.splitNodeRight(node, length)
        node.piece.meta = mergeMeta(node.piece.meta, meta)

        length -= node.piece.length
        start += node.piece.length
      }

      this.formatInner(start, length, start, node, meta)
    } else {
      const reminder = start - startOffset
      this.splitNodeLeft(node, reminder)

      this.formatInner(start, length, start, node, meta)
    }
  }

  // ---- Atomic Operation ---- //

  // ---- Iterate ---- //

  /**
   * Iterate the line in this piece tree
   * @param callback
   */
  forEachLine(callback: (line: IPiece[], lineNumber: number) => void) {
    let node = this.root.findMin()
    let line: IPiece[] = []
    let lineNumber: number = 1
    while (node.isNotNil) {
      const { piece } = node
      const { meta, length } = piece

      const text = this.getTextInPiece(piece)
      if (piece.lineFeedCnt === 0) {
        line.push({ text, length, meta })
      } else {
        const texts = text.split(EOL)
        for (let i = 0; i < texts.length; i++) {
          const txt = texts[i]
          if (txt) line.push({ text: txt, length: txt.length, meta })

          if (i < texts.length - 1) {
            callback(line, lineNumber)
            line = []
            lineNumber += 1
          }
        }
      }

      node = node.successor()
    }

    callback(line, lineNumber)
  }

  /**
   * Interate all the pieces
   * @param callback
   */
  forEachPiece(callback: (piece: Piece, text: string) => void) {
    let node = this.root.findMin()
    while (node.isNotNil) {
      const text = this.getTextInPiece(node.piece)
      callback(node.piece, text)
      node = node.successor()
    }
  }

  // ---- Iterate ---- //

  // ---- Fetch Operation ---- //

  /**
   * Get the Whole Text
   */
  getAllText(): string {
    let txt = ''
    this.forEachPiece((_, text) => {
      txt += text
    })
    return txt
  }

  /**
   * Get All Lines
   */
  getLines(): IPiece[][] {
    let node = this.root.findMin()
    const lines: IPiece[][] = []

    let line: IPiece[] = []
    while (node.isNotNil) {
      const { piece } = node
      const { meta, length } = piece

      let text = this.getTextInPiece(piece)
      if (piece.lineFeedCnt === 0) {
        line.push({ text, length, meta })
      } else {
        const texts = text.split(EOL)

        for (let i = 0; i < texts.length; i++) {
          const txt = texts[i]
          if (i === texts.length - 1) {
            if (txt) {
              line.push({ text: txt, length: txt.length, meta })
            }
          } else {
            if (txt) {
              line.push({ text: txt, length: txt.length, meta })
            }
            lines.push(line)
            line = []
          }
        }
      }

      node = node.successor()
    }

    lines.push(line)

    return lines
  }

  /**
   * 获取某一行的 piece 列表
   * @param lineNumber
   */
  getLine(lineNumber: number): IPiece[] {
    const line: IPiece[] = []

    let anchorNodePostion: LineNodePosition = {
      node: this.root,
      remindLineCnt: 0,
      startOffset: 0,
    }

    if (lineNumber <= 1) {
      anchorNodePostion.node = this.root.findMin()
    } else if (lineNumber >= this.root.leftLineFeeds + this.root.piece.lineFeedCnt + this.root.rightLineFeeds + 1) {
      lineNumber = this.root.leftLineFeeds + this.root.piece.lineFeedCnt + this.root.rightLineFeeds
      anchorNodePostion = this.root.findByLineNumber(lineNumber)
    } else {
      lineNumber -= 1
      anchorNodePostion = this.root.findByLineNumber(lineNumber)
    }

    const { remindLineCnt } = anchorNodePostion

    // 1. 往查找直到上一个换行符出现
    let anchorNode = anchorNodePostion.node
    const { piece } = anchorNode
    const { meta, bufferIndex, start, length } = piece

    const txt = this.getTextInBuffer(bufferIndex, start, length)
    const texts = txt.split(EOL)
    const text = texts[remindLineCnt]

    line.push({ text, length: text.length, meta })

    anchorNode = anchorNode.successor()
    while (anchorNode.isNotNil) {
      const { piece } = anchorNode
      const { meta, bufferIndex, start, length } = piece
      if (anchorNode.piece.lineFeedCnt === 0) {
        const txt = this.getTextInBuffer(bufferIndex, start, length)
        const texts = txt.split(EOL)
        const text = texts[texts.length - 1]

        line.push({ text, length: text.length, meta })
        anchorNode = anchorNode.successor()
      } else {
        const txt = this.getTextInBuffer(bufferIndex, start, length)
        const texts = txt.split(EOL)
        const text = texts[0]
        line.push({ text, length: text.length, meta })
        break
      }
    }

    return line
  }

  /**
   * Find Start Offset for specific line
   * @param lineNumber
   */
  findLineStartOffset(lineNumber: number) {
    if (lineNumber <= 1) {
      return 0
    } else if (lineNumber >= this.root.leftLineFeeds + this.root.piece.lineFeedCnt + this.root.rightLineFeeds + 1) {
      lineNumber = this.root.leftLineFeeds + this.root.piece.lineFeedCnt + this.root.rightLineFeeds + 1
    } else {
      lineNumber -= 1
    }
    let { node, remindLineCnt, startOffset } = this.root.findByLineNumber(lineNumber)
    const { piece } = node
    const { bufferIndex, start, length } = piece
    const txt = this.getTextInBuffer(bufferIndex, start, length)
    const texts = txt.split(EOL)
    for (let i = 0; i <= remindLineCnt; i++) {
      const text = texts[i]
      startOffset += text.length + 1
    }

    return startOffset
  }

  /**
   * 获取 piece 中的文字内容。
   *
   * @param piece
   */
  private getTextInPiece(piece: Piece) {
    const { bufferIndex, start, length } = piece
    return this.getTextInBuffer(bufferIndex, start, length)
  }

  private getTextInBuffer(bufferIndex: number, start: number, length: number) {
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
  private createPiece(text: string, meta: any): Piece {
    if (text) {
      const start = this.buffers[0].length
      this.buffers[0].buffer += text
      const length = text.length
      const lineFeedsCnt = computeLineFeedCnt(text)
      const piece = new Piece(0, start, length, lineFeedsCnt, meta)
      return piece
    } else {
      const piece = new Piece(-1, 0, 1, 0, meta)
      return piece
    }
  }

  /**
   * Split One Node into two nodes
   * @param node
   * @param reminder
   */
  private splitNodeLeft(node: PieceTreeNode, reminder: number) {
    const { bufferIndex, start, meta } = node.piece
    const leftStr = this.buffers[bufferIndex].buffer.substring(start, start + reminder)
    const leftLineFeedsCnt = computeLineFeedCnt(leftStr)

    const leftPiece = new Piece(bufferIndex, start, reminder, leftLineFeedsCnt, { ...meta })

    node.piece.start += reminder
    node.piece.length -= reminder
    node.piece.lineFeedCnt -= leftLineFeedsCnt

    this.insertFixedLeft(node, leftPiece)
  }

  private splitNodeRight(node: PieceTreeNode, reminder: number) {
    const { bufferIndex, start, meta, length, lineFeedCnt } = node.piece

    const leftStr = this.buffers[bufferIndex].buffer.substring(start, start + reminder)
    const leftLineFeedsCnt = computeLineFeedCnt(leftStr)

    const rightPiece = new Piece(
      bufferIndex,
      start + reminder,
      length - reminder,
      lineFeedCnt - leftLineFeedsCnt,
      meta ? { ...meta } : meta,
    )

    node.piece.length = reminder
    node.piece.lineFeedCnt = leftLineFeedsCnt
    node.piece.meta = mergeMeta(node.piece.meta, meta)

    this.insertFixedRight(node, rightPiece)
  }

  private recomputeLineFeedsCntInPiece(piece: Piece) {
    const { bufferIndex, start, length } = piece
    if (bufferIndex < 0 || bufferIndex > this.buffers.length - 1) {
      return 0
    }

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

/**
 * Merge Two Meta
 * @param target
 * @param source
 */
function mergeMeta(target: any, source: any) {
  if (source) {
    if (target === null) target = {}
    Object.keys(source).forEach((key: string) => {
      target[key] = source[key]
    })
  }

  return target
}
