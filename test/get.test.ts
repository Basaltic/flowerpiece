import { PieceTree, IPieceMeta } from '../src/flowerpiece'

/**
 * Test For Fetching Lines and Pieces
 */
it('Get: Line and Pieces', () => {
  const tree = new PieceTree()

  const text = 'This is a test paragraph.\n这是测试段落，只有文字\n'
  tree.insert(0, text)

  let line = tree.getLine(0)
  expect(line).toEqual({
    meta: null,
    pieces: [{ text: 'This is a test paragraph.', length: 25, meta: null }],
  })

  line = tree.getLine(1)
  expect(line).toEqual({
    meta: null,
    pieces: [{ text: 'This is a test paragraph.', length: 25, meta: null }],
  })

  line = tree.getLine(2)
  expect(line).toEqual({
    meta: null,
    pieces: [{ text: '这是测试段落，只有文字', length: 11, meta: null }],
  })

  line = tree.getLine(3)
  expect(line).toEqual({
    meta: null,
    pieces: [{ text: '', length: 0, meta: null }],
  })

  line = tree.getLine(4)
  expect(line).toEqual({
    meta: null,
    pieces: [{ text: '', length: 0, meta: null }],
  })

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
  expect(tree.getLine(1)).toEqual({
    meta: null,
    pieces: [
      { text: 'Th', length: 2, meta: null },
      { text: '', length: 1, meta: imageMeta },
      { text: 'abc', length: 3, meta: null },
      { text: 'is is a test paragraph.', length: 23, meta: null },
    ],
  })

  tree.insert(2, '\n')
  tree.insert(3, '', imageMeta)
  tree.insert(4, '\n')
  expect(tree.getLine(1)).toEqual({
    meta: null,
    pieces: [{ text: 'Th', length: 2, meta: null }],
  })
  expect(tree.getLine(2)).toEqual({
    meta: null,
    pieces: [{ text: '', length: 1, meta: imageMeta }],
  })
})

/**
 * Test For Fetching Line Meta
 */
it('Get Line Meta', () => {
  const tree = new PieceTree()

  tree.insert(0, 'First Line\nSecond Line')

  expect(tree.getLineMeta(1)).toBe(null)
  expect(tree.getLineMeta(2)).toBe(null)

  const testMeta = { testProperty: 'test' }
  tree.formatLine(1, testMeta)
  expect(tree.getLineMeta(1)).toEqual(testMeta)

  const testMeta2 = { prop1: 'test' }
  tree.formatLine(2, testMeta2)
  expect(tree.getLineMeta(2)).toEqual(testMeta2)
})
