import { Piece, PieceNode, PieceType } from './pieceNode'
import { Inline } from './pieceNode.inline'
import { Paragraph } from './pieceNode.paragraph'
import { Structural } from './pieceNode.structural'
import { Text } from './pieceNode.text'

/**
 *
 * @param piece
 */
export function createPieceNode(piece: Piece): PieceNode {
  switch (piece.pieceType) {
    case PieceType.INLINE:
      return new Inline(piece.meta)
    case PieceType.PARAGRAPH:
      return new Paragraph(piece.meta)
    case PieceType.STRUCTURAL:
      return new Structural(piece.meta)
    case PieceType.TEXT:
    default:
      return new Text(piece.bufferIndex, piece.start, piece.length, piece.meta)
  }
}
