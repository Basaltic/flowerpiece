import { PieceMeta, Model } from '../src/flowerpiece'

/**
 * Test For Fetching Lines and Pieces
 */
it('Get: Line and Pieces', () => {
  const model = new Model()
  const { operations, queries } = model

  const text = 'This is a test paragraph.\n这是测试段落，只有文字\n'
  operations.insert(0, text)

  let line = queries.getLine(0)
  expect(line).toEqual({
    meta: null,
    pieces: [{ text: 'This is a test paragraph.', length: 25, meta: null }],
  })

  line = queries.getLine(1)
  expect(line).toEqual({
    meta: null,
    pieces: [{ text: 'This is a test paragraph.', length: 25, meta: null }],
  })

  line = queries.getLine(2)
  expect(line).toEqual({
    meta: null,
    pieces: [{ text: '这是测试段落，只有文字', length: 11, meta: null }],
  })

  line = queries.getLine(3)
  expect(line).toEqual({
    meta: null,
    pieces: [{ text: '', length: 0, meta: null }],
  })

  line = queries.getLine(4)
  expect(line).toEqual({
    meta: null,
    pieces: [{ text: '', length: 0, meta: null }],
  })

  let pieces = queries.getPieces()
  expect(pieces).toEqual([
    { text: 'This is a test paragraph.', length: 25, meta: null },
    { text: '\n', length: 1, meta: null },
    { text: '这是测试段落，只有文字', length: 11, meta: null },
    { text: '\n', length: 1, meta: null },
  ])

  operations.insert(2, 'abc')
  pieces = queries.getPieces()
  expect(pieces).toEqual([
    { text: 'Th', length: 2, meta: null },
    { text: 'abc', length: 3, meta: null },
    { text: 'is is a test paragraph.', length: 23, meta: null },
    { text: '\n', length: 1, meta: null },
    { text: '这是测试段落，只有文字', length: 11, meta: null },
    { text: '\n', length: 1, meta: null },
  ])

  const imageMeta: PieceMeta = { type: 'image', width: 500, height: 500, style: {} }
  operations.insert(2, '', imageMeta)
  expect(queries.getLine(1)).toEqual({
    meta: null,
    pieces: [
      { text: 'Th', length: 2, meta: null },
      { text: '', length: 1, meta: imageMeta },
      { text: 'abc', length: 3, meta: null },
      { text: 'is is a test paragraph.', length: 23, meta: null },
    ],
  })

  operations.insert(2, '\n')
  operations.insert(3, '', imageMeta)
  operations.insert(4, '\n')
  expect(queries.getLine(1)).toEqual({
    meta: null,
    pieces: [{ text: 'Th', length: 2, meta: null }],
  })
  expect(queries.getLine(2)).toEqual({
    meta: null,
    pieces: [{ text: '', length: 1, meta: imageMeta }],
  })
})

/**
 * Test For Fetching Line Meta
 */
it('Get Line Meta', () => {
  const model = new Model()
  const { operations, queries } = model

  operations.insert(0, 'First Line\nSecond Line')

  expect(queries.getLineMeta(1)).toBe(null)
  expect(queries.getLineMeta(2)).toBe(null)

  const testMeta = { testProperty: 'test' }
  operations.formatLine(1, testMeta)
  expect(queries.getLineMeta(1)).toEqual(testMeta)

  const testMeta2 = { prop1: 'test' }
  operations.formatLine(2, testMeta2)
  expect(queries.getLineMeta(2)).toEqual(testMeta2)
})

/**
 * GetPicesInRange Unit Test
 */
it('Get Pieces In Range', () => {
  const model = new Model()
  const { operations, queries } = model

  for (let i = 0; i < 10; i++) {
    operations.insert(0, 'aaaa', { p: i })
  }

  expect(queries.getPiecesInRange(1, 6)).toEqual([
    { text: 'aaa', length: 3, meta: { p: 9 } },
    { text: 'aa', length: 2, meta: { p: 8 } },
  ])

  expect(queries.getPiecesInRange(0, 2)).toEqual([{ text: 'aa', length: 2, meta: { p: 9 } }])

  expect(queries.getPiecesInRange(1, 3)).toEqual([{ text: 'aa', length: 2, meta: { p: 9 } }])

  operations.insert(0, 'abcdefghijk', { p: 100 })
  expect(queries.getPiecesInRange(2, 3)).toEqual([{ text: 'c', length: 1, meta: { p: 100 } }])

  expect(queries.getPiecesInRange(2, 5)).toEqual([{ text: 'cde', length: 3, meta: { p: 100 } }])
})

/**
 * GetTextInRange Unit Test
 */
it('Get Pure Text In Range', () => {
  const codeA = 'a'.charCodeAt(0)
  const model = new Model()
  const { operations, queries } = model

  for (let i = 0; i < 10; i++) {
    const s = String.fromCharCode(codeA + i)
    operations.insert(0, s + s, { p: i })
  }

  expect(queries.getTextInRange(1, 3)).toEqual('ji')

  expect(queries.getTextInRange(0, 6)).toEqual('jjiihh')

  expect(queries.getTextInRange(-10, 1)).toEqual('j')
})
