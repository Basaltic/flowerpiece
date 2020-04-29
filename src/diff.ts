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
