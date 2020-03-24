import { PieceTree } from '../src/flowerpiece'

const log = console.log

// insert undo redo test
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

// Delete undo redo test
it('flower piece: redo undo delete', () => {
  const tree = new PieceTree()

  tree.insert(0, 'test', {}, true)
  tree.insert(2, 'i', {}, true)

  tree.insert(2, 'x', {}, true)
  tree.insert(2, 'y', {}, true)

  expect(tree.getAllText()).toBe('teyxist')

  tree.delete(1, 5)
  expect(tree.getAllText()).toBe('tt')

  tree.undo()
  expect(tree.getAllText()).toBe('teyxist')

  tree.redo()
  expect(tree.getAllText()).toBe('tt')

  tree.undo()
  expect(tree.getAllText()).toBe('teyxist')

  tree.delete(0, 5)
  expect(tree.getAllText()).toBe('st')

  tree.undo()
  expect(tree.getAllText()).toBe('teyxist')
})

// Format undo redo test
it('flower piece: redo undo format', () => {
  const tree = new PieceTree()

  tree.insert(0, 'test', {}, true)
  tree.insert(2, 'i', {}, true)

  tree.insert(2, 'x', {}, true)
  tree.insert(2, 'y', {}, true)

  expect(tree.getAllText()).toBe('teyxist')

  tree.format(1, 5, { color: 'red' })
  tree.forEachPiece((piece, text, index) => {
    if (index > 0 && index < 6) {
      if (piece.meta) expect(piece.meta.color).toBe('red')
    }
  })

  tree.undo()
  tree.forEachPiece((piece, text, index) => {
    if (index > 0 && index < 6) {
      if (piece.meta) expect(piece.meta.color).toBe(undefined)
    }
  })

  tree.redo()
  tree.forEachPiece((piece, text, index) => {
    if (index > 0 && index < 6) {
      if (piece.meta) expect(piece.meta.color).toBe('red')
    }
  })
})

//
