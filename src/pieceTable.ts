import { Piece, PieceNode } from 'pieceNode'
import StringBuffer from 'stringBuffer'
import { ChangeStack } from 'history'
import { Document } from 'pieceNode.document'

export const LINE_BREAK = '\n'

export class PieceTable {
  public buffers: StringBuffer[] = [new StringBuffer(''), new StringBuffer('')]

  private document: Document

  private changeHistory: ChangeStack

  constructor() {
    this.document = new Document()

    this.changeHistory = new ChangeStack()
  }

  /**
   * Insert Pure Text in specific postion of the doc
   *
   * @param docPosition
   * @param text
   */
  public insertText(docPosition: number, text: string) {
    if (!text) return null
  }

  /**
   * Delete
   */
  public delete() {}

  public format() {}

  /**
   * Get All Text Content
   */
  public getFullText(): string {
    return this.getTextInNode(this.document)
  }

  /**
   * Get Text Content In a Range
   *
   * @param start
   * @param end
   */
  public getText(start: number, end: number): string {
    return ''
  }

  // ----- Atomic Operation Methods ----- //

  // ----- Util Methods ------ //

  /**
   * Get Text In Buffer
   *
   * @param bufferIndex
   * @param start
   * @param length
   */
  private getTextInBuffer(bufferIndex: number, start: number, length: number) {
    if (bufferIndex < 0) return ''
    const buffer = this.buffers[bufferIndex]
    const value = buffer.buffer.substring(start, start + length)
    return value
  }

  /**
   * Get Actual Text in piece
   *
   * @param piece
   */
  private getTextInPiece(piece: Piece) {
    const { bufferIndex, start, length } = piece
    return this.getTextInBuffer(bufferIndex, start, length)
  }

  /**
   * Get All Text in a node
   * @param node
   */
  private getTextInNode(node?: PieceNode): string {
    let text = ''

    if (node) {
      if (node.children) {
        const firstNode = node.firstChild
        while (firstNode !== null && firstNode.isNotNil) {
          text += this.getTextInNode(firstNode)
          firstNode.successor()
        }
      } else {
        text = this.getTextInPiece(node.piece)
      }
    }

    return text
  }
}
