import { PieceMeta } from './Meta'
import Piece from './piece'

export default interface Change {
  type: 'insert' | 'delete' | 'format'
}

/**
 * Represent the change of insert operation
 */
export interface InsertChange extends Change {
  type: 'insert'
  start: number
  length: number
  // [bufferIndex, start, length]
  text: number[]
  meta: PieceMeta
}

/**
 * Represent the change of delete operation
 */
export interface DeleteChange extends Change {
  type: 'delete'
  start: number
  length: number
  // Deleted part of piece, only the text string need to be stored. [bufferIndex, start, length]
  pieces: Piece[]
}

/**
 * Represent the change of format operation
 */
export interface FormatChange extends Change {
  type: 'format'
  start: number
  length: number
  meta: PieceMeta
  // reverse meta change for every piece
  pieceChange: Array<{
    startOffset: number
    length: number
    meta: PieceMeta
  }>
}

export function createInsertChange(startOffset: number, text: number[], meta: PieceMeta): InsertChange {
  return {
    type: 'insert',
    start: startOffset,
    length: text[2],
    text,
    meta,
  }
}

export function createDeleteChange(startOffset: number, length: number, pieces: Piece[]): DeleteChange {
  return {
    type: 'delete',
    start: startOffset,
    length,
    pieces: pieces,
  }
}
