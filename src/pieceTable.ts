import { NodePosition } from 'common'
import { createPieceNode, createRootPiece, Piece, PieceNode, PieceType } from 'pieceNode'
import StringBuffer from 'stringBuffer'
import cloneDeep from 'lodash.clonedeep'

export const LINE_BREAK = '\n'

export class PieceTable {
  public buffers: StringBuffer[] = [new StringBuffer(''), new StringBuffer('')]

  private root: PieceNode

  constructor() {
    this.root = createPieceNode(createRootPiece({}))
  }

  /**
   * Insert Pure Text in specific postion of the doc
   *
   * @param docPosition
   * @param text
   */
  public insertText(docPosition: number, text: string) {
    if (!text) return null

    // 找到需要插入文字的节点
    // 判断：
    // - 分割节点，插入的文字以新节点插入其中
    //    - 插入的文字中存在换行符，分割查找到的文字节点之上的段落节点为两个段落节点。换行符之前为前一个节点，之后会后一个节点。多个换行符，那么创建多个段落
    // - 连续输入，文字放入buffer后，移动节点的长度引用
    // - 节点前或者节点后插入新的文字节点

    const nodePosition = this.findNode(docPosition)

    if (nodePosition) {
      const { node, reminder, startOffset, startLineFeedCnt } = nodePosition

      const addBuffer = this.buffers[0]
      const isContinousInput =
        node.isNotNil &&
        node.piece.bufferIndex === 0 &&
        addBuffer.length === node.piece.start + node.piece.length &&
        reminder === node.piece.length

      const texts = text.split(LINE_BREAK)

      if (texts.length === 1) {
        if (isContinousInput) {
        }
      } else if (texts.length > 1) {
        // Split Two Paragraph Structural Node
      }
    }
  }

  public delete() {}

  public format() {}

  private findNode(offset: number): NodePosition | null {
    let list = this.root.children

    while (list && list !== null) {
      const position = list.find(offset)
      const { node, reminder, startOffset, startLineFeedCnt } = position

      // Find A Empty Structural Piece In this Layer, Go Blow layer
      if (node.piece.pieceType === PieceType.STRUCTURAL && node.piece.length === 0) {
        if (node.children) {
          list = node.children
          offset = reminder
        } else {
          break
        }
      } else {
        return position
      }
    }

    return null
  }
}

function splitTextNode(node: PieceNode, offset: number) {
  const { bufferIndex, start, meta, pieceType } = node.piece

  const leftPiece: Piece = { bufferIndex, start, length: offset, lineFeedCnt: 0, meta: cloneDeep(meta), pieceType: pieceType }

  node.piece.start += offset
  node.piece.length -= offset
  node.piece.lineFeedCnt -= 0

  const leftNode = new PieceNode(leftPiece)

  return []
}
