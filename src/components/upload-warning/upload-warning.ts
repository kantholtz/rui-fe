import { defineComponent } from "vue";

import ButtonRegular from "@/components/snippets/ButtonRegular.vue";

export default defineComponent({
  name: "UploadWarning",
  components: { ButtonRegular },

  emits: {
    cancel() {
      return true;
    },

    overwrite() {
      return true;
    },
  },

  methods: {
    onCancel(): void {
      this.$emit("cancel");
    },

    onOverwrite(): void {
      this.$emit("overwrite");
    },
  },
});
