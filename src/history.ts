import { ChangeRecord } from './history-change-record'

/**
 * Manage the Changes
 */
export class ChangeStack {
    // undo stack
    private undoChangesStack: ChangeRecord[][] = []
    // redo stack
    private redoChangesStack: ChangeRecord[][] = []

    // indicate if piece tree is under the changing mode.
    private changing: boolean = false

    get last(): ChangeRecord[] {
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
    push(change: ChangeRecord) {
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
    applayRedo(callback: (change: ChangeRecord) => ChangeRecord) {
        const changes = this.redoChangesStack.pop()
        const returnChanges: ChangeRecord[] = []
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
    applayUndo(callback: (change: ChangeRecord) => ChangeRecord) {
        const changes = this.undoChangesStack.pop()
        const returnChanges: ChangeRecord[] = []
        if (changes !== undefined) {
            for (let i = changes.length - 1; i >= 0; i--) {
                callback(changes[i])
            }
            this.redoChangesStack.push(changes)
        }
        return returnChanges
    }
}
