import PieceTreeNode, { SENTINEL, createPieceTreeNode } from './pieceTreeNode'
import { NodeColor, NodePosition } from './common'
import NodePiece, { determinePureTextSize } from './piece'
import StringBuffer from './stringBuffer'

/**
 * Piece Tree Base
 */
export default class PieceTreeBase {
  public buffers: StringBuffer[]
  public root: PieceTreeNode = SENTINEL

  constructor() {
    const addedTextBuffer = new StringBuffer('')
    this.buffers = [addedTextBuffer, new StringBuffer('')]
  }

  /**
   * Length Of The Content
   */
  getLength() {
    return this.root.leftSize + this.root.rightSize + this.root.piece.length
  }

  /**
   * Get How many lines the document has
   */
  getLineCount() {
    return this.root.leftLineFeeds + this.root.rightLineFeeds + this.root.piece.lineFeedCnt
  }

  /**
   * Pure Text Count
   */
  getPureTextCount() {
    return this.root.leftTextSize + this.root.rightTextSize + determinePureTextSize(this.root.piece)
  }

  /**
   * Check if there's no content
   */
  isEmpty() {
    if (this.getLength() <= 1) {
      return true
    }
    return false
  }

  /**
   * Find Node Position by Offset
   * @param offset
   */
  findByOffset(offset: number): NodePosition {
    let node = this.root
    let reminder = 0
    let startOffset = 0
    let startLineFeedCnt = 0

    while (node !== SENTINEL) {
      if (node.leftSize > offset) {
        node = node.left
      } else if (node.leftSize + node.piece.length >= offset) {
        reminder = offset - node.leftSize
        startOffset += node.leftSize
        startLineFeedCnt += node.leftLineFeeds
        break
      } else {
        if (node.right === SENTINEL) break

        offset -= node.leftSize + node.piece.length
        startOffset += node.leftSize + node.piece.length
        startLineFeedCnt += node.leftLineFeeds + node.piece.lineFeedCnt
        node = node.right
      }
    }

    return { node, reminder, startOffset, startLineFeedCnt }
  }

  /**
   * Find The Specific Line Start Node
   */
  findByLineNumber(lineNumber: number): NodePosition {
    let node = this.root
    let reminder = 0
    let startOffset = 0
    let startLineFeedCnt = lineNumber

    if (lineNumber <= 0) lineNumber = 1
    if (lineNumber > this.getLineCount()) lineNumber = this.getLineCount()

    while (node !== SENTINEL) {
      if (node.leftLineFeeds >= lineNumber) {
        node = node.left
      } else if (node.leftLineFeeds + node.piece.lineFeedCnt >= lineNumber) {
        startOffset += node.leftSize
        break
      } else {
        if (node.right === SENTINEL) break

        lineNumber -= node.leftLineFeeds + node.piece.lineFeedCnt
        startOffset += node.leftSize + node.piece.length

        node = node.right
      }
    }

    return { node, reminder, startOffset, startLineFeedCnt }
  }

  /**
   * Append the piece
   * @param piece
   */
  protected insertRightest(piece: NodePiece) {
    const node = this.root.findMax()
    this.insertFixedRight(node, piece)
  }

  /**
   * Insert newNode as Node predecessor
   * @param node Insert After This Node
   * @param piece
   */
  protected insertFixedLeft(node: PieceTreeNode, piece: NodePiece): PieceTreeNode {
    const newNode = createPieceTreeNode(piece)
    if (node.isNil) {
      this.root = newNode
      newNode.left = SENTINEL
      newNode.right = SENTINEL
      newNode.parent = SENTINEL
    } else {
      node.prepend(newNode)
    }
    newNode.updateMetaUpward()
    this.insertFixup(newNode)

    return newNode
  }

  /**
   * Insert new Node as Node successor
   * @param node
   * @param piece
   */
  protected insertFixedRight(node: PieceTreeNode, piece: NodePiece) {
    const newNode = createPieceTreeNode(piece)
    if (node.isNil) {
      this.root = newNode
      newNode.left = SENTINEL
      newNode.right = SENTINEL
      newNode.parent = SENTINEL
    } else {
      node.append(newNode)
    }
    newNode.updateMetaUpward()
    this.insertFixup(newNode)

    return newNode
  }

  /**
   * Delete Node
   * @param node
   */
  protected deleteNode(z: PieceTreeNode) {
    let y = z
    let yOriginalColor = y.color

    let x = y

    // 1.
    if (z.left.isNil) {
      x = z.right
      this.transplant(z, z.right)

      x.parent.updateMeta()
    } else if (z.right.isNil) {
      x = z.left
      this.transplant(z, z.left)

      x.parent.updateMeta()
    }
    // 3. 左树、右树都存在。用该节点的后继节点移植
    else {
      y = z.right.findMin()
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

      x.parent.updateMeta()
      y.updateMeta()
    }

    if (yOriginalColor === NodeColor.BLACK) {
      this.deleteNodeFixup(x)
    }

    z.detach()
  }

  /**
   * Fixup the tree after node deletion
   * @param x node which is used to replace deleted node
   */
  protected deleteNodeFixup(x: PieceTreeNode) {
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
  protected insertFixup(node: PieceTreeNode) {
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
  protected leftRotate(x: PieceTreeNode) {
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
  protected rightRotate(y: PieceTreeNode) {
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
  protected transplant(x: PieceTreeNode, y: PieceTreeNode) {
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
