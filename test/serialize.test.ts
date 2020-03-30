import { PieceTree } from '../src/flowerpiece'
import { IPiece } from '../src/piece'

it('serialize deserialize', () => {
  const tree = new PieceTree()

  for (let i = 0; i < 26; i++) {
    const t = String.fromCharCode(i + 97)
    tree.insert(0, t)
  }

  expect(tree.getAllText()).toBe('zyxwvutsrqponmlkjihgfedcba')

  // interate and serialize to json
  const pieces = tree.getPieces()
  const pieceStr = JSON.stringify(pieces)
  const deserializePieces = JSON.parse(pieceStr) as IPiece[]

  const tree2 = new PieceTree(deserializePieces)
  expect(tree2.getAllText()).toBe('zyxwvutsrqponmlkjihgfedcba')
})
