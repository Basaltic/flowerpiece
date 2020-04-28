import { Model, Line } from '../src/flowerpiece'

it('isEmpty Test', () => {
  const model = new Model({})
  const { operations } = model

  expect(model.isEmpty()).toBe(true)

  operations.insert(0, 'x')

  expect(model.isEmpty()).toBe(false)

  operations.delete(0, 1)
  expect(model.isEmpty()).toBe(true)
})

it('Model With Initial Value', () => {
  const lines: Line[] = [{ meta: { t: 't' }, pieces: [{ text: 'aaa', length: 3, meta: null }] }]

  const model = new Model({
    initialValue: lines,
  })
  const { queries } = model

  expect(queries.getLines()).toEqual(lines)
})
