<template>
  <div
    class="inline-block font-bold text-center w-6 h-6 rounded-lg transition-colors duration-300"
    :class="classes"
  >
    {{ label }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    label: String,
    kind: String,
    enabled: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    classes: function () {
      // --

      const enabledClasses: { [key: string]: string[] } = {
        grey: ["bg-gray-200", "text-gray-400"],
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
        pink: [
          "bg-pink-600",
          "text-pink-100",
          "hover:bg-pink-800",
          "hover:text-white",
        ],
      };

      const disabledClasses: { [key: string]: string[] } = {
        grey: ["bg-gray-200", "text-gray-200"],
        sky: ["bg-sky-200", "text-white"],
        orange: ["bg-orange-100", "text-white"],
        pink: ["bg-pink-300", "text-white"],
      };

      // --

      const key = this.kind || "grey";
      const selection = this.enabled
        ? enabledClasses[key]
        : disabledClasses[key];

      if (this.enabled) {
        selection.push("cursor-pointer");
      }

      return selection;
    },
  },
});
</script>
