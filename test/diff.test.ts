import { mergeDiffs, Diff } from '../src/diff'

it('Merge Diffs', () => {
  const diffsList: Diff[][] = [
    [
      { type: 'replace', lineNumber: 1 },
      { type: 'insert', lineNumber: 2 },
      { type: 'insert', lineNumber: 3 },
      { type: 'insert', lineNumber: 4 },
      { type: 'replace', lineNumber: 5 },
    ],
    [
      { type: 'replace', lineNumber: 2 },
      { type: 'remove', lineNumber: 3 },
      { type: 'remove', lineNumber: 4 },
    ],
  ]

  const diffs = mergeDiffs(diffsList)

  expect(diffs).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'insert', lineNumber: 2 },
    { type: 'insert', lineNumber: 3 },
    { type: 'insert', lineNumber: 4 },
    { type: 'replace', lineNumber: 5 },
    { type: 'replace', lineNumber: 2 },
    { type: 'remove', lineNumber: 3 },
    { type: 'remove', lineNumber: 4 },
  ])
})
