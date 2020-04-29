import { Model } from '../src/flowerpiece'

/**
 * Test For Getting Pure Text Count
 */
it('Get Pure Text Count', () => {
  const model = new Model()
  const { operations, queries } = model

  operations.insert(0, '你好呀')
  operations.insert(0, '', { type: 'image', w: 100, h: 100 })

  expect(queries.getCountOfCharacter()).toBe(3)

  operations.insert(2, '\n')
  operations.insert(0, '\n')
  expect(queries.getCountOfCharacter()).toBe(3)
})

it('Line Count', () => {
  const model = new Model()
  const { operations, queries } = model

  operations.insert(0, 'hello')
  operations.insertNonText(0, {})
  operations.insertLineBreak(0)
  operations.insertText(5, 'aaa')

  expect(queries.getCountOfLine()).toBe(2)
})
