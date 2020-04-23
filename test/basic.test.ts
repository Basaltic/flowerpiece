import { PieceTree, PieceMeta } from '../src/flowerpiece'

it('isEmpty Test', () => {
  const tree = new PieceTree()

  expect(tree.isEmpty()).toBe(true)

  tree.insert(0, 'x')

  expect(tree.isEmpty()).toBe(false)

  tree.delete(0, 1)
  expect(tree.isEmpty()).toBe(true)
})

it('format 1', () => {
  const tree = new PieceTree()

  tree.insert(0, 'abc defg hijk \n', { color: 'red' })

  const meta: any = new PieceMeta()
  meta.color = 'blue'

  tree.format(2, 2, meta)

  const line = tree.getLine(1)
  expect(line).toEqual({
    meta: null,
    pieces: [
      { text: 'ab', length: 2, meta: { color: 'red' } },
      { text: 'c ', length: 2, meta: { color: 'blue' } },
      { text: 'defg hijk ', length: 10, meta: { color: 'red' } },
    ],
  })
})
