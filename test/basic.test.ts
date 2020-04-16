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
  if (line[0].meta) expect(line[0].meta.color).toBe('red')
  if (line[1].meta) expect(line[1].meta.color).toBe('blue')
  if (line[2].meta) expect(line[2].meta.color).toBe('red')
})
