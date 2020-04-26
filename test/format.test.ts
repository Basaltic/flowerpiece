import { PieceTree } from '../src/pieceTree'
import { PieceMeta } from '../src/meta'

it('Basic Format', () => {
  const tree = new PieceTree()

  tree.insert(0, 'abc defg hijk \n', { color: 'red' })

  const meta: any = new PieceMeta()
  meta.color = 'blue'

  // tree.format(2, 2, meta)

  // const line = tree.getLine(1)
  // expect(line).toEqual({
  //   meta: null,
  //   pieces: [
  //     { text: 'ab', length: 2, meta: { color: 'red' } },
  //     { text: 'c ', length: 2, meta: { color: 'blue' } },
  //     { text: 'defg hijk ', length: 10, meta: { color: 'red' } },
  //   ],
  // })
})

it('Advanced Format', () => {
  const tree = new PieceTree()
  const meta1 = { property: 'test' }
  const meta2 = { property2: 't2' }

  const imageMeta = { type: 'image' }

  tree.insert(0, 'aaa\nbbb\nccc\nddd\n')
  tree.insert(2, '', imageMeta)

  console.log(tree.getPieces())

  tree.formatLine(2, meta1)
  // expect(tree.getLineMeta(2)).toEqual(meta1)
  console.log(tree.getPieces())

  // tree.formatLine(2, meta2)
  // expect(tree.getLineMeta(2)).toEqual({ ...meta1, ...meta2 })

  // console.log(tree.getLine(1))
  // expect(tree.getLine(1)).toEqual({
  //   meta: null,
  //   pieces: [
  //     { text: 'aa', length: 2, meta: null },
  //     { text: '', length: 1, meta: imageMeta },
  //     { text: 'a', length: 1, meta: null }
  //   ]
  // })
})
