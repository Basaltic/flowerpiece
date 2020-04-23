import NodePiece, { determinePureTextSize } from './piece'
import { NodeColor, NodePosition, LineNodePosition } from './common'

/**
 * A Node Refers a piece of content in the document
 */
export default class PieceTreeNode {
  parent: PieceTreeNode
  left: PieceTreeNode
  right: PieceTreeNode
  color: NodeColor

  // Left sub-tree Text Size
  leftSize!: number
  // Left sub-tree Line Feeds
  leftLineFeeds!: number
  // Right sub-tree Accumulate Size
  rightSize!: number
  // Right sub-tree Accumulate Lind Feed Size
  rightLineFeeds!: number

  // --- Statistic Purpose Variables --- //

  // Left sub-tree Pure Text Size
  leftTextSize: number
  // Right sub-tree Pure Text Size
  rightTextSize: number

  // Every Node Store The Text Piece
  piece!: NodePiece

  constructor(piece: NodePiece, color?: NodeColor) {
    this.piece = piece
    this.leftSize = 0
    this.leftLineFeeds = 0
    this.rightSize = 0
    this.rightLineFeeds = 0

    this.leftTextSize = 0
    this.rightTextSize = 0

    this.color = color || NodeColor.RED
    this.parent = this
    this.left = this
    this.right = this
  }

  get isRoot() {
    return this.parent === SENTINEL
  }

  get isNil() {
    return this === SENTINEL
  }

  get isNotNil() {
    return this !== SENTINEL
  }

  get isBlack() {
    return this.color === NodeColor.BLACK
  }

  get isRed() {
    return this.color === NodeColor.RED
  }

  get isLeft() {
    return this.parent.left === this
  }

  get isRight() {
    return this.parent.right === this
  }

  /**
   * Set To Red Node
   */
  toRed() {
    this.color = NodeColor.RED
  }

  /**
   * Set To Black Node
   */
  toBlack() {
    this.color = NodeColor.BLACK
  }

  /**
   * Prepend
   * @param node
   */
  prepend(node: PieceTreeNode) {
    if (this.left === SENTINEL) {
      this.left = node
      node.parent = this
    } else {
      const predecessor = this.predecessor()
      predecessor.right = node
      node.parent = predecessor
    }
  }

  /**
   * Append
   * @param node
   */
  append(node: PieceTreeNode) {
    if (this.right === SENTINEL) {
      this.right = node
      node.parent = this
    } else {
      const successor = this.successor()
      successor.left = node
      node.parent = successor
    }
  }

  /**
   * Find the node where the line starts
   * @param lineNumber
   */
  findByLineNumber(lineNumber: number, startOffset: number = 0): LineNodePosition {
    if (this.leftLineFeeds >= lineNumber) {
      return this.left.findByLineNumber(lineNumber)
    } else if (this.leftLineFeeds + this.piece.lineFeedCnt >= lineNumber) {
      lineNumber -= this.leftLineFeeds
      return {
        node: this,
        remindLineCnt: lineNumber,
        startOffset: startOffset + this.leftSize,
      }
    } else if (this.right.isNil) {
      lineNumber = 0
      return {
        node: this,
        remindLineCnt: lineNumber,
        startOffset: startOffset + this.leftSize,
      }
    } else {
      startOffset += this.leftSize + this.piece.length
      lineNumber -= this.leftLineFeeds + this.piece.lineFeedCnt

      return this.right.findByLineNumber(lineNumber, startOffset)
    }
  }

  /**
   * 寻找本节点子树的最左侧节点
   */
  findMin(): PieceTreeNode {
    if (this.left.isNotNil) {
      return this.left.findMin()
    }
    return this
  }

  /**
   * Find The Max Node in this subtree
   */
  findMax(): PieceTreeNode {
    if (this.right.isNotNil) {
      return this.right.findMax()
    }
    return this
  }

  /**
   * Tree Successor
   */
  successor() {
    if (this.right.isNotNil) {
      return this.right.findMin()
    }

    let node: PieceTreeNode = this

    while (node.parent.isNotNil) {
      if (node.parent.left === node) {
        break
      }
      node = node.parent
    }

    return node.parent
  }

  /**
   * Tree Predecessor
   */
  predecessor() {
    if (this.left.isNotNil) {
      return this.left.findMax()
    }

    let node: PieceTreeNode = this

    while (node.parent.isNotNil) {
      if (node.parent.right === node) {
        break
      }
      node = node.parent
    }

    return node.parent
  }

  /**
   * Update Meta Info of The Node
   */
  updateMeta() {
    if (this.left.isNil) {
      this.leftSize = 0
      this.leftLineFeeds = 0

      this.leftTextSize = 0
    } else {
      this.leftSize = this.left.leftSize + this.left.rightSize + this.left.piece.length
      this.leftLineFeeds = this.left.leftLineFeeds + this.left.rightLineFeeds + this.left.piece.lineFeedCnt

      this.leftTextSize = this.left.leftTextSize + this.left.rightTextSize + determinePureTextSize(this.left.piece)
    }

    if (this.right.isNil) {
      this.rightSize = 0
      this.rightLineFeeds = 0

      this.rightTextSize = 0
    } else {
      this.rightSize = this.right.leftSize + this.right.rightSize + this.right.piece.length
      this.rightLineFeeds = this.right.leftLineFeeds + this.right.rightLineFeeds + this.right.piece.lineFeedCnt

      this.rightTextSize = this.right.leftTextSize + this.right.rightTextSize + determinePureTextSize(this.right.piece)
    }
  }

  /**
   * Update Node Meta Recursively
   *
   * O(logn)
   *
   * @param this
   */
  updateMetaUpward(stopAnchor?: PieceTreeNode): boolean {
    this.updateMeta()

    if (this.parent.isNotNil && this !== stopAnchor) {
      this.parent.updateMetaUpward()
    }

    return true
  }

  detach() {
    this.parent = null!
    this.left = null!
    this.right = null!
  }
}

// Sentinel Node Which Refers to Black Nil Node
export const SENTINEL = new PieceTreeNode(new NodePiece(1, 1, 0, 0, null), NodeColor.BLACK)

/**
 * Create New Node
 * @param piece
 * @param color
 */
export function createPieceTreeNode(piece: NodePiece, color?: NodeColor): PieceTreeNode {
  const node = new PieceTreeNode(piece, color)
  node.left = SENTINEL
  node.right = SENTINEL
  node.parent = SENTINEL
  return node
}
