/**
 * Piece Type for
 */
export interface Piece {
  // Text Content
  text: string
  // Length of this piece
  length: number
}

/**
 * A Line of Content is a list of pieces
 */
export interface Line {
  pieces: Piece[]
}
