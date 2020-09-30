import { chdir } from 'process'
import { NodeColor } from './common'
import { mergeMeta, PieceMeta } from './meta'
import { PieceNodeList } from './pieceNodeList'

// TODO: Selection Offset 修正

/**
 * Types Of Piece
 */
export enum PieceType {
  /**
   * Pure Text Object. Can Have:
   * 1. Text Reference
   * 2. Lenght, Offset
   * 3. Meta Style
   */
  TEXT = 1,
  /**
   * A Inline Object. e.x. Image, Video, Custom inline object. Can Have:
   * 1. Meta, Style
   * 2. Length, Offset
   */
  OBJECT = 2,
  /**
   * A Container Piece. Can Have:
   * 1. Meta Style
   * 2. Children Piece List
   *
   * Empty Structural Piece Must have a one length text or object piece as its child leave node
   *
   * e.x.
   *
   * Paragraph
   * Table
   *    Table Row
   *       Table Cell
   *
   */
  STRUCTURAL = 3,

  /**
   * A Root Piece, One Piece Table Can only have one root
   */
  ROOT = 4,
}

export interface Piece {
  // TEXT: Buffer Index
  // OBJECT: -1
  // STRUCTURAL: -1
  bufferIndex: number
  // TEXT: Raw Content Start in Current Buffer
  // OBJECT: -1
  // STRUCTURAL: -1
  start: number
  // TEXT: Content Length
  // OBJECT: 1
  // STRUCTURAL: -1
  length: number

  // How Many Line Break In This Piece.
  lineFeedCnt: number

  // Extra Meta Info
  meta: PieceMeta | null

  // Type of this piece
  pieceType: PieceType
}

/**
 * A Node Refers a piece of content in the document
 */
export class PieceNode {
  parent: PieceNode
  left: PieceNode
  right: PieceNode
  color: NodeColor

  above: PieceNode

  // Left sub-tree Text Size
  leftSize: number
  // Left sub-tree node count
  leftNodeCnt: number
  // Left sub-tree Line Feeds
  leftLineFeedCnt: number

  // Right sub-tree Accumulate Size
  rightSize: number
  // Right sub-tree node count
  rightNodeCnt: number
  // Right sub-tree Accumulate Lind Feed Size
  rightLineFeedCnt: number

  // --- Statistic Purpose Variables --- //

  // Left sub-tree Pure Text Size
  leftTextSize: number
  // Right sub-tree Pure Text Size
  rightTextSize: number

  // Every Node Store The Text Piece
  piece: Piece

  // If this is a structural piece, it can have innner piece list
  children?: PieceNodeList

  /**
   * Content length of this node
   */
  public get size(): number {
    if (this.children) {
      return this.piece.length + this.children.size
    }
    return this.piece.length
  }

  /**
   * Line Feed Count
   */
  public get lineFeedCnt(): number {
    if (this.children) {
      return this.piece.lineFeedCnt + this.children.lineFeedCnt
    }
    return this.piece.lineFeedCnt
  }

  /**
   * The Node Immediately following this node
   */
  public get nextSibling(): PieceNode | null {
    const node = this.successor()
    if (node.isNotNil) {
      return node
    }
    return null
  }

  /**
   * The node immediately preceding this node
   */
  public get previousSibling(): PieceNode | null {
    const node = this.predecessor()
    if (node.isNotNil) {
      return node
    }
    return null
  }

  /**
   * First Child Of this node
   */
  public get firstChild(): PieceNode | null {
    if (this.children) {
      const node = this.children.firstNode
      if (node.isNotNil) return node
    }

    return null
  }

  /**
   * Last Child of this node
   */
  public get lastChild(): PieceNode | null {
    if (this.children) {
      const node = this.children.lastNode
      if (node.isNotNil) return node
    }

    return null
  }

