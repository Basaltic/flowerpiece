import { PieceMeta } from 'meta'
import { PieceNode, PieceType, SENTINEL } from 'pieceNode'

/**
 * Text Node.
 */
export class Text extends PieceNode {
  constructor(bufferIndex: number, start: number, length: number, meta: PieceMeta | null = null) {
    const piece = { pieceType: PieceType.TEXT, bufferIndex, start, length, lineFeedCnt: 0, meta }
    super(piece)
    this.left = SENTINEL
    this.right = SENTINEL
    this.parent = SENTINEL
    this.above = SENTINEL
  }
}
