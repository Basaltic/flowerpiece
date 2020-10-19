import { Piece, PieceNode, PieceType } from 'pieceNode'
import StringBuffer from 'stringBuffer'
import { ChangeStack } from 'history'
import { Document } from 'pieceNode.document'
import { Inline } from 'pieceNode.inline'
import { Paragraph } from 'pieceNode.paragraph'
import { Structural } from 'pieceNode.structural'
import { Text } from 'pieceNode.text'
import { PendingRenderNodes } from 'pendingRenderNodes'
import clonedeep from 'lodash.clonedeep'

export const LINE_BREAK = '\n'

export class PieceTable {
  public buffers: StringBuffer[] = [new StringBuffer(''), new StringBuffer('')]

  public document: Document

  public selection: Selection

  public changeHistory: ChangeStack

  public pendingRenderNodes: PendingRenderNodes

  constructor() {
    this.document = new Document()
    this.selection = new Selection()
    this.changeHistory = new ChangeStack()
    this.pendingRenderNodes = new PendingRenderNodes()
  }

  /**
   * Insert Pure Text in specific postion of the doc.
   * Make sure there's no link break in text
   *
   * @param docPosition
   * @param text
   */
  public insertText(docPosition: number, text: string) {
    if (!text) return null

    const addBuffer = this.buffers[0]

    const pos = this.document.findLeafNode(docPosition)

    if (pos) {
      if (pos.reminder === 0) {
        const node = pos.node.previousSibling
        const { start, length } = addBuffer.append(text)

        if (node) {
          const textNode = new Text({ bufferIndex: 0, start, length, meta: clonedeep(node.piece.meta) })
          node.after(textNode)
        } else {
          const textNode = new Text({ bufferIndex: 0, start, length, meta: null })
          pos.node.before(textNode)
        }

        this.pendingRenderNodes.add(pos.node.above)
      } else if (pos.reminder === pos.node.piece.length) {
        const isContinousInput = pos.node.piece.start + pos.reminder === addBuffer.length && pos.node.piece.bufferIndex === 0

        if (isContinousInput) {
          const { length } = addBuffer.append(text)

          pos.node.piece.length += length

          this.pendingRenderNodes.add(pos.node)
        } else {
          const node = pos.node

          const { start, length } = addBuffer.append(text)
          const meta = node.piece.pieceType === PieceType.TEXT ? clonedeep(node.piece.meta) : null
          const textNode = new Text({ bufferIndex: 0, start, length, meta })
          node.after(textNode)

          this.pendingRenderNodes.add(node.above)
        }
      } else {
        const node = pos.node as Text
        node.split(pos.reminder)

        const { start, length } = addBuffer.append(text)
        const textNode = new Text({ bufferIndex: 0, start, length, meta: clonedeep(node.piece.meta) })
        node.after(textNode)

        this.pendingRenderNodes.add(node.above)
      }
    }
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

  public addRenderingNode(node: PieceNode) {
    this.pendingRenderNodes.add(node)
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
        return new Text({ ...piece })
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
