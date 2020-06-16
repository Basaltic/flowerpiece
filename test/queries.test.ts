import { Model } from '../src/flowerpiece'

test('test: getMaxOffset', () => {
  const model = new Model({})
  const { operations, queries } = model

  let text = ''
  for (let i = 0; i < 100; i++) {
    text += 'a'
  }

  operations.insert(0, text)
  operations.insertLineBreak(20)
  operations.insert(100, text)

  let offset = queries.getMaxOffset()
  expect(offset).toBe(100 + 1 + 100)
})
