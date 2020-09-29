import { createEmptyParagraphList } from './util'

it('PieceTable: findNode', () => {
  const list = createEmptyParagraphList()

  for (let i = 0; i < 10; i++) {
    const position = list.find(i)
    expect(position.reminder).toBe(0)
    expect(position.startOffset).toBe(i)
    expect(position.startLineFeedCnt).toBe(i)
  }
})
