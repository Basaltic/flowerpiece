import PieceTreeNode from '../src/pieceTreeNode'

/**
 * Helper Functions to make debuger easier
 */
export default class PieceTreeTest {
  /**
   * The Height Of The subtree
   * @param node
   */
  height(node: PieceTreeNode) {
    if (node.isNil) {
      return 0
    } else {
      const lh: number = this.height(node.left)
      const rh: number = this.height(node.right)

      if (lh > rh) {
        return lh + 1
      } else {
        return rh + 1
      }
    }
  }

  printLevelOrder(root: PieceTreeNode) {
    const h = this.height(root)
    for (let i = 1; i <= h; i++) {
      const list: string[] = []
      this.printGivenLevel(root, i, list)
      console.log(list.join('  '))
    }
  }

  printGivenLevel(root: PieceTreeNode, level: number, list: string[]) {
    if (root.isNil) {
      list.push('n')
      return
    }
    if (level === 1) {
      list.push(
        `${root.leftLineFeeds},${root.leftSize},${root.piece.length},${root.rightSize},${root.rightLineFeeds},${root.piece.lineFeedCnt}`,
      )
    } else if (level > 1) {
      this.printGivenLevel(root.left, level - 1, list)
      this.printGivenLevel(root.right, level - 1, list)
    }
  }
}
