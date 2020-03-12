import { PieceTree } from '../src/pieceTree'

const log = console.log

it('flower piece: redo undo 1', () => {
  const tree = new PieceTree()

  tree.insert(0, 'test', {})
  tree.insert(2, 'i', {})

  tree.undo()
  let txt = tree.getAllText()
  expect(txt).toBe('test')

  tree.redo()
  txt = tree.getAllText()
  expect(txt).toBe('teist')
})
