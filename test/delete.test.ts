import { Model } from '../src/flowerpiece'

it('Delete Line', () => {
  const model = new Model()
  const { operations } = model

  operations.insert(0, 'aaaa\nbbbb\ncccc\ndddd\n')

  operations.deleteLine(1)
})

it('Delete： Corner Case', () => {
  const model = new Model()
  const { operations } = model

  operations.insert(0, 'aa')

  operations.delete(0, 2)
  operations.delete(0, 1)

  operations.insert(0, 'aaa')

  operations.delete(6, 1)

  expect(operations.deleteLine(2)).toEqual(null)

  operations.deleteLine(1)
  expect(model.isEmpty()).toBe(true)

  operations.insert(0, 'abc\nabc\nabc')
  operations.deleteLine(3)

  expect(operations.deleteLine(100)).toEqual(null)
})
