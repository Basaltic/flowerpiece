import { Piece, PieceNode, PieceType } from './piece-node'
import { Inline } from './piece-node-inline'
import { Paragraph } from './piece-node-paragraph'
import { Structural } from './piece-node-structural'
import { Text } from './piece-node-text'

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
            return new Text({ ...piece })
    }
}
