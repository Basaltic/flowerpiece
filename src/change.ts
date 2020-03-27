import { PieceMeta } from './meta'
import Piece from './piece'
import { Patch } from 'immer'

export default interface IChange {
  type: 'insert' | 'delete' | 'format'
}

/**
 * Represent the change of insert operation
 */
export interface InsertChange extends IChange {
  type: 'insert'
  startOffset: number
  length: number
  // [bufferIndex, start, length]
  text: number[]
  meta: PieceMeta
}

/**
 * Represent the change of delete operation
 */
export interface DeleteChange extends IChange {
  type: 'delete'
  startOffset: number
  length: number
  // Deleted part of piece, only the text string need to be stored. [bufferIndex, start, length]
  pieces: Piece[]
}

/**
 * Represent the change of format operation
 */
export interface FormatChange extends IChange {
  type: 'format'
  startOffset: number
  length: number
  meta: PieceMeta
  // reverse meta change for every piece

  piecePatches: PiecePatch[]
}

export interface PiecePatch {
  startOffset: number
  length: number
  inversePatches: Patch[]
}

export function createInsertChange(startOffset: number, text: number[], meta: PieceMeta): InsertChange {
  return { type: 'insert', startOffset, length: text[2], text, meta }
}

export function createDeleteChange(startOffset: number, length: number, pieces: Piece[]): DeleteChange {
  return { type: 'delete', startOffset, length, pieces: pieces }
}

export function createFormatChange(startOffset: number, length: number, meta: PieceMeta, piecePatches: PiecePatch[]): FormatChange {
  return { type: 'format', startOffset, length, meta, piecePatches }
}

/**
 * Manage the Changes
 */
export class ChangeStack {
  // undo stack
  private undoChanges: IChange[][] = []
  // redo stack
  private redoChanges: IChange[][] = []

  // indicate if piece tree is under the changing mode.
  private changing: boolean = false

  startChange() {
    this.changing = true
    this.undoChanges.push([])
  }

  endChange() {
    this.changing = false
  }

  /**
   * Add new Changes
   * @param change
   */
  push(change: IChange) {
    if (this.changing) {
      const len = this.undoChanges.length
      this.undoChanges[len].push(change)
    } else {
      this.undoChanges.push([change])
    }
    if (this.redoChanges.length > 0) {
      this.redoChanges = []
    }
  }

  /**
   * Redo
   * @param callback
   */
  applayRedo(callback: (change: IChange) => void) {
    const changes = this.redoChanges.pop()
    if (changes) {
      for (let i = 0; i < changes.length; i++) {
        callback(changes[i])
      }

      this.undoChanges.push(changes)
    }
  }

  /**
   * Undo
   * @param callback
   */
  applayUndo(callback: (change: IChange) => void) {
    const changes = this.undoChanges.pop()
    if (changes) {
      for (let i = changes.length - 1; i >= 0; i--) {
        callback(changes[i])
      }

      this.redoChanges.push(changes)
    }
  }
}
