import { Model } from '../src/flowerpiece'

// insert undo redo test
it('redo undo insert', () => {
  const model = new Model()
  const { operations, queries } = model

  model.change(() => {
    operations.insert(0, 'test', {})
  })

  model.change(() => {
    operations.insert(2, 'i', {})
  })

  model.undo()
  let txt = queries.getText()
  expect(txt).toBe('test')

  model.redo()
  txt = queries.getText()
  expect(txt).toBe('teist')
})

// Delete undo redo test
it('redo undo delete', () => {
  const model = new Model()
  const { operations, queries } = model

  operations.insert(0, 'test', {})
  operations.insert(2, 'i', {})

  operations.insert(2, 'x', {})
  operations.insert(2, 'y', {})

  expect(queries.getText()).toBe('teyxist')

  model.change(() => {
    operations.delete(1, 5)
  })
  expect(queries.getText()).toBe('tt')

  model.undo()
  expect(queries.getText()).toBe('teyxist')

  model.redo()
  expect(queries.getText()).toBe('tt')

  model.undo()
  expect(queries.getText()).toBe('teyxist')

  model.change(() => {
    operations.delete(0, 5)
  })
  expect(queries.getText()).toBe('st')

  model.undo()
  expect(queries.getText()).toBe('teyxist')
})

// Format undo redo test
it('redo undo format', () => {
  const model = new Model()
  const { operations, queries } = model

  operations.insert(0, 'test', {})
  operations.insert(2, 'i', {})

  operations.insert(2, 'x', {})
  operations.insert(2, 'y', {})

  expect(queries.getText()).toBe('teyxist')

  model.change(() => {
    operations.format(1, 5, { color: 'red' })
  })
  expect(queries.getPieces()).toEqual([
    { text: 't', length: 1, meta: {} },
    { text: 'e', length: 1, meta: { color: 'red' } },
    { text: 'y', length: 1, meta: { color: 'red' } },
    { text: 'x', length: 1, meta: { color: 'red' } },
    { text: 'i', length: 1, meta: { color: 'red' } },
    { text: 's', length: 1, meta: { color: 'red' } },
    { text: 't', length: 1, meta: {} },
  ])

  model.undo()
  expect(queries.getPieces()).toEqual([
    { text: 't', length: 1, meta: {} },
    { text: 'e', length: 1, meta: {} },
    { text: 'y', length: 1, meta: {} },
    { text: 'x', length: 1, meta: {} },
    { text: 'i', length: 1, meta: {} },
    { text: 's', length: 1, meta: {} },
    { text: 't', length: 1, meta: {} },
  ])

  model.redo()
  expect(queries.getPieces()).toEqual([
    { text: 't', length: 1, meta: {} },
    { text: 'e', length: 1, meta: { color: 'red' } },
    { text: 'y', length: 1, meta: { color: 'red' } },
    { text: 'x', length: 1, meta: { color: 'red' } },
    { text: 'i', length: 1, meta: { color: 'red' } },
    { text: 's', length: 1, meta: { color: 'red' } },
    { text: 't', length: 1, meta: {} },
  ])
})

// Chagne Cascade undo redo
it('change cascade undo redo', () => {
  const model = new Model()
  const { operations, queries } = model

  model.change(() => {
    operations.insert(0, 'test', {})
    operations.insert(2, 'i', {})
  })

  model.undo()
  expect(queries.getText()).toBe('')

  model.redo()
  expect(queries.getText()).toBe('teist')

  model.redo()
  expect(queries.getText()).toBe('teist')

  model.undo()
  model.undo()
  expect(queries.getText()).toBe('')
})

it('change corner case', () => {
  const model = new Model()
  const { operations, queries } = model

  model.change(() => {
    operations.insert(0, 'aaa')
    operations.insert(1, 'bbb')
  })

  expect(queries.getText()).toBe('abbbaa')

  model.undo()
  expect(queries.getText()).toBe('')

  model.change(() => {})
})
