<template>
  <section class="informationTab p-6">
    <p class="text-xs">{{ sortType }} Sort</p>
    <p class="font-bold text-xl">Step by step</p>
  </section>
</template>

<script lang="ts">
export default {
  props: {
    sortType: {
      type: String,
      default: "Insertion",
    },
  },
  data() {
    return {};
  },
};
</script>

<style></style>
