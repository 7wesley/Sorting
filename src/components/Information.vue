<template>
  <section class="informationTab p-2 sm:p-6 pt-4">
    <p class="text-md">➤ {{ sortType }} Sort</p>
    <p class="font-bold text-xl mb-1">Description</p>
    <p class="description mb-2 leading-5">
      {{ descriptions[sortType as keyof Algorithms].info }}
    </p>
    <p
      class="text-md mb-3"
      v-html="'Time Complexity: O(' + descriptions[sortType as keyof Algorithms].complexity + ')'"
    ></p>
    <section class="flex flex-row">
      <p class="font-bold text-xl mb-1">Step by step</p>
    </section>
    <section class="code mt-2 border-gray-600 p-2">
      <p
        v-for="(line, index) in explanations[sortType as keyof Algorithms]"
        class="code-text font-bold whitespace-pre px-1"
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
        Insertion: {
          info: "Each element in the array is checked with the elements preceding it and determines which position the element should be inserted at. It does this by removing the element from it's current position and inserting it at the correct location within the sorted array.",
          complexity: "n<sup>2</sup>",
        },
        Selection: {
          info: "Divides the array into two parts, sorted and unsorted, where sorted lives on the left and unsorted on the right. The smallest element is selected from the unsorted array and swapped with the leftmost element, and then it becomes part of the sorted array. This process repeats until there are no more unsorted elements.",
          complexity: "n<sup>2</sup>",
        },
        Bubble: {
          info: 'Loops through the array and swaps elements that are out of order from left to right. This process is repeated until no elements are needed to be swapped. It\'s called bubble sort due to how larger elements "bubble" to the top of the list.',
          complexity: "n<sup>2</sup>",
        },
        Merge: {
          info: "Divides an array into smaller subarrays, sorting each subarray, and then merging the sorted subarrays back together to form the final sorted array.",
          complexity: "n log n",
        },
        Quick: {
          info: "Similar to merge sort, this algorithm divides the array into subarrays and then sorts them. It divides the array by 'pivot' points which are typically the first or last element of the array. Once a pivot is chosen, you rearrange all elements less than the pivot to the left of it, and all greater elements to the right. Repeat this process for the left and right side of the pivot until the array is sorted.",
          complexity: "log n",
        },
      } as Algorithms,
      explanations: {
        Insertion: [
          "for each unsorted element X",
          "\tfor each element Y starting @ index of X - 1",
          "\t\tif element Y > element X",
          "\t\t\tmove X to the right by 1",
          "\tinsert X here",
        ],
        Selection: [
          "for each element X",
          "\tset X as min element",
          "\tfor each unsorted element Y",
          "\t\tif Y < X",
          "\t\t\tset Y as min element",
          "\tswap X with min",
        ],
        Bubble: [
          "while sorted == false",
          "\tsorted = true",
          "\tfor each element X",
          "\t\tif X > X + 1",
          "\t\t\tswap elements",
          "\t\t\tsorted = false",
        ],
        Merge: [
          "split array in half until each sub array is 1 element",
          "while subarrays exist",
          "\tgrab 2 adjacent subarrays",
          "\tsort the subarrays and merge them together",
          "\tmerge new array back into original array",
        ],
        Quick: [
          "while array not sorted",
          "\tselect pivot value (last element)",
          "\tfor every element X starting @ pivot index",
          "\t\tif X < pivot value",
          "\t\t\tswap X with element at pivot index",
          "\t\t\tpivot index += 1",
          "\tmove the pivot value to the pivot index",
          "\tuse pivot index as start/end values next iteration",
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
  background: linear-gradient(-45deg, rgba(233, 72, 9, 0.5) 15px, white 0);
}
.description {
  font-size: 0.88rem;
}
.code-text {
  font-size: 0.96rem;
}
</style>
