import { PieceTree } from '../src/flowerpiece'
import { IPiece } from '../src/piece'

const log = console.log

it('iterate test 1', () => {
  const tree = new PieceTree()

  const text = 'This is a test paragraph.\n这是测试段落，只有文字\n'

  tree.insert(0, text)
  expect(tree.getAllText()).toBe(text)

  let lines: IPiece[][] = []
  let num = 1
  tree.forEachLine((line: IPiece[], lineNumber: number) => {
    expect(lineNumber).toBe(num)
    num++
    lines.push(line)
  })
  expect(lines).toEqual([
    [{ text: 'This is a test paragraph.', length: 25, meta: null }],
    [{ text: '这是测试段落，只有文字', length: 11, meta: null }],
    [{ text: '', length: 0, meta: null }],
  ])

  tree.insert(2, 'abc')

  lines = []
  num = 1
  tree.forEachLine((line: IPiece[], lineNumber: number) => {
    expect(lineNumber).toBe(num)
    num++
    lines.push(line)
  })
  expect(lines).toEqual([
    [
      { text: 'Th', length: 2, meta: null },
      { text: 'abc', length: 3, meta: null },
      { text: 'is is a test paragraph.', length: 23, meta: null },
    ],
    [{ text: '这是测试段落，只有文字', length: 11, meta: null }],
    [{ text: '', length: 0, meta: null }],
  ])
})
