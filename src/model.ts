import { Operations } from './operations'
import { PieceTree } from './pieceTree'
import { Queries } from './queries'
import { ChangeStack, createResetChange } from './history'
import { Line } from './piece'
import { DocumentChange } from 'flowerpiece'

export interface ModelConfig {
  initialValue?: Line[]
}

/**
 * Data Model
 */
export class Model {
  operations: Operations
  queries: Queries

  pieceTree: PieceTree
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
   * Start Recording Operations
   */
  startChange() {
    this.changeHistory.startChange()
  }

  /**
   * Finish Recording Operations.
   */
  endChange() {
    this.changeHistory.endChange()
  }

  /**
   * Combine Multiple Operations into one Change.
   * @param callback
   */
  change(callback: (operations: Operations) => void): DocumentChange[] {
    this.changeHistory.startChange()
    let changes: DocumentChange[] = []
    try {
      callback(this.operations)
      changes = this.changeHistory.last
    } catch (error) {}
    this.changeHistory.endChange()
    return changes
  }

  /**
   * Redo the operation
   */
  redo(): DocumentChange[] {
    this.changeHistory.endChange()
    return this.changeHistory.applayRedo(change => this.pieceTree.doRedo(change))
  }

  /**
   * Undo the operation
   */
  undo(): DocumentChange[] {
    this.changeHistory.endChange()
    return this.changeHistory.applayUndo(change => this.pieceTree.doUndo(change))
  }

  /**
   * Check If there's no content
   */
  isEmpty() {
    return this.pieceTree.isEmpty()
  }

  /**
   * Reset Contents
   * @param lines
   */
  resetContent(lines: Line[]): DocumentChange | null {
    this.changeHistory.clear()
    this.pieceTree.resetByLines(lines)
    return createResetChange()
  }
}
