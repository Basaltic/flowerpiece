import { PieceMeta } from './Meta'
import Piece from './piece'

export default interface Change {
  type: 'insert' | 'delete' | 'format'
}

export interface InsertChange extends Change {
  type: 'insert'
  startOffset: number
  length: number
  // [bufferIndex, start, length]
  text: number[]
  meta: PieceMeta
}

export interface DeleteChange extends Change {
  type: 'delete'
  startOffset: number
  // Deleted part of piece, only the text string need to be stored. [bufferIndex, start, length]
  pieceChange: Array<Piece | number[]>
}

export interface FormatChange extends Change {
  type: 'format'
  startOffset: number
  length: number
  meta: PieceMeta
  // reverse meta change for every piece
  pieceChange: Array<{
    startOffset: number
    length: number
    meta: PieceMeta
  }>
}

export function createInsertChange(
  startOffset: number,
  text: number[],
  meta: PieceMeta
): InsertChange {
  return {
    type: 'insert',
    startOffset,
    length: text[2],
    text,
    meta
  }
}
