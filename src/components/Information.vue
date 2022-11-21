<template>
  <section class="informationTab p-6">
    <p class="text-xs">{{ sortType }} Sort</p>
    <p class="font-bold text-xl mb-4">Step by step</p>
    <font-awesome-icon icon="fa-solid fa-code" size="lg" class="" />
    <section class="code mt-2 border-gray-600"></section>
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

<style>
.code {
  border: 0.125em solid  rgb(75 85 99);
  border-radius: 0.75em;
}
</style>
