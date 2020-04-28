import { Model } from '../src/flowerpiece'

it('Insert At Start of Document', () => {
  const model = new Model()
  const { operations, queries } = model

  // Insert Plain Text

  operations.insert(0, 'aaaabbbb')
  let text = queries.getText()
  expect(text).toBe('aaaabbbb')

  operations.insert(0, 'ccc')
  text = queries.getText()
  expect(text).toBe('cccaaaabbbb')

  operations.insert(0, 'aa\nac\n')
  text = queries.getText()
  expect(text).toBe('aa\nac\ncccaaaabbbb')
})

it('Insert At Document: Continously Input, Middle And End Input', () => {
  const model = new Model()
  const { operations, queries } = model

  let txt = ''
  for (let i = 0; i < 5; i++) {
    operations.insert(i, 'a')
    txt += 'a'
  }

  expect(queries.getText()).toBe(txt)
  expect(queries.getPieces().length).toBe(1)

  operations.insert(txt.length, 'bbb')
  expect(queries.getText()).toBe(`${txt}bbb`)

  operations.insert(txt.length + 3, 'bbb\nccc\n')
  expect(queries.getText()).toBe(`${txt}bbbbbb\nccc\n`)

  expect(queries.getPieces().length).toBe(4)

  operations.insert(txt.length, 'ddd')
  expect(queries.getText()).toBe(`${txt}dddbbbbbb\nccc\n`)

  operations.insert(txt.length + 1, 'ee\nee\ne')
  expect(queries.getText()).toBe(`${txt}dee\nee\neddbbbbbb\nccc\n`)

  operations.insert(txt.length + 4, 'ff\nff\n')
  expect(queries.getText()).toBe(`${txt}dee\nff\nff\nee\neddbbbbbb\nccc\n`)
})
