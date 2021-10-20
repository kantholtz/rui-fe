import {flushPromises, shallowMount} from '@vue/test-utils'

import PredictionCard from '@/components/prediction-card/prediction-card.vue'
import PredictionsPage from '@/pages/predictions-page/predictions-page.vue'
import TreeItem from '@/components/tree-item/tree-item.vue'
import {PostNode} from '@/models/node/post-node'

import {CandidateWithPredictions} from '@/models/prediction/candidate-with-predictions'
import {DeepNode} from '@/models/node/deep-node'
import {Entity} from '@/models/entity/entity'
import {PostEntity} from '@/models/entity/post-entity'
import {PredictionResponse} from '@/models/prediction/prediction-response'
import {createFetchResponse, mockFetchResponse} from '../../../tests/unit/util'

const entityAa1: Entity = {id: 1, nodeId: 1, name: 'Aa-1', matchesCount: 2}
const nodeAa: DeepNode = {id: 1, parentId: 0, entities: [entityAa1], children: []}

const entityAb1: Entity = {id: 2, nodeId: 2, name: 'Ab-1', matchesCount: 2}
const nodeAb: DeepNode = {id: 2, parentId: 0, entities: [entityAb1], children: []}

const entityA1: Entity = {id: 0, nodeId: 0, name: 'A-1', matchesCount: 2}
const nodeA: DeepNode = {id: 0, parentId: null, entities: [entityA1], children: [nodeAa, nodeAb]}

const entityBa1: Entity = {id: 4, nodeId: 4, name: 'Ba-1', matchesCount: 1}
const entityBa2: Entity = {id: 5, nodeId: 4, name: 'Ba-2', matchesCount: 1}
const entityBa3: Entity = {id: 6, nodeId: 4, name: 'Ba-3', matchesCount: 0}
const entityBa4: Entity = {id: 7, nodeId: 4, name: 'Ba-4', matchesCount: 1}
const entityBa5: Entity = {id: 8, nodeId: 4, name: 'Ba-5', matchesCount: 1}
const nodeBa: DeepNode = {
    id: 4,
    parentId: 3,
    entities: [entityBa1, entityBa2, entityBa3, entityBa4, entityBa5],
    children: []
}

const entityBb1: Entity = {id: 9, nodeId: 5, name: 'Bb-1', matchesCount: 1}
const entityBb2: Entity = {id: 10, nodeId: 5, name: 'Bb-2', matchesCount: 1}
const nodeBb: DeepNode = {id: 5, parentId: 3, entities: [entityBb1, entityBb2], children: []}

const entityB1: Entity = {id: 3, nodeId: 3, name: 'B-1', matchesCount: 1}
const nodeB = {id: 3, parentId: null, entities: [entityB1], children: [nodeBa, nodeBb]}

const entityC1: Entity = {id: 11, nodeId: 6, name: 'C-1', matchesCount: 1}
const nodeC = {id: 6, parentId: null, entities: [entityC1], children: []}

const getNodesResponse = [nodeA, nodeB, nodeC]

const prediction1: CandidateWithPredictions = {
    candidate: 'Erat imperdiet sed euismod nisi porta lorem mollis .',
    dismissed: false,
    parentPredictions: [{score: 1.0, node: nodeA}],
    synonymPredictions: []
}

const prediction2: CandidateWithPredictions = {
    candidate: 'Tempor orci dapibus ultrices in iaculis nunc sed .',
    dismissed: false,
    parentPredictions: [],
    synonymPredictions: [{score: 1.0, node: nodeA}]
}

const prediction3: CandidateWithPredictions = {
    candidate: 'Porta lorem mollis aliquam ut porttitor leo a diam .',
    dismissed: false,
    parentPredictions: [],
    synonymPredictions: [{score: 1.0, node: nodeA}]
}

const getPredictionsResponse: PredictionResponse = {
    totalPredictions: 3,
    predictions: [prediction1, prediction2, prediction3]
}

const getPredictionsResponseWithoutAnnotatedPrediction: PredictionResponse = {
    totalPredictions: 2,
    predictions: [prediction1, prediction2]
}

it('Render', async() => {

    //
    // GIVEN the backend with the following endpoints:
    // - GET    /nodes
    // - GET    /nodes/:nodeId/predictions
    //

    global.fetch = jest.fn()
        // GET /nodes
        .mockImplementationOnce(mockFetchResponse("/nodes", getNodesResponse))
        // GET /nodes/0/predictions?offset=0&limit=3
        .mockImplementationOnce(mockFetchResponse("/nodes/0/predictions?offset=0&limit=3", getPredictionsResponse))

    //
    // GIVEN the predictions page with some predictions
    //

    const wrapper = await shallowMount(PredictionsPage, {
        global: {mocks: {$route: {params: {node: nodeA.id}}}}
    })

    await flushPromises()

    //
    // THEN  the node should be shown in the taxonomy
    // AND   the predictions should be shown
    //

    const treeItem = wrapper.findComponent(TreeItem)
    expect(treeItem.vm.node.entities[0].name).toBe(entityA1.name)

    expect(wrapper.findAllComponents(PredictionCard)).toHaveLength(getPredictionsResponse.totalPredictions)
})