  constructor(piece: Piece, color?: NodeColor) {
    this.piece = piece

    this.leftSize = 0
    this.leftNodeCnt = 0
    this.leftLineFeedCnt = 0

    this.rightSize = 0
    this.rightNodeCnt = 0
    this.rightLineFeedCnt = 0

    this.leftTextSize = 0
    this.rightTextSize = 0

    this.color = color || NodeColor.RED
    this.parent = this
    this.left = this
    this.right = this

    this.above = this
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
  public toRed() {
    this.color = NodeColor.RED
  }

  /**
   * Set To Black Node
   */
  public toBlack() {
    this.color = NodeColor.BLACK
  }

  /**
   * Change Meta Object
   */
  public changeMeta(modifiedMeta: PieceMeta) {
    const result = mergeMeta(this.piece.meta, modifiedMeta)
    if (result !== null) {
      this.piece.meta = result[0]
      return result[1]
    }

    return null
  }

  // -------------------- Method to Change Structure ---------------- //

  /**
   * Append Child To this node's child list
   * @param node
   */
  public appendChild(node: PieceNode) {
    if (this.children) {
      node.above = this
      this.children.append(node)
    }
  }

  /**
   * Prepend Child to this node's child list
   */
  public prependChild(node: PieceNode) {
    if (this.children) {
      this.above = this
      this.children.prepend(node)
    }
  }

  /**
   * Insert new node to child node list after specific child node
   *
   * @param newNode
   * @param referenceNode
   */
  public insertAfter(newNode: PieceNode, referenceNode: PieceNode): PieceNode {
    if (referenceNode.above === this && this.children) {
      newNode.above = this
      this.children.insertAfter(newNode, referenceNode)
    }
    return newNode
  }

  /**
   * Insert new node to child node list before specific child node
   *
   * @param newNode
   * @param referenceNode
   */
  public insertBefore(newNode: PieceNode, referenceNode: PieceNode): PieceNode {
    if (referenceNode.above === this && this.children) {
      newNode.above = this
      this.children.insertBefore(newNode, referenceNode)
    }
    return newNode
  }

  /**
   * Remove A Specific Child Node
   *
   * @param {PieceNode} childNode Child Node Prepare to be removed
   */
  public removeChild(childNode: PieceNode) {
    if (this.children) {
      this.children.deleteNode(childNode)
    }
    return childNode
  }

  /**
   * Prepend
   *
   * @param node
   */
  public before(node: PieceNode) {
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
  public after(node: PieceNode) {
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
   * 寻找本节点子树的最左侧节点
   */
  public lefest(): PieceNode {
    if (this.left.isNotNil) {
      return this.left.lefest()
    }
    return this
  }

  /**
   * Find The Max Node in this subtree
   */
  public rightest(): PieceNode {
    if (this.right.isNotNil) {
      return this.right.rightest()
    }
    return this
  }

  /**
   * Tree Successor
   */
  public successor() {
    if (this.right.isNotNil) {
      return this.right.lefest()
    }

    let node: PieceNode = this

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
  public predecessor() {
    if (this.left.isNotNil) {
      return this.left.rightest()
    }

    let node: PieceNode = this

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
  public updateMeta() {
    if (this.left.isNil) {
      this.leftSize = 0
      this.leftNodeCnt = 0
      this.leftLineFeedCnt = 0
    } else {
      this.leftSize = this.left.leftSize + this.left.rightSize + this.left.size
      this.leftNodeCnt = this.left.leftNodeCnt + this.left.rightNodeCnt + 1
      this.leftLineFeedCnt = this.left.leftLineFeedCnt + this.left.rightLineFeedCnt + this.left.lineFeedCnt
    }

    if (this.right.isNil) {
      this.rightSize = 0
      this.rightNodeCnt = 0
      this.rightLineFeedCnt = 0
    } else {
      this.rightSize = this.right.leftSize + this.right.rightSize + this.right.size
      this.rightNodeCnt = this.right.leftNodeCnt + this.right.rightNodeCnt + 1
      this.rightLineFeedCnt = this.right.leftLineFeedCnt + this.right.rightLineFeedCnt + this.right.lineFeedCnt
    }
  }

  /**
   * Update Node Meta Recursively
   *
   * O(logn)
   *
   */
  public updateMetaUpward(stopAnchor?: PieceNode): boolean {
    this.updateMeta()

    // Update Meta of This level
    if (this.parent.isNotNil && this !== stopAnchor) {
      this.parent.updateMetaUpward()
    }

    // Update up level
    if (this.above.isNotNil) {
      this.above.updateMetaUpward()
    }

    return true
  }

  /**
   * detach this node from the tree
   */
  public detach() {
    this.parent = null!
    this.left = null!
    this.right = null!
    this.above = null!
    this.children = null!
  }
}

/**
 * Create Text Piece
 *
 * @param bufferIndex
 * @param start
 * @param length
 * @param lineFeedCnt
 * @param meta
 */
export function createTextPiece(
  bufferIndex: number,
  start: number,
  length: number,
  lineFeedCnt: number,
  meta: PieceMeta | null = null,
): Piece {
  return { pieceType: PieceType.TEXT, bufferIndex, start, length, lineFeedCnt, meta }
}

/**
 * Create Object Piece
 * @param meta
 */
export function createObjectPiece(meta: PieceMeta): Piece {
  return { pieceType: PieceType.OBJECT, bufferIndex: -1, start: 0, length: 1, lineFeedCnt: 0, meta }
}

/**
 * Create Structural Piece
 * @param meta
 */
export function createStructuralPiece(length: number = 0, meta: PieceMeta) {
  return { pieceType: PieceType.STRUCTURAL, bufferIndex: -1, start: 0, length, lineFeedCnt: 0, meta }
}

/**
 * Create Root Piece
 * @param meta
 */
export function createRootPiece(meta: PieceMeta = {}): Piece {
  return { pieceType: PieceType.ROOT, bufferIndex: -1, start: 0, length: 0, lineFeedCnt: 0, meta }
}

/**
 * Create New Node
 * @param piece
 * @param color
 */
export function createPieceNode(piece: Piece): PieceNode {
  const node = new PieceNode(piece)
  node.left = SENTINEL
  node.right = SENTINEL
  node.parent = SENTINEL
  node.above = SENTINEL

  node.children = new PieceNodeList()
  return node
}

// Sentinel Node Which Refers to Black Nil Node
export const SENTINEL = new PieceNode(createTextPiece(1, 0, 0, 0), NodeColor.BLACK)
