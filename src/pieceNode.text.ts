import { PieceMeta } from './meta'
import { PieceNode, PieceType, SENTINEL } from './pieceNode'
import cloneDeep from 'lodash.clonedeep'

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