it('Annotate synonym prediction', async () => {

    //
    // GIVEN the backend with the following endpoints:
    // - POST   /entities
    // - GET    /nodes
    // - GET    /nodes/:nodeId/predictions
    // - PATCH  /predictions
    //

    const entityA2: Entity = {id: 0, nodeId: 0, name: 'A-2', matchesCount: 2}
    const nodeAWithEntityA2: DeepNode = {id: 0, parentId: null, entities: [entityA1, entityA2], children: [nodeAa, nodeAb]}
    const getNodesResponseWithEntityA2 = [nodeAWithEntityA2, nodeB, nodeC]

    global.fetch = jest.fn()
        // GET /nodes
        .mockImplementationOnce(mockFetchResponse("/nodes", getNodesResponse))
        // GET /nodes/0/predictions?offset=0&limit=3
        .mockImplementationOnce(mockFetchResponse("/nodes/0/predictions?offset=0&limit=3", getPredictionsResponse))
        // POST /entities
        .mockImplementationOnce(mockFetchResponse("/entities", {}))
        // GET /nodes
        .mockImplementationOnce(mockFetchResponse("/nodes", getNodesResponseWithEntityA2))
        // GET /nodes/0/predictions?offset=0&limit=3
        .mockImplementationOnce(mockFetchResponse("/nodes/0/predictions?offset=0&limit=3", getPredictionsResponseWithoutAnnotatedPrediction))

    //
    // GIVEN the predictions page with some predictions
    //

    const wrapper = await shallowMount(PredictionsPage, {
        global: {mocks: {$route: {params: {node: nodeA.id}}}}
    })

    await flushPromises()

    //
    // WHEN  a prediction card emits a "createEntity" event
    //

    const postEntity: PostEntity = {nodeId: nodeA.id, name: 'A-2'}

    await wrapper.findAllComponents(PredictionCard)[0].vm.$emit('createEntity', postEntity)

    await flushPromises()

    //
    // THEN  POST /nodes should have been called
    // AND   the node should be added to the taxonomy
    // AND   the prediction should vanish
    //

    const treeItem = wrapper.findComponent(TreeItem)
    expect(treeItem.vm.node.entities[1].name).toBe('A-2')

    expect(wrapper.findAllComponents(PredictionCard)).toHaveLength(2)
})

it('Annotate child prediction', async () => {

    //
    // GIVEN the backend with the following endpoints:
    // - GET    /nodes
    // - POST   /nodes
    // - GET    /nodes/:nodeId/predictions
    // - PATCH  /predictions
    //

    const entityAc1: Entity = {id: 12, nodeId: 7, name: 'Ac-1', matchesCount: 0}
    const nodeAc: DeepNode = {id: 7, parentId: 0, entities: [entityAc1], children: []}
    const nodeAWithChildNodeAc: DeepNode = {id: 0, parentId: null, entities: [entityA1], children: [nodeAa, nodeAb, nodeAc]}
    const getNodesResponseWithChildNodeAc = [nodeAWithChildNodeAc, nodeB, nodeC]

    global.fetch = jest.fn()
        // GET /nodes
        .mockImplementationOnce(mockFetchResponse("/nodes", getNodesResponse))
        // GET /nodes/0/predictions?offset=0&limit=3
        .mockImplementationOnce(mockFetchResponse("/nodes/0/predictions?offset=0&limit=3", getPredictionsResponse))
        // POST /nodes
        .mockImplementationOnce(mockFetchResponse("/nodes", {}))
        // GET /nodes
        .mockImplementationOnce(mockFetchResponse("/nodes", getNodesResponseWithChildNodeAc))
        // GET /nodes/0/predictions?offset=0&limit=3
        .mockImplementationOnce(mockFetchResponse("/nodes/0/predictions?offset=0&limit=3", getPredictionsResponseWithoutAnnotatedPrediction))

    //
    // GIVEN the predictions page with some predictions
    //

    const wrapper = shallowMount(PredictionsPage, {
        global: {mocks: {$route: {params: {node: '0'}}}}
    })

    await flushPromises()

    //
    // WHEN  a prediction emits a "createNode" event
    //

    const postNode: PostNode = {parentId: nodeA.id, entities: [{name: 'foo'}]}

    await wrapper.findAllComponents(PredictionCard)[0].vm.$emit('createNode', postNode)

    await flushPromises()

    //
    // THEN  POST /nodes should have been called
    // AND   the node should be added to the taxonomy
    // AND   the prediction should vanish
    //

    const treeItem = wrapper.findComponent(TreeItem)
    expect(treeItem.vm.node.children[2].entities[0].name).toBe(entityAc1.name)

    expect(wrapper.findAllComponents(PredictionCard)).toHaveLength(2)
})
