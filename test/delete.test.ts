import { PieceTree } from '../src/pieceTree'

it('Delete Line', () => {
  const tree = new PieceTree()

  tree.insert(0, 'aaaa\nbbbb\ncccc\ndddd\n')

  tree.deleteLine(1)
})

it('Delete： Corner Case', () => {
  const tree = new PieceTree()

  tree.insert(0, 'aa')

  tree.delete(0, 2)
  tree.delete(0, 1)

  tree.insert(0, 'aaa')

  tree.delete(6, 1)
})
