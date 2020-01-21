import PieceTreeNode, { SENTINEL, createPieceTreeNode } from './pieceTreeNode'
import Piece from './piece'
import { NodeColor, NodePosition } from './common'

const EOF = '\n'

/**
 * Text String Buffer
 */
export class StringBuffer {
  // Text String
  buffer: string

  get length() {
    return this.buffer.length
  }

  constructor(buffer: string) {
    this.buffer = buffer
  }
}

/**
 * Piece Tree Implementation
 */
export class PieceTree {
  public buffers: StringBuffer[]
  public root: PieceTreeNode = SENTINEL

  constructor(originalBuffer: StringBuffer) {
    const addBuffer = new StringBuffer('')
    this.buffers = [addBuffer, originalBuffer]

    const originalPiece = new Piece(
      1,
      0,
      originalBuffer.buffer.length,
      computeLineFeedCnt(originalBuffer.buffer)
    )
    const originalPieceTreeNode = createPieceTreeNode(originalPiece, NodeColor.BLACK)
    this.root = originalPieceTreeNode
  }

  /**
   * Get How many lines the document has
   */
  getLineCount() {
    return this.root.leftLineFeeds + this.root.rightLineFeeds + this.root.piece.lineFeedCnt + 1
  }

  getOffsetAt(lineNumber: number, column: number, lineSize: number) {
    const totalLine =
      this.root.leftLineFeeds + this.root.rightLineFeeds + this.root.piece.lineFeedCnt

    let node = this.root
    let offset = 0
    let cnt = 0
    if (lineNumber > totalLine) {
      node = this.root.findMax()
      if (node.piece.lineFeedCnt > 1) {
        cnt = node.piece.lineFeedCnt + 1
      }
    } else {
      if (lineNumber < 1) lineNumber = 1

      let nodeCntPostion = this.root.findByLineCnt(lineNumber)
      node = nodeCntPostion.node
      offset = nodeCntPostion.startOffset
      cnt = nodeCntPostion.remindLineCnt
    }

    if (cnt === 1) {
      const text = this.getTextInNode(node)
      const texts = text.split('\n')
      const txt = texts[0]

      offset += txt.length
      offset -= lineSize

      return offset + column
    } else {
      const text = this.getTextInNode(node)
      const texts = text.split('\n')

      for (let i = 0; i < cnt - 1; i++) {
        offset += texts[i].length + 1
      }

      offset -= lineSize

      return offset + column
    }
  }

  /**
   * Get Buffer Value
   * @param bufferIndex
   * @param start
   * @param length
   */
  getTextInBuffer(bufferIndex: number, start: number, length: number) {
    const buffer = this.buffers[bufferIndex]
    const value = buffer.buffer.substring(start, start + length)
    return value
  }

  /**
   * Get Buffer Value by Piece
   * @param piece
   */
  getTextInPiece(piece: Piece) {
    return this.getTextInBuffer(piece.bufferIndex, piece.start, piece.length)
  }

  /**
   * Get The Value In Some Node
   * @param node
   */
  getTextInNode(node: PieceTreeNode) {
    if (node.isNil) return ''

    const { piece } = node
    return this.getTextInPiece(piece)
  }

  /**
   * Get The Value In Range
   */
  getTextInRange(startOffset: number, endOffset: number): string {
    const startNodePosition = this.findNodeAt(startOffset)
    const endNodePosition = this.findNodeAt(endOffset)
    if (startNodePosition && endNodePosition) {
      let txt = ''

      // 1.开始节点的内容
      let node: PieceTreeNode = startNodePosition.node
      let strBuffer = this.buffers[node.piece.bufferIndex]
      let text = strBuffer.buffer.substring(
        node.piece.start + startNodePosition.reminder,
        node.piece.end
      )
      txt += text

      node = node.successor()

      // 2.中间节点的内容
      while (node !== endNodePosition.node) {
        const text = this.getTextInNode(node)
        txt += text
        node = node.successor()
      }

      // 3.结束节点的内容
      strBuffer = this.buffers[node.piece.bufferIndex]
      text = strBuffer.buffer.substring(
        node.piece.start,
        node.piece.start + endNodePosition.reminder
      )
      txt += text

      return txt
    }

    return ''
  }

