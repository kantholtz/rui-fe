<template>
  <span
    class="inline-block text-center w-6 h-6 mr-2 pb-1 rounded-lg transition-colors duration-150"
    :class="classes"
  >
    {{ label }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    label: String,
    kind: String,
  },

  computed: {
    classes: function () {
      const defs: { [key: string]: string[] } = {
        grey: ["bg-gray-200", "text-gray-200"],
        sky: [
          "bg-sky-400",
          "text-sky-100",
          "hover:bg-sky-700",
          "hover:text-white",
        ],
        orange: [
          "bg-orange-300",
          "text-orange-100",
          "hover:bg-orange-600",
          "hover:text-white",
        ],
      };

      return defs[this.kind || "grey"];
    },
  },
});
</script>
