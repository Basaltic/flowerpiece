import { Inline } from 'piece-node-inline'
import { Text } from 'piece-node-text'
import { PieceNode } from './piece-node'

/**
 * Color of RB-Tree Node
 */
export enum NodeColor {
    BLACK = 1,
    RED = 2,
}

/**
 * Node Position
 */
export interface NodePosition {
    /**
     * Which node the position is located
     */
    node: PieceNode
    /**
     * Remind content length in the node
     */
    reminder: number
    /**
     * Start offset in the entire document
     */
    startOffset: number
    /**
     * line Feed Count before this node
     */
    startLineFeedCnt: number
}

export interface LeafNodePosition extends NodePosition {
    node: Text | Inline
}

/**
 * Document Postion. Its just a offset number
 */
export declare type DocPostion = number

let id = 1
export function getId() {
    return id++
}
