import { PieceMeta } from './meta'
import { PieceType, SENTINEL, Piece } from './pieceNode'
import cloneDeep from 'lodash.clonedeep'
import { Inline } from './pieceNode.inline'
import { PieceTable } from './pieceTable'

export interface TextParams {
  // TEXT: Buffer Index
  // OBJECT: -1
  // STRUCTURAL: -1
  bufferIndex: number
  // TEXT: Raw Content Start in Current Buffer
  // OBJECT: -1
  // STRUCTURAL: -1
  start: number
  // TEXT: Content Length
  // OBJECT: 1
  // STRUCTURAL: -1
  length: number

  // Extra Meta Info
  meta: PieceMeta | null
}

/**
 * Text Node.
 */
export class Text extends Inline {
  constructor(params: TextParams, pieceTable: PieceTable) {
    const piece = {
      pieceType: PieceType.TEXT,
      bufferIndex: params.bufferIndex,
      start: params.start,
      length: params.length,
      lineFeedCnt: 0,
      meta: params.meta,
    }
    super(piece, pieceTable)
    this.left = SENTINEL
    this.right = SENTINEL
    this.parent = SENTINEL
    this.above = SENTINEL
  }

  /**
   * Split Text Node into two
   *
   * This node as the left node. new node as the successor of this node
   *
   * @param offset
   * @returns {boolean} split successfully or not
   */
  public split(offset: number): boolean {
    if (offset <= 0 || offset >= this.piece.length) return false

    const { bufferIndex, start, length, meta } = this.piece

    const successorNode = new Text(bufferIndex, start + offset, length - offset, cloneDeep(meta))

    this.piece.length = offset

    this.after(successorNode)

    return true
  }
}
