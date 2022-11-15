<template>
  <section class="visualizationTab sm:p-4 md:p-6">
    <nav>
      <ul class="flex flex-wrap">
        <li
          class="mr-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white px-2 border border-blue-500 border-b-2 hover:border-transparent rounded"
          :class="{ 'bg-blue-500 text-white': sortSelected == 'Insertion' }"
          @click="updateSort('Insertion')"
        >
          <a href="#">Insertion</a>
        </li>
        <li
          class="mr-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white px-2 border border-blue-500 border-b-2 hover:border-transparent rounded"
          :class="{ 'bg-blue-500 text-white': sortSelected == 'Selection' }"
          @click="updateSort('Selection')"
        >
          <a href="#">Selection</a>
        </li>
        <li
          class="mr-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white px-2 border border-blue-500 border-b-2 hover:border-transparent rounded"
          :class="{ 'bg-blue-500 text-white': sortSelected == 'Bubble' }"
          @click="updateSort('Bubble')"
        >
          <a href="#">Bubble</a>
        </li>
        <li
          class="mr-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white px-2 border border-blue-500 border-b-2 hover:border-transparent rounded"
          :class="{ 'bg-blue-500 text-white': sortSelected == 'Merge' }"
          @click="updateSort('Merge')"
        >
          <a href="#">Merge</a>
        </li>
        <li
          class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white px-2 border border-blue-500 border-b-2 hover:border-transparent rounded"
          :class="{ 'bg-blue-500 text-white': sortSelected == 'Quick' }"
          @click="updateSort('Quick')"
        >
          <a href="#">Quick</a>
        </li>
      </ul>
    </nav>
    <p class="mt-3 font-bold text-xl">
      Visualization
      <font-awesome-icon icon="fa-solid fa-rotate" @click="randomize" />
    </p>
    <main class="mt-4">
      <section class="graph flex flex-col justify-end">
        <div class="flex flex-row justify-center">
          <div class="flex flex-col justify-end" v-for="item in items">
            <div
              class="graph-item border-2 border-gray-600 px-3 mx-2 rounded-t"
              :style="{ height: item * 10 + 'px' }"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </section>
      <section class="flex justify-center mt-2">
        <button
          class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white px-2 border border-blue-500 border-b-2 hover:border-transparent rounded"
        >
          <font-awesome-icon icon="fa-solid fa-play" />
        </button>
        <button
          class="ml-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white px-2 border border-blue-500 border-b-2 hover:border-transparent rounded"
        >
          <font-awesome-icon icon="fa-solid fa-pause" />
        </button>
        <button
          class="ml-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white px-2 border border-blue-500 border-b-2 hover:border-transparent rounded"
        >
          <font-awesome-icon icon="fa-solid fa-forward-step" />
        </button>
      </section>
    </main>
  </section>
</template>

<script lang="ts">
export default {
  data() {
    return {
      items: [6, 3, 7, 5, 9, 7],
      sortSelected: "Insertion",
    };
  },
  methods: {
    bubbleSort(): number {
      return 1;
    },
    randomize() {
      this.items = this.items.map(() => Math.floor(Math.random() * 7 + 3));
    },
    updateSort(selected: string) {
      this.sortSelected = selected;
      this.$emit("sort", selected);
    },
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
.fa-rotate:hover {
  color: rgb(59 130 246);
  cursor: pointer;
}
</style>
