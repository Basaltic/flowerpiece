import { Document } from '../src/pieceNode.document'
import { Paragraph } from '../src/pieceNode.paragraph'
import { Text } from '../src/pieceNode.text'

it('Paragraph Piece Node Split', () => {
  const doc = new Document()
  const p1 = new Paragraph({})

  const t1 = new Text({ bufferIndex: 0, start: 0, length: 10, meta: {} })
  const t2 = new Text({ bufferIndex: 0, start: 0, length: 10, meta: {} })
  const t3 = new Text({ bufferIndex: 0, start: 0, length: 10, meta: {} })
  const t4 = new Text({ bufferIndex: 0, start: 0, length: 10, meta: {} })

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
