import {DeepNode} from '@/models/node/deep-node'
import {NodePatch} from '@/models/node/node-patch'
import {PostNode} from '@/models/node/post-node'

export const NodeService = {

    getNodes(): Promise<DeepNode[]> {
        return fetch(`${process.env.VUE_APP_API_URL}/nodes`)
            .then(response => {
                const data = response.json()
                console.debug(data)
                return data
            })
            .catch(error => console.error(error))
    },

    postNode(postNode: PostNode): Promise<void> {
        const fetchOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(postNode)
        }

        return fetch(`${process.env.VUE_APP_API_URL}/nodes`, fetchOptions)
            .then(response => console.debug(response))
            .catch(error => console.error(error))
    },

    deleteNode(nodeId: number): Promise<void> {
        const fetchOptions = {
            method: 'DELETE'
        }

        return fetch(`${process.env.VUE_APP_API_URL}/nodes/${nodeId}`, fetchOptions)
            .then(response => console.debug(response))
            .catch(error => console.error(error))
    }
}
