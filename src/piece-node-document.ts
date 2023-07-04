import { LeafNodePosition } from './common'
import { PieceType, SENTINEL } from './piece-node'
import { PieceNodeList } from './piece-node-list'
import { Structural } from './piece-node-structural'
import { Paragraph } from './piece-node-paragraph'
import { Text } from './piece-node-text'

/**
 * Document
 */
export class Document extends Structural {
    constructor() {
        super({ pieceType: PieceType.ROOT, bufferIndex: -1, start: 0, length: 0, lineFeedCnt: 0, meta: null })
        this.left = SENTINEL
        this.right = SENTINEL
        this.parent = SENTINEL
        this.above = SENTINEL
        this.children = new PieceNodeList()

        // Empty Paragraph While initializing
        // const paragraph = new Paragraph()
        // const text = new Text({ bufferIndex: 0, start: 0, length: 0, meta: null })
        // this.appendChild(paragraph)
        // paragraph.appendChild(text)
    }

    /**
     * Find the Leaf node by offset
     * The Node Found here must be text or inline node
     *
     * @param {number} offset
     */
    public findLeafNode(offset: number): LeafNodePosition | null {
        let list = this.children

        while (list && list !== null) {
            const position = list.find(offset)
            const { node, reminder } = position

            if (node.children) {
                list = node.children
                offset = reminder
            } else {
                return position
            }
        }

        return null
    }
}
