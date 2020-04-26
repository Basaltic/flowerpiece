import { PieceTree } from '../src/flowerpiece'

// insert undo redo test
it('redo undo insert', () => {
  const tree = new PieceTree()

  tree.startChange()
  tree.insert(0, 'test', {})
  tree.endChange()

  tree.startChange()
  tree.insert(2, 'i', {})
  tree.endChange()

  tree.undo()
  let txt = tree.getText()
  expect(txt).toBe('test')

  tree.redo()
  txt = tree.getText()
  expect(txt).toBe('teist')
})

// Delete undo redo test
it('redo undo delete', () => {
  const tree = new PieceTree()

  tree.insert(0, 'test', {})
  tree.insert(2, 'i', {})

  tree.insert(2, 'x', {})
  tree.insert(2, 'y', {})

  expect(tree.getText()).toBe('teyxist')

  tree.startChange()
  tree.delete(1, 5)
  tree.endChange()
  expect(tree.getText()).toBe('tt')

  tree.undo()
  expect(tree.getText()).toBe('teyxist')

  tree.redo()
  expect(tree.getText()).toBe('tt')

  tree.undo()
  expect(tree.getText()).toBe('teyxist')

  tree.startChange()
  tree.delete(0, 5)
  tree.endChange()
  expect(tree.getText()).toBe('st')

  tree.undo()
  expect(tree.getText()).toBe('teyxist')
})

// Format undo redo test
it('redo undo format', () => {
  const tree = new PieceTree()

  tree.insert(0, 'test', {})
  tree.insert(2, 'i', {})

  tree.insert(2, 'x', {})
  tree.insert(2, 'y', {})

  expect(tree.getText()).toBe('teyxist')

  tree.startChange()
  tree.format(1, 5, { color: 'red' })
  tree.endChange()
  expect(tree.getPieces()).toEqual([
    { text: 't', length: 1, meta: {} },
    { text: 'e', length: 1, meta: { color: 'red' } },
    { text: 'y', length: 1, meta: { color: 'red' } },
    { text: 'x', length: 1, meta: { color: 'red' } },
    { text: 'i', length: 1, meta: { color: 'red' } },
    { text: 's', length: 1, meta: { color: 'red' } },
    { text: 't', length: 1, meta: {} },
  ])

  tree.undo()
  expect(tree.getPieces()).toEqual([
    { text: 't', length: 1, meta: {} },
    { text: 'e', length: 1, meta: {} },
    { text: 'y', length: 1, meta: {} },
    { text: 'x', length: 1, meta: {} },
    { text: 'i', length: 1, meta: {} },
    { text: 's', length: 1, meta: {} },
    { text: 't', length: 1, meta: {} },
  ])

  tree.redo()
  expect(tree.getPieces()).toEqual([
    { text: 't', length: 1, meta: {} },
    { text: 'e', length: 1, meta: { color: 'red' } },
    { text: 'y', length: 1, meta: { color: 'red' } },
    { text: 'x', length: 1, meta: { color: 'red' } },
    { text: 'i', length: 1, meta: { color: 'red' } },
    { text: 's', length: 1, meta: { color: 'red' } },
    { text: 't', length: 1, meta: {} },
  ])
})

// Chagne Cascade undo redo
it('change cascade undo redo', () => {
  const tree = new PieceTree()

  tree.startChange()
  tree.insert(0, 'test', {})
  tree.insert(2, 'i', {})
  tree.endChange()

  tree.undo()
  expect(tree.getText()).toBe('')

  tree.redo()
  expect(tree.getText()).toBe('teist')

  tree.redo()
  expect(tree.getText()).toBe('teist')

  tree.undo()
  tree.undo()
  expect(tree.getText()).toBe('')
})

it('change', () => {
  const tree = new PieceTree()

  tree.change(() => {
    tree.insert(0, 'aaa')
    tree.insert(1, 'bbb')
  })

  expect(tree.getText()).toBe('abbbaa')

  tree.undo()
  expect(tree.getText()).toBe('')
})
