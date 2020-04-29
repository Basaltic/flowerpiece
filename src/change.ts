import { Patch } from 'immer'
import { PieceMeta } from './meta'
import NodePiece from './piece'
import { Diff } from './diff'

export interface DocumentChange {
  type: 'insert' | 'delete' | 'format'
  diffs: Diff[]
  startOffset: number
  length: number
}

/**
 * Represent the change of insert operation
 */
export interface InsertChange extends DocumentChange {
  type: 'insert'

  // [bufferIndex, start, length]
  text: number[]
  meta: PieceMeta
}

/**
 * Represent the change of delete operation
 */
export interface DeleteChange extends DocumentChange {
  type: 'delete'
  // Deleted part of piece, only the text string need to be stored. [bufferIndex, start, length]
  pieces: NodePiece[]
}

/**
 * Represent the change of format operation
 */
export interface FormatChange extends DocumentChange {
  type: 'format'
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

export function createDeleteChange(startOffset: number, length: number, pieces: NodePiece[], diffs: Diff[]): DeleteChange {
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
  private undoChangesStack: DocumentChange[][] = []
  // redo stack
  private redoChangesStack: DocumentChange[][] = []

  // indicate if piece tree is under the changing mode.
  private changing: boolean = false

  get last(): DocumentChange[] {
    const index = this.undoChangesStack.length - 1
    return this.undoChangesStack[index]
  }

  /**
   * Clear all changes
   */
  clear() {
    this.undoChangesStack = []
    this.redoChangesStack = []
  }

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
  push(change: DocumentChange) {
    if (this.changing) {
      const len = this.undoChangesStack.length - 1
      this.undoChangesStack[len].push(change)

      if (this.redoChangesStack.length > 0) {
        this.redoChangesStack = []
      }
    }
  }

  /**
   * Redo
   * @param callback
   */
  applayRedo(callback: (change: DocumentChange) => DocumentChange) {
    const changes = this.redoChangesStack.pop()
    const returnChanges: DocumentChange[] = []
    if (changes !== undefined) {
      for (let i = 0; i < changes.length; i++) {
        callback(changes[i])
      }
      this.undoChangesStack.push(changes)
    }

    return returnChanges
  }

  /**
   * Undo
   * @param callback
   */
  applayUndo(callback: (change: DocumentChange) => DocumentChange) {
    const changes = this.undoChangesStack.pop()
    const returnChanges: DocumentChange[] = []
    if (changes !== undefined) {
      for (let i = changes.length - 1; i >= 0; i--) {
        callback(changes[i])
      }
      this.redoChangesStack.push(changes)
    }
    return returnChanges
  }
}
