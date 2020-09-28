import { PieceTree } from './pieceTree'
import { SENTINEL } from './pieceNode'
import { Line, Piece } from './piece'
import { PieceMeta } from './meta'

/**
 * Methods For Getting Info/Data
 */
export class Queries {
  private pieceTree: PieceTree

  constructor(pieceTree: PieceTree) {
    this.pieceTree = pieceTree
  }

  /**
   * Max Offset of the doucment
   */
  getMaxOffset() {
    return this.pieceTree.getLength() - 1
  }

  /**
   * How many charactor in doc
   */
  getCountOfCharacter(): number {
    return this.pieceTree.getPureTextCount()
  }

  /**
   * How many lines in doc
   */
  getCountOfLine(): number {
    return this.pieceTree.getLineCount()
  }

  /**
   * Get the Whole Text
   */
  getText(): string {
    let txt = ''
    this.pieceTree.forEachPiece(piece => {
      txt += piece.text
    })
    return txt
  }

  /**
   * Get Text String in Range
   * @param from
   * @param to
   */
  getTextInRange(from: number, to: number): string {
    if (from < 0) from = 0
    if (to < 0) to = 0
    from++
    to++
    if (to > from && from >= 0) {
      to = to - from
      let text = ''
      let { node, reminder } = this.pieceTree.findByOffset(from)

      if (reminder === node.piece.length) {
        node = node.successor()
      } else if (reminder > 0 && reminder < node.piece.length) {
        const { bufferIndex, start, length } = node.piece
        const s = start + reminder
        const len = length - reminder
        text += this.pieceTree.getTextInBuffer(bufferIndex, s, len)
        node = node.successor()
        to -= len
      }

      while (node !== SENTINEL && to > 0) {
        const { start, bufferIndex, length } = node.piece
        if (to < node.piece.length) {
          text += this.pieceTree.getTextInBuffer(bufferIndex, start, to)
        } else {
          text += this.pieceTree.getTextInPiece(node.piece)
        }

        to -= length
        node = node.successor()
      }

      return text
    } else {
      return ''
    }
  }

  /**
   * get piece list of some line
   * @param lineNumber
   */
  getLine(lineNumber: number): Line {
    let { node } = this.pieceTree.findByLineNumber(lineNumber)

    const line: Line = { meta: node.piece.meta, pieces: [] }

    node = node.successor()

    while (node !== SENTINEL && node.piece.lineFeedCnt <= 0) {
      line.pieces.push({ text: this.pieceTree.getTextInPiece(node.piece), length: node.piece.length, meta: node.piece.meta })
      node = node.successor()
    }
    if (line.pieces.length === 0) {
      line.pieces.push({ text: '', length: 0, meta: null })
    }

    return line
  }

  /**
   * Get All Lines
   */
  getLines(): Line[] {
    const lines: Line[] = []

    this.forEachLine(line => {
      lines.push(line)
    })

    return lines
  }

  /**
   * Get First Line
   */
  getFirstLine(): Line {
    return this.getLine(1)
  }

  /**
   * Get Last Line
   */
  getLastLine(): Line {
    const lastLineNumber = this.getCountOfLine()
    return this.getLine(lastLineNumber)
  }

  /**
   * Get Specific Line Meta
   */
  getLineMeta(lineNumber: number): PieceMeta | null {
    const { node } = this.pieceTree.findByLineNumber(lineNumber)
    if (node.piece.lineFeedCnt === 1) {
      return node.piece.meta
    }
    return null
  }

  /**
   * Get All the pieces of this tree
   */
  getPieces(): Piece[] {
    const pieces: Piece[] = []
    this.pieceTree.forEachPiece(piece => {
      pieces.push(piece)
    })

    return pieces
  }

  /**
   * Get Specific Range of Pieces
   */
  getPiecesInRange(from: number, to: number): Piece[] {
    from++
    to++
    if (to > from && from >= 0) {
      to = to - from
      const pieces: Piece[] = []
      let { node, reminder } = this.pieceTree.findByOffset(from)

      if (reminder === node.piece.length) {
        node = node.successor()
      }
      // In The Piece
      else if (reminder + to <= node.piece.length) {
        const { bufferIndex, start, meta } = node.piece
        const s = start + reminder
        const len = to

        pieces.push({ text: this.pieceTree.getTextInBuffer(bufferIndex, s, len), length: len, meta })

        to = 0
      } else if (reminder + to > node.piece.length) {
        const { bufferIndex, start, length, meta } = node.piece
        const s = start + reminder
        const len = length - reminder
        pieces.push({ text: this.pieceTree.getTextInBuffer(bufferIndex, s, len), length: len, meta })
        node = node.successor()
        to -= len
      }

      while (node !== SENTINEL && to > 0) {
        const { start, bufferIndex, length, meta } = node.piece
        if (to < node.piece.length) {
          pieces.push({ text: this.pieceTree.getTextInBuffer(bufferIndex, start, to), length: to, meta })
        } else {
          pieces.push({ text: this.pieceTree.getTextInPiece(node.piece), length, meta })
        }

        to -= length
        node = node.successor()
      }

      return pieces
    } else {
      return []
    }
  }

  /**
   * Iterate the line in this piece tree
   * @param callback
   */
  forEachLine(callback: (line: Line, lineNumber: number) => void) {
    let node = this.pieceTree.root.findMin()
    let line: Line = { meta: {}, pieces: [] }
    let lineNumber: number = 1

    line.meta = node.piece.meta

    node = node.successor()
    while (node.isNotNil) {
      const { piece } = node
      const { meta, length } = piece

      if (piece.lineFeedCnt === 0) {
        const text = this.pieceTree.getTextInPiece(piece)
        line.pieces.push({ text, length, meta })
      } else {
        callback(line, lineNumber)

        line = { meta: node.piece.meta, pieces: [] }
        lineNumber++
      }

      node = node.successor()
    }

    // Empty Line
    if (line.pieces.length === 0) {
      line.pieces = []
    }

    callback(line, lineNumber)
  }
}
