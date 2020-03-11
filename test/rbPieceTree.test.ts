import { PieceTree } from '../src/pieceTree'

const log = console.log

it('rbTree: Insert', () => {
  const tree = new PieceTree()

  // Format
})

it('rbTree: Format', () => {
  const tree = new PieceTree()

  tree.insert(0, 'abc defg hijk \n', { color: 'red' })

  tree.format(2, 2, { color: 'blue' })

  const line = tree.getLine(1)
  expect(line[0].meta.color).toBe('red')
  expect(line[1].meta.color).toBe('blue')
  expect(line[2].meta.color).toBe('red')
})
