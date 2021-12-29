<template>
  <span class="px-3 py-1 rounded-lg font-bold" :class="classes">
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
        sky: ["bg-sky-400", "text-white", "hover:bg-sky-700"],
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
