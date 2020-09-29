import { PieceType } from 'pieceNode'
import { PieceNodeList } from 'pieceNodeList'
import StringBuffer from 'stringBuffer'

export class PieceTable {
  public buffers: StringBuffer[] = [new StringBuffer(''), new StringBuffer('')]

  private list: PieceNodeList = new PieceNodeList()

  /**
   * Insert Pure Text in specific postion of the doc
   *
   * @param docPosition
   * @param text
   */
  public insertText(docPosition: number, text: string) {
    if (!text) return null

    // 1.

    //
  }

  public delete() {}

  public format() {}

  private findNode(offset: number) {
    let list = this.list
    while (list !== null) {
      const position = list.find(offset)
      const { node, reminder, startOffset, startLineFeedCnt } = position

      // Find A Empty Structural Piece In this Layer, Go Blow layer
      if (node.piece.pieceType === PieceType.STRUCTURAL && node.piece.length === 0) {
        if (node.children) {
          list = node.children
        } else {
          break
        }
      }
    }
  }
}
