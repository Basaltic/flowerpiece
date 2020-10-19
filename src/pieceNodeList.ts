import { NodeColor, NodePosition } from './common'
import { PieceNode, Piece, SENTINEL } from './pieceNode'
import cloneDeep from 'lodash.clonedeep'
import { createPieceNode } from './pieceNodeFactory'

/**
 *
 * PieceNodeList Implemented Using A Balanced Binary Tree(RBTree)
 *
 */
export class PieceNodeList {
  public root: PieceNode = SENTINEL

  /**
   * Actual Content Size Which is used as accordination base.
   */
  public get size(): number {
    return this.root.leftSize + this.root.rightSize + this.root.size
  }

  /**
   * How many nodes in this list
   */
  public get nodeCnt(): number {
    if (this.root === SENTINEL) return 0
    return this.root.leftNodeCnt + this.root.rightNodeCnt + 1
  }

  /**
   * Number of Line Feeds in the list
   */
  public get lineFeedCnt(): number {
    return this.root.leftLineFeedCnt + this.root.rightLineFeedCnt + this.root.lineFeedCnt
  }

  /**
   * First Node Of the list
   */
  public get firstNode(): PieceNode {
    return this.get(1)
  }

  /**
   * Last Node in the list
   */
  public get lastNode(): PieceNode {
    return this.get(this.nodeCnt)
  }

  // --------------------------------------------------------------------------

  /**
   * Iterate This List
   */
  public forEach(callback: (node: PieceNode, index: number) => void) {
    let index = 0
    let node: PieceNode = this.firstNode
    while (node.isNotNil) {
      callback(node, index)
      index++
      node = node.successor()
    }
  }

  // --------------------------------------------------------------------------

  /**
   * Get node in specific index
   *
   * @param index
   */
  public get(index: number): PieceNode {
    let node = this.root

    if (index <= 0) index === 1
    if (index > this.nodeCnt) index === this.nodeCnt

    while (node !== SENTINEL) {
      if (node.leftNodeCnt >= index) {
        node = node.left
      } else if (node.leftNodeCnt + 1 >= index) {
        // -- Found
        break
      } else {
        index -= node.leftNodeCnt
        index -= 1
        node = node.right
      }
    }

    return node
  }

  /**
   * Find Node Postion In Specific Offset In This List
   *
   * Always find the previous node if the offset is between two nodes
   *
   * @param offset
   */
  public find(offset: number): NodePosition {
    let node = this.root
    let reminder = 0
    let startOffset = 0
    let startLineFeedCnt = 0

    if (offset <= 0) return { node: this.root.lefest(), reminder: 0, startOffset: startOffset, startLineFeedCnt }
    if (offset >= this.size) {
      const lastNode = this.lastNode
      return {
        node: lastNode,
        reminder: lastNode.size,
        startOffset: this.size - lastNode.size,
        startLineFeedCnt: this.lineFeedCnt - lastNode.lineFeedCnt,
      }
    }

    while (node !== SENTINEL) {
      if (node.leftSize > offset) {
        node = node.left
      } else if (node.leftSize + node.size > offset) {
        reminder = offset - node.leftSize
        startOffset += node.leftSize
        startLineFeedCnt += node.leftLineFeedCnt
        break
      } else {
        if (node.right === SENTINEL) break

        offset -= node.leftSize + node.size
        startOffset += node.leftSize + node.size
        startLineFeedCnt += node.leftLineFeedCnt + node.lineFeedCnt

        node = node.right
      }
    }

    return { node, reminder, startOffset: startOffset, startLineFeedCnt }
  }

  /**
   * Insert a new node to the leftest of the tree
   * @param newNode
   */
  public prepend(newNode: PieceNode) {
    const referenceNode = this.firstNode
    return this.insertBefore(newNode, referenceNode)
  }

  /**
   * Insert a new node after the last node
   *
   * @param newNode
   */
  public append(newNode: PieceNode) {
    const referenceNode = this.lastNode
    return this.insertAfter(newNode, referenceNode)
  }

