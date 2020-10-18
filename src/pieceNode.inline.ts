import { PieceMeta } from './flowerpiece'
import { PieceNode, PieceType, SENTINEL } from './pieceNode'
import { PieceTable } from './pieceTable'

/**
 * Inline Node is the leaf node. it must be as child of paragraph
 */
export class Inline extends PieceNode {
  constructor(meta: PieceMeta | null, pieceTable: PieceTable) {
    super({ pieceType: PieceType.INLINE, bufferIndex: -1, start: 0, length: 1, lineFeedCnt: 0, meta }, pieceTable)
    this.left = SENTINEL
    this.right = SENTINEL
    this.parent = SENTINEL
    this.above = SENTINEL
  }
}
