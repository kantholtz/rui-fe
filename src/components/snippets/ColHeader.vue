<template>
  <header class="mb-10 pb-3 border-b-4 border-gray-200">
    <h2 class="text-xl">{{ title }}</h2>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: String,
  },
});
</script>
