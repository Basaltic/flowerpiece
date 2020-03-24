import PieceTreeNode from './pieceTreeNode'

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
  // node instance
  node: PieceTreeNode
  // remind content length in the node
  reminder: number
  // node content start offset in the document
  startOffset: number
  // line Feed Cnt before this node
  startLineFeedCnt: number
}

export interface LineNodePosition {
  // start node of this line
  node: PieceTreeNode
  remindLineCnt: number
  startOffset: number
}

export interface ContentLoaction {
  line: number
  column: number
}
