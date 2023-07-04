import { PieceMeta } from '.'
import { PieceNode, PieceType, SENTINEL } from './pieceNode'
import { PieceNodeList } from './pieceNodeList'
import { Structural } from './pieceNode.structural'

/**
 * Paragraph Node is one of the basic block node.
 * It contains text or inline node as children.
 * Paragraph has 1 length to represent a line break in content
 */
export class Paragraph extends Structural {
  constructor(meta: PieceMeta | null = null) {
    super(meta)
    this.piece.pieceType = PieceType.PARAGRAPH
    this.piece.length = 1

    this.left = SENTINEL
    this.right = SENTINEL
    this.parent = SENTINEL
    this.above = SENTINEL
    this.children = new PieceNodeList()
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

  /**
   * Merge A Paragraph To This Paragraph
   * @param node
   */
  public merge(paragraphToMerge: Paragraph) {
    paragraphToMerge.remove()
    if (paragraphToMerge.children) {
      paragraphToMerge.children.forEach(node => {
        this.appendChild(node)
      })
    }
  }
}
