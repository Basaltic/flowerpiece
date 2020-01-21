import { StringBuffer, PieceTree } from '../src/pieceTree'
import Piece from '../src/piece'
import PieceTreeNode, { createPieceTreeNode } from '../src/pieceTreeNode'

const log = console.log

it('rbTree: Insert Fixed Position', () => {
  const oriStrBuf = new StringBuffer('This is a example. \n Another Example')
  const tree = new PieceTree(oriStrBuf)

  const piece1 = new Piece(1, 0, 1, 1)
  const node1 = createPieceTreeNode(piece1)
  tree.insertFixedRight(tree.root, node1)

  expect(tree.root.rightSize).toBe(1)
  expect(tree.root.rightLineFeeds).toBe(1)

  // 这里会触发树平衡
  const piece2 = new Piece(1, 1, 2, 2)
  const node2 = createPieceTreeNode(piece2)
  tree.insertFixedRight(tree.root, node2)

  expect(tree.root.rightSize).toBe(1)
  expect(tree.root.rightLineFeeds).toBe(1)
  expect(tree.root.leftSize).toBe(36)
  expect(tree.root.leftLineFeeds).toBe(1)
})

it('rbTree: 随机操作', () => {
  const oriStrBuf = new StringBuffer('This is a example. \n Another Example')

  const tree = new PieceTree(oriStrBuf)

  // 插入原始piece的中间
  tree.insert(1, 'test')
  // append到左节点
  tree.insert(1, 'xxxx\n')
  // pre append 到左节点
  tree.insert(0, 'xx  \n ')
  // 再往左边插入，会导致树的自平衡
  tree.insert(0, 'yy  ')
  tree.insert(0, 'zz  ')
  tree.insert(59, 'mmmmmm')

  let txt = ''
  let node: PieceTreeNode = tree.root.findMin()

  while (node.isNotNil) {
    const text = tree.getTextInNode(node)
    // log(text, node.piece)
    txt += text
    node = node.successor()
  }

  expect(tree.root.leftSize + tree.root.rightSize + tree.root.piece.length).toBe(txt.length)
  expect(txt).toBe('zz  yy  xx  \n Txxxx\ntesthis is a example. \n Another Examplemmmmmm')

  const subStr = tree.getTextInRange(1, txt.length - 1)
  expect(subStr).toBe('z  yy  xx  \n Txxxx\ntesthis is a example. \n Another Examplemmmmm')

  const lineTxt1 = tree.getLineTextContent(1)
  expect(lineTxt1).toBe('zz  yy  xx  ')

  const lineTxt2 = tree.getLineTextContent(2)
  expect(lineTxt2).toBe(' Txxxx')

  const lineTxt3 = tree.getLineTextContent(3)
  expect(lineTxt3).toBe('testhis is a example. ')

  const lineTxt4 = tree.getLineTextContent(4)
  expect(lineTxt4).toBe(' Another Examplemmmmmm')

  // 其实没有第5行，大于最大行，取最大行
  const lineTxt5 = tree.getLineTextContent(5)
  expect(lineTxt5).toBe(' Another Examplemmmmmm')

  const offset = tree.getOffsetAt(2, 1, lineTxt2.length)
  log(offset)
})

it('rbTree: 快速顺序插入', () => {
  const oriStrBuf = new StringBuffer('This is a example. \n Another Example')
  const tree = new PieceTree(oriStrBuf)

  for (let i = 0; i < 10; i++) {
    tree.insert(i + 1, i + '')
  }
  let txt = ''
  let node: PieceTreeNode = tree.root.findMin()

  while (node.isNotNil) {
    const text = tree.getTextInNode(node)
    txt += text
    node = node.successor()
  }

  expect(txt).toBe('T0123456789his is a example. \n Another Example')
})
