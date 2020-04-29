import { PieceMeta } from '../src/meta'
import { Model } from '../src/flowerpiece'

it('Basic Format', () => {
  const model = new Model()
  const { operations } = model

  operations.insert(0, 'abc defg hijk \n', { color: 'red' })

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
  const model = new Model()
  const { operations, queries } = model

  const meta1 = { property: 'test' }
  const meta2 = { property2: 't2' }
  const meta3 = { p: 3 }
  const meta4 = { p: 4 }
  const meta5 = { p: 5 }

  const imageMeta = { type: 'image' }

  operations.insert(0, 'aaa\nbbb\nccc\nddd\n')
  operations.insert(2, '', imageMeta)

  operations.formatLine(2, meta1)
  expect(queries.getLineMeta(2)).toEqual(meta1)

  operations.formatLine(2, meta2)
  expect(queries.getLineMeta(2)).toEqual({ ...meta1, ...meta2 })

  expect(queries.getLine(1)).toEqual({
    meta: null,
    pieces: [
      { text: 'aa', length: 2, meta: null },
      { text: '', length: 1, meta: imageMeta },
      { text: 'a', length: 1, meta: null },
    ],
  })

  operations.formatInLine(2, meta3)
  expect(queries.getLine(2)).toEqual({
    meta: { ...meta1, ...meta2 },
    pieces: [{ text: 'bbb', length: 3, meta: meta3 }],
  })

  operations.formatTextInLine(1, meta4)
  expect(queries.getLine(1)).toEqual({
    meta: null,
    pieces: [
      { text: 'aa', length: 2, meta: meta4 },
      { text: '', length: 1, meta: imageMeta },
      { text: 'a', length: 1, meta: meta4 },
    ],
  })

  operations.formatNonTextInLine(1, meta5)
  expect(queries.getLine(1)).toEqual({
    meta: null,
    pieces: [
      { text: 'aa', length: 2, meta: meta4 },
      { text: '', length: 1, meta: { ...imageMeta, ...meta5 } },
      { text: 'a', length: 1, meta: meta4 },
    ],
  })
})

it('FormatInLine Corner Case', () => {
  const model = new Model()
  const { operations, queries } = model

  const meta1 = { color: 'r1' }
  const meta2 = { color: 'r2' }

  operations.insert(0, 'aaa')

  operations.formatInLine(1, meta1)
  expect(queries.getLine(1).pieces).toEqual([{ text: 'aaa', length: 3, meta: meta1 }])
  expect(operations.formatInLine(100, meta1)).toEqual(null)

  operations.insert(3, '\nbbb')

  operations.formatInLine(2, meta2)
  expect(queries.getLine(2).pieces).toEqual([{ text: 'bbb', length: 3, meta: meta2 }])
  expect(operations.formatInLine(100, meta1)).toEqual(null)
})

it('FormatTextInLine Corner Case', () => {
  const model = new Model()
  const { operations, queries } = model

  const meta1 = { color: 'r1' }
  const meta2 = { color: 'r2' }

  operations.insert(0, 'aaa')
  operations.insert(0, '', { t: 'image' })

  operations.formatTextInLine(1, meta1)
  expect(queries.getLine(1).pieces).toEqual([
    { text: '', length: 1, meta: { t: 'image' } },
    { text: 'aaa', length: 3, meta: meta1 },
  ])
  expect(operations.formatTextInLine(100, meta1)).toEqual(null)

  operations.insert(4, '\nbbb')
  operations.insert(6, '', { t: 'image' })

  operations.formatTextInLine(2, meta2)
  expect(queries.getLine(2).pieces).toEqual([
    { text: 'b', length: 1, meta: meta2 },
    { text: '', length: 1, meta: { t: 'image' } },
    { text: 'bb', length: 2, meta: meta2 },
  ])
  expect(operations.formatTextInLine(100, meta1)).toEqual(null)
})

it('FormatNonTextInLine Corner Case', () => {
  const model = new Model()
  const { operations, queries } = model

  const meta1 = { color: 'r1' }
  const meta2 = { color: 'r2' }

  operations.insert(0, 'aaa')
  operations.insert(0, '', { t: 'image' })

  operations.formatNonTextInLine(1, meta1)
  expect(queries.getLine(1).pieces).toEqual([
    { text: '', length: 1, meta: { t: 'image', ...meta1 } },
    { text: 'aaa', length: 3, meta: null },
  ])
  expect(operations.formatNonTextInLine(100, meta1)).toEqual(null)

  operations.insert(4, '\nbbb')
  operations.insert(6, '', { t: 'image' })

  operations.formatNonTextInLine(2, meta2)
  expect(queries.getLine(2).pieces).toEqual([
    { text: 'b', length: 1, meta: null },
    { text: '', length: 1, meta: { t: 'image', ...meta2 } },
    { text: 'bb', length: 2, meta: null },
  ])
  expect(operations.formatNonTextInLine(100, meta1)).toEqual(null)
})
