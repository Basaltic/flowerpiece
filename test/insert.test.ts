import { PieceTree, IPieceMeta } from '../src/flowerpiece'

it('Insert At Start of Document', () => {
  const tree = new PieceTree()

  // Insert Plain Text
  tree.insert(0, 'aaaabbbb')
  let text = tree.getText()
  expect(text).toBe('aaaabbbb')

  tree.insert(0, 'ccc')
  text = tree.getText()
  expect(text).toBe('cccaaaabbbb')

  tree.insert(0, 'aa\nac\n')
  text = tree.getText()
  expect(text).toBe('aa\nac\ncccaaaabbbb')
})

it('Insert At Document: Continously Input, Middle And End Input', () => {
  const tree = new PieceTree()

  let txt = ''
  for (let i = 0; i < 5; i++) {
    tree.insert(i, 'a')
    txt += 'a'
  }

  expect(tree.getText()).toBe(txt)
  expect(tree.getPieces().length).toBe(1)

  tree.insert(txt.length, 'bbb')
  expect(tree.getText()).toBe(`${txt}bbb`)

  tree.insert(txt.length + 3, 'bbb\nccc\n')
  expect(tree.getText()).toBe(`${txt}bbbbbb\nccc\n`)

  expect(tree.getPieces().length).toBe(4)

  tree.insert(txt.length, 'ddd')
  expect(tree.getText()).toBe(`${txt}dddbbbbbb\nccc\n`)

  tree.insert(txt.length + 1, 'ee\nee\ne')
  expect(tree.getText()).toBe(`${txt}dee\nee\neddbbbbbb\nccc\n`)

  tree.insert(txt.length + 4, 'ff\nff\n')
  expect(tree.getText()).toBe(`${txt}dee\nff\nff\nee\neddbbbbbb\nccc\n`)
})
