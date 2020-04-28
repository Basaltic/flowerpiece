import { Model } from '../src/flowerpiece'

it('Diff: Insert', () => {
  const model = new Model()
  const { operations, queries } = model

  let diff = operations.insert(0, 'a\nb\n')
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'insert', lineNumber: 2 },
    { type: 'insert', lineNumber: 3 },
  ])

  expect(queries.getText()).toBe('a\nb\n')

  diff = operations.insert(0, 'a\nb')
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'insert', lineNumber: 2 },
  ])

  diff = operations.insert(0, 'cc')
  expect(diff).toEqual([{ type: 'replace', lineNumber: 1 }])

  diff = operations.insert(1, 'dd')
  expect(diff).toEqual([{ type: 'replace', lineNumber: 1 }])

  diff = operations.insert(6, 'ee\nee')
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 2 },
    { type: 'insert', lineNumber: 3 },
  ])

  diff = operations.insert(7, '\nff\n')

  expect(diff).toEqual([
    { type: 'replace', lineNumber: 2 },
    { type: 'insert', lineNumber: 3 },
    { type: 'insert', lineNumber: 4 },
  ])
})

it('Diff: Delete 1', () => {
  const model = new Model()
  const { operations } = model

  operations.insert(0, 'tttt\nssss\nxxxx')

  let diff = operations.delete(2, 10)
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'remove', lineNumber: 2 },
    { type: 'remove', lineNumber: 3 },
  ])
})

it('Diff: Delete 2', () => {
  const model = new Model()
  const { operations } = model

  operations.insert(0, 'tttt\nssss\nxxxx')

  let diff = operations.delete(2, 1)
  expect(diff).toEqual([{ type: 'replace', lineNumber: 1 }])
})

it('Diff: Delete 3', () => {
  const model = new Model()
  const { operations } = model

  operations.insert(0, 'tttt\nssss\nxxxx')

  let diff = operations.delete(2, 4)
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'remove', lineNumber: 2 },
  ])
})

it('Diff: Format', () => {
  const model = new Model()
  const { operations } = model

  operations.insert(0, 'tttt\nssss\nxxxx')

  let diff = operations.format(2, 1, { color: 'blue' })
  expect(diff).toEqual([{ type: 'replace', lineNumber: 1 }])

  diff = operations.format(2, 3, { color: 'blue' })
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'replace', lineNumber: 2 },
  ])

  diff = operations.format(2, 10, { color: 'red' })
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 1 },
    { type: 'replace', lineNumber: 2 },
    { type: 'replace', lineNumber: 3 },
  ])

  diff = operations.format(6, 2, { color: 'blue' })
  expect(diff).toEqual([{ type: 'replace', lineNumber: 2 }])

  diff = operations.format(6, 5, { color: 'red' })
  expect(diff).toEqual([
    { type: 'replace', lineNumber: 2 },
    { type: 'replace', lineNumber: 3 },
  ])

  diff = operations.format(11, 2, { color: 'red' })
  expect(diff).toEqual([{ type: 'replace', lineNumber: 3 }])
})
