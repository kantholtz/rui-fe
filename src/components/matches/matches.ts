import { defineComponent, PropType } from "vue";

import { DeepNode } from "@/models/node";
import { Match } from "@/models/match";
import { MatchService } from "@/services/match-service";

import ButtonRegular from "@/components/snippets/ButtonRegular.vue";

export default defineComponent({
  name: "Matches",

  components: { ButtonRegular },

  props: {
    node: Object as PropType<DeepNode>,
  },

  watch: {
    node: {
      immediate: true,
      handler(newNode: DeepNode | null) {
        this.loadMatches(newNode);
      },
    },
  },

  data() {
    return {
      entityToMatchesData: {} as {
        [entity: number]: {
          name: string;
          matchesCount: number;
          matches: Match[];
        };
      },
    };
  },

  methods: {
    loadMatches(node: DeepNode | null): void {
      this.entityToMatchesData = {};

      if (node) {
        for (const entity of node.entities) {
          MatchService.getMatches(entity.eid).then((matches: Match[]) => {
            this.entityToMatchesData[entity.eid] = {
              name: entity.name,
              matchesCount: entity.matchesCount,
              matches: matches,
            };
          });
        }
      }
    },

    loadMoreMatches(eid: number): void {
      const loadedEntityMatches = this.entityToMatchesData[eid].matches;

      MatchService.getMatches(eid, loadedEntityMatches.length).then(
        (matches: Match[]) => {
          this.entityToMatchesData[eid].matches.push(...matches);
        }
      );
    },

    getMarkedContext(match: Match): string {
      const markTokens: number[] = [];

      for (let i = 0; i < match.mentionIndexes.length; i += 2) {
        const from = match.mentionIndexes[i];
        const until = match.mentionIndexes[i + 1];

        for (let j = from; j < until; j++) {
          markTokens.push(j);
        }
      }

      const contextTokens = match.context.split(" ");
      const htmlTokens: string[] = [];

      for (let i = 0; i < contextTokens.length; i++) {
        if (markTokens.indexOf(i) !== -1) {
          htmlTokens.push(
            '<span class="font-bold text-black">' + contextTokens[i] + "</span>"
          );
        } else {
          htmlTokens.push(contextTokens[i]);
        }
      }

      return htmlTokens.join(" ");
    },
  },
});