  /**
   * Insert newNode as Node predecessor
   *
   * @param {PieceNode} newNode
   * @param {PieceNode} referenceNode
   */
  public insertBefore(newNode: PieceNode, referenceNode: PieceNode): PieceNode {
    if (referenceNode === SENTINEL) {
      this.root = newNode
    } else {
      if (referenceNode.left === SENTINEL) {
        referenceNode.left = newNode
        newNode.parent = referenceNode
      } else {
        const predecessor = referenceNode.predecessor()
        predecessor.right = newNode
        newNode.parent = predecessor
      }
    }

    newNode.updateMetaUpward()
    this.insertFixup(newNode)

    return newNode
  }

  /**
   * Insert new Node as Node successor
   *
   * @param {PieceNode} newNode
   * @param {PieceNode} referenceNode
   */
  public insertAfter(newNode: PieceNode, referenceNode: PieceNode): PieceNode {
    if (referenceNode.isNil) {
      this.root = newNode
    } else {
      if (referenceNode.right.isNil) {
        referenceNode.right = newNode
        newNode.parent = referenceNode
      } else {
        const successor = referenceNode.successor()
        successor.left = newNode
        newNode.parent = successor
      }
    }
    newNode.updateMetaUpward()
    this.insertFixup(newNode)

    return newNode
  }

  /**
   * Delete Node
   * @param node
   */
  public deleteNode(z: PieceNode): PieceNode {
    let y = z
    let yOriginalColor = y.color

    let x = y

    // 1.
    if (z.left.isNil) {
      x = z.right
      this.transplant(z, z.right)

      x.parent.updateMetaUpward()
    } else if (z.right.isNil) {
      x = z.left
      this.transplant(z, z.left)

      x.parent.updateMetaUpward()
    }
    // 3. 左树、右树都存在。用该节点的后继节点移植
    else {
      y = z.right.lefest()
      yOriginalColor = y.color
      x = y.right

      if (y.parent === z) {
        x.parent = y
      } else {
        this.transplant(y, y.right)
        y.right = z.right
        y.right.parent = y
      }

      this.transplant(z, y)
      y.left = z.left
      y.left.parent = y
      y.color = z.color

      x.parent.updateMetaUpward()
      y.updateMetaUpward()
    }

    if (yOriginalColor === NodeColor.BLACK) {
      this.deleteNodeFixup(x)
    }

    z.detach()
    return z
  }

  /**
   * Fixup the tree after node deletion
   * @param x node which is used to replace deleted node
   */
  protected deleteNodeFixup(x: PieceNode) {
    while (!x.isRoot && x.isBlack) {
      if (x.isLeft) {
        let w = x.parent.right
        if (w.isRed) {
          w.toBlack()
          x.parent.toRed()
          this.leftRotate(x.parent)
          w = x.parent.right
        }

        if (w.left.isBlack && w.right.isBlack) {
          w.toRed()
          x = x.parent
        } else if (w.right.isBlack) {
          w.left.toBlack()
          w.toRed()
          this.rightRotate(w)
          w = x.parent.right
        } else {
          w.color = x.parent.color
          x.parent.toBlack()
          w.right.toBlack()
          this.leftRotate(x.parent)
          x = this.root
        }
      } else {
        let w = x.parent.left
        if (w.isRed) {
          w.toBlack()
          x.parent.toRed()
          this.rightRotate(x.parent)
          w = x.parent.left
        }

        if (w.right.isBlack && w.left.isBlack) {
          w.toRed()
          x = x.parent
        } else if (w.left.isBlack) {
          w.right.toBlack()
          w.toRed()
          this.leftRotate(w)
          w = x.parent.left
        } else {
          w.color = x.parent.color
          x.parent.toBlack()
          w.left.toBlack()
          this.rightRotate(x.parent)
          x = this.root
        }
      }
    }

    x.toBlack()
  }

  /**
   * Fix up The Tree
   * @param node
   */
  protected insertFixup(node: PieceNode) {
    // 0. 传入节点的父节点是红色节点，就不断循环
    while (node.parent.isRed) {
      // 1. 插入的节点的父节点是 左节点
      if (node.parent.isLeft) {
        const uncle = node.parent.parent.right
        if (uncle.isRed) {
          // 1.1 叔叔节点亦是红色节点，重新染色
          node.parent.toBlack()
          uncle.toBlack()
          node.parent.parent.toRed()
          node = node.parent.parent
        } else if (node.isRight) {
          // 1.2
          node = node.parent
          this.leftRotate(node)
        } else {
          // 1.3
          node.parent.toBlack()
          node.parent.parent.toRed()
          this.rightRotate(node.parent.parent)
        }
      } else {
        const uncle = node.parent.parent.left

        if (uncle.isRed) {
          node.parent.toBlack()
          uncle.toBlack()
          node.parent.parent.toRed()
          node = node.parent.parent
        } else if (node.isLeft) {
          node = node.parent
          this.rightRotate(node)
        } else {
          node.parent.toBlack()
          node.parent.parent.toRed()

          this.leftRotate(node.parent.parent)
        }
      }
    }

    this.root.toBlack()
  }

