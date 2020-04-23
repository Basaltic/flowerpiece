import { PieceTree } from '../src/flowerpiece'

it('Diff: Insert', () => {
  const tree = new PieceTree()

  let diff = tree.insert(0, 'a\nb\n')
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'insert', lineNumber: 2 },
    { type: 'insert', lineNumber: 3 },
  ])

  expect(tree.getAllText()).toBe('a\nb\n')

  diff = tree.insert(0, 'a\nb')
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'insert', lineNumber: 2 },
  ])

  diff = tree.insert(0, 'cc')
  expect(diff).toEqual([{ type: 'replace', lineNumber: 1 }])

  diff = tree.insert(1, 'dd')
  expect(diff).toEqual([{ type: 'replace', lineNumber: 1 }])

  diff = tree.insert(6, 'ee\nee')
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 2 },
    { type: 'insert', lineNumber: 3 },
  ])

  diff = tree.insert(7, '\nff\n')

  expect(diff).toEqual([
    { type: 'replace', lineNumber: 2 },
    { type: 'insert', lineNumber: 3 },
    { type: 'insert', lineNumber: 4 },
  ])
})

it('Diff: Delete 1', () => {
  const tree = new PieceTree()

  tree.insert(0, 'tttt\nssss\nxxxx')

  let diff = tree.delete(2, 10)
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'remove', lineNumber: 2 },
    { type: 'remove', lineNumber: 3 },
  ])
})

it('Diff: Delete 2', () => {
  const tree = new PieceTree()

  tree.insert(0, 'tttt\nssss\nxxxx')

  let diff = tree.delete(2, 1)
  expect(diff).toEqual([{ type: 'replace', lineNumber: 1 }])
})

it('Diff: Delete 3', () => {
  const tree = new PieceTree()

  tree.insert(0, 'tttt\nssss\nxxxx')

  let diff = tree.delete(2, 4)
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'remove', lineNumber: 2 },
  ])
})

it('Diff: Format', () => {
  const tree = new PieceTree()

  tree.insert(0, 'tttt\nssss\nxxxx')

  let diff = tree.format(2, 1, { color: 'blue' })
  expect(diff).toEqual([{ type: 'replace', lineNumber: 1 }])

  diff = tree.format(2, 3, { color: 'blue' })
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'replace', lineNumber: 2 },
  ])

  diff = tree.format(2, 10, { color: 'red' })
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'replace', lineNumber: 2 },
    { type: 'replace', lineNumber: 3 },
  ])

  diff = tree.format(6, 2, { color: 'blue' })
  expect(diff).toEqual([{ type: 'replace', lineNumber: 2 }])

  diff = tree.format(6, 5, { color: 'red' })
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 2 },
    { type: 'replace', lineNumber: 3 },
  ])

  diff = tree.format(11, 2, { color: 'red' })
  expect(diff).toEqual([{ type: 'replace', lineNumber: 3 }])
})
