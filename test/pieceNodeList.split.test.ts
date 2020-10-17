import { Document } from '../src/pieceNode.document'
import { Paragraph } from '../src/pieceNode.paragraph'
import { Text } from '../src/pieceNode.text'

it('Text Piece Node Split', () => {
  const paragraph = new Paragraph({})

  const text = new Text(0, 0, 10, {})

  paragraph.appendChild(text)

  const result = text.split(2)

  expect(result).toBe(true)
  expect(paragraph.childNodeCnt).toBe(2)
  expect(text.piece.start).toBe(0)
  expect(text.piece.length).toBe(2)

  expect(text.successor().piece.start).toBe(2)
  expect(text.successor().piece.length).toBe(8)
})

it('Paragraph Piece Node Split', () => {
  const doc = new Document()
  const p1 = new Paragraph({})

  const t1 = new Text(0, 0, 10, {})
  const t2 = new Text(0, 0, 10, {})
  const t3 = new Text(0, 0, 10, {})
  const t4 = new Text(0, 0, 10, {})

  doc.appendChild(p1)
  p1.appendChild(t1, t2, t3, t4)

  expect(doc.childNodeCnt).toBe(1)

  p1.split(t2)

  expect(doc.childNodeCnt).toBe(2)

  const p2 = p1.successor()

  expect(p1.firstChild).toBe(t1)
  expect(p1.lastChild).toBe(t2)

  expect(p2.firstChild).toBe(t3)
  expect(p2.lastChild).toBe(t4)
})
