import { createTextPiece } from '../src/pieceNode'
import { splitStructuralNode, splitTextNode } from '../src/pieceNodeList'
import { NodeFactory } from './util.factory'

it('PieceNodeList: splitTextNode (static)', () => {
  const pNode = NodeFactory.createParagraphNode()
  const textNode = NodeFactory.createTextNode('abcd')
  pNode.appendChild(textNode)

  const [leftNode, rightNode] = splitTextNode(textNode, 1)

  expect(leftNode.piece).toEqual(createTextPiece(1, 0, 1, 0, null))
  expect(rightNode.piece).toEqual(createTextPiece(1, 1, 3, 0, null))

  expect(leftNode.successor()).toBe(rightNode)

  // PieceTreeTest.printTree(pNode.children)
})

it('PieceNodeList: splitStructuralNode (static)', () => {
  const root = NodeFactory.createRootNode()
  const pNode = NodeFactory.createParagraphNode()
  const textNode1 = NodeFactory.createTextNode('abcd')
  const textNode2 = NodeFactory.createTextNode('efgh')
  const textNode3 = NodeFactory.createTextNode('ijkl')

  root.appendChild(pNode)
  pNode.appendChild(textNode1)
  pNode.appendChild(textNode2)
  pNode.appendChild(textNode3)

  console.log(root.size, root.childNodeCnt)

  const [leftNode, rightNode] = splitStructuralNode(pNode, textNode2)

  expect(leftNode.size).toBe(4)
  expect(leftNode.childNodeCnt).toBe(1)
  expect(leftNode.firstChild).toBe(textNode1)

  expect(rightNode.size).toBe(8)
  expect(rightNode.childNodeCnt).toBe(2)
  expect(rightNode.firstChild).toBe(textNode2)
  expect(rightNode.lastChild).toBe(textNode3)
  if (rightNode.firstChild) expect(rightNode.firstChild.successor()).toBe(textNode3)

  expect(root.size).toBe(12)
  expect(root.childNodeCnt).toBe(2)
})
