import { PieceNode } from '../src/pieceNode'
import { NodeFactory } from './util.factory'

it('PieceTable: findNode', () => {
  const root = NodeFactory.createRootNode()

  const nodes: PieceNode[] = []
  const tNodes: PieceNode[] = []
  for (let i = 0; i < 10; i++) {
    const pNode = NodeFactory.createParagraphNode()
    const tNode = NodeFactory.createTextNode(`${i}bc\n`)
    root.appendChild(pNode)
    pNode.appendChild(tNode)

    nodes.push(pNode)
    tNodes.push(tNode)
  }
})
