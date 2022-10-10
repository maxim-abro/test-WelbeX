<template>
  <div class="container mx-auto pt-10">
    <v-table
      :table-data="state.tableData"
      :column="state.sortCol"
      :order="state.order"
      @sort="orderHandler"
    />
    <v-pagination
      v-if="state.pagination"
      :v-model="state.pagination.current_page"
      :pages="state.pagination.total_pages"
      @update:modelValue="paginationHandler"
      class="p-2 flex justify-center"
    ></v-pagination>
  </div>

  <loader />
</template>

<script setup>
import Loader from "@/components/Loader.vue";
import VTable from "@/components/VTable.vue";
import VPagination from "@/components/VPagination.vue";

import api from "@/modules/api";
import {onMounted, reactive} from "vue";
import { useLoadStore } from "@/stores/load";
const load = useLoadStore();

const state = reactive({
  tableData: [],
  pagination: null,
  sortCol: "",
  order: "",
});

onMounted(async () => {
  load.handleLoad();
  const { data } = await api.get("/table/");
  state.tableData = data.rows;
  state.pagination = data.pagination;
  load.handleLoad();
});

async function orderHandler(event) {
  load.handleLoad();
  state.sortCol = event.column;
  state.order = event.order;
  const { data } = await api.get(`/table/?col=${state.sortCol}&order=${state.order}`);

  setTableData(data.rows, data.pagination);
  load.handleLoad();
}

async function paginationHandler(page) {
  load.handleLoad();
  const { data } = await api.get(`/table/?page=${page}${state.sortCol ? '&col=' + state.sortCol + '&order=' + state.order : ''}`);

  setTableData(data.rows, data.pagination);
  load.handleLoad();
}

function setTableData(tableData, pagination) {
  state.tableData = tableData;
  state.pagination = pagination;
}
</script>
