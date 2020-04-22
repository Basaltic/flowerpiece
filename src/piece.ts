import { PieceMeta, IPieceMeta } from './meta'

/**
 * A Piece Refer a piece of text content of the document
 *
 * 1. text piece: bufferIndex > 0 && length > 0
 * 2. line break piece: lineFeedCnt === 1
 * 3. non-text piece: bufferIndex < 0
 *
 */
export default class NodePiece {
  // Buffer Index
  bufferIndex: number
  // Raw Content Start in Current Buffer
  start: number
  // Content Length
  length: number

  // How Many Line Break In This Piece.
  lineFeedCnt: number

  meta: IPieceMeta | null

  constructor(bufferIndex: number, start: number, length: number, lineFeedCnt: number, meta: IPieceMeta | null = null) {
    this.bufferIndex = bufferIndex
    this.start = start
    this.length = length
    this.lineFeedCnt = lineFeedCnt
    this.meta = meta
  }
}

/**
 * Piece Type for
 */
export interface Piece {
  // Text Content
  text: string
  // Length of this piece
  length: number
  // Meta info of this piece
  meta: IPieceMeta | null
}

/**
 * A Line of Content is a list of pieces
 */
export declare type Line = Piece[]
