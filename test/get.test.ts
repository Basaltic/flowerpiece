import { PieceTree, IPieceMeta } from '../src/flowerpiece'

it('Get: Line and Pieces', () => {
  const tree = new PieceTree()

  const text = 'This is a test paragraph.\n这是测试段落，只有文字\n'
  tree.insert(0, text)

  let line = tree.getLine(1)
  expect(line).toEqual([{ text: 'This is a test paragraph.', length: 25, meta: null }])

  line = tree.getLine(2)
  expect(line).toEqual([{ text: '这是测试段落，只有文字', length: 11, meta: null }])

  line = tree.getLine(3)
  expect(line).toEqual([{ text: '', length: 0, meta: null }])

  line = tree.getLine(0)
  expect(line).toEqual([{ text: 'This is a test paragraph.', length: 25, meta: null }])

  line = tree.getLine(4)
  expect(line).toEqual([{ text: '', length: 0, meta: null }])

  let pieces = tree.getPieces()
  expect(pieces).toEqual([
    { text: 'This is a test paragraph.', length: 25, meta: null },
    { text: '\n', length: 1, meta: null },
    { text: '这是测试段落，只有文字', length: 11, meta: null },
    { text: '\n', length: 1, meta: null },
  ])

  tree.insert(2, 'abc')
  pieces = tree.getPieces()
  expect(pieces).toEqual([
    { text: 'Th', length: 2, meta: null },
    { text: 'abc', length: 3, meta: null },
    { text: 'is is a test paragraph.', length: 23, meta: null },
    { text: '\n', length: 1, meta: null },
    { text: '这是测试段落，只有文字', length: 11, meta: null },
    { text: '\n', length: 1, meta: null },
  ])

  const imageMeta: IPieceMeta = { type: 'image', width: 500, height: 500, style: {} }
  tree.insert(2, '', imageMeta)
  expect(tree.getLine(1)).toEqual([
    { text: 'Th', length: 2, meta: null },
    { text: '', length: 1, meta: imageMeta },
    { text: 'abc', length: 3, meta: null },
    { text: 'is is a test paragraph.', length: 23, meta: null },
  ])

  tree.insert(2, '\n')
  tree.insert(3, '', imageMeta)
  tree.insert(4, '\n')
  expect(tree.getLine(1)).toEqual([{ text: 'Th', length: 2, meta: null }])
  expect(tree.getLine(2)).toEqual([{ text: '', length: 1, meta: imageMeta }])
})
