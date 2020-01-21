/**
 * A Piece Refer a piece of text content of the document
 */
export default class Piece {
  // Buffer Index
  bufferIndex: number
  // Raw Content Start in Current Buffer
  start: number
  // Content Length
  length: number

  // How Many Line Break In This Piece
  lineFeedCnt: number

  get end() {
    return this.start + this.length
  }

  constructor(bufferIndex: number, start: number, length: number, lineFeedCnt: number) {
    this.bufferIndex = bufferIndex
    this.start = start
    this.length = length
    this.lineFeedCnt = lineFeedCnt
  }
}
