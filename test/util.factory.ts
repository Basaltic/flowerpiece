import { PieceNode, createTextPiece, createPieceNode, createStructuralPiece, createRootPiece } from '../src/pieceNode'

export class NodeFactory {
  /**
   * Create Text Piece Node
   */
  public static createTextNode(text: string, lineFeedCnt: number = 0): PieceNode {
    const length = text.length

    const tPiece = createTextPiece(1, 0, length, lineFeedCnt)
    const node = createPieceNode(tPiece)
    return node
  }

  /**
   * Create A Paragraph Node
   */
  public static createParagraphNode(): PieceNode {
    const piece = createStructuralPiece(0, { type: 'p' })
    const node = createPieceNode(piece)

    return node
  }

  /**
   * Create Root Node
   */
  public static createRootNode(): PieceNode {
    return createPieceNode(createRootPiece())
  }
}
