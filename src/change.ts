import { Patch } from 'immer'
import { PieceMeta } from './meta'
import Piece from './piece'
import { Diff, mergeDiffs } from './diff'

export default interface IChange {
  type: 'insert' | 'delete' | 'format'
  diffs: Diff[]
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

export function createInsertChange(startOffset: number, text: number[], meta: PieceMeta, diffs: Diff[]): InsertChange {
  return { type: 'insert', startOffset, length: text[2], text, meta, diffs }
}

export function createDeleteChange(startOffset: number, length: number, pieces: Piece[], diffs: Diff[]): DeleteChange {
  return { type: 'delete', startOffset, length, pieces: pieces, diffs }
}

export function createFormatChange(
  startOffset: number,
  length: number,
  meta: PieceMeta,
  piecePatches: PiecePatch[],
  diffs: Diff[],
): FormatChange {
  return { type: 'format', startOffset, length, meta, piecePatches, diffs }
}

/**
 * Manage the Changes
 */
export class ChangeStack {
  // undo stack
  private undoChangesStack: IChange[][] = []
  // redo stack
  private redoChangesStack: IChange[][] = []

  // indicate if piece tree is under the changing mode.
  private changing: boolean = false

  startChange() {
    this.changing = true
    this.undoChangesStack.push([])
  }

  endChange() {
    this.changing = false
    // make sure there's no empty change list in the stack
    const changes = this.undoChangesStack.pop()
    if (changes !== undefined && changes.length > 0) {
      this.undoChangesStack.push(changes)
    }
  }

  /**
   * Add new Changes
   * @param change
   */
  push(change: IChange) {
    if (this.changing) {
      const len = this.undoChangesStack.length - 1
      this.undoChangesStack[len].push(change)
    } else {
      this.undoChangesStack.push([change])
    }
    if (this.redoChangesStack.length > 0) {
      this.redoChangesStack = []
    }
  }

  /**
   * Redo
   * @param callback
   */
  applayRedo(callback: (change: IChange) => Diff[]): Diff[] {
    const changes = this.redoChangesStack.pop()
    if (changes !== undefined) {
      const diffs: Diff[][] = []
      for (let i = 0; i < changes.length; i++) {
        diffs.push(callback(changes[i]))
      }

      this.undoChangesStack.push(changes)
      return mergeDiffs([])
    }

    return []
  }

  /**
   * Undo
   * @param callback
   */
  applayUndo(callback: (change: IChange) => Diff[]) {
    const changes = this.undoChangesStack.pop()
    if (changes) {
      const diffs: Diff[][] = []
      for (let i = changes.length - 1; i >= 0; i--) {
        diffs.push(callback(changes[i]))
      }

      this.redoChangesStack.push(changes)

      return mergeDiffs(diffs)
    }
    return []
  }
}
