import { PieceNode } from '../src/pieceNode'
import { PieceNodeFactory } from '../src/pieceNode.factory'

export class NodeFactory {
  /**
   * Create Text Piece Node
   */
  public static createTextNode(text: string, lineFeedCnt: number = 0): PieceNode {
    const length = text.length

    const tPiece = PieceNodeFactory.createTextPiece(1, 0, length, lineFeedCnt)
    const node = PieceNodeFactory.createPieceNode(tPiece)
    return node
  }

  /**
   * Create A Paragraph Node
   */
  public static createParagraphNode(): PieceNode {
    const piece = PieceNodeFactory.createParagraphPiece({ type: 'p' })
    const node = PieceNodeFactory.createPieceNode(piece)

    return node
  }

  /**
   * Create Root Node
   */
  public static createRootNode(): PieceNode {
    return PieceNodeFactory.createPieceNode(PieceNodeFactory.createRootPiece())
  }
}
