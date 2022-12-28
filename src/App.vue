<script setup lang="ts">
import Information from "./components/Information.vue";
import Visualization from "./components/Visualization.vue";
</script>

<template>
  <section
    class="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-x-2 md:divide-y-0 divide-dashed"
  >
    <Visualization @sort="updateSort" @line="updateLine" />
    <Information :sortType="sort" :currentLine="line" />
  </section>
  <!-- <RouterView /> -->
</template>

<script lang="ts">
export default {
  data() {
    return {
      sort: "Insertion",
      description: "Insertion sort",
      line: 0,
    };
  },
  methods: {
    updateSort(selected: string) {
      this.sort = selected;
    },
    updateLine(line: number) {
      this.line = line;
    },
  },
};
</script>

<style scoped>
section {
  height: 100%;
}
</style>
