import { PieceTree } from '../src/flowerpiece'

/**
 * Test For Getting Pure Text Count
 */
it('Get Pure Text Count', () => {
  const tree = new PieceTree()

  tree.insert(0, '你好呀')
  tree.insert(0, '', { type: 'image', w: 100, h: 100 })

  expect(tree.getPureTextCount()).toBe(3)

  tree.insert(2, '\n')
  tree.insert(0, '\n')
  expect(tree.getPureTextCount()).toBe(3)
})

it('Line Count', () => {
  const tree = new PieceTree()
  tree.insert(0, 'hello')
  tree.insertLine(2, null)
  tree.insertNonText(0, {})
  tree.insertLineBreak(0)
  tree.insertText(5, 'aaa')

  expect(tree.getLineCount()).toBe(4)
})
