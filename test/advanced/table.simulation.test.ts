import { Model } from '../../src/flowerpiece'

it('Table Simulation', () => {
  const model = new Model()
  const { operations, queries } = model

  /**
   *
   * tb-s
   *
   *  tr
   *    t-cell
   *    t-cell
   *    t-cell
   *  tr
   *    t-cell
   *    t-cell
   *    t-cell
   *
   * tb-e
   *
   */
  operations.insertText(0, 'a')
  operations.insertLineBreak(1, { type: 'tb-s' })

  operations.insertLineBreak(2, { type: 'tc', num: 1 })
  operations.insertLineBreak(3, { type: 'tc', num: 2 })
  operations.insertLineBreak(4, { type: 'tc', num: 3 })

  operations.insertLineBreak(5, { type: 'tc', num: 4 })
  operations.insertLineBreak(6, { type: 'tc', num: 5 })
  operations.insertLineBreak(7, { type: 'tc', num: 6 })

  operations.insertText(3, 'abc\ncde')

  console.log(queries.getLines())
  console.log(queries.getPieces())
})
