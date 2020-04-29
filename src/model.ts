import { Operations } from './operations'
import { PieceTree } from './pieceTree'
import { Queries } from './query'
import { ChangeStack } from './change'
import { Diff } from './diff'
import { Line } from './piece'

export interface ModelConfig {
  initialValue?: Line[]
}

/**
 * Data Model
 */
export class Model {
  operations: Operations
  queries: Queries

  private pieceTree: PieceTree
  // A Stack to manage the changes
  private changeHistory: ChangeStack

  constructor(config: ModelConfig = {}) {
    const { initialValue } = config

    this.changeHistory = new ChangeStack()
    this.pieceTree = new PieceTree({ initialLines: initialValue }, this.changeHistory)
    this.operations = new Operations(this.pieceTree)
    this.queries = new Queries(this.pieceTree)
  }

  /**
   * Reset Contents
   * @param lines
   */
  resetContent(lines: Line[]) {
    this.changeHistory.clear()
    this.pieceTree.resetByLines(lines)
  }

  /**
   * Combine Multiple Operations into one Change.
   * @param callback
   */
  change(callback: (operations: Operations) => void) {
    this.changeHistory.startChange()
    try {
      callback(this.operations)
    } catch (error) {}
    this.changeHistory.endChange()
  }

  /**
   * Redo the operation
   */
  redo(): Diff[] {
    this.changeHistory.endChange()
    return this.changeHistory.applayRedo(change => this.pieceTree.doRedo(change))
  }

  /**
   * Undo the operation
   */
  undo(): Diff[] {
    this.changeHistory.endChange()
    return this.changeHistory.applayUndo(change => this.pieceTree.doUndo(change))
  }

  /**
   * Check If there's no content
   */
  isEmpty() {
    return this.pieceTree.isEmpty()
  }
}
