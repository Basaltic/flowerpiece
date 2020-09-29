import { NodePosition } from 'common'
import { PieceType } from 'pieceNode'
import { PieceNodeList } from 'pieceNodeList'
import StringBuffer from 'stringBuffer'

export class PieceTable {
  public buffers: StringBuffer[] = [new StringBuffer(''), new StringBuffer('')]

  private list: PieceNodeList = new PieceNodeList()

  constructor() {}

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
    // - 连续输入，文字放入buffer后，移动节点的长度引用
    // - 节点前或者节点后插入新的文字节点
  }

  public delete() {}

  public format() {}

  private findNode(offset: number): NodePosition | null {
    let list = this.list
    while (list !== null) {
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
