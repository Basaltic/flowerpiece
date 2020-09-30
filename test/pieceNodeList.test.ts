import { createEmptyParagraphList, createEmptyTableParagraphList } from './util'

it('PieceNodeList: find1', () => {
  const root = createEmptyParagraphList()

  if (root.children) {
    const list = root.children
    for (let i = 0; i < 10; i++) {
      const position = list.find(i)
      expect(position.reminder).toBe(0)
      expect(position.startOffset).toBe(i)
    }
  }
})

it('PieceNodeList: find2', () => {
  const root = createEmptyTableParagraphList()

  if (root.children) {
    const list = root.children

    let position = list.find(0)
    expect(position.reminder).toBe(0)
    expect(position.startOffset).toBe(0)
    expect(position.node.piece.meta).toEqual({ type: 'p' })

    for (let i = 1; i < 5; i++) {
      position = list.find(i)
      expect(position.reminder).toBe(i - 1)
      expect(position.startOffset).toBe(1)
      expect(position.node.piece.meta).toEqual({ type: 'table' })
    }

    position = list.find(5)
    expect(position.reminder).toBe(0)
    expect(position.startOffset).toBe(5)
    expect(position.node.piece.meta).toEqual({ type: 'p' })
  }
})

it('PieceNodeList: splitNode', () => {
  const root = createEmptyParagraphList()
})
