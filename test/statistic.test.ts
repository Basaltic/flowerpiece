import { PieceTree, Operations } from '../src/flowerpiece'

/**
 * Test For Getting Pure Text Count
 */
it('Get Pure Text Count', () => {
  const tree = new PieceTree()
  const operations = new Operations(tree)

  operations.insert(0, '你好呀')
  operations.insert(0, '', { type: 'image', w: 100, h: 100 })

  expect(tree.getPureTextCount()).toBe(3)

  operations.insert(2, '\n')
  operations.insert(0, '\n')
  expect(tree.getPureTextCount()).toBe(3)
})

it('Line Count', () => {
  const tree = new PieceTree()
  const operations = new Operations(tree)

  operations.insert(0, 'hello')
  operations.insertLine(2, null)
  operations.insertNonText(0, {})
  operations.insertLineBreak(0)
  operations.insertText(5, 'aaa')

  expect(tree.getLineCount()).toBe(4)
})
