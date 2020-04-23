import { PieceTree } from '../src/flowerpiece'
import { Piece, Line } from '../src/piece'

it('serialize deserialize', () => {
  const tree = new PieceTree()

  let txt = ''
  for (let i = 0; i < 5; i++) {
    txt += 'a\n'
    tree.insert(0, 'a\n')
  }

  expect(tree.getAllText()).toBe(txt)

  const lines = tree.getLines()
  const linesStr = JSON.stringify(lines)
  const deserializeLines = JSON.parse(linesStr) as Line[]

  const tree2 = new PieceTree({ initialLines: deserializeLines })
  expect(tree2.getAllText()).toBe(txt)
})
