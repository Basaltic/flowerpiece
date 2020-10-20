import PieceTreeTest from '../src/forTest/pieceTreeTestHelper'
import { PieceNodeList } from '../src/pieceNodeList'
import { createPieceNode } from '../src/pieceNodeFactory'
import { Text } from '../src/pieceNode.text'

/**
 * Test: get node by specific index
 */
it(' get', () => {
  const list = new PieceNodeList()

  const nodes: any[] = []
  for (let i = 0; i < 10; i++) {
    const pNode = createPieceNode({ pieceType: 1, bufferIndex: -1, start: 0, length: 1, lineFeedCnt: 0, meta: null })
    list.append(pNode)
    nodes.push(pNode)
  }

  for (let i = 0; i < 10; i++) {
    const node = list.get(i + 1)
    expect(node).toBe(nodes[i])
  }

  let node = list.get(-5)
  expect(node).toBe(nodes[0])

  node = list.get(100)
  expect(node).toBe(nodes[9])
})

/**
 * Test: Find node position by offset
 */
it('find', () => {
  const list = new PieceNodeList()

  const nodes: any[] = []
  for (let i = 0; i < 10; i++) {
    const tNode = new Text({ bufferIndex: 0, start: i * 5, length: 5, meta: {} })
    list.append(tNode)

    nodes.push(tNode)
  }

  let pos = list.find(0)
  expect(pos.node).toBe(nodes[0])
  expect(pos.reminder).toBe(0)
  expect(pos.startOffset).toBe(0)

  pos = list.find(50)
  expect(pos.node).toBe(nodes[9])
  expect(pos.reminder).toBe(5)
  expect(pos.startOffset).toBe(45)

  for (let i = 0; i < 10; i++) {
    let pos = list.find(i * 5)
    expect(pos.node).toBe(nodes[i])
    expect(pos.reminder).toBe(0)
    expect(pos.startOffset).toBe(i * 5)
  }

  for (let i = 0; i < 10; i++) {
    let pos = list.find(i * 5 + 1)
    expect(pos.node).toBe(nodes[i])
    expect(pos.reminder).toBe(1)
    expect(pos.startOffset).toBe(i * 5)
  }

  for (let i = 0; i < 10; i++) {
    let pos = list.find(i * 5 + 4)
    expect(pos.node).toBe(nodes[i])
    expect(pos.reminder).toBe(4)
    expect(pos.startOffset).toBe(i * 5)
  }
})

/**
 * DeleteNode Method Unit Test
 */
it('deleteNode', () => {
  const list = new PieceNodeList()

  const nodes: any[] = []
  for (let i = 0; i < 10; i++) {
    const pNode = createPieceNode({ pieceType: 1, bufferIndex: -1, start: 0, length: 1, lineFeedCnt: 0, meta: null })
    list.append(pNode)
    nodes.push(pNode)
  }

  expect(list.nodeCnt).toBe(10)

  list.deleteNode(nodes[0])
  expect(list.nodeCnt).toBe(9)

  for (let i = 1; i < 10; i++) {
    const node = list.get(i)
    expect(node).toBe(nodes[i])
  }
})