  /**
   * Get Specific Line Content
   * @param lineNumber
   */
  getLineTextContent(lineNumber: number): string {
    const totalLine =
      this.root.leftLineFeeds + this.root.rightLineFeeds + this.root.piece.lineFeedCnt

    // 如果行数是最后一行，那么直接找到右侧节点，然后向前取到上一个换行符为止
    let node = this.root
    let cnt = 1
    if (lineNumber > totalLine) {
      node = this.root.findMax()
      if (node.piece.lineFeedCnt > 1) {
        cnt = node.piece.lineFeedCnt + 1
      }
    } else {
      if (lineNumber < 1) lineNumber = 1

      let nodeCntPostion = this.root.findByLineCnt(lineNumber, 0)
      node = nodeCntPostion.node
      cnt = nodeCntPostion.remindLineCnt
    }

    // 1. 第一个换行符表示，文字处于该节点的前部，需要往前获取直到上一个换行符的文字
    // 2. 大于1个换行符表示，该行的内容就在本节点中
    let txt = ''
    if (cnt === 1) {
      const text = this.getTextInNode(node)
      const texts = text.split('\n')
      txt = texts[0]

      node = node.predecessor()
      while (node.piece.lineFeedCnt === 0 && node.isNotNil) {
        const text = this.getTextInNode(node)
        txt = text + txt

        node = node.predecessor()
      }

      if (node.isNotNil) {
        const texts = this.getTextInNode(node).split(EOF)
        const text = texts[texts.length - 1]
        txt = text + txt
      }
    } else if (cnt > 1) {
      const text = this.getTextInNode(node)
      const texts = text.split(EOF)
      txt = texts[cnt - 1]
    }

    return txt
  }

  /**
   * Get Every Line Content
   */
  getLinesTextContent(): string[] {
    const txt = this.getAllTextContent()
    return txt.split(EOF)
  }

  /**
   * Get All Text
   */
  getAllTextContent(): string {
    let node: PieceTreeNode | null = this.root.findMin()
    let txt = ''
    do {
      const text = this.getTextInNode(node)
      txt += text
      node = node.successor()
    } while (node.isNotNil)

    return txt
  }

  findNodeAt(offset: number): NodePosition | null {
    return this.root.find(offset, 0)
  }

  /**
   * Insert Text In Offset
   * 在指定的偏移，插入文字
   *
   * @param offset
   * @param value
   */
  insert(offset: number, value: string) {
    const addBuffer = this.buffers[0]

    // 1. 寻找该偏移所在的 树节点，找到该节点，则执行插入操作
    const nodePosition = this.findNodeAt(offset)
    if (nodePosition) {
      const { node, reminder, startOffset } = nodePosition

      // 1.1 插入的偏移 和 add buffer中的偏移一致。表示在同一个节点连续输入。 那么只要把输入的文本直接加在该节点之后，
      if (
        node.piece.bufferIndex === 0 &&
        nodePosition.startOffset + nodePosition.node.piece.length === offset &&
        addBuffer.buffer.length === nodePosition.node.piece.start + nodePosition.node.piece.length
      ) {
        addBuffer.buffer += value

        nodePosition.node.piece.length += value.length
        nodePosition.node.updateMetaUpward()
      }
      // 1.2 插入的位置在 节点 内容的前面，新增左侧节点
      else if (startOffset === offset) {
        const lineFeedCnt = computeLineFeedCnt(value)
        const nPiece = new Piece(0, addBuffer.length, value.length, lineFeedCnt)

        addBuffer.buffer += value

        const newNode = createPieceTreeNode(nPiece)
        this.insertFixedLeft(node, newNode)
      }

      // 1.3 插入的位置在 节点 内容中间
      else if (startOffset + node.piece.length > offset) {
        // 1.3.1 把该节点piece分成两个 piece
        const strBuffer = this.buffers[node.piece.bufferIndex]

        const leftStr = strBuffer.buffer.substring(node.piece.start, reminder)
        const leftLineFeedCnt = computeLineFeedCnt(leftStr)
        const leftPiece = new Piece(
          node.piece.bufferIndex,
          node.piece.start,
          reminder,
          leftLineFeedCnt
        )

        const middleLineFeedCnt = computeLineFeedCnt(value)
        const middlePiece = new Piece(0, addBuffer.length, value.length, middleLineFeedCnt)

        const rightPiece = new Piece(
          node.piece.bufferIndex,
          node.piece.start + reminder,
          node.piece.length - reminder,
          node.piece.lineFeedCnt - leftLineFeedCnt
        )

        addBuffer.buffer += value

        // 把本节点的piece改为左边 piece
        node.piece = leftPiece

        // 在本节点向右侧 依次插入右边 piece的节点，新增value的节点
        const rightNewNode = createPieceTreeNode(rightPiece)
        const middleNewNode = createPieceTreeNode(middlePiece)
        this.insertFixedRight(node, rightNewNode)
        this.insertFixedRight(node, middleNewNode)
      }

      // 1.4 插入的位置在 节点 内容右侧，新增右侧节点
      else {
        const lineFeedCnt = computeLineFeedCnt(value)
        const nPiece = new Piece(0, addBuffer.length, value.length, lineFeedCnt)

        addBuffer.buffer += value

        const newNode = createPieceTreeNode(nPiece)
        this.insertFixedRight(node, newNode)
      }
    }
  }

