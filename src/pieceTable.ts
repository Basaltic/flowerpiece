import { Piece, PieceNode, PieceType } from 'pieceNode'
import StringBuffer from 'stringBuffer'
import { ChangeStack } from 'history'
import { Document } from 'pieceNode.document'
import { Inline } from 'pieceNode.inline'
import { Paragraph } from 'pieceNode.paragraph'
import { Structural } from 'pieceNode.structural'
import { Text } from 'pieceNode.text'

export const LINE_BREAK = '\n'

export class PieceTable {
  public buffers: StringBuffer[] = [new StringBuffer(''), new StringBuffer('')]

  public document: Document

  public selection: Selection

  public changeHistory: ChangeStack

  public pendingRenderNodes: Set<number>

  constructor() {
    this.document = new Document()
    this.selection = new Selection()
    this.changeHistory = new ChangeStack()
    this.pendingRenderNodes = new Set()
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

  public change() {
    // op1
    // op2
  }

  /**
   * Create New Piece Node
   * @param piece
   */
  public createPieceNode(piece: Piece): PieceNode {
    switch (piece.pieceType) {
      case PieceType.INLINE:
        return new Inline(piece.meta)
      case PieceType.PARAGRAPH:
        return new Paragraph(piece.meta)
      case PieceType.STRUCTURAL:
        return new Structural(piece.meta)
      case PieceType.TEXT:
      default:
        return new Text(piece.bufferIndex, piece.start, piece.length, piece.meta)
    }
  }

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
