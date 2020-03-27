import { PieceTree } from '../src/flowerpiece'

it('init from json', () => {
  const tree = new PieceTree()

  // Format
})

it('format 1', () => {
  const tree = new PieceTree()

  tree.insert(0, 'abc defg hijk \n', { color: 'red' })

  tree.format(2, 2, { color: 'blue' })

  const line = tree.getLine(1)
  if (line[0].meta) expect(line[0].meta.color).toBe('red')
  if (line[1].meta) expect(line[1].meta.color).toBe('blue')
  if (line[2].meta) expect(line[2].meta.color).toBe('red')
})
