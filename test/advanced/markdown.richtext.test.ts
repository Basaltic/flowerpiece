import { PieceMeta, Model } from '../../src/flowerpiece'

it('Insert: Rich Text Case', () => {
  const h1Meta: PieceMeta = { type: 'h1' }
  const h2Meta: PieceMeta = { type: 'h2' }
  const h3Meta: PieceMeta = { type: 'h3' }
  const textMeta: PieceMeta = { type: 'text' }
  const imageMeta: PieceMeta = { type: 'image', width: 500, height: 500 }

  const model = new Model()
  const { operations, queries } = model

  operations.insert(0, '123456789\n1234')
  operations.insert(0, '# ')
  operations.delete(0, 2)

  console.log(queries.getPieces())

  operations.formatLine(1, h1Meta)
  operations.formatInLine(1, h1Meta)
  operations.formatInLine(2, h1Meta)

  let line = queries.getLine(1)
  console.log(line)
  console.log(queries.getLine(2))
  // expect(line.meta).toEqual(h1Meta)
})
