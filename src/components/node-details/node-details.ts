import { defineComponent, PropType } from "vue";

import { DeepNode } from "@/models/node";
import { Entity, PostEntity } from "@/models/entity";

import { PredictionService } from "@/services/prediction-service";
import { Predictions } from "@/models/prediction";

import ButtonKnob from "@/components/snippets/ButtonKnob.vue";
import ButtonRegular from "@/components/snippets/ButtonRegular.vue";

export default defineComponent({
  name: "NodeDetails",
  components: { ButtonKnob, ButtonRegular },

  props: {
    node: Object as PropType<DeepNode>,
  },

  computed: {
    totalPredictions: function () {
      return (this.totalSynonyms || 0) + (this.totalChildren || 0);
    },
    hasPredictions: function () {
      return this.totalPredictions > 0;
    },
  },

  watch: {
    node: {
      immediate: true,
      handler(node: DeepNode) {
        this.resetNodeData();

        const { shallowNodeMatches, deepNodeMatches } = this.countMatches(node);

        this.shallowNodeMatches = shallowNodeMatches;
        this.deepNodeMatches = deepNodeMatches;

        this.countPredictions(node);
      },
    },
  },

  emits: {
    createNode(parent: DeepNode) {
      return true;
    },

    deleteNode(node: DeepNode) {
      return true;
    },

    createEntity(postEntity: PostEntity) {
      return true;
    },

    deleteEntity(eid: number) {
      return true;
    },
  },

  data() {
    return {
      shallowNodeMatches: null as number | null,
      deepNodeMatches: null as number | null,
      totalSynonyms: null as number | null,
      totalChildren: null as number | null,
    };
  },

  methods: {
    resetNodeData() {
      this.shallowNodeMatches = null;
      this.deepNodeMatches = null;

      this.totalSynonyms = null;
      this.totalChildren = null;
    },

    createEntity(event: Event) {
      const node = this.node!;

      const input = event.target as HTMLInputElement;

      const postEntity: PostEntity = {
        nid: node.nid,
        name: input.value,
      };

      this.$emit("createEntity", postEntity);

      input.value = "";
    },

    deleteEntity(eid: number): void {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const node = this.node!;

      if (node.entities.length > 1) {
        this.$emit("deleteEntity", eid);
      }
    },

    countMatches(node: DeepNode): {
      shallowNodeMatches: number;
      deepNodeMatches: number;
    } {
      const shallowNodeMatches = this.countShallowNodeMatches(node);
      const deepNodeMatches = this.countDeepNodeMatches(node);

      return { shallowNodeMatches, deepNodeMatches };
    },

    countShallowNodeMatches(node: DeepNode): number {
      return node.entities.reduce(
        (nodeMatches: number, entity: Entity) =>
          nodeMatches + entity.matchesCount,
        0
      );
    },

    countDeepNodeMatches(node: DeepNode): number {
      let deepMatches = this.countShallowNodeMatches(node);

      for (const child of node.children) {
        deepMatches += this.countDeepNodeMatches(child);
      }

      return deepMatches;
    },

    countPredictions(node: DeepNode) {
      PredictionService.getPredictions(node.nid).then((resp: Predictions) => {
        this.totalSynonyms = resp.totalSynonyms;
        this.totalChildren = resp.totalChildren;
      });
    },
  },
});