  /**
   * Tree Left Rotate
   *
   *      g                   g
   *      |                   |
   *      x                   y
   *    /   \   ======>     /   \
   *  a       y           x       c
   *        /   \       /   \
   *      b       c   a       b
   */
  protected leftRotate(x: PieceNode) {
    // 1. Link x's right to y's left
    const y = x.right
    const b = y.left

    x.right = b

    // 2. Link Parent to x
    if (b.isNotNil) {
      b.parent = x
    }

    // 3. Link y's parent to x's parent
    y.parent = x.parent

    // 4. No Parent means x is root. Set root to y
    if (x.isRoot) {
      this.root = y
    } else if (x.isLeft) {
      x.parent.left = y
    } else {
      x.parent.right = y
    }

    y.left = x
    x.parent = y

    x.updateMeta()
    y.updateMeta()
  }

  /**
   * Tree Right Rotate
   *
   *          g                         g
   *          |                         |
   *          y                         x
   *        /   \                     /   \
   *      x       c   =====>        a       y
   *    /   \                             /   \
   *  a       b                         b       c
   *
   */
  protected rightRotate(y: PieceNode) {
    const x = y.left
    const b = x.right

    y.left = b

    if (b.isNotNil) {
      b.parent = y
    }

    x.parent = y.parent

    if (y.isRoot) {
      this.root = x
    } else if (y.isLeft) {
      y.parent.left = x
    } else {
      y.parent.right = x
    }

    x.right = y
    y.parent = x

    y.updateMeta()
    x.updateMeta()
  }

  /**
   * Tansplant one subtree to another
   *
   * @param x
   * @param y
   */
  protected transplant(x: PieceNode, y: PieceNode) {
    if (x.isRoot) {
      this.root = y
    } else if (x.isLeft) {
      x.parent.left = y
    } else {
      x.parent.right = y
    }
    y.parent = x.parent
  }
}

/**
 * Split a node into to two new node
 * 1. split into two text piece node
 * 2. split into two structural piece node(paragraph)
 *
 * @param {PieceNode} nodeToSplit Node To Split
 * @param {number} offset Where To Split
 */
export function splitTextNode(nodeToSplit: PieceNode, offset: number): PieceNode[] {
  const { bufferIndex, start, meta, pieceType } = nodeToSplit.piece

  const leftPiece: Piece = { bufferIndex, start, length: offset, lineFeedCnt: 0, meta: cloneDeep(meta), pieceType: pieceType }
  const leftNode = createPieceNode(leftPiece)

  nodeToSplit.piece.start += offset
  nodeToSplit.piece.length -= offset

  nodeToSplit.before(leftNode)

  return [leftNode, nodeToSplit]
}

/**
 * Split Structural Node into two.
 * Left New Node contains the nodes to anchorNode. Right Node contains the other nodes.
 *
 * LetNode
 * [firstNode, ...., anchorNode]
 *
 * rightNode
 * [anchorNode + 1, ...., lastNode]
 *
 * @param {PieceNode} nodeToSplit Must Be a structural node
 * @param {PieceNode} anchorNode
 */
export function splitStructuralNode(nodeToSplit: PieceNode, anchorNode: PieceNode): PieceNode[] {
  const rightPiece: Piece = cloneDeep(nodeToSplit.piece)
  const rightNode: PieceNode = createPieceNode(rightPiece)

  nodeToSplit.after(rightNode)

  anchorNode = anchorNode.successor()

  while (anchorNode.isNotNil) {
    const nextNode = anchorNode.successor()

    nodeToSplit.removeChild(anchorNode)

    anchorNode.parent = SENTINEL
    anchorNode.left = SENTINEL
    anchorNode.right = SENTINEL
    rightNode.appendChild(anchorNode)

    anchorNode = nextNode
  }

  return [nodeToSplit, rightNode]
}
