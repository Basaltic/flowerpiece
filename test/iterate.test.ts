import { PieceTree } from '../src/flowerpiece'
import { Line } from '../src/piece'

it('iterate test 1', () => {
  const tree = new PieceTree()

  const text = 'This is a test paragraph.\n这是测试段落，只有文字\n'

  tree.insert(0, text)
  expect(tree.getAllText()).toBe(text)

  let lines: Line[] = tree.getLines()
  expect(lines).toEqual([
    {
      meta: null,
      pieces: [{ text: 'This is a test paragraph.', length: 25, meta: null }],
    },
    { meta: null, pieces: [{ text: '这是测试段落，只有文字', length: 11, meta: null }] },
    { meta: null, pieces: [{ text: '', length: 0, meta: null }] },
  ])

  tree.insert(2, 'abc')

  lines = tree.getLines()
  expect(lines).toEqual([
    {
      meta: null,
      pieces: [
        { text: 'Th', length: 2, meta: null },
        { text: 'abc', length: 3, meta: null },
        { text: 'is is a test paragraph.', length: 23, meta: null },
      ],
    },
    {
      meta: null,
      pieces: [{ text: '这是测试段落，只有文字', length: 11, meta: null }],
    },
    { meta: null, pieces: [{ text: '', length: 0, meta: null }] },
  ])
})
