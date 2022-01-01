import { defineComponent } from "vue";

import Matches from "@/components/matches/matches.vue";
import NewNode from "@/components/new-node/new-node.vue";
import NodeDetails from "@/components/node-details/node-details.vue";
import Taxonomy from "@/components/taxonomy/taxonomy.vue";
import ColHeader from "@/components/snippets/ColHeader.vue";

import { getNodeName, DeepNode, PostNode } from "@/models/node";
import { PostEntity } from "@/models/entity";

import { EntityService } from "@/services/entity-service";
import { NodeService } from "@/services/node-service";

export default defineComponent({
  name: "TaxonomyPage",

  components: {
    NewNode,
    NodeDetails,
    Matches,
    Taxonomy,
    ColHeader,
  },

  data() {
    return {
      rootNodes: [] as DeepNode[],
      selectedNode: null as DeepNode | null,

      creatingNewNode: false,

      loadingMessages: [] as string[],
      showLoading: false,
      showLoadingTimeout: -1,
    };
  },

  computed: {
    nodeTitle: function (): string {
      if (this.selectedNode) {
        return `Node: ${getNodeName(this.selectedNode)} (id=${
          this.selectedNode.nid
        })`;
      }

      return "Node Details";
    },
  },

  mounted() {
    this.loadTaxonomy();
  },

  methods: {
    loadTaxonomy(): void {
      NodeService.getNodes().then((rootNodes: DeepNode[]) => {
        this.rootNodes = rootNodes;
      });
    },

    reloadTaxonomy(): void {
      if (this.selectedNode) {
        this.reloadTaxonomyWithSelectedNode(this.selectedNode);
      } else {
        this.loadTaxonomy();
      }
    },

    reloadTaxonomyWithSelectedNode(selectedNode: DeepNode): void {
      const nid = selectedNode.nid;

      function findNodeInNodes(nodes: DeepNode[], id: number): DeepNode | null {
        for (const node of nodes) {
          if (node.nid === id) {
            return node;
          }

          const foundNode = findNodeInNodes(node.children, id);

          if (foundNode) {
            return foundNode;
          }
        }

        return null;
      }

      NodeService.getNodes().then((nodes: DeepNode[]) => {
        this.rootNodes = nodes;
        this.selectedNode = findNodeInNodes(nodes, nid);
      });
    },

    selectNode(node: DeepNode): void {
      this.selectedNode = node;
      this.creatingNewNode = false;
    },

    showCreateRootNode(): void {
      this.selectedNode = null;
      this.creatingNewNode = true;
    },

    showCreateNode(): void {
      this.creatingNewNode = true;
    },

    createNode(entityNames: string[]) {
      const postNodeEntities = entityNames.map((name) => {
        return { name };
      });

      const postNode: PostNode = {
        pid: this.selectedNode ? this.selectedNode.nid : null,
        entities: postNodeEntities,
      };

      NodeService.postNode(postNode).then(() => {
        this.reloadTaxonomy();
      });

      this.creatingNewNode = false;
    },

    deleteNode(node: DeepNode): void {
      NodeService.deleteNode(node.nid).then(() => {
        if (this.selectedNode && node.nid === this.selectedNode.nid) {
          this.selectedNode = null;
        }

        this.reloadTaxonomy();
      });
    },

    createEntity(postEntity: PostEntity): void {
      EntityService.postEntity(postEntity).then(() => {
        this.reloadTaxonomy();
      });
    },

    deleteEntity(eid: number): void {
      EntityService.deleteEntity(eid).then(() => {
        this.reloadTaxonomy();
      });
    },
  },
});
