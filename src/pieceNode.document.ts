import { LeafNodePosition } from 'common'
import { PieceNode, PieceType } from 'pieceNode'
import { PieceNodeList } from 'pieceNodeList'

/**
 * Document
 */
export class Document extends PieceNode {
  constructor() {
    super({ pieceType: PieceType.ROOT, bufferIndex: -1, start: 0, length: 0, lineFeedCnt: 0, meta: null })
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
