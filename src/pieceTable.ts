import { NodePosition } from 'common'
import { PieceNode, PieceType } from 'pieceNode'
import StringBuffer from 'stringBuffer'
import cloneDeep from 'lodash.clonedeep'
import { splitTextNode } from 'pieceNodeList'
import { PieceNodeFactory } from 'pieceNode.factory'
import { ChangeStack } from 'change'

export const LINE_BREAK = '\n'

export class PieceTable {
  public buffers: StringBuffer[] = [new StringBuffer(''), new StringBuffer('')]

  private root: PieceNode

  private changeHistory: ChangeStack

  constructor() {
    this.root = PieceNodeFactory.createPieceNode(PieceNodeFactory.createRootPiece({}))

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

    const nodePosition = this.findNode(docPosition)

    if (nodePosition) {
      const { node, reminder } = nodePosition

      const addBuffer = this.buffers[0]
      const isContinousInput =
        node.isNotNil &&
        node.piece.bufferIndex === 0 &&
        addBuffer.length === node.piece.start + node.piece.length &&
        reminder === node.piece.length

      const texts = text.split(LINE_BREAK)

      // Pure Text. No Line Break
      if (texts.length === 1) {
        const [start] = addBuffer.append(text)

        // Before Node
        if (reminder === 0) {
          const newTextPiece = PieceNodeFactory.createTextPiece(0, start, text.length, 0, cloneDeep(node.piece.meta))
          const newNode = PieceNodeFactory.createPieceNode(newTextPiece)
          node.before(newNode)
        }
        // After Node
        else if (reminder >= node.size) {
          if (isContinousInput) {
            node.piece.length += text.length
          } else {
            const newTextPiece = PieceNodeFactory.createTextPiece(0, start, text.length, 0, cloneDeep(node.piece.meta))
            const newNode = PieceNodeFactory.createPieceNode(newTextPiece)
            node.after(newNode)
          }
        }
        // Middle of the node
        else {
          const [leftNode, rightNode] = splitTextNode(node, reminder)

          const newTextPiece = PieceNodeFactory.createTextPiece(0, start, text.length, 0, cloneDeep(leftNode.piece.meta))
          const newNode = PieceNodeFactory.createPieceNode(newTextPiece)

          leftNode.after(newNode)
        }
      } else if (texts.length > 1) {
        // Split Two Paragraph Structural Node
      }
    }
  }

  public delete() {}

  public format() {}

  /**
   * Find the Lowest node by offset
   *
   * @param {number} offset
   */
  public findNode(offset: number): NodePosition | null {
    let list = this.root.children

    while (list && list !== null) {
      const position = list.find(offset)
      const { node, reminder } = position

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

  /**
   * Get All Text Content
   */
  public getFullText(): string {
    return ''
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

  private
}
