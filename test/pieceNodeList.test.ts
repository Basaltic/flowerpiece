import PieceTreeTest from '../src/forTest/pieceTreeTestHelper'
import { NodeFactory } from './util.factory'
import { PieceNodeList } from '../src/pieceNodeList'
import { createPieceNode } from '../src/pieceNodeFactory'

/**
 * Test: get node by specific index
 */
it('PieceNodeList: get', () => {
  const list = new PieceNodeList()

  const nodes: any[] = []
  for (let i = 0; i < 10; i++) {
    const pNode = createPieceNode({ pieceType: 1, bufferIndex: -1, start: 0, length: 1, lineFeedCnt: 0, meta: null })
    list.append(pNode)
  }

  for (let i = 0; i < 10; i++) {
    const node = list.get(i + 1)
    expect(node).toBe(nodes[i])
  }
})

/**
 * Test: Find node position by offset
 */
it('PieceNodeList: find', () => {
  const root = NodeFactory.createRootNode()

  const nodes: any[] = []
  for (let i = 0; i < 10; i++) {
    const pNode = NodeFactory.createParagraphNode()
    const tNode = NodeFactory.createTextNode(`${i}bc\n`)
    root.appendChild(pNode)
    pNode.appendChild(tNode)

    nodes.push(pNode)
  }

  if (root.children) {
    const list = root.children

    let position = list.find(0)
    expect(position.reminder).toBe(0)
    expect(position.startOffset).toBe(0)
    expect(position.node).toBe(nodes[0])
    expect(position.node.piece.meta).toEqual({ type: 'p' })

    for (let i = 1; i < 10; i++) {
      position = list.find(i * 4)
      expect(position.reminder).toBe(4)
      expect(position.startOffset).toBe((i - 1) * 4)
      expect(position.node).toBe(nodes[i - 1])
    }

    position = list.find(40)
    expect(position.reminder).toBe(4)
    expect(position.startOffset).toBe(36)
    expect(position.node).toBe(nodes[9])

    for (let i = 0; i < 10; i++) {
      position = list.find(i * 4 + 1)
      expect(position.reminder).toBe(1)
      expect(position.startOffset).toBe(i * 4)
      expect(position.node).toBe(nodes[i])

      position = list.find(i * 4 + 2)
      expect(position.reminder).toBe(2)
      expect(position.startOffset).toBe(i * 4)
      expect(position.node).toBe(nodes[i])
    }

    PieceTreeTest.printTree(root.children)
  }
})
