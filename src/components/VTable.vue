<template>
  <table class="min-w-full mx-auto divide-y divide-gray-100 shadow-sm border-gray-200 border">
    <thead>
    <tr>
      <th
          v-for="col of columns"
          :key="col.value"
          @click="sortCol(col.value)"
          class="px-3 py-2 font-semibold text-left bg-gray-100 border-b w-1/4 cursor-pointer hover:bg-gray-200 active:bg-gray-300"
      >
        <div class="flex items-center">
          <span class="mr-4">{{ col.title }}</span>
          <svg v-if="props.column === col.value && props.order === 'DESC'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
          </svg>
          <svg v-if="props.column === col.value && props.order === 'ASC'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16">
            <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
          </svg>
        </div>
      </th>
    </tr>
    </thead>

    <tbody class="bg-white divide-y divide-gray-100">
    <tr v-for="elem of tableData" :key="elem.id" class="cursor-pointer hover:bg-gray-100">
      <td class="px-3 py-2 whitespace-no-wrap">{{ elem.date.split("-").reverse().join(".") }}</td>
      <td class="px-3 py-2 whitespace-no-wrap">{{ elem.title }}</td>
      <td class="px-3 py-2 whitespace-no-wrap">{{ elem.count }}</td>
      <td class="px-3 py-2 whitespace-no-wrap">{{ elem.distance }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script setup>
import { defineProps, ref, defineEmits } from "vue";

const emit = defineEmits(["sort"]);

const props = defineProps({
  tableData: {
    type: Array,
    default: [],
    required: true,
  },
  column: {
    type: String,
    default: "",
  },
  order: {
    type: String,
    default: ""
  }
});
const columns = [
  {
    title: "Дата",
    value: "date",
  },
  {
    title: "Название",
    value: "title",
  },
  {
    title: "Количество",
    value: "count",
  },
  {
    title: "Расстояние",
    value: "distance",
  },
];

function sortCol(col) {
  if (col === "date") {
    return;
  }
  if (col === props.column) {
    if (props.order === "ASC") {
      emit("sort",{ column: col, order: "DESC" });
    } else if (props.order === "DESC") {
      emit("sort",{ column: "", order: "" });
    }
  } else {
    emit("sort",{ column: col, order: "ASC" });
  }
}
</script>
