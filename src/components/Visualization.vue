<template>
  <section class="visualizationTab p-1 sm:p-6 pb-4">
    <nav>
      <ul class="flex flex-wrap">
        <li
          v-for="key in Object.keys(algorithms)"
          class="mr-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white px-2 py-0.5 border border-blue-500 border-b-2 hover:border-transparent rounded mt-1 sort-btn"
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
        <transition-group
          class="flex flex-row justify-center"
          name="bars"
          tag="section"
        >
          <div
            class="flex flex-col justify-end"
            v-for="(item, index) in currentFrame.steps"
            :key="item"
          >
            <div
              class="graph-item border-2 border-gray-600 mx-2 rounded-t mt-1"
              :class="{
                'green-bg': index == currentFrame.i,
                'red-bg': index == currentFrame.j,
                highlight: currentFrame.highlight.includes(index),
              }"
              :style="{ height: 22 * item + 'px' }"
            >
              {{ item }}
            </div>
          </div>
        </transition-group>
      </section>

      <section class="flex justify-center mt-2 mb-2">
        <button
          v-for="(val, key) in icons"
          class="bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white mx-0.5 px-2 border border-blue-500 border-b-2 hover:border-transparent rounded media-btn"
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
      sortSelected: "Insertion",
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
  methods: {
    updateSort(selected: string) {
      this.sortSelected = selected;
      this.$emit("sort", selected);
      this.redoSorting();
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
        await new Promise((r) => setTimeout(r, 150));
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
      this.frames = [
        { steps: this.items, i: -1, j: -1, highlight: [], currentLine: 0 },
      ];
      this.updateFrame(0);
      this.frameIndex++;
      this.mediaSelected = "";

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
          const mergeItems = this.items.slice();
          const originalItems = this.items.slice();

          this.mergeSortSplit(mergeItems);
          this.items = originalItems;
          break;
        case "Quick":
          this.quickSortRecursive(this.items.slice(), 0, this.items.length - 1);
      }

      this.frameIndex = 0;
    },
    saveStep(
      arr: Array<number>,
      i: number = -1,
      j: number = -1,
      currentLine: number,
      highlight: Array<number> = []
    ) {
      this.frames[this.frameIndex] = {
        steps: arr.slice(),
        i,
        j,
        currentLine,
        highlight: highlight,
      };
      this.frameIndex++;
    },
    insertionSort(arr: Array<number>) {
      let i, key, j;
      for (i = 1; i < arr.length; i++) {
        this.saveStep(arr, i, undefined, 0);
        key = arr[i];

        for (j = i - 1; j >= 0 && arr[j] > key; j--) {
          this.saveStep(arr, i, j, 1);
          this.saveStep(arr, i, j, 2);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          this.saveStep(arr, i, j, 3);
        }
        this.saveStep(arr, undefined, j + 1, 4);
      }
    },
    selectionSort(arr: Array<number>) {
      for (let i = 0; i < arr.length; i++) {
        this.saveStep(arr, i, undefined, 0);
        let lowest = i;
        this.saveStep(arr, i, undefined, 1);

        for (let j = i + 1; j < arr.length; j++) {
          this.saveStep(arr, i, j, 2);
          this.saveStep(arr, i, j, 3);

          if (arr[j] < arr[lowest]) {
            lowest = j;
            this.saveStep(arr, i, j, 4);
          }
        }
        if (lowest !== i) {
          // Swap
          [arr[i], arr[lowest]] = [arr[lowest], arr[i]];
          this.saveStep(arr, i, lowest, 5);
        }
      }
      return arr;
    },
    bubbleSort(arr: Array<number>) {
      let sorted = false;
      while (!sorted) {
        this.saveStep(arr, undefined, undefined, 0);
        sorted = true;
        this.saveStep(arr, undefined, undefined, 1);

        for (var i = 0; i < arr.length; i++) {
          this.saveStep(arr, i, undefined, 2);
          this.saveStep(arr, i, i + 1, 3);
          // Checking if the item at present iteration
          // is greater than the next iteration
          if (arr[i] > arr[i + 1]) {
            // If the condition is true then swap them
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
            this.saveStep(arr, i, i + 1, 4);
            sorted = false;
            this.saveStep(arr, i, i + 1, 5);
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
      this.saveStep(this.items, undefined, undefined, 1);

      const highlighted = this.highlightItems(sortedSubArray);
      this.saveStep(this.items, undefined, undefined, 2, highlighted);

      this.replaceItems(sortedSubArray);
      this.saveStep(this.items, undefined, undefined, 3, highlighted);
      this.saveStep(this.items, undefined, undefined, 4, highlighted);

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
      this.saveStep(arr, undefined, end, 1);

      for (let i = start; i < end; i++) {
        this.saveStep(arr, i, end, 2);
        this.saveStep(arr, i, end, 3);
        if (arr[i] < pivotValue) {
          // Swapping elements
          [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
          this.saveStep(arr, i, end, 4);

          // Moving to next element
          pivotIndex++;
          this.saveStep(arr, i, end, 5);
        }
      }

      // Putting the pivot value in the middle
      [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
      this.saveStep(arr, pivotIndex, end, 6);
      this.saveStep(arr, pivotIndex, end, 7);
      return pivotIndex;
    },
    quickSortRecursive(arr: Array<number>, start: number, end: number) {
      // Base case or terminating case
      if (start >= end) {
        return;
      }

      // Returns pivotIndex
      let index = this.quickSortPartition(arr, start, end);

      // Recursively apply the same logic to the left and right subarrays
      this.quickSortRecursive(arr, start, index - 1);

      this.quickSortRecursive(arr, index + 1, end);
    },
    highlightItems(arr: Array<number>): Array<number> {
      let highlight = new Array<number>();

      arr.forEach((e) => {
        highlight.push(this.currentFrame.steps.findIndex((s) => s == e));
      });
      return highlight;
    },
    replaceItems(arr: Array<number>) {
      const lastFrame = this.frames[this.frames.length - 1];
      const steps = lastFrame.steps.slice();
      const highlighted = lastFrame.highlight.sort((a, b) => a - b);
      steps.splice(highlighted[0], highlighted.length, ...arr);
      this.items = steps;
    },
  },
  mounted() {
    this.redoSorting();
  },
};
</script>

<style>
.graph {
  height: 240px;
  border: 0.125em solid lightblue;
  border-radius: 0.75em;
  background: linear-gradient(-45deg, rgb(50, 70, 138, 0.5) 15px, white 0);
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
  padding: 0 0.9rem 0 0.9rem;
}
.bars-move {
  transition: all 0.5s ease;
} /* apply transition to moving elements */
.bars-enter-active,
.bars-leave-active {
  transition: all 0.5s ease;
}
.bars-enter-from,
.bars-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.bars-leave-active {
  position: absolute;
}
.green-bg {
  background: rgba(61, 181, 99, 0.7);
}
.red-bg {
  background: rgba(213, 28, 28, 0.7);
}
.highlight {
  background: rgba(61, 181, 99, 0.7);
}
.sort-btn {
  font-size: 1.05rem;
}
.media-btn {
  font-size: 1.1rem;
}
</style>
