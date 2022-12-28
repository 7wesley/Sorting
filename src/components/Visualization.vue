<template>
  <section class="visualizationTab sm:p-4 md:p-6">
    <nav>
      <ul class="flex flex-wrap">
        <li
          v-for="key in Object.keys(algorithms)"
          class="mr-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white px-2 border border-blue-500 border-b-2 hover:border-transparent rounded mt-1"
          :class="{ 'bg-blue-500 text-white': sortSelected == key }"
          @click="updateSort(key)"
        >
          <a href="#">{{ key }}</a>
        </li>
      </ul>
    </nav>
    <p class="mt-3 font-bold text-xl">
      Visualization
      <font-awesome-icon
        icon="fa-solid fa-shuffle"
        class="hover:text-blue-500 hover:cursor-pointer"
        @click="randomize"
      />
    </p>
    <main class="mt-4">
      <section class="graph flex flex-col justify-end">
        <div class="flex flex-row justify-center">
          <div
            class="flex flex-col justify-end"
            v-for="(item, index) in currentFrame.steps"
          >
            <font-awesome-icon
              icon="fa-solid fa-sort-down"
              v-if="index == currentFrame.i"
              color="red"
            />
            <font-awesome-icon
              icon="fa-solid fa-sort-down"
              v-if="index == currentFrame.j"
              color="blue"
            />
            <div
              class="graph-item border-2 border-gray-600 px-3 mx-2 rounded-t mt-1"
              :style="{ height: 18 * item + 'px' }"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </section>
      <section class="flex justify-center mt-2">
        <button
          v-for="(val, key) in icons"
          class="bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white mx-0.5 px-2 border border-blue-500 border-b-2 hover:border-transparent rounded"
          :class="{ 'bg-blue-500 text-white': mediaSelected == key }"
          @click="updatePlayer(key)"
        >
          <font-awesome-icon :icon="'fa-solid fa-' + val" />
        </button>
      </section>
    </main>
  </section>
</template>

<script lang="ts">
import type Frames from "@/types/Frames";
import type Controls from "@/types/Controls";
import AlgorithmsClass from "@/classes/Algorithms";

