import { defineComponent, PropType } from "vue";
import { getNodeName, DeepNode } from "@/models/node";

import ButtonRegular from "@/components/snippets/ButtonRegular.vue";
import ButtonKnob from "@/components/snippets/ButtonKnob.vue";

import { Prediction, Annotation } from "@/models/prediction";

export default defineComponent({
  name: "PredictionCard",

  components: { ButtonRegular, ButtonKnob },
  emits: ["dismiss", "annotate", "close", "filter"],

  props: {
    relation: { type: String, required: true },
    node: { type: Object as PropType<DeepNode>, required: true },
    nodes: { type: Array as PropType<Array<DeepNode>>, required: true },
    prediction: { type: Object as PropType<Prediction>, required: true },
  },

  data() {
    return {
      tokens: undefined as undefined | string[],
      tokenSelections: undefined as undefined | boolean[],
      getNodeName: getNodeName,

      // annotation form
      selectedPhrase: "",
      selectedNid: this.node.nid,
      selectedRelation: this.relation,

      // state
      submittedAnnotation: false,
      submittedFilter: false,
      duplicates: null as number | null,
      filtered: null as number | null,
    };
  },

  computed: {
    formattedScore: function () {
      return (
        this.prediction.scoreNorm.toFixed(2) +
        " (" +
        this.prediction.score.toFixed(2) +
        ")"
      );
    },
    hasAnnotation: function () {
      return this.selectedPhrase !== "";
    },
    submitted: function () {
      return this.submittedAnnotation || this.submittedFilter;
    },
  },

  watch: {
    prediction: {
      immediate: true,
      handler(prediction: Prediction) {
        this.tokens = prediction.context.split(" ");
        this.tokenSelections = new Array<boolean>(this.tokens.length).fill(
          false
        );
      },
    },

    tokenSelections: {
      deep: true,
      handler(tokenSelections: boolean[]) {
        const tokens = this.tokens!;

        this.selectedPhrase = tokenSelections
          .map((tokenSelection, index) =>
            tokenSelection ? tokens[index] : null
          )
          .filter((token) => token !== null)
          .join(" ");
      },
    },
  },

  methods: {
    annotate: function () {
      const annotation: Annotation = {
        nid: this.selectedNid,
        relation: this.selectedRelation,
        phrase: this.selectedPhrase,
      };

      this.submittedAnnotation = true;
      this.$emit("annotate", annotation, (duplicates: number) => {
        this.duplicates = duplicates;
      });
    },

    filter: function () {
      this.submittedFilter = true;
      this.$emit("filter", this.selectedPhrase, (filtered: number) => {
        this.filtered = filtered;
      });
    },
  },
});
