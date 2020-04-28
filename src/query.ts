import { PieceTree } from './pieceTree'
import { SENTINEL } from './pieceTreeNode'
import { Line, Piece } from './piece'
import { IPieceMeta } from './meta'

export class Queries {
  private pieceTree: PieceTree

  constructor(pieceTree: PieceTree) {
    this.pieceTree = pieceTree
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
    const line: Line = { meta: null, pieces: [] }

    let { node } = this.pieceTree.findByLineNumber(lineNumber)
    line.meta = node.piece.meta

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

    this.pieceTree.forEachLine(line => {
      lines.push(line)
    })

    return lines
  }

  /**
   * Get Specific Line Meta
   */
  getLineMeta(lineNumber: number): IPieceMeta | null {
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
}
