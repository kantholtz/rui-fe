import { defineComponent, PropType } from "vue";
import { getNodeName, DeepNode } from "@/models/node";

import ButtonKnob from "@/components/snippets/ButtonKnob.vue";

export default defineComponent({
  name: "TreeItem",
  components: { ButtonKnob },
  props: {
    node: {
      type: Object as PropType<DeepNode>,
      required: true,
    },

    /**
     * The selected item. If it is this item or one of its children, it
     * will be highlighted.
     */
    selectedNode: Object as PropType<DeepNode>,

    /**
     * Whether the item or its child items can be selected by the user
     */
    selectable: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    expandable(): boolean {
      return this.node.children.length > 0;
    },
    sortedChildren(): DeepNode[] {
      const nodes = this.node.children.slice();

      const fn = (n: DeepNode) => getNodeName(n).toLowerCase();
      nodes.sort((n1, n2) => (fn(n1) < fn(n2) ? -1 : 1));

      return nodes;
    },
  },

  watch: {
    selectedNode: {
      immediate: true,
      handler(selectedNode: DeepNode | null) {
        if (selectedNode) {
          const contains = this.containsNode(this.node, selectedNode);
          if (contains) {
            this.expanded = true;
          }
        }
      },
    },
  },

  emits: {
    select(node: DeepNode) {
      return true;
    },
  },

  data() {
    return {
      expanded: false,
      getNodeName: getNodeName,
    };
  },

  methods: {
    getNodeClasses() {
      const classes: string[] = [];

      if (this.selectable) {
        classes.push("cursor-pointer");
      }

      if (this.selectedNode === this.node && this.selectable) {
        classes.push("font-bold");
      }

      return classes;
    },

    containsNode(checkNode: DeepNode, searchNode: DeepNode): boolean {
      for (const child of checkNode.children) {
        if (child === searchNode) {
          return true;
        }

        const childContainsNode = this.containsNode(child, searchNode);
        if (childContainsNode) {
          return true;
        }
      }

      return false;
    },
  },
});
