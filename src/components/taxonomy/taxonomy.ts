import { defineComponent, PropType } from "vue";

import TreeItem from "@/components/tree-item/tree-item.vue";
import ButtonRegular from "@/components/snippets/ButtonRegular.vue";
import { DeepNode } from "@/models/node/deep-node";

export default defineComponent({
  name: "Taxonomy",

  components: { TreeItem, ButtonRegular },

  props: {
    rootNodes: {
      type: Array as PropType<Array<DeepNode>>,
      required: true,
    },

    selectedNode: Object as PropType<DeepNode>,
  },

  emits: {
    select(node: DeepNode) {
      return true;
    },

    createNode() {
      return true;
    },
  },
});
