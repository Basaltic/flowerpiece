/**
 * Text String Buffer
 */
export class StringBuffer {
    // Text String
    buffer: string

    get length() {
        return this.buffer.length
    }

    constructor(buffer: string) {
        this.buffer = buffer
    }

    /**
     * Append New Text
     *
     * @param text
     */
    append(text: string) {
        const oldLength = this.buffer.length
        this.buffer = this.buffer.concat(text)

        return {
            start: oldLength,
            length: text.length,
        }
    }
}
