import { PieceTree, EOL } from './pieceTree'
import { Diff } from './diff'
import { IPieceMeta } from './meta'
import { PieceType } from './piece'

export class Operations {
  private pieceTree: PieceTree

  constructor(pieceTree: PieceTree) {
    this.pieceTree = pieceTree
  }

  /**
   * Insert Content Which will cause offset change, piece increment, piece split
   * 1. Always create a new piece while having meta
   * 2. Coninuesly input only text, append to same node
   * 3. LineBreak(\n) will in a new piece which used to store line data
   */
  insert(offset: number, text: string = '', meta?: any): Diff[] {
    if (offset <= 0) {
      offset = 1
    } else {
      offset += 1
    }

    return this.pieceTree.insertInner(offset, text, meta)
  }

  /**
   * Delete Content
   */
  delete(offset: number, length: number): Diff[] {
    if (offset <= 0) {
      offset = 1
    } else {
      offset += 1
    }

    return this.pieceTree.deleteInner(offset, length)
  }

  /**
   * Format The Content. Only change the meta
   */
  format(offset: number, length: number, meta: IPieceMeta): Diff[] {
    // Notice: The Piece Tree will have a default line break piece. Adjust the offset
    if (offset <= 0) {
      offset = 1
    } else {
      offset += 1
    }

    return this.pieceTree.formatInner(offset, length, meta)
  }

  /**
   * Break The Content into two lines
   * @param offset
   * @param meta
   */
  insertLineBreak(offset: number, meta: IPieceMeta | null = null): Diff[] {
    return this.insert(offset, EOL, meta)
  }

  /**
   * Insert A Complete new Line in Offset
   * @param offset
   * @param meta
   */
  insertLine(offset: number, meta: IPieceMeta | null = null): Diff[] {
    const diff1 = this.insertLineBreak(offset, null)
    const diff2 = this.insert(offset, '', meta)
    const diff3 = this.insertLineBreak(offset + 2, null)
    return [...diff1, ...diff2, ...diff3]
  }

  /**
   * Insert Plain Text
   * @param offset
   * @param text
   * @param meta
   */
  insertText(offset: number, text: string, meta: IPieceMeta | null = null): Diff[] {
    if (text === '') {
      throw new Error('cannot pass empty text')
    }

    return this.insert(offset, text, meta)
  }

  /**
   * Insert Non Text
   * @param offset
   * @param meta
   */
  insertNonText(offset: number, meta: IPieceMeta): Diff[] {
    return this.insert(offset, '', meta)
  }

  /**
   * Delete The Entire Line Contents
   * @param lineNumber
   */
  deleteLine(lineNumber: number): Diff[] {
    const cnt = this.pieceTree.getLength()
    const lineCnt = this.pieceTree.getLineCount()

    if (lineCnt === 1) {
      if (lineNumber === 1) {
        return this.pieceTree.deleteInner(1, cnt - 1)
      }
      return []
    } else {
      if (lineNumber === lineCnt) {
        const { startOffset } = this.pieceTree.findByLineNumber(lineNumber)
        return this.pieceTree.deleteInner(startOffset, cnt - startOffset)
      } else if (lineNumber > lineCnt || lineNumber <= 0) {
        return []
      } else {
        const posStart = this.pieceTree.findByLineNumber(lineNumber)
        const posEnd = this.pieceTree.findByLineNumber(lineNumber + 1)

        const len = posEnd.startOffset - posStart.startOffset
        return this.pieceTree.deleteInner(posStart.startOffset, len)
      }
    }
  }

  /**
   * Format the Specific Line
   * @param lineNumber
   * @param meta
   */
  formatLine(lineNumber: number, meta: IPieceMeta): Diff[] {
    const { startOffset } = this.pieceTree.findByLineNumber(lineNumber)
    return this.pieceTree.formatInner(startOffset, 1, meta, PieceType.LINE_FEED)
  }

  /**
   * Change All Piece Meta In The Line
   */
  formatInLine(lineNumber: number, meta: IPieceMeta): Diff[] {
    const cnt = this.pieceTree.getLength()
    const lineCnt = this.pieceTree.getLineCount()

    if (lineCnt === 1) {
      if (lineNumber === 1) {
        return this.pieceTree.formatInner(1, cnt - 1, meta)
      }
      return []
    } else {
      if (lineNumber === lineCnt) {
        const { startOffset } = this.pieceTree.findByLineNumber(lineNumber)
        return this.pieceTree.formatInner(startOffset + 1, cnt - startOffset - 1, meta)
      } else if (lineNumber > 0 && lineNumber <= lineCnt) {
        const posStart = this.pieceTree.findByLineNumber(lineNumber)
        const posEnd = this.pieceTree.findByLineNumber(lineNumber + 1)

        const len = posEnd.startOffset - posStart.startOffset
        return this.pieceTree.formatInner(posStart.startOffset + 1, len, meta)
      } else {
        return []
      }
    }
  }

  /**
   * Change All Text Piece Meta In The Line
   */
  formatTextInLine(lineNumber: number, meta: IPieceMeta): Diff[] {
    const cnt = this.pieceTree.getLength()
    const lineCnt = this.pieceTree.getLineCount()

    if (lineCnt === 1) {
      if (lineNumber === 1) {
        return this.formatText(1, cnt - 1, meta)
      }
      return []
    } else {
      if (lineNumber === lineCnt) {
        const { startOffset } = this.pieceTree.findByLineNumber(lineNumber)
        return this.formatText(startOffset + 1, cnt - startOffset - 1, meta)
      } else if (lineNumber > 0 && lineNumber <= lineCnt) {
        const posStart = this.pieceTree.findByLineNumber(lineNumber)
        const posEnd = this.pieceTree.findByLineNumber(lineNumber + 1)

        const len = posEnd.startOffset - posStart.startOffset
        return this.formatText(posStart.startOffset, len, meta)
      } else {
        return []
      }
    }
  }

  /**
   * Change All Non-Text Piece Meta In The Line
   */
  formatNonTextInLine(lineNumber: number, meta: IPieceMeta): Diff[] {
    const cnt = this.pieceTree.getLength()
    const lineCnt = this.pieceTree.getLineCount()

    if (lineCnt === 1) {
      if (lineNumber === 1) {
        return this.formatNonText(1, cnt - 1, meta)
      }
      return []
    } else {
      if (lineNumber === lineCnt) {
        const { startOffset } = this.pieceTree.findByLineNumber(lineNumber)
        return this.formatNonText(startOffset + 1, cnt - startOffset - 1, meta)
      } else if (lineNumber > 0 && lineNumber <= lineCnt) {
        const posStart = this.pieceTree.findByLineNumber(lineNumber)
        const posEnd = this.pieceTree.findByLineNumber(lineNumber + 1)

        const len = posEnd.startOffset - posStart.startOffset
        return this.formatNonText(posStart.startOffset, len, meta)
      } else {
        return []
      }
    }
  }

  /**
   * Format Text Piece
   * @param offset
   */
  formatText(offset: number, length: number, meta: IPieceMeta): Diff[] {
    return this.pieceTree.formatInner(offset, length, meta, PieceType.TEXT)
  }

  /**
   * Format Non-Text Pieces
   * @param offset
   * @param length
   * @param meta
   */
  formatNonText(offset: number, length: number, meta: IPieceMeta): Diff[] {
    return this.pieceTree.formatInner(offset, length, meta, PieceType.NON_TEXT)
  }
}
