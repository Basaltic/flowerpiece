/**
 * Text String Buffer
 */
export default class StringBuffer {
  // Text String
  buffer: string

  get length() {
    return this.buffer.length
  }

  constructor(buffer: string) {
    this.buffer = buffer
  }
}
