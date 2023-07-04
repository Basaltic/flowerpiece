import { PieceNode } from 'piece-node'

/**
 * Record the nodes that has any changes need to rerender after operation
 */
export class PendingRenderNodes {
    private nodeMap: { [key: string]: PieceNode }

    public constructor() {
        this.nodeMap = {}
    }

    /**
     * Add pending render node
     * @param node
     */
    public add(node: PieceNode) {
        if (this.nodeMap[node.id]) {
            return
        } else {
            this.nodeMap[node.id] = node
        }
    }

    /**
     * Trigger Render For All nodes. and clear the nodes
     */
    public toRender() {
        Object.keys(this.nodeMap).forEach(id => {
            this.nodeMap[id].render()
        })

        this.nodeMap = {}
    }
}
