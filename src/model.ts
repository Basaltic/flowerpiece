import { Operations } from './operations'
import { PieceTree } from './pieceTree'
import { Queries } from './query'

export interface ModelConfig {}

/**
 * Data Model
 */
export class Model {
  private pieceTree: PieceTree

  operations: Operations
  queries: Queries

  constructor() {
    this.pieceTree = new PieceTree()
    this.operations = new Operations(this.pieceTree)
    this.queries = new Queries(this.pieceTree)
  }

  /**
   * Combine Multiple Operations into one Change.
   * @param callback
   */
  change(callback: (operations: Operations) => void) {
    this.pieceTree.startChange()
    try {
      callback(this.operations)
    } catch (error) {}

    this.pieceTree.endChange()
  }

  redo() {
    return this.pieceTree.redo()
  }

  undo() {
    return this.pieceTree.undo()
  }

  isEmpty() {
    return this.pieceTree.isEmpty()
  }
}
