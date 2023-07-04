import { PieceMeta } from './meta'
import { Piece } from './piece-node'
import { Patch } from 'immer'

export interface ChangeRecord {
    type: 'insertText' | 'insertLineBreak' | 'delete' | 'format' | 'reset'
    offset: number
    length: number
}

/**
 * Represent the change of insert operation
 */
export interface InsertTextChangeRecord extends ChangeRecord {
    type: 'insertText'
    bufferStart: number
}

export interface InsertLineBreakChangeRecord extends ChangeRecord {
    type: 'insertLineBreak'
}

/**
 * Represent the change of delete operation
 */
export interface DeleteChange extends ChangeRecord {
    type: 'delete'
    pieces: Piece[]
}

/**
 * Represent the change of format operation
 */
export interface FormatChange extends ChangeRecord {
    type: 'format'
    meta: PieceMeta
    piecePatches: PiecePatch[]
}

export interface PiecePatch {
    startOffset: number
    length: number
    inversePatches: Patch[]
}

export function createInsertTextChangeRecord(startOffset: number, bufferStart: number, bufferLength: number): InsertTextChangeRecord {
    return { type: 'insertText', offset: startOffset, length: bufferLength, bufferStart }
}

export function createInsertLineBreakChangeRecord(offset: number): InsertLineBreakChangeRecord {
    return { type: 'insertLineBreak', offset, length: 1 }
}

export function createDeleteChange(startOffset: number, length: number, pieces: Piece[]): DeleteChange {
    return { type: 'delete', offset: startOffset, length, pieces: pieces }
}

export function createFormatChange(startOffset: number, length: number, meta: PieceMeta, piecePatches: PiecePatch[]): FormatChange {
    return { type: 'format', offset: startOffset, length, meta, piecePatches }
}

export function createResetChange(): ChangeRecord {
    return { type: 'reset', offset: 0, length: 0 }
}
