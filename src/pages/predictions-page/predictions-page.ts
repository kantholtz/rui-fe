import { defineComponent, reactive } from "vue";

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

      node: null as DeepNode | null,
      nodes: [] as Array<DeepNode>,
      roots: [] as Array<DeepNode>,

      isLoading: true,

      predictions: reactive({
        totalSynonyms: 0,
        totalChildren: 0,
        synonyms: [] as Prediction[],
        children: [] as Prediction[],
      }),
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

  computed: {
    title: function (): string {
      return this.node === null
        ? "Predictions"
        : `Predictions for "${getNodeName(this.node)}"`;
    },
  },

  methods: {
    initData(): void {
      this.nid = Number(this.$route.params.node);
      this.loadNodes()
        .then(this.loadPredictions)
        .catch((err) => console.error(`catched error in initData: ${err}`));
    },

    loadPredictions(): Promise<void | Predictions> {
      const nid = this.nid;
      const limit = 500;

      if (isNaN(nid)) {
        return Promise.reject("this.nid is NaN");
      }

      return PredictionService.getPredictions(nid, 0, limit).then(
        (preds: Predictions) => {
          this.predictions.totalChildren = preds.totalChildren;
          this.predictions.totalSynonyms = preds.totalSynonyms;
          this.predictions.synonyms = preds.synonyms;
          this.predictions.children = preds.children;

          this.isLoading = false;
        }
      );
    },

    loadNodes() {
      if (this.nid === -1) {
        console.error("could not read nid from route!");
      }
      return NodeService.getNodes().then((roots: DeepNode[]) => {
        // create flat array of nodes -> populates this.nodes
        // recurses pre-order
        function flatten(accum: DeepNode[], nodes: DeepNode[]) {
          nodes.forEach((node) => {
            accum.push(node);
            flatten(accum, node.children);
          });

          return accum;
        }

        const nodes = flatten([], roots);
        const fn = (n: DeepNode) => getNodeName(n).toLowerCase();
        nodes.sort((n1, n2) => (fn(n1) < fn(n2) ? -1 : 1));

        // find and populate the currently active root node
        this.nodes = nodes;
        this.findRootNodes(roots, this.nid);

        this.roots = roots.filter((n) => n.nid !== this.node?.nid);
      });
    },

    updatePredictionCounts() {
      if (!this.node) {
        console.error("predictions-page updatePredictionCounts(): no node set");
        return;
      }

      console.log(">>> load predictions (updatePredictionCounts)");
      PredictionService.getPredictions(this.node.nid, 0, 0).then(
        (preds: Predictions) => {
          if (!this.predictions) {
            console.error(
              "predictions-page updatePredictionCounts(): no predictions"
            );
            return;
          }

          this.predictions.totalSynonyms = preds.totalSynonyms;
          this.predictions.totalChildren = preds.totalChildren;
        }
      );
    },

    findRootNodes(roots: DeepNode[], nid: number): void {
      // find currently selected node
      for (const root of roots) {
        const node = this.findNode(root, nid);

        if (node) {
          this.node = node;
          break;
        }
      }

      // retain other roots
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

    // --- commonly used by event handlers

    removePredictions(pids: Set<number>, relation: string) {
      console.log(`removing ${pids.size} prediction(s) from ${relation}`);

      const fn = (pred: Prediction) => !pids.has(pred.pid);

      if (relation === "synonym") {
        this.predictions.synonyms = this.predictions.synonyms.filter(fn);
      } else {
        this.predictions.children = this.predictions.children.filter(fn);
      }
    },

    // --- handling events

    dismiss(pred: Prediction, relation: string) {
      console.log("dismiss", pred, relation);
      this.removePredictions(new Set([pred.pid]), relation);
      PredictionService.delPrediction(pred.pid);
      this.updatePredictionCounts();
    },

    annotate(
      pred: Prediction,
      annotation: Annotation,
      relation: string,
      callback: (removed: number) => void
    ) {
      console.log("predictions-page: annotate", pred, annotation, relation);

      // response contains all to-be delete pids
      PredictionService.annPrediction(pred.pid, annotation).then((res) => {
        // remove cards from list
        const removed = new Set(res.removed);
        removed.delete(pred.pid);
        this.removePredictions(removed, relation);

        // update state
        this.loadNodes();
        this.updatePredictionCounts();
        callback(res.removed.length);
      });
    },

    close(pred: Prediction, relation: string) {
      console.log("close", pred, relation);
      this.removePredictions(new Set([pred.pid]), relation);
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
        const removed = new Set(res.removed);
        removed.delete(pred.pid);
        this.removePredictions(removed, relation);
        callback(res.removed.length);
      });
    },
  },
});
