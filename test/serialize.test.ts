import { Model } from '../src/flowerpiece'
import { Line } from '../src/piece'

it('serialize deserialize', () => {
  const model = new Model()
  const { operations, queries } = model

  let txt = ''
  for (let i = 0; i < 5; i++) {
    txt += 'a\n'
    operations.insert(0, 'a\n')
  }

  expect(queries.getText()).toBe(txt)

  const lines = queries.getLines()
  const linesStr = JSON.stringify(lines)
  const deserializeLines = JSON.parse(linesStr) as Line[]

  // TODO:
  // const tree2 = new PieceTree({ initialLines: deserializeLines })
  // expect(tree2.getText()).toBe(txt)
})
