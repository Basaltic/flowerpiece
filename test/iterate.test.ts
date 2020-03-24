import { PieceTree } from '../src/flowerpiece'
import { IPiece } from '../src/piece'

const log = console.log

it('iterate test 1', () => {
  const tree = new PieceTree()

  const text = 'This is a test paragraph.\n这是测试段落，只有文字\n'

  tree.insert(0, text)
  expect(tree.getAllText()).toBe(text)

  const lines: IPiece[][] = []
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
})

it('get test 1', () => {
  const tree = new PieceTree()

  const text = 'This is a test paragraph.\n这是测试段落，只有文字\n'
  tree.insert(0, text)

  let line = tree.getLine(1)
  expect(line).toEqual([{ text: 'This is a test paragraph.', length: 25, meta: null }])

  line = tree.getLine(2)
  expect(line).toEqual([{ text: '这是测试段落，只有文字', length: 11, meta: null }])

  line = tree.getLine(3)
  expect(line).toEqual([{ text: '', length: 0, meta: null }])

  line = tree.getLine(0)
  expect(line).toEqual([{ text: 'This is a test paragraph.', length: 25, meta: null }])

  line = tree.getLine(4)
  expect(line).toEqual([{ text: '', length: 0, meta: null }])
})
