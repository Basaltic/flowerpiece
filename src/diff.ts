/**
 * Difference for atomic insert, delete, format operation
 */
export interface Diff {
  // insert: indicate this line is newly added
  // remove: indicate this line is removed
  // replace: indicate this line has some change. need to fetch the line content again
  type: 'insert' | 'replace' | 'remove'
  // Which line inserted, changed, removed
  lineNumber: number
}

/**
 * Merge Multi list of diffs to make sure the diffs applied are correct
 *
 * TODO Implement Diff Merge Later
 *
 * combination of diff list
 * 1. insert and replace
 * 2. remove and replace
 * 3. only replace
 *
 * @param diffsList
 */
export function mergeDiffs(diffsList: Diff[][]) {
  // if (diffsList.length === 1) {
  //   return diffsList[0]
  // } else if (diffsList.length > 1) {
  //   let lastLineNumberOffset = 0
  //   let lineNumberOffset = 0
  //   for (const diffs of diffsList) {
  //     for (const diff of diffs) {
  //       if (diff.type === 'insert') {
  //         lineNumberOffset++
  //         diff.lineNumber += lastLineNumberOffset
  //       } else if (diff.type === 'remove') {
  //         lineNumberOffset--
  //         diff.lineNumber += lastLineNumberOffset
  //       }
  //     }
  //     lastLineNumberOffset = lineNumberOffset
  //     lineNumberOffset = 0
  //   }
  // }

  // TODO later. figure out a better way to merge diffs
  let diffs: Diff[] = []
  diffsList.forEach(ds => {
    diffs = [...diffs, ...ds]
  })

  return diffs
}
