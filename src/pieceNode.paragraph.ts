import { PieceMeta } from './flowerpiece'
import { PieceNode, PieceType, SENTINEL } from './pieceNode'
import { PieceNodeList } from './pieceNodeList'

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

  /**
   * Split Paragraph Node into two.
   * Left New Node contains the nodes to anchorNode. Right Node contains the other nodes.
   *
   * LetNode
   * [firstNode, ...., anchorNode]
   *
   * rightNode
   * [anchorNode + 1, ...., lastNode]   * @param anchorNode
   */
  public split(anchorNode: PieceNode) {
    const rightNode: PieceNode = new Paragraph(this.piece.meta)

    this.after(rightNode)

    anchorNode = anchorNode.successor()

    while (anchorNode.isNotNil) {
      const nextNode = anchorNode.successor()

      this.removeChild(anchorNode)

      anchorNode.parent = SENTINEL
      anchorNode.left = SENTINEL
      anchorNode.right = SENTINEL
      rightNode.appendChild(anchorNode)

      anchorNode = nextNode
    }
  }
}
