import { Model } from '../src/flowerpiece'

it('Diff: Insert', () => {
  const model = new Model()
  const { operations, queries } = model

  let change = operations.insert(0, 'a\nb\n')
  expect(change).toMatchObject({
    type: 'insert',
    startOffset: 1,
    length: 4,
    diffs: [
      { type: 'replace', lineNumber: 1 },
      { type: 'insert', lineNumber: 2 },
      { type: 'insert', lineNumber: 3 },
    ],
  })

  expect(queries.getText()).toBe('a\nb\n')

  change = operations.insert(0, 'a\nb')
  expect(change).toMatchObject({
    type: 'insert',
    startOffset: 1,
    length: 3,
    diffs: [
      { type: 'replace', lineNumber: 1 },
      { type: 'insert', lineNumber: 2 },
    ],
  })

  change = operations.insert(0, 'cc')
  expect(change).toMatchObject({
    type: 'insert',
    startOffset: 1,
    length: 2,
    diffs: [{ type: 'replace', lineNumber: 1 }],
  })

  change = operations.insert(1, 'dd')
  expect(change).toMatchObject({
    type: 'insert',
    startOffset: 2,
    length: 2,
    diffs: [{ type: 'replace', lineNumber: 1 }],
  })

  change = operations.insert(6, 'ee\nee')
  expect(change).toMatchObject({
    type: 'insert',
    startOffset: 7,
    length: 5,
    diffs: [
      { type: 'replace', lineNumber: 2 },
      { type: 'insert', lineNumber: 3 },
    ],
  })

  change = operations.insert(7, '\nff\n')

  expect(change).toMatchObject({
    type: 'insert',
    startOffset: 8,
    length: 4,
    diffs: [
      { type: 'replace', lineNumber: 2 },
      { type: 'insert', lineNumber: 3 },
      { type: 'insert', lineNumber: 4 },
    ],
  })
})

it('Diff: Delete 1', () => {
  const model = new Model()
  const { operations } = model

  operations.insert(0, 'tttt\nssss\nxxxx')

  let change = operations.delete(2, 10)
  expect(change).toMatchObject({
    type: 'delete',
    startOffset: 3,
    length: 10,
    diffs: [
      { type: 'replace', lineNumber: 1 },
      { type: 'remove', lineNumber: 2 },
      { type: 'remove', lineNumber: 3 },
    ],
  })
})

it('Diff: Delete 2', () => {
  const model = new Model()
  const { operations } = model

  operations.insert(0, 'tttt\nssss\nxxxx')

  let change = operations.delete(2, 1)
  expect(change).toMatchObject({
    type: 'delete',
    startOffset: 3,
    length: 1,
    diffs: [{ type: 'replace', lineNumber: 1 }],
  })
})

it('Diff: Delete 3', () => {
  const model = new Model()
  const { operations } = model

  operations.insert(0, 'tttt\nssss\nxxxx')

  let change = operations.delete(2, 4)
  expect(change).toMatchObject({
    type: 'delete',
    startOffset: 3,
    length: 4,
    diffs: [
      { type: 'replace', lineNumber: 1 },
      { type: 'remove', lineNumber: 2 },
    ],
  })
})

it('Diff: Format', () => {
  const model = new Model()
  const { operations } = model

  operations.insert(0, 'tttt\nssss\nxxxx')

  let change = operations.format(2, 1, { color: 'blue' })
  expect(change).toMatchObject({
    type: 'format',
    startOffset: 3,
    length: 1,
    diffs: [{ type: 'replace', lineNumber: 1 }],
  })

  change = operations.format(2, 3, { color: 'blue' })
  expect(change).toMatchObject({
    type: 'format',
    startOffset: 3,
    length: 3,
    diffs: [
      { type: 'replace', lineNumber: 1 },
      { type: 'replace', lineNumber: 2 },
    ],
  })

  change = operations.format(2, 10, { color: 'red' })
  expect(change).toMatchObject({
    type: 'format',
    startOffset: 3,
    length: 10,
    diffs: [
      { type: 'replace', lineNumber: 1 },
      { type: 'replace', lineNumber: 2 },
      { type: 'replace', lineNumber: 3 },
    ],
  })

  change = operations.format(6, 2, { color: 'blue' })
  expect(change).toMatchObject({
    type: 'format',
    startOffset: 7,
    length: 2,
    diffs: [{ type: 'replace', lineNumber: 2 }],
  })

  change = operations.format(6, 5, { color: 'red' })
  expect(change).toMatchObject({
    type: 'format',
    startOffset: 7,
    length: 5,
    diffs: [
      { type: 'replace', lineNumber: 2 },
      { type: 'replace', lineNumber: 3 },
    ],
  })

  change = operations.format(11, 2, { color: 'red' })
  expect(change).toMatchObject({
    type: 'format',
    startOffset: 12,
    length: 2,
    diffs: [{ type: 'replace', lineNumber: 3 }],
  })
})