  /**
   * Insert newNode as Node predecessor
   * @param node Insert After This Node
   * @param piece
   */
  insertFixedLeft(node: PieceTreeNode, newNode: PieceTreeNode) {
    if (node.isNil) {
      this.root = node
      node.left = SENTINEL
      node.right = SENTINEL
      node.parent = SENTINEL
    } else {
      node.prepend(newNode)
    }
    newNode.updateMetaUpward()
    this.insertFixup(newNode)
  }

  /**
   * Insert new Node as Node successor
   * @param node
   * @param piece
   */
  insertFixedRight(node: PieceTreeNode, newNode: PieceTreeNode) {
    if (node.isNil) {
      this.root = node
      node.left = SENTINEL
      node.right = SENTINEL
      node.parent = SENTINEL
    } else {
      node.append(newNode)
    }
    newNode.updateMetaUpward()
    this.insertFixup(newNode)
  }

  /**
   * Delete Value
   */
  delete(startOffset: number, length: number) {
    const startNodePosition = this.findNodeAt(startOffset)

    if (startNodePosition) {
      const { node, reminder } = startNodePosition
      // 1. 删除的内容正好从该节点内容的最后开始，直接删除文本内容
      if (node.piece.length - reminder === length) {
        if (reminder === 0) {
          this.deleteNode(node)
        } else {
          node.piece.length = reminder
          node.piece.lineFeedCnt = computeLineFeedCnt(this.getTextInNode(node))
        }
      }
      // 2. 删除的内容在该节点内容的中间, 分割为两个节点
      else if (node.piece.length - reminder > length) {
        if (reminder === 0) {
          node.piece.start += length
          node.piece.lineFeedCnt = computeLineFeedCnt(this.getTextInNode(node))
        } else {
          const start = node.piece.start + reminder + length
          const pieceLength = node.piece.end - start
          const piece = new Piece(node.piece.bufferIndex, start, pieceLength, 0)
          piece.lineFeedCnt = computeLineFeedCnt(this.getTextInPiece(piece))

          node.piece.length = reminder
          node.piece.lineFeedCnt = computeLineFeedCnt(this.getTextInNode(node))

          const newNode = createPieceTreeNode(piece)
          this.insertFixedRight(node, newNode)
        }
      }
      // 3. 删除的内容在该节点之外，垮多个节点
      else {
        const endOffset = startOffset + length
        const endNodePosition = this.findNodeAt(endOffset)
        if (endNodePosition) {
          let startNode = startNodePosition.node
          let endNode = endNodePosition.node

          // 3.1 开始节点
          if (startNodePosition.reminder === 0) {
            startNode = startNode.successor()
            this.deleteNode(startNodePosition.node)
          } else {
            startNodePosition.node.piece.length = startNodePosition.reminder
            startNodePosition.node.piece.lineFeedCnt = computeLineFeedCnt(
              this.getTextInNode(startNodePosition.node)
            )
          }

          // 3.2 中间节点
          const nodesToDelete: PieceTreeNode[] = []
          while (startNode !== endNode && startNode !== startNodePosition.node) {
            nodesToDelete.push(startNode)
            startNode = startNode.successor()
          }
          nodesToDelete.forEach(node => this.deleteNode(node))

          // 3.3 结束节点
          if (endNodePosition.startOffset + endNode.piece.length === endOffset) {
            this.deleteNode(endNode)
          } else {
            endNode.piece.start += endNodePosition.reminder
            endNode.piece.length = endNode.piece.length - endNodePosition.reminder
            endNode.piece.lineFeedCnt = computeLineFeedCnt(this.getTextInNode(endNode))
          }
        }
      }
    }
  }

  /**
   * Delete Node
   * @param node
   */
  deleteNode(z: PieceTreeNode) {
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
  }

  /**
   * Fixup the tree after node deletion
   * @param x 替换删除节点的节点
   */
  deleteNodeFixup(x: PieceTreeNode) {
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

  // ----- rbTree Operations ------ //

  /**
   * Fix up The Tree
   * @param node
   */
  insertFixup(node: PieceTreeNode) {
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
   * 左旋
   *
   *      g                   g
   *      |                   |
   *      x                   y
   *    /   \   ======>     /   \
   *  a       y           x       c
   *        /   \       /   \
   *      b       c   a       b
   */
  leftRotate(x: PieceTreeNode) {
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
   * 右旋
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
  rightRotate(y: PieceTreeNode) {
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
  transplant(x: PieceTreeNode, y: PieceTreeNode) {
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

// ---------- Utils ------------ //

/**
 * 计算字符串中的换行符数量
 * @param str
 */
export function computeLineFeedCnt(str: string) {
  const matches = str.match(/\n/gm)
  if (matches) {
    return matches.length
  }
  return 0
}
