import { DocumentChange } from 'flowerpiece'
import StringBuffer from 'stringBuffer'

export class PieceTable {
  public buffers: StringBuffer[] = [new StringBuffer(''), new StringBuffer('')]

  /**
   * Insert Pure Text in specific postion of the doc
   *
   * @param docPosition
   * @param text
   */
  public insertText(docPosition: number, text: string): DocumentChange | null {
    if (!text) return null

    // 1.

    //
  }

  public delete() {}

  public format() {}
}
