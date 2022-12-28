<template>
  <section class="informationTab p-6">
    <p class="text-xs">{{ sortType }} Sort</p>
    <p class="font-bold text-xl mb-1">Description</p>
    <p class="text-xs mb-4">{{ descriptions[sortType as keyof Algorithms] }}</p>
    <section class="flex flex-row">
      <p class="font-bold text-xl mb-2">Step by step</p>
    </section>
    <section class="code mt-2 border-gray-600 p-2">
      <p
        v-for="(line, index) in explanations[sortType as keyof Algorithms]"
        class="font-bold text-sm whitespace-pre px-1"
        :class="{ 'bg-yellow-200': index == currentLine }"
      >
        {{ line }}
      </p>
    </section>
  </section>
</template>

<script lang="ts">
import type Algorithms from "@/types/Algorithms";

export default {
  props: {
    sortType: {
      type: String,
      default: "Insertion",
    },
    sortDescription: {
      type: String,
    },
    currentLine: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      descriptions: {
        Insertion: "Insertion sort",
        Selection: "Selection sort",
        Bubble: "Bubble sort",
        Merge: "Merge sort",
        Quick: "Quick sort",
      } as Algorithms,
      explanations: {
        Insertion: [
          "for each unsorted element X",
          "\tfor each element Y starting @ index of X - 1",
          "\t\tif element Y > element X",
          "\t\t\tmove X to the right by 1",
          "\t\telse",
          "\t\t\tinsert X here, break loop",
        ],
      } as Algorithms,
    };
  },
  computed: {},
};
</script>

<style>
.code {
  border: 0.125em solid rgb(75 85 99);
  border-radius: 0.75em;
}
</style>
