import { PieceTree } from '../src/pieceTree'
import { PieceMeta } from '../src/meta'

it('Format', () => {
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
