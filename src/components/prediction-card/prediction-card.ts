import { defineComponent, PropType } from "vue";
import { getNodeName, DeepNode } from "@/models/node";

import ButtonRegular from "@/components/snippets/ButtonRegular.vue";
import ButtonKnob from "@/components/snippets/ButtonKnob.vue";

import { Prediction, Annotation } from "@/models/prediction";

export default defineComponent({
  name: "PredictionCard",

  components: { ButtonRegular, ButtonKnob },
  emits: ["dismiss", "annotate"],

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

      this.$emit("annotate", annotation);
    },
  },
});

// import { AssertionError } from "assert";
// import { PostEntity } from "@/models/entity/post-entity";
// import { PostNode } from "@/models/node/post-node";
// import { getNodeName } from "@/models/node/node";

/*
export default defineComponent({
  data() {
    return {
      tokens: undefined as undefined | string[],
      tokenSelections: undefined as undefined | boolean[],

      mentionInput: "",

      selectedPrediction: undefined as
        | undefined
        | {
            type: PredictionType;
            index: number;
          },

      getNodeName,
      PredictionType,
    };
  },

  emits: {
    dismiss() {
      return true;
    },

    createEntity(postEntity: PostEntity) {
      return true;
    },

    createNode(postNode: PostNode) {
      return true;
    },
  },

  methods: {
    /**
     * Emit "createEntity" event if synonym prediction is selected or "createNode"
     * event if child prediction is selected.
     *
     * Must only be called when a prediction is selected.
     *
    annotate() {
      const selectedPrediction = this.selectedPrediction!;

      const mentionInput = this.$refs.mention as HTMLInputElement;
      const mention = mentionInput.value;

      if (selectedPrediction.type === PredictionType.SYNONYM) {
        const synonyms = this.predictions.synonyms;
        const selectedSynonymPrediction: Prediction =
          synonyms[selectedPrediction.index];
        const selectedNode = selectedSynonymPrediction.node;

        const postEntity: PostEntity = {
          nid: selectedNode.nid,
          name: mention,
        };

        this.$emit("createEntity", postEntity);
      } else if (selectedPrediction.type === PredictionType.CHILD) {
        const children = this.predictions.children;
        const selectedParentPrediction: Prediction =
          children[selectedPrediction.index];
        const selectedNode = selectedParentPrediction.node;

        const postNode: PostNode = {
          parentId: selectedNode.nid,
          entities: [{ name: mention }],
        };

        this.$emit("createNode", postNode);
      }
    },

    isPredictionSelected(type: PredictionType, index: number): boolean {
      const selectedPrediction = this.selectedPrediction!;

      return (
        type === selectedPrediction.type && index === selectedPrediction.index
      );
    },
  },

  name: "PredictionCard",

  props: {
    // predictions: {
    //   type: Object as PropType<Predictions>,
    //   required: true,
    // },

    currentNodeId: {
      type: Number,
      required: true,
    },
  },

  watch: {
    predictions: {
      immediate: true,
      handler(predictions: Predictions) {
        this.tokens = predictions.candidate.split(" ");
        this.tokenSelections = new Array<boolean>(this.tokens.length).fill(
          false
        );
      },
    },

    tokenSelections: {
      deep: true,
      handler(tokenSelections: boolean[]) {
        const tokens = this.tokens!;

        this.mentionInput = tokenSelections
          .map((tokenSelection, index) =>
            tokenSelection ? tokens[index] : null
          )
          .filter((token) => token !== null)
          .join(" ");
      },
    },

    /**
     * Select the synonym prediction for the current node. If there is none, select
     * the child prediction for the current node. There must be one or both of these.
     *
    currentNodeId: {
      immediate: true,
      handler(currentNodeId: number) {
        console.log("hello!");
        console.log(this.predictions);

        const synonyms = this.predictions.synonyms;
        for (let i = 0; i < synonyms.length; i++) {
          const synonymPrediction = synonyms[i];
          if (synonymPrediction.node.nid === currentNodeId) {
            this.selectedPrediction = {
              type: PredictionType.SYNONYM,
              index: i,
            };
            return;
          }
        }

        const children = this.predictions.children;
        for (let i = 0; i < children.length; i++) {
          const parentPrediction = children[i];
          if (parentPrediction.node.nid === currentNodeId) {
            this.selectedPrediction = { type: PredictionType.CHILD, index: i };
            return;
          }
        }

        throw "There is neither a synonym nor a parent prediction about the current node.";
      },
    },
  },
});
*/
