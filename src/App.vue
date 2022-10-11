<template>
  <div class="container mx-auto pt-10">
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
      v-if="state.pagination"
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
const load = useLoadStore();

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
  load.handleLoad();
  const { data } = await api.get("/table/");
  state.tableData = data;
  state.pagination.total_pages = Math.ceil(data.length / state.limit);
  state.pagination.total_elements = data.length;
  state.filteredTableData = updateElement(state.pagination.current_page, state.tableData, {column: state.sortCol, order: state.order});
  load.handleLoad();
});

function filterByInteger(data) {
  if (state.formFilter.valueFilter === "equally") {
    return data.filter(i => i[state.formFilter.colFilter] === state.formFilter.valueFilter);
  }
  if (state.formFilter.valueFilter === "more") {
    return data.filter(i => i[state.formFilter.colFilter] > state.formFilter.valueFilter);
  }
  if (state.formFilter.valueFilter === "less") {
    return data.filter(i => i[state.formFilter.colFilter] < state.formFilter.valueFilter);
  }
}

function filterByString(data) {
  console.log(data)
  if (state.formFilter.typeFilter === "equally") {
    return data.filter(i => i[state.formFilter.colFilter].toLowerCase() === state.formFilter.valueFilter.toLowerCase())
  }
  if (state.formFilter.typeFilter === "contains") {
    console.log(data)
    return data.filter(i => {
      console.log(i)
      return i[state.formFilter.colFilter].toLowerCase().contains(state.formFilter.valueFilter.toLowerCase())
    })
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
  } else {
    return data;
  }
}

function submitFilter(event) {
  console.log(event);
  state.formFilter.colFilter = event.colFilter;
  state.formFilter.typeFilter = event.typeFilter;
  state.formFilter.valueFilter = event.valueFilter;
  updateElement(state.pagination.current_page, state.tableData, { column: state.sortCol, order: state.order });
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
  const resultFilter = filterUpdate(data);
  const resultSort = orderUpdate(event, resultFilter);
  return paginationUpdate(page || 1, resultSort);
}
</script>
