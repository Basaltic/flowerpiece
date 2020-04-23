import { IPieceMeta, PieceTree } from '../src/flowerpiece'

it('Insert: Rich Text Case', () => {
  const textMeta: IPieceMeta = { type: 'text', style: { fontSize: 16 } }
  const imageMeta: IPieceMeta = { type: 'image', width: 500, height: 500, style: {} }

  const tree = new PieceTree()

  // Typing Text
  let txt = ''
  for (let i = 0; i < 5; i++) {
    tree.insert(i, 'a', null)
    txt += 'a'
  }
  expect(tree.getAllText()).toBe(txt)
  expect(tree.getPieces().length).toBe(1)

  // Insert Image
  tree.insert(2, '', imageMeta)
  expect(tree.getAllText()).toBe(txt)
  expect(tree.getPieces()[1]).toEqual({ text: '', length: 1, meta: imageMeta })

  // Insert Image in a individual line
  tree.insert(1, '\n')
  tree.insert(2, '', imageMeta)
  tree.insert(3, '\n')
  expect(tree.getAllText()).toBe('a\n\naaaa')
  expect(tree.getPieces()).toEqual([
    { text: 'a', length: 1, meta: null },
    { text: '\n', length: 1, meta: null },
    { text: '', length: 1, meta: imageMeta },
    { text: '\n', length: 1, meta: null },
    { text: 'a', length: 1, meta: null },
    { text: '', length: 1, meta: imageMeta },
    { text: 'aaa', length: 3, meta: null },
  ])

  const pieces = tree.getPieces()
  expect(pieces[2].meta === pieces[5].meta).toBe(false)

  // Format Text
  const toRed = { style: { color: 'red' } }
  tree.format(0, 3, toRed)
  const newImageMeta = { type: 'image', width: 500, height: 500, style: { color: 'red' } }
  expect(tree.getPieces()).toEqual([
    { text: 'a', length: 1, meta: toRed },
    { text: '\n', length: 1, meta: toRed },
    { text: '', length: 1, meta: newImageMeta },
    { text: '\n', length: 1, meta: null },
    { text: 'a', length: 1, meta: null },
    { text: '', length: 1, meta: imageMeta },
    { text: 'aaa', length: 3, meta: null },
  ])
})
