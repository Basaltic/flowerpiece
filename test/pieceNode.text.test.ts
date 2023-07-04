import { Paragraph } from '../src/piece-node-paragraph'
import { Text } from '../src/piece-node-text'

it('Text Piece Node Split', () => {
    const paragraph = new Paragraph({})

    const text = new Text({ bufferIndex: 0, start: 0, length: 10, meta: {} })

    paragraph.appendChild(text)

    const result = text.split(2)

    expect(result).toBe(true)
    expect(paragraph.childNodeCnt).toBe(2)
    expect(text.piece.start).toBe(0)
    expect(text.piece.length).toBe(2)

    expect(text.successor().piece.start).toBe(2)
    expect(text.successor().piece.length).toBe(8)
})
