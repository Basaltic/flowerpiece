import { PieceTree } from '../src/flowerpiece'

it('Insert Diff 1', () => {
  const tree = new PieceTree()

  let diff = tree.insert(0, 'tttt\nssss\n')
  expect(diff.length).toBe(3)
  expect(diff).toHaveProperty([0, 'type'], 'insert')
  expect(diff).toHaveProperty([1, 'type'], 'insert')
  expect(diff).toHaveProperty([2, 'type'], 'insert')
  expect(diff).toHaveProperty([0, 'lineNumber'], 1)
  expect(diff).toHaveProperty([1, 'lineNumber'], 2)
  expect(diff).toHaveProperty([2, 'lineNumber'], 3)

  // middle of node
  diff = tree.insert(2, 'mm\n123\n')
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'insert', lineNumber: 2 },
    { type: 'insert', lineNumber: 3 },
  ])

  // start of node
  diff = tree.insert(0, 'mm')
  expect(diff).toEqual([{ type: 'replace', lineNumber: 1 }])

  diff = tree.insert(2, 's')
  expect(diff).toEqual([{ type: 'replace', lineNumber: 1 }])

  // middle of node
  diff = tree.insert(2, 's\nx')
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'insert', lineNumber: 2 },
  ])
})

it('Insert Diff 2', () => {
  const tree = new PieceTree()

  tree.insert(0, 'tttt\nssss\n')

  let diff = tree.insert(10, 's')
  expect(diff).toEqual([{ type: 'replace', lineNumber: 3 }])

  diff = tree.insert(11, 's\ns\n')
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 3 },
    { type: 'insert', lineNumber: 4 },
    { type: 'insert', lineNumber: 5 },
  ])
})

it('Format Diff 1', () => {
  const tree = new PieceTree()

  tree.insert(0, 'tttt\nssss\nxxxx')

  let diff = tree.format(2, 10, { color: 'red' })
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'replace', lineNumber: 2 },
    { type: 'replace', lineNumber: 3 },
  ])
})

it('Delete Diff 1', () => {
  const tree = new PieceTree()

  tree.insert(0, 'tttt\nssss\nxxxx')

  let diff = tree.delete(2, 10)
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'remove', lineNumber: 2 },
    { type: 'remove', lineNumber: 3 },
  ])
})

it('Delete Diff 2', () => {
  const tree = new PieceTree()

  tree.insert(0, 'tttt\nssss\nxxxx')

  let diff = tree.delete(2, 1)
  expect(diff).toEqual([{ type: 'replace', lineNumber: 1 }])
})

it('Delete Diff 3', () => {
  const tree = new PieceTree()

  tree.insert(0, 'tttt\nssss\nxxxx')

  let diff = tree.delete(2, 3)
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'remove', lineNumber: 2 },
  ])
})
