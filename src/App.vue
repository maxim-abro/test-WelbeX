<template>
  <div class="container mx-auto pt-10">
    <h1 class="text-6xl font-bold mx-auto text-center mb-20">Тестовое задание WelbeX</h1>
    <v-filter
      @submitFilter="submitFilter"
    />
    <v-table
      :table-data="state.filteredTableData"
      :column="state.sortCol"
      :order="state.order"
      @sort="state.filteredTableData = updateElement(state.pagination.current_page, state.tableData, $event)"
    />
    <v-pagination
      v-if="state.pagination && state.filteredTableData.length"
      :v-model="state.pagination.current_page"
      :pages="state.pagination.total_pages"
      @update:modelValue="state.filteredTableData = updateElement($event, state.tableData, {column: state.sortCol, order: state.order})"
      class="p-2 flex justify-center"
    ></v-pagination>
  </div>

  <loader />
</template>

<script setup>
import Loader from "@/components/Loader.vue";
import VTable from "@/components/VTable.vue";
import VPagination from "@/components/VPagination.vue";
import VFilter from "@/components/VFilter.vue";

import api from "@/modules/api";
import {onMounted, reactive, computed} from "vue";
import { useLoadStore } from "@/stores/load";
const loader = useLoadStore();

const state = reactive({
  tableData: [],
  filteredTableData: [],
  pagination: {
    current_page: 1,
    total_pages: 1,
    total_elements: 1,
  },
  sortCol: "",
  order: "",
  limit: 15,
  formFilter: {
    colFilter: "",
    typeFilter: "",
    valueFilter: "",
  },
});

onMounted(async () => {
  loader.toggleLoader();
  const { data } = await api.get("/table/");
  state.tableData = data;
  state.pagination.total_pages = Math.ceil(data.length / state.limit);
  state.pagination.total_elements = data.length;
  state.filteredTableData = updateElement(state.pagination.current_page, state.tableData, {column: state.sortCol, order: state.order});
  loader.toggleLoader();
});

function filterByInteger(data) {
  if (state.formFilter.typeFilter === "equally") {
    const filteredData = data.filter(i => i[state.formFilter.colFilter] * 1 === state.formFilter.valueFilter * 1);
    state.pagination.total_elements = filteredData.length;
    state.pagination.total_pages = Math.ceil(filteredData.length / state.limit);
    return filteredData;
  }
  if (state.formFilter.typeFilter === "more") {
    const filteredData = data.filter(i => i[state.formFilter.colFilter] * 1 > state.formFilter.valueFilter * 1);
    state.pagination.total_elements = filteredData.length;
    state.pagination.total_pages = Math.ceil(filteredData.length / state.limit);
    return filteredData;
  }
  if (state.formFilter.typeFilter === "less") {
    const filteredData = data.filter(i => i[state.formFilter.colFilter] * 1 < state.formFilter.valueFilter * 1);
    state.pagination.total_elements = filteredData.length;
    state.pagination.total_pages = Math.ceil(filteredData.length / state.limit);
    return filteredData;
  }
}

function filterByString(data) {
  if (state.formFilter.typeFilter === "equally") {
    const filteredData = data.filter(i => i[state.formFilter.colFilter].toLowerCase() === state.formFilter.valueFilter.toLowerCase());
    state.pagination.total_elements = filteredData.length;
    state.pagination.total_pages = Math.ceil(filteredData.length / state.limit);
    return filteredData;
  }
  if (state.formFilter.typeFilter === "contains") {
    const filteredData = data.filter(i =>  i[state.formFilter.colFilter].toLowerCase().includes(state.formFilter.valueFilter.toLowerCase()));
    state.pagination.total_elements = filteredData.length;
    state.pagination.total_pages = Math.ceil(filteredData.length / state.limit);
    return filteredData;
  }
}

function filterByDate(data) {
  const filterDate = new Date(state.formFilter.valueFilter).getTime();
  if (state.formFilter.typeFilter === "equally") {
    const filteredData = data.filter(i => {
      return new Date(i.date).getTime() === filterDate;
    });
    state.pagination.total_elements = filteredData.length;
    state.pagination.total_pages = Math.ceil(filteredData.length / state.limit);
    return filteredData;
  }
  if (state.formFilter.typeFilter === "more") {
    const filteredData = data.filter(i => {
      return new Date(i.date).getTime() > filterDate;
    });
    state.pagination.total_elements = filteredData.length;
    state.pagination.total_pages = Math.ceil(filteredData.length / state.limit);
    return filteredData;
  }
  if (state.formFilter.typeFilter === "less") {
    const filteredData = data.filter(i => {
      return new Date(i.date).getTime() < filterDate;
    });
    state.pagination.total_elements = filteredData.length;
    state.pagination.total_pages = Math.ceil(filteredData.length / state.limit);
    return filteredData;
  }
}

function filterUpdate(data) {
  if (state.formFilter.colFilter && state.formFilter.typeFilter && state.formFilter.valueFilter) {
    if (state.formFilter.colFilter === "title") {
      return filterByString(data);
    }
    if (state.formFilter.colFilter === "count") {
      return filterByInteger(data);
    }
    if (state.formFilter.colFilter === "distance") {
      return filterByInteger(data);
    }
    if (state.formFilter.colFilter === "date") {
      return filterByDate(data);
    }
  } else {
    state.pagination.total_elements = data.length;
    state.pagination.total_pages = Math.ceil(data.length / state.limit);
    return data;
  }
}

function submitFilter(event) {
  state.formFilter.colFilter = event.colFilter;
  state.formFilter.typeFilter = event.typeFilter;
  state.formFilter.valueFilter = event.valueFilter;
  state.filteredTableData = updateElement(1, state.tableData, { column: state.sortCol, order: state.order });
}

function orderUpdate(event, data) {
  state.sortCol = event.column;
  state.order = event.order;

  if (!state.sortCol) {
    state.pagination.current_page = 1;
    return data.sort((a,b) => a.id - b.id)
  }
  const sortingTable = data.sort((a, b) => {
    let modifier = 1;
    if (state.order === "DESC") modifier = -1;
    if (state.sortCol === "title") {
      if (a[state.sortCol].toLowerCase() < b[state.sortCol].toLowerCase()) return -1 * modifier;
      if (a[state.sortCol].toLowerCase() > b[state.sortCol].toLowerCase()) return 1 * modifier;
      return 0;
    }
    if (a[state.sortCol] < b[state.sortCol]) return -1 * modifier;
    if (a[state.sortCol] > b[state.sortCol]) return 1 * modifier;
  });

  state.pagination.current_page = 1;
  return sortingTable;
}

function paginationUpdate(page, data) {
  state.pagination.current_page = page;
  const startElement = state.pagination.current_page === 1 ? 0 : state.limit * (state.pagination.current_page - 1);
  return data.slice(startElement, startElement + state.limit);
}

function updateElement(page, data, event) {
  loader.toggleLoader();
  const resultFilter = filterUpdate(data);
  const resultSort = orderUpdate(event, resultFilter);
  loader.toggleLoader();
  return paginationUpdate(page || 1, resultSort);
}
</script>
