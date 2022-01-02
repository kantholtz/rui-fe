import { defineComponent } from "vue";

import PredictionCard from "@/components/prediction-card/prediction-card.vue";
import TreeItem from "@/components/tree-item/tree-item.vue";
import ColHeader from "@/components/snippets/ColHeader.vue";

import { getNodeName, DeepNode } from "@/models/node";
import { NodeService } from "@/services/node-service";

import { Prediction, Predictions, Annotation } from "@/models/prediction";
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
      nid: -1,
      limit: 20,

      root: null as DeepNode | null,
      node: null as DeepNode | null,
      nodes: [] as Array<DeepNode>,

      predictions: null as Predictions | null,
    };
  },

  mounted() {
    this.initData();

    this.$watch(
      () => this.$route.params,
      () => {
        this.initData();
      }
    );
  },

  methods: {
    initData(): void {
      this.nid = Number(this.$route.params.node);

      if (this.nid === -1) {
        console.error("could not read nid from route!");
      }

      NodeService.getNodes().then((roots: DeepNode[]) => {
        // create flat array of nodes -> populates this.nodes
        // recurses pre-order
        function recurse(accum: DeepNode[], nodes: DeepNode[]) {
          nodes.forEach((node) => {
            accum.push(node);
            recurse(accum, node.children);
          });
        }

        recurse(this.nodes, roots);
        this.nodes.sort((n1, n2) =>
          getNodeName(n1) < getNodeName(n2) ? -1 : 1
        );

        // find and populate the currently active root node
        this.findRootNode(roots, this.nid);
        this.loadPredictions(this.nid);
      });
    },

    loadPredictions(nid: number): void {
      const limit = 500;

      PredictionService.getPredictions(nid, 0, limit).then(
        (predictionResponse: Predictions) => {
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
      if (node.nid === nid) {
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

    findCollection(relation: string): Prediction[] {
      if (!new Set(["synonym", "children"]).has(relation)) {
        console.error("prediction-page.findCollection: unknown", relation);
        return [];
      }

      if (this.predictions === null) {
        console.error("prediction-page.findCollection: no predictions");
        return [];
      }

      return relation === "synonym"
        ? this.predictions.synonyms
        : this.predictions.children;
    },

    dismiss(pred: Prediction, index: number, relation: string) {
      console.log("dismiss", pred, index, relation);
      if (this.predictions === null) return;
      this.findCollection(relation).splice(index, 1);
      PredictionService.delPrediction(pred.pid);
    },

    annotate(pred: Prediction, annotation: Annotation, relation: string) {
      console.log("predictions-page: annotate", pred, annotation);

      // response contains all to-be delete pids
      PredictionService.annPrediction(pred.pid, annotation).then((res) => {
        const removed = new Set(res.removed);

        // important: not annotated relation but the source list's one
        const preds = this.findCollection(relation);
        if (!preds) {
          console.error("no predictions?");
          return;
        }

        const indexes: number[] = [];
        preds.forEach((pred, index) => {
          if (removed.has(pred.pid)) indexes.push(index);
        });

        // backwards to retain previous indexes
        while (indexes.length) {
          const tbd = indexes.pop();
          if (tbd) {
            // lol typescript
            preds.splice(tbd, 1);
            console.log("removing index", tbd);
          }
        }
      });
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
