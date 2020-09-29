import { PieceNodeList } from '../src/pieceNodeList'
import { createPieceNode, createStructuralPiece, createTextPiece, PieceNode } from '../src/pieceNode'
import PieceTreeTest from '../src/forTest/pieceTreeTestHelper'

/**
 * Create A Piece Node List Of Empty Paragraph
 */
export function createEmptyParagraphList(): PieceNodeList {
  const list = new PieceNodeList()

  for (let i = 0; i < 10; i++) {
    const p = createParagraphNode()
    list.appendNode(p)
  }
  return list
}

/**
 * P
 * Table
 * P
 */
export function createEmptyTableParagraphList(): PieceNodeList {
  const list = new PieceNodeList()

  list.appendNode(createParagraphNode())
  list.appendNode(createTableNode({ row: 1, col: 1 }))
  list.appendNode(createParagraphNode())

  PieceTreeTest.printLevelOrder(list.root)

  return list
}

let id = 0

/**
 * Create An Empty Paragraph Structural Piece Node
 */
export function createParagraphNode() {
  const piece = createStructuralPiece(0, { type: 'p', id: id++ })
  const node = createPieceNode(piece)

  const list = new PieceNodeList()
  node.children = list

  // text node has a line feed symbol
  const tNode = createTextNode(1, 1)
  list.appendNode(tNode)

  return node
}

/**
 * Create An Empty Table Layout Structural Piece With Specific row and col
 * @param params
 */
export function createTableNode(params: { row: number; col: number }) {
  let { row, col } = params

  const piece = createStructuralPiece(1, { type: 'table' })
  const node = createPieceNode(piece)
  const children = new PieceNodeList()
  node.children = children

  if (row <= 0) {
    row = 1
  }

  for (let i = 0; i < row; i++) {
    const rowNode = createTableRowNode(col)
    children.appendNode(rowNode)
  }

  return node
}

function createTableRowNode(cellNum: number): PieceNode {
  const piece = createStructuralPiece(1, { type: 'tr' })
  const node = createPieceNode(piece)
  const children = new PieceNodeList()
  node.children = children

  if (cellNum <= 0) {
    cellNum = 1
  }

  for (let i = 0; i < cellNum; i++) {
    const cell = createTableCellNode()
    children.appendNode(cell)
  }

  return node
}

function createTableCellNode(): PieceNode {
  const cellPiece = createStructuralPiece(1, { type: 'tc' })
  const cellNode = createPieceNode(cellPiece)

  const cellChildren = new PieceNodeList()
  cellNode.children = cellChildren

  const paragraphNode = createParagraphNode()
  cellChildren.appendNode(paragraphNode)

  console.log(cellNode.children.size, cellNode.piece.length, cellNode.size)

  return cellNode
}

/**
 * Create  Text Piece Node
 */
function createTextNode(length: number = 1, lineFeedCnt: number = 0): PieceNode {
  const tPiece = createTextPiece(1, 0, length, lineFeedCnt)
  const node = createPieceNode(tPiece)
  return node
}
