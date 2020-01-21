import { StringBuffer, PieceTree } from '../src/pieceTree'
import PieceTreeNode, { createPieceTreeNode } from '../src/pieceTreeNode'
import Piece from '../src/piece'

// 删除相关的测试

it('rbTree: Delete Node', () => {
  const oriStrBuf = new StringBuffer('This is a example. \n Another Example')
  const tree = new PieceTree(oriStrBuf)

  tree.buffers[0].buffer = '1234567'

  const a = createPieceTreeNode(new Piece(0, 0, 1, 1))
  const x = createPieceTreeNode(new Piece(0, 1, 1, 1))
  const b = createPieceTreeNode(new Piece(0, 2, 1, 1))
  const y = createPieceTreeNode(new Piece(0, 3, 1, 1))
  const c = createPieceTreeNode(new Piece(0, 4, 1, 1))

  const m = createPieceTreeNode(new Piece(0, 5, 1, 1))
  const n = createPieceTreeNode(new Piece(0, 6, 1, 1))

  tree.insertFixedLeft(tree.root, x)
  tree.insertFixedLeft(x, a)
  tree.insertFixedRight(x, y)
  tree.insertFixedRight(x, b)
  tree.insertFixedRight(y, c)

  tree.insertFixedLeft(b, m)
  tree.insertFixedRight(b, n)

  tree.deleteNode(b)

  let txt = ''
  let node: PieceTreeNode = tree.root.findMin()

  while (node.isNotNil) {
    const text = tree.getTextInNode(node)
    txt += text
    node = node.successor()
  }

  expect(txt).toBe('126745This is a example. \n Another Example')
})

it('rbTree: Delete Test', () => {
  const oriStrBuf = new StringBuffer('T e X')
  const tree = new PieceTree(oriStrBuf)

  tree.insert(0, 'test ')
  tree.insert(10, ' test')

  let txt = tree.getAllTextContent()
  expect(txt).toBe('test T e X test')

  tree.delete(0, 5)
  txt = tree.getAllTextContent()
  expect(txt).toBe('T e X test')

  tree.delete(1, 1)
  txt = tree.getAllTextContent()
  expect(txt).toBe('Te X test')

  tree.delete(0, 1)
  txt = tree.getAllTextContent()
  expect(txt).toBe('e X test')

  tree.delete(1, 4)
  txt = tree.getAllTextContent()
  expect(txt).toBe('eest')

  tree.insert(3, 'nice workd')
  txt = tree.getAllTextContent()
  expect(txt).toBe('eesnice workdt')

  tree.delete(1, 13)
  txt = tree.getAllTextContent()
  expect(txt).toBe('e')

  let node: PieceTreeNode = tree.root.findMin()

  while (node.isNotNil) {
    // console.log(tree.getValueInNode(node))
    node = node.successor()
  }
})

it('PieceTree: Delete', () => {
  const oriStrBuf = new StringBuffer('This is a example. \n Another Example')
  const tree = new PieceTree(oriStrBuf)
  for (let i = 1; i < 5; i++) {
    tree.insert(i, i + '')
  }
})
