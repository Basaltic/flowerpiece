import { PieceTree } from '../src/flowerpiece'

it('flower piece: Insert Diff', () => {
  const tree = new PieceTree()

  let diff = tree.insert(0, 'tttt\nssss\n')
  expect(diff.length).toBe(3)
  expect(diff).toHaveProperty([0, 'type'], 'insert')
  expect(diff).toHaveProperty([1, 'type'], 'insert')
  expect(diff).toHaveProperty([2, 'type'], 'insert')
  expect(diff).toHaveProperty([0, 'lineNumber'], 1)
  expect(diff).toHaveProperty([1, 'lineNumber'], 2)
  expect(diff).toHaveProperty([2, 'lineNumber'], 3)

  diff = tree.insert(2, 'mm')
  expect(diff).toEqual([{ type: 'replace', lineNumber: 1 }])

  diff = tree.insert(0, 'mm')
  expect(diff).toEqual([{ type: 'replace', lineNumber: 1 }])
})
