import { defineComponent } from "vue";

import PredictionCard from "@/components/prediction-card/prediction-card.vue";
import TreeItem from "@/components/tree-item/tree-item.vue";
import ColHeader from "@/components/snippets/ColHeader.vue";

import { DeepNode } from "@/models/node/deep-node";
// import { EntityService } from "@/services/entity-service";
import { NodeService } from "@/services/node-service";
// import { PostEntity } from "@/models/entity/post-entity";
// import { PostNode } from "@/models/node/post-node";

import { PredictionResponse } from "@/models/prediction";
import { PredictionService } from "@/services/prediction-service";

export default defineComponent({
  name: "PredictionsPage",

  components: {
    PredictionCard,
    TreeItem,
    ColHeader,
  },

  data() {
    return {
      nid: null as number | null,

      root: null as DeepNode | null,
      node: null as DeepNode | null,

      predictions: null as PredictionResponse | null,
    };
  },

  mounted() {
    this.nid = Number(this.$route.params.node);
    this.loadRootNode(this.nid);

    this.$watch(
      () => this.$route.params,
      () => {
        this.nid = Number(this.$route.params.node);
        this.loadRootNode(this.nid);
      }
    );
  },

  methods: {
    loadRootNode(nid: number): void {
      NodeService.getNodes().then((roots: DeepNode[]) => {
        this.findRootNode(roots, nid);
        this.loadPredictions(nid);
      });
    },

    loadPredictions(nid: number): void {
      const limit = 10;

      PredictionService.getPredictions(nid, 0, limit).then(
        (predictionResponse: PredictionResponse) => {
          this.predictions = predictionResponse;
        }
      );
    },

    findRootNode(roots: DeepNode[], nid: number): void {
      for (const root of roots) {
        const node = this.findNode(root, nid);

        if (node) {
          this.root = root;
          this.node = node;
          break;
        }
      }
    },

    findNode(node: DeepNode, nid: number): DeepNode | null {
      if (node.id === nid) {
        return node;
      }

      for (const child of node.children) {
        const foundNode = this.findNode(child, nid);

        if (foundNode) {
          return foundNode;
        }
      }

      return null;
    },

    /**
     * Dismiss the prediction with the specified candidate and reload the predictions.
     *
     * Expects nid to be set.
     */
    // dismissPredictions(candidate: string): void {
    //   const nid = this.nid!;

    //   const predictionPatch: PredictionPatch = { dismissed: true };

    //   this.startLoading("Updating prediction...");
    //   PredictionService.patchPrediction(candidate, predictionPatch).then(() => {
    //     this.loadPredictions(nid, this.offset, 3);
    //     this.stopLoading("Updating prediction...");
    //   });
    // },

    /**
     * Post entity via EntityService and reload the taxonomy. Also, dismiss the
     * annotated prediction and reload the predictions.
     *
     * Expects nid and predictions to be set.
     */
    // createEntityAndDismissPrediction(index: number, postEntity: PostEntity) {
    //   const nid = this.nid!;
    //   const predictions = this.predictions!;

    //   const candidate = predictions[index].candidate;
    //   const predictionPatch: PredictionPatch = { dismissed: true };

    //   this.startLoading("Updating prediction...");
    //   PredictionService.patchPrediction(candidate, predictionPatch).then(() => {
    //     this.startLoading("Creating entity...");
    //     EntityService.postEntity(postEntity).then(() => {
    //       this.loadRootNode(nid);

    //       this.stopLoading("Creating entity...");
    //     });

    //     this.stopLoading("Updating prediction...");
    //   });
    // },

    /**
     * Post node via NodeService and reload the taxonomy. Also, dismiss the
     * annotated prediction and reload the predictions.
     *
     * Expects nid and predictions to be set.
     */
    // createNodeAndDismissPrediction(index: number, postNode: PostNode) {
    //   const nid = this.nid!;
    //   const predictions = this.predictions!;

    //   const candidate = predictions[index].candidate;
    //   const predictionPatch: PredictionPatch = { dismissed: true };

    //   this.startLoading("Updating prediction...");
    //   PredictionService.patchPrediction(candidate, predictionPatch).then(() => {
    //     this.startLoading("Creating node...");
    //     NodeService.postNode(postNode).then(() => {
    //       this.loadRootNode(nid);

    //       this.stopLoading("Creating node...");
    //     });

    //     this.stopLoading("Updating prediction...");
    //   });
    // },
  },
});
