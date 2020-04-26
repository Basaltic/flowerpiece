import { PieceTree } from '../src/pieceTree'

it('Delete Line', () => {
  const tree = new PieceTree()

  tree.insert(0, 'aaaa\nbbbb\ncccc\ndddd\n')

  tree.deleteLine(1)
})
