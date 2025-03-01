import { defineComponent, PropType } from "vue";

import TreeItem from "@/components/tree-item/tree-item.vue";
import ButtonRegular from "@/components/snippets/ButtonRegular.vue";
import { DeepNode } from "@/models/node";

export default defineComponent({
  name: "Taxonomy",

  components: { TreeItem, ButtonRegular },

  props: {
    loading: { type: Boolean, required: true },

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
