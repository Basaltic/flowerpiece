import { PieceTree } from '../src/flowerpiece'

const log = console.log

it('flower piece: redo undo insert', () => {
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

it('flower piece: redo undo delete', () => {
  const tree = new PieceTree()

  tree.insert(0, 'test', {}, true)
  tree.insert(2, 'i', {}, true)

  tree.insert(2, 'x', {}, true)
  tree.insert(2, 'y', {}, true)

  expect(tree.getAllText()).toBe('teyxist')

  tree.delete(1, 5)
  expect(tree.getAllText()).toBe('tt')
})
