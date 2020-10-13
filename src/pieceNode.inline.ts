import { PieceMeta } from 'flowerpiece'
import { PieceNode, PieceType } from 'pieceNode'
import { SENTINEL } from 'pieceNode.factory'

/**
 * Inline Node is the leaf node. it must be as child of paragraph
 */
export class Inline extends PieceNode {
  constructor(meta: PieceMeta | null) {
    super({ pieceType: PieceType.Inline, bufferIndex: -1, start: 0, length: 1, lineFeedCnt: 0, meta })
    this.left = SENTINEL
    this.right = SENTINEL
    this.parent = SENTINEL
    this.above = SENTINEL
  }
}
