import { NodeColor, NodePosition } from 'common'
import { SENTINEL, PieceNode, Piece } from 'pieceNode'
import { PieceTable } from 'pieceTable'
import cloneDeep from 'lodash.clonedeep'
import { off } from 'process'

/**
 * Balanced Binary Tree
 *
 * Piece List 初始化的时候，
 *
 */
export class PieceNodeList {
  private root: PieceNode = SENTINEL

  private pt: PieceTable

  /**
   * Actual Length
   */
  public get length(): number {
    return this.root.leftSize + this.root.rightSize + this.root.piece.length
  }

  /**
   * Number of Line Feeds in the list
   */
  public get lineFeedCnt(): number {
    return this.root.leftLineFeeds + this.root.rightLineFeeds + this.root.piece.lineFeedCnt
  }

  constructor(pt: PieceTable) {
    this.pt = pt
  }

  /**
   * Find Node Postion
   *
   * @param offset
   */
  public find(offset: number): NodePosition {
    let node = this.root
    let reminder = 0
    let startOffset = 0
    let startLineFeedCnt = 0

    if (offset <= 0) return { node: this.root.lefest(), reminder: 0, startOffset: startOffset, startLineFeedCnt }
    if (offset >= this.length) {
      const lastNode = this.root.rightest()
      return {
        node: lastNode,
        reminder: lastNode.piece.length,
        startOffset: this.length - lastNode.piece.length,
        startLineFeedCnt: this.lineFeedCnt - lastNode.piece.lineFeedCnt,
      }
    }

    while (node !== SENTINEL) {
      // Go to left tree
      if (node.leftSize > offset) {
        node = node.left
      }
      // In This Node
      else if (node.leftSize + node.piece.length > offset) {
      } else {
        if (node.right === SENTINEL) break

        offset -= node.leftSize + node.piece.length
        startOffset += node.leftSize + node.piece.length
        startLineFeedCnt += node.leftLineFeeds + node.piece.lineFeedCnt

        node = node.right
      }
    }

    return { node: this.root.lefest(), reminder: 0, startOffset: startOffset, startLineFeedCnt }
  }

  /**
   * Split a node into to two new node
   *
   * @param pieceNode Node To Split
   * @param offset Where To Split
   */
  public splitNode(pieceNode: PieceNode, offset: number) {
    const { bufferIndex, start, meta, pieceType } = pieceNode.piece

    const leftPiece: Piece = {
      bufferIndex,
      start,
      length: offset,
      lineFeedCnt: 0,
      meta: cloneDeep(meta),
      pieceType: pieceType,
    }

    pieceNode.piece.start += offset
    pieceNode.piece.length -= offset
    pieceNode.piece.lineFeedCnt -= 0

    const leftNode = new PieceNode(leftPiece)

    this.insertFixedLeft(pieceNode, leftNode)
    return [leftNode, pieceNode]
  }

  /**
   * Insert a new node to the leftest of the tree
   * @param pieceNode
   */
  public prepend(pieceNode: PieceNode) {
    const node = this.root.lefest()
    this.insertFixedLeft(node, pieceNode)
  }

  /**
   * Insert a new node to the rightest of the tree
   * @param piece
   */
  public append(pieceNode: PieceNode) {
    const node = this.root.rightest()
    this.insertFixedRight(node, pieceNode)
  }

  /**
   * Insert newNode as Node predecessor
   * @param node Insert After This Node
   * @param piece
   */
  public insertFixedLeft(node: PieceNode, pieceNode: PieceNode): PieceNode {
    if (node.isNil) {
      this.root = pieceNode
      pieceNode.left = SENTINEL
      pieceNode.right = SENTINEL
      pieceNode.parent = SENTINEL
    } else {
      node.prepend(pieceNode)
    }
    pieceNode.updateMetaUpward()
    this.insertFixup(pieceNode)

    return pieceNode
  }

  /**
   * Insert new Node as Node successor
   * @param node
   * @param piece
   */
  public insertFixedRight(node: PieceNode, pieceNode: PieceNode) {
    if (node.isNil) {
      this.root = pieceNode
      pieceNode.left = SENTINEL
      pieceNode.right = SENTINEL
      pieceNode.parent = SENTINEL
    } else {
      node.append(pieceNode)
    }
    pieceNode.updateMetaUpward()
    this.insertFixup(pieceNode)

    return pieceNode
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
