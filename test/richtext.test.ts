import { IPieceMeta, Model } from '../src/flowerpiece'

it('Insert: Rich Text Case', () => {
  const textMeta: IPieceMeta = { type: 'text', style: { fontSize: 16 } }
  const imageMeta: IPieceMeta = { type: 'image', width: 500, height: 500, style: {} }

  const model = new Model()
  const { operations, queries } = model

  // Typing Text
  let txt = ''
  for (let i = 0; i < 5; i++) {
    operations.insert(i, 'a', null)
    txt += 'a'
  }
  expect(queries.getText()).toBe(txt)
  expect(queries.getPieces().length).toBe(1)

  // Insert Image
  operations.insert(2, '', imageMeta)
  expect(queries.getText()).toBe(txt)
  expect(queries.getPieces()[1]).toEqual({ text: '', length: 1, meta: imageMeta })

  // Insert Image in a individual line
  operations.insert(1, '\n')
  operations.insert(2, '', imageMeta)
  operations.insert(3, '\n')
  expect(queries.getText()).toBe('a\n\naaaa')
  expect(queries.getPieces()).toEqual([
    { text: 'a', length: 1, meta: null },
    { text: '\n', length: 1, meta: null },
    { text: '', length: 1, meta: imageMeta },
    { text: '\n', length: 1, meta: null },
    { text: 'a', length: 1, meta: null },
    { text: '', length: 1, meta: imageMeta },
    { text: 'aaa', length: 3, meta: null },
  ])

  const pieces = queries.getPieces()
  expect(pieces[2].meta === pieces[5].meta).toBe(false)

  // Format Text
  const toRed = { style: { color: 'red' } }
  operations.format(0, 3, toRed)
  const newImageMeta = { type: 'image', width: 500, height: 500, style: { color: 'red' } }
  expect(queries.getPieces()).toEqual([
    { text: 'a', length: 1, meta: toRed },
    { text: '\n', length: 1, meta: toRed },
    { text: '', length: 1, meta: newImageMeta },
    { text: '\n', length: 1, meta: null },
    { text: 'a', length: 1, meta: null },
    { text: '', length: 1, meta: imageMeta },
    { text: 'aaa', length: 3, meta: null },
  ])
})
