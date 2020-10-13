import { NodeColor } from './common'
import { PieceMeta } from './meta'
import { Piece, PieceType, PieceNode } from './pieceNode'
import { PieceNodeList } from './pieceNodeList'

export class PieceNodeFactory {
  /**
   * Create Text Piece
   *
   * @param bufferIndex
   * @param start
   * @param length
   * @param lineFeedCnt
   * @param meta
   */
  public static createTextPiece(
    bufferIndex: number,
    start: number,
    length: number,
    lineFeedCnt: number,
    meta: PieceMeta | null = null,
  ): Piece {
    return { pieceType: PieceType.TEXT, bufferIndex, start, length, lineFeedCnt, meta }
  }

  /**
   * Create Object Piece
   * @param meta
   */
  public static createObjectPiece(meta: PieceMeta): Piece {
    return { pieceType: PieceType.Inline, bufferIndex: -1, start: 0, length: 1, lineFeedCnt: 0, meta }
  }

  /**
   * Create Structural Piece
   * @param meta
   */
  public static createStructuralPiece(length: number = 0, meta: PieceMeta) {
    return { pieceType: PieceType.STRUCTURAL, bufferIndex: -1, start: 0, length, lineFeedCnt: 0, meta }
  }

  /**
   * Create Pragraph Piece
   */
  public static createParagraphPiece(meta: PieceMeta): Piece {
    return { pieceType: PieceType.PARAGRAPH, bufferIndex: -1, start: 0, length: 0, lineFeedCnt: 0, meta }
  }

  /**
   * Create Root Piece
   * @param meta
   */
  public static createRootPiece(meta: PieceMeta = {}): Piece {
    return { pieceType: PieceType.ROOT, bufferIndex: -1, start: 0, length: 0, lineFeedCnt: 0, meta }
  }

  /**
   * Create New Node
   *
   * @param piece
   * @param color
   */
  public static createPieceNode(piece: Piece): PieceNode {
    const node = new PieceNode(piece)
    node.left = SENTINEL
    node.right = SENTINEL
    node.parent = SENTINEL
    node.above = SENTINEL

    node.children = new PieceNodeList()
    return node
  }
}

// Sentinel Node Which Refers to Black Nil Node
export const SENTINEL = new PieceNode(PieceNodeFactory.createTextPiece(1, 0, 0, 0), NodeColor.BLACK)
