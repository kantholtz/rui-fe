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
        (preds: Predictions) => {
          this.predictions = preds;
        }
      );
    },

    updatePredictionCounts() {
      if (!this.node) {
        console.error("predictions-page updatePredictionCounts(): no node set");
        return;
      }

      PredictionService.getPredictions(this.node.nid, 0, 0).then(
        (preds: Predictions) => {
          if (!this.predictions) {
            console.error(
              "predictions-page updatePredictionCounts(): no predictions"
            );
            return;
          }

          this.predictions.totalChildren = preds.totalChildren;
          this.predictions.totalSynonyms = preds.totalSynonyms;
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
      this.updatePredictionCounts();
    },

    removePredictions(preds: Prediction[], pids: number[]) {
      const removed = new Set(pids);

      const indexes: number[] = [];
      preds.forEach((pred, index) => {
        if (removed.has(pred.pid)) indexes.push(index);
      });

      // backwards to retain previous indexes
      while (indexes.length > 1) {
        const tbd = indexes.pop();
        // lol typescript
        if (tbd) {
          preds.splice(tbd, 1);
          console.log("removing index", tbd);
        }
      }

      this.updatePredictionCounts();
    },

    annotate(
      pred: Prediction,
      annotation: Annotation,
      relation: string,
      callback: (removed: number) => void
    ) {
      console.log("predictions-page: annotate", pred, annotation);

      // response contains all to-be delete pids
      PredictionService.annPrediction(pred.pid, annotation).then((res) => {
        // important: not annotated relation but the source list's one
        const preds = this.findCollection(relation);
        if (!preds) {
          console.error("predictions-page annotate(): no predictions?");
          return;
        }

        this.removePredictions(preds, res.removed);
        callback(res.removed.length);
      });
    },

    close(index: number, relation: string) {
      this.findCollection(relation).splice(index, 1);
    },

    filter(
      pred: Prediction,
      relation: string,
      phrase: string,
      callback: (filtered: number) => void
    ) {
      console.log("predictions-page: filter", pred, phrase);
      if (this.node == null) {
        console.error("predictions-page filter(): no node set");
        return;
      }

      PredictionService.filterPrediction(
        pred.pid,
        this.node.nid,
        relation,
        phrase
      ).then((res) => {
        // important: not annotated relation but the source list's one
        const preds = this.findCollection(relation);
        if (!preds) {
          console.error("no predictions?");
          return;
        }

        this.removePredictions(preds, res.removed);
        callback(res.removed.length);
      });
    },
  },
});
