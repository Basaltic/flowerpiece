import { LeafNodePosition } from './common'
import { PieceType, SENTINEL } from './pieceNode'
import { PieceNodeList } from './pieceNodeList'
import { Structural } from './pieceNode.structural'
import { PieceTable } from './pieceTable'

/**
 * Document
 */
export class Document extends Structural {
  constructor(pieceTable: PieceTable) {
    super({ pieceType: PieceType.ROOT, bufferIndex: -1, start: 0, length: 0, lineFeedCnt: 0, meta: null }, pieceTable)
    this.left = SENTINEL
    this.right = SENTINEL
    this.parent = SENTINEL
    this.above = SENTINEL
    this.children = new PieceNodeList()
  }

  /**
   * Find the Leaf node by offset
   * The Node Found here must be text or inline node
   *
   * @param {number} offset
   */
  public findLeafNode(offset: number): LeafNodePosition | null {
    let list = this.children

    while (list && list !== null) {
      const position = list.find(offset)
      const { node, reminder } = position

      if (node.children) {
        list = node.children
        offset = reminder
      } else {
        return position
      }
    }

    return null
  }
}
