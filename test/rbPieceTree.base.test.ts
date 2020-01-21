import { StringBuffer, PieceTree, computeLineFeedCnt } from '../src/pieceTree'
import { createPieceTreeNode } from '../src/pieceTreeNode'
import Piece from '../src/piece'

it('rbTree: Rotate Test', () => {
  const oriStrBuf = new StringBuffer('This is a example. \n Another Example')
  const tree = new PieceTree(oriStrBuf)

  tree.buffers[0].buffer = '\n\n\n\n\n'

  const a = createPieceTreeNode(new Piece(1, 0, 1, 1))
  const x = createPieceTreeNode(new Piece(1, 1, 1, 1))
  const b = createPieceTreeNode(new Piece(1, 2, 1, 1))
  const y = createPieceTreeNode(new Piece(1, 3, 1, 1))
  const c = createPieceTreeNode(new Piece(1, 4, 1, 1))

  tree.root.left = x
  x.parent = tree.root

  x.left = a
  x.right = y
  a.parent = x
  y.parent = x

  y.left = b
  y.right = c
  b.parent = y
  c.parent = y

  tree.leftRotate(x)

  expect(tree.root.left).toEqual(y)
  expect(y.left).toEqual(x)
  expect(y.right).toEqual(c)
  expect(x.parent).toEqual(y)
  expect(x.right).toEqual(b)
  expect(b.parent).toEqual(x)

  const predecessor = y.predecessor()
  expect(predecessor).toEqual(b)

  tree.rightRotate(y)
  expect(tree.root.left).toEqual(x)
  expect(x.right).toEqual(y)
  expect(y.parent).toEqual(x)
  expect(x.left).toEqual(a)
  expect(a.parent).toEqual(x)

  expect(y.left).toEqual(b)
  expect(y.right).toEqual(c)
  expect(b.parent).toEqual(y)
  expect(c.parent).toEqual(y)
})

it('rbTree: Append Prepend Test', () => {
  const oriStrBuf = new StringBuffer('This is a example. \n Another Example')
  const tree = new PieceTree(oriStrBuf)

  const node = createPieceTreeNode(new Piece(1, 0, 1, 1))
  tree.root.append(node)

  expect(tree.root.right).toEqual(node)
  expect(node.parent).toEqual(tree.root)

  const node2 = createPieceTreeNode(new Piece(1, 1, 1, 1))
  tree.root.append(node2)

  expect(tree.root.right.left).toEqual(node2)
  expect(node2.parent).toEqual(tree.root.right)

  const node3 = createPieceTreeNode(new Piece(1, 2, 1, 1))
  tree.root.append(node3)

  expect(tree.root.right.left.left).toEqual(node3)
  expect(node3.parent).toEqual(tree.root.right.left)
})

it('rbTree: Insert Fixup', () => {
  const oriStrBuf = new StringBuffer('This is a example. \n Another Example')
  const tree = new PieceTree(oriStrBuf)

  tree.buffers[0].buffer = '\n\n\n\n\n'

  const a = createPieceTreeNode(new Piece(1, 0, 1, 1))
  const x = createPieceTreeNode(new Piece(1, 1, 1, 1))
  const b = createPieceTreeNode(new Piece(1, 2, 1, 1))
  const y = createPieceTreeNode(new Piece(1, 3, 1, 1))
  const c = createPieceTreeNode(new Piece(1, 4, 1, 1))

  tree.root.append(a)
  tree.root.append(x)

  tree.insertFixup(x)

  expect(tree.root).toEqual(x)
})

it('rbTree: computeLineFeedCnt', () => {
  const str = 'T\n TS\n T\n'

  const lineFeedCnt = computeLineFeedCnt(str)
  expect(lineFeedCnt).toBe(3)
})
