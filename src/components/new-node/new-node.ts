import { defineComponent } from "vue";
import ButtonKnob from "@/components/snippets/ButtonKnob.vue";
import ButtonRegular from "@/components/snippets/ButtonRegular.vue";

export default defineComponent({
  name: "NewNode",

  components: { ButtonKnob, ButtonRegular },

  emits: {
    createNode(entityNames: string[]) {
      return entityNames.length > 0;
    },
  },

  data() {
    return {
      entityNames: [] as string[],
    };
  },

  methods: {
    addEntityName(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      const inputValue = inputElement.value;

      this.entityNames.push(inputValue);

      inputElement.value = "";
    },
  },
});
