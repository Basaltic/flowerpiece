import { createPieceNode, createRootPiece, createStructuralPiece, createTextPiece, PieceNode, SENTINEL } from '../src/piece-node'
import PieceTreeTest from '../src/for-test/piece-tree-test-helper'

/**
 * Create A Piece Node List Of Empty Paragraph
 */
export function createEmptyParagraphList(): PieceNode {
    const root = createPieceNode(createRootPiece())

    for (let i = 0; i < 10; i++) {
        const p = createParagraphNode('a')
        root.appendChild(p)
    }

    if (root.children) {
        PieceTreeTest.printLevelOrder(root.children.root)
    }

    return root
}

/**
 * P
 * Table
 * P
 */
export function createEmptyTableParagraphList(): PieceNode {
    const root = createPieceNode(createRootPiece())

    root.appendChild(createParagraphNode('a'))
    root.appendChild(createTableNode({ row: 1, col: 1 }))
    root.appendChild(createParagraphNode('a'))

    if (root.children) {
        PieceTreeTest.printLevelOrder(root.children.root)
    }

    return root
}

/**
 * Create An Empty Paragraph Structural Piece Node
 */
export function createParagraphNode(text: string) {
    const piece = createStructuralPiece(0, { type: 'p' })
    const node = createPieceNode(piece)

    // text node has a line feed symbol
    const tNode = createTextNode(text, 1)
    node.appendChild(tNode)

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

    if (row <= 0) {
        row = 1
    }

    for (let i = 0; i < row; i++) {
        const rowNode = createTableRowNode(col)
        node.appendChild(rowNode)
    }

    return node
}

function createTableRowNode(cellNum: number): PieceNode {
    const piece = createStructuralPiece(1, { type: 'tr' })
    const node = createPieceNode(piece)

    if (cellNum <= 0) {
        cellNum = 1
    }

    for (let i = 0; i < cellNum; i++) {
        const cell = createTableCellNode()
        node.appendChild(cell)
    }

    return node
}

function createTableCellNode(): PieceNode {
    const cellPiece = createStructuralPiece(1, { type: 'tc' })
    const cellNode = createPieceNode(cellPiece)

    const paragraphNode = createParagraphNode('a')
    cellNode.appendChild(paragraphNode)

    return cellNode
}

/**
 * Create  Text Piece Node
 */
function createTextNode(text: string, lineFeedCnt: number = 0): PieceNode {
    const length = text.length

    const tPiece = createTextPiece(1, 0, length, lineFeedCnt)
    const node = createPieceNode(tPiece)
    return node
}
