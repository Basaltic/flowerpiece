import { PieceTree } from '../src/pieceTree'
import { PieceMeta } from '../src/meta'
import PieceTreeHelper from './pieceTreeTestHelper'

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
  const meta3 = { p: 3 }
  const meta4 = { p: 4 }
  const meta5 = { p: 5 }

  const imageMeta = { type: 'image' }

  tree.insert(0, 'aaa\nbbb\nccc\nddd\n')
  tree.insert(2, '', imageMeta)

  tree.formatLine(2, meta1)
  expect(tree.getLineMeta(2)).toEqual(meta1)

  tree.formatLine(2, meta2)
  expect(tree.getLineMeta(2)).toEqual({ ...meta1, ...meta2 })

  expect(tree.getLine(1)).toEqual({
    meta: null,
    pieces: [
      { text: 'aa', length: 2, meta: null },
      { text: '', length: 1, meta: imageMeta },
      { text: 'a', length: 1, meta: null },
    ],
  })

  tree.formatInLine(2, meta3)
  expect(tree.getLine(2)).toEqual({
    meta: { ...meta1, ...meta2 },
    pieces: [{ text: 'bbb', length: 3, meta: meta3 }],
  })

  tree.formatTextInLine(1, meta4)
  expect(tree.getLine(1)).toEqual({
    meta: null,
    pieces: [
      { text: 'aa', length: 2, meta: meta4 },
      { text: '', length: 1, meta: imageMeta },
      { text: 'a', length: 1, meta: meta4 },
    ],
  })

  tree.formatNonTextInLine(1, meta5)
  expect(tree.getLine(1)).toEqual({
    meta: null,
    pieces: [
      { text: 'aa', length: 2, meta: meta4 },
      { text: '', length: 1, meta: { ...imageMeta, ...meta5 } },
      { text: 'a', length: 1, meta: meta4 },
    ],
  })
})
