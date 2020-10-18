import { PieceMeta } from './flowerpiece'
import { PieceNode, PieceType, SENTINEL } from './pieceNode'
import { PieceNodeList } from './pieceNodeList'
import { PieceTable } from './pieceTable'

/**
 * Structural Node is a container
 */
export class Structural extends PieceNode {
  constructor(meta: PieceMeta | null, pieceTable: PieceTable) {
    super({ pieceType: PieceType.STRUCTURAL, bufferIndex: -1, start: 0, length, lineFeedCnt: 0, meta }, pieceTable)
    this.left = SENTINEL
    this.right = SENTINEL
    this.parent = SENTINEL
    this.above = SENTINEL
    this.children = new PieceNodeList()
  }
}
