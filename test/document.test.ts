import { Document } from '../src/pieceNode.document'
import { Paragraph } from '../src/pieceNode.paragraph'
import { Text } from '../src/pieceNode.text'

it('Document findLeafNode', () => {
  const document = new Document()

  const paragraph = new Paragraph({})
  const text = new Text(0, 0, 10, {})

  paragraph.appendChild(text)
  document.appendChild(paragraph)

  const pos = document.findLeafNode(5)
  if (pos) {
    expect(pos.node).toBe(text)
  }
})
