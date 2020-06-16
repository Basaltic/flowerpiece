import { PieceTree } from '../src/pieceTree'
import { Model } from '../src/flowerpiece'

it('findByOffset', () => {
  const model = new Model()
  const { operations, queries } = model

  operations.insertText(0, 'a')
  operations.insertLineBreak(1, {})
})
