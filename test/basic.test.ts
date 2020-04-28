import { Model } from '../src/flowerpiece'

it('isEmpty Test', () => {
  const model = new Model()
  const { operations } = model

  expect(model.isEmpty()).toBe(true)

  operations.insert(0, 'x')

  expect(model.isEmpty()).toBe(false)

  operations.delete(0, 1)
  expect(model.isEmpty()).toBe(true)
})
