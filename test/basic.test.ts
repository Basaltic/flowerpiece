import { PieceTree, PieceMeta } from '../src/flowerpiece'

it('isEmpty Test', () => {
  const tree = new PieceTree()

  expect(tree.isEmpty()).toBe(true)

  tree.insert(0, 'x')

  expect(tree.isEmpty()).toBe(false)

  tree.delete(0, 1)
  expect(tree.isEmpty()).toBe(true)
})
