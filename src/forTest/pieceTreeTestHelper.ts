import PieceNode from '../pieceNode'

/**
 * Helper Functions to make debuger easier
 */
export default class PieceTreeTest {
  /**
   * The Height Of The subtree
   * @param node
   */
  static height(node: PieceNode) {
    if (node.isNil) {
      return 0
    } else {
      const lh: number = PieceTreeTest.height(node.left)
      const rh: number = PieceTreeTest.height(node.right)

      if (lh > rh) {
        return lh + 1
      } else {
        return rh + 1
      }
    }
  }

  static printLevelOrder(root: PieceNode) {
    const h = PieceTreeTest.height(root)
    for (let i = 1; i <= h; i++) {
      const list: string[] = []
      PieceTreeTest.printGivenLevel(root, i, list)
      console.log(list.join('  '))
    }
  }

  static printGivenLevel(root: PieceNode, level: number, list: string[]) {
    if (root.isNil) {
      list.push('n')
      return
    }
    if (level === 1) {
      list.push(
        `${root.leftLineFeeds},${root.leftSize},${root.piece.length},${root.rightSize},${root.rightLineFeeds},${root.piece.lineFeedCnt}`,
      )
    } else if (level > 1) {
      PieceTreeTest.printGivenLevel(root.left, level - 1, list)
      PieceTreeTest.printGivenLevel(root.right, level - 1, list)
    }
  }
}
