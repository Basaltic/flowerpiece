import { PieceTree } from '../src/flowerpiece'

it('Diff: Insert', () => {
  const tree = new PieceTree()

  let diff = tree.insert(0, 'a\nb\n')
  expect(diff).toEqual([
    { type: 'insert', lineNumber: 1 },
    { type: 'insert', lineNumber: 2 },
    { type: 'replace', lineNumber: 3 },
  ])

  expect(tree.getAllText()).toBe('a\nb\n')

  diff = tree.insert(0, 'a\nb')
  expect(diff).toEqual([
    { type: 'insert', lineNumber: 1 },
    { type: 'replace', lineNumber: 2 },
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

// it('Insert Diff 2', () => {
//   const tree = new PieceTree()

//   tree.insert(0, 'tttt\nssss\n')

//   let diff = tree.insert(10, 's')
//   expect(diff).toEqual([{ type: 'replace', lineNumber: 3 }])

//   diff = tree.insert(11, 's\ns\n')
//   expect(diff).toEqual([
//     { type: 'replace', lineNumber: 3 },
//     { type: 'insert', lineNumber: 4 },
//     { type: 'insert', lineNumber: 5 },
//   ])
// })

// it('Format Diff 1', () => {
//   const tree = new PieceTree()

//   tree.insert(0, 'tttt\nssss\nxxxx')

//   let diff = tree.format(2, 10, { color: 'red' })
//   expect(diff).toEqual([
//     { type: 'replace', lineNumber: 1 },
//     { type: 'replace', lineNumber: 2 },
//     { type: 'replace', lineNumber: 3 },
//   ])
// })

// it('Delete Diff 1', () => {
//   const tree = new PieceTree()

//   tree.insert(0, 'tttt\nssss\nxxxx')

//   let diff = tree.delete(2, 10)
//   expect(diff).toEqual([
//     { type: 'replace', lineNumber: 1 },
//     { type: 'remove', lineNumber: 2 },
//     { type: 'remove', lineNumber: 3 },
//   ])
// })

// it('Delete Diff 2', () => {
//   const tree = new PieceTree()

//   tree.insert(0, 'tttt\nssss\nxxxx')

//   let diff = tree.delete(2, 1)
//   expect(diff).toEqual([{ type: 'replace', lineNumber: 1 }])
// })

// it('Delete Diff 3', () => {
//   const tree = new PieceTree()

//   tree.insert(0, 'tttt\nssss\nxxxx')

//   let diff = tree.delete(2, 3)
//   expect(diff).toEqual([
//     { type: 'replace', lineNumber: 1 },
//     { type: 'remove', lineNumber: 2 },
//   ])
// })
