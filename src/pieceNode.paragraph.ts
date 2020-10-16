import { PieceMeta } from 'flowerpiece'
import { PieceNode, PieceType, SENTINEL } from 'pieceNode'
import { PieceNodeList } from 'pieceNodeList'

/**
 * Paragraph Node is one of the basic block node.
 * It contains text or inline node as children.
 * Paragraph has 1 length to represent a line break in content
 */
export class Paragraph extends PieceNode {
  constructor(meta: PieceMeta | null = null, leafNodes?: PieceNode[]) {
    super({ pieceType: PieceType.PARAGRAPH, bufferIndex: -1, start: 0, length: 1, lineFeedCnt: 1, meta })
    this.left = SENTINEL
    this.right = SENTINEL
    this.parent = SENTINEL
    this.above = SENTINEL
    this.children = new PieceNodeList()

    if (leafNodes) {
      for (let text of leafNodes) {
        this.appendChild(text)
      }
    }
  }
}
