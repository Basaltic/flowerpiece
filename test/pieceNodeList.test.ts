import { PieceNodeList } from '../src/pieceNodeList'
import { createPieceNode, createStructuralPiece, createTextPiece } from '../src/pieceNode'
import PieceTreeTest from '../src/forTest/pieceTreeTestHelper'

it('PieceNodeList: find', () => {
  const list = new PieceNodeList()

  for (let i = 0; i < 10; i++) {
    const p = createParagraphNode()
    list.appendNode(p)
  }

  // PieceTreeTest.printLevelOrder(list.root)

  for (let i = 0; i < 10; i++) {
    const position = list.find(i)
    expect(position.reminder).toBe(0)
    expect(position.startOffset).toBe(i)
    expect(position.startLineFeedCnt).toBe(i)
  }
})

let id = 0
/**
 * Create An Empty Paragraph Structural Piece Node
 */
function createParagraphNode() {
  const paragraphPiece = createStructuralPiece(0, { type: 'p', id: id++ })
  const pNode = createPieceNode(paragraphPiece)

  const list = new PieceNodeList()

  // text node has a line feed symbol
  const tNode = createTextNode(1, 1)
  list.appendNode(tNode)

  pNode.children = list

  return pNode
}

/**
 * Create  Text Piece Node
 */
function createTextNode(length: number = 1, lineFeedCnt: number = 0) {
  const tPiece = createTextPiece(1, 0, length, lineFeedCnt)
  const node = createPieceNode(tPiece)
  return node
}