export default {
  data() {
    return {
      items: [6, 3, 7, 5, 9, 8],
      currentFrame: {} as Frames,
      sortSelected: "",
      mediaSelected: "",
      frames: new Array<Frames>(),
      frameIndex: 0,
      icons: {
        play: "play",
        pause: "pause",
        next: "forward-step",
        back: "backward-step",
        restart: "rotate",
      } as Controls,
      algorithms: new AlgorithmsClass(),
    };
  },
  watch: {
    sortSelected() {
      this.redoSorting();
    },
  },
  methods: {
    updateSort(selected: string) {
      this.sortSelected = selected;
      this.$emit("sort", selected);
    },
    async updatePlayer(selected: string) {
      if (this.mediaSelected == selected && this.mediaSelected == "play") {
        return;
      }

      this.mediaSelected = selected;

      this.playFrames();
    },
    async playFrames() {
      while (
        this.mediaSelected == "play" &&
        this.frameIndex < this.frames.length - 1
      ) {
        this.updateFrame(this.frameIndex + 1);
        await new Promise((r) => setTimeout(r, 500));
      }

      if (
        this.mediaSelected == "next" &&
        this.frameIndex < this.frames.length - 1
      ) {
        this.updateFrame(this.frameIndex + 1);
      } else if (this.mediaSelected == "back" && this.frameIndex >= 1) {
        this.updateFrame(this.frameIndex - 1);
      } else if (this.mediaSelected == "restart") {
        this.updateFrame(0);
      }
    },
    updateFrame(index: number) {
      this.frameIndex = index;
      this.currentFrame = this.frames[this.frameIndex];
      this.$emit("line", this.currentFrame.currentLine);
    },
    randomize() {
      let set: Set<number> = new Set<number>();

      while (set.size !== 6) {
        set.add(Math.floor(Math.random() * 8) + 2);
      }
      this.items = [...set];
      this.redoSorting();
    },
    redoSorting() {
      this.frames = [];
      this.frameIndex = 0;
      this.saveStep(this.items, -1, -1, 0);
      this.currentFrame = this.frames[0];

      switch (this.sortSelected) {
        case "Insertion":
          this.insertionSort(this.items.slice());
          break;
        case "Selection":
          this.selectionSort(this.items.slice());
          break;
        case "Bubble":
          this.bubbleSort(this.items.slice());
          break;
        case "Merge":
          this.mergeSortSplit(this.items.slice());
          break;
        case "Quick":
          this.quickSortRecursive(this.items.slice(), 0, this.items.length - 1);
      }

      this.frameIndex = 0;
    },
    saveStep(arr: Array<number>, i: number, j: number, currentLine: number) {
      this.frames[this.frameIndex] = {
        steps: arr.slice(),
        i,
        j,
        currentLine,
      };
      this.frameIndex++;
    },
    insertionSort(arr: Array<number>) {
      let i,
        key,
        j = 0;
      for (i = 1; i < arr.length; i++) {
        this.saveStep(arr, i, j, 0);
        key = arr[i];
        j = i - 1;

        while (j >= 0 && arr[j] > key) {
          this.saveStep(arr, i, j, 1);
          this.saveStep(arr, i, j, 2);
          if (arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
            this.saveStep(arr, i, j, 3);
          }
        }
        this.saveStep(arr, i, j, 4);
        arr[j + 1] = key;
        this.saveStep(arr, i, j, 5);
      }
    },
    selectionSort(arr: Array<number>) {
      for (let i = 0; i < arr.length; i++) {
        let lowest = i;
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[j] < arr[lowest]) {
            lowest = j;
          }
          this.saveStep(arr, i, j, 0);
        }
        if (lowest !== i) {
          // Swap
          [arr[i], arr[lowest]] = [arr[lowest], arr[i]];
          this.saveStep(arr, i, -1, 1);
        }
      }
      return arr;
    },
    bubbleSort(arr: Array<number>) {
      for (var i = 0; i < arr.length; i++) {
        // Last i elements are already in place
        for (var j = 0; j < arr.length - i - 1; j++) {
          this.saveStep(arr, i, j, 0);

          // Checking if the item at present iteration
          // is greater than the next iteration
          if (arr[j] > arr[j + 1]) {
            // If the condition is true then swap them
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            this.saveStep(arr, i, j, 1);
          }
        }
      }
    },
    // https://stackabuse.com/merge-sort-in-javascript/
    mergeSortSplit(array: Array<number>): Array<number> {
      const half = array.length / 2;

      // Base case or terminating case
      if (array.length < 2) {
        return array;
      }

      const left = array.splice(0, half);

      // merging the two split arrays recursively
      const sortedSubArray = this.mergeSortMerge(
        this.mergeSortSplit(left),
        this.mergeSortSplit(array)
      );

      this.saveStep(sortedSubArray, 0, 0, 0);
      return sortedSubArray;
    },
    mergeSortMerge(left: Array<number>, right: Array<number>): Array<number> {
      let arr = new Array<number>();
      // Break out of loop if any one of the array gets empty
      while (left.length && right.length) {
        // Pick the smaller among the smallest element of left and right sub arrays
        if (left[0] < right[0]) {
          const smallest = left.shift();
          smallest && arr.push(smallest);
        } else {
          const smallest = right.shift();
          smallest && arr.push(smallest);
        }
      }

      // Concatenating the leftover elements
      // (in case we didn't go through the entire left or right array)
      return [...arr, ...left, ...right];
    },
    // https://stackabuse.com/quicksort-in-javascript/
    quickSortPartition(arr: Array<number>, start: number, end: number) {
      // Taking the last element as the pivot
      const pivotValue = arr[end];
      let pivotIndex = start;
      for (let i = start; i < end; i++) {
        if (arr[i] < pivotValue) {
          // Swapping elements
          [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
          this.saveStep(arr, i, end, 0);

          // Moving to next element
          pivotIndex++;
        }
      }

      // Putting the pivot value in the middle
      [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
      return pivotIndex;
    },
    quickSortRecursive(arr: Array<number>, start: number, end: number) {
      // Base case or terminating case
      if (start >= end) {
        return;
      }

      // Returns pivotIndex
      let index = this.quickSortPartition(arr, start, end);
      this.saveStep(arr, start, end, 1);

      // Recursively apply the same logic to the left and right subarrays
      this.quickSortRecursive(arr, start, index - 1);
      this.saveStep(arr, start, end, 2);

      this.quickSortRecursive(arr, index + 1, end);
      this.saveStep(arr, start, end, 3);
    },
  },
  mounted() {
    this.sortSelected = "Insertion";
  },
};
</script>

<style>
.graph {
  height: 200px;
  border: 0.125em solid lightblue;
  border-radius: 0.75em;
}
.graph-item {
  border: 0.125em solid lightblue;
  background: repeating-linear-gradient(
    45deg,
    white,
    white 10px,
    rgba(105, 115, 228, 0.233) 10px,
    rgba(105, 115, 228, 0.233) 20px
  );
}
</style>
