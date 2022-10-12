<template>
<form @submit.prevent="submitForm" class="flex gap-8 mb-10">
  <select @change="validateForm" v-model="formFilter.colFilter" name="column" class="w-1/46 border border-2 border-gray-300">
    <option value="" disabled selected>Выберите колонку</option>
    <option v-for="col of columns" :key="col.value" :value="col.value">{{ col.title }}</option>
  </select>
  <select v-model="formFilter.typeFilter" name="type_filter" class="w-1/46 border border-2 border-gray-300">
    <option value="" disabled selected>Выберите тип фильтрации</option>
    <option v-for="filter of computedType" :value="filter.value">{{ filter.title }}</option>
  </select>
  <input @input="validateForm" v-model="formFilter.valueFilter" :type="formFilter.colFilter !== 'date' ? 'search' : 'date'" class="w-1/6 border border-2 border-gray-300 focus:outline-0 focus:border-green-600" placeholder="Введите значение">

  <button :disabled="!isFullForm" type="submit" class="w-1/8 bg-green-600 text-zinc-50 px-2 hover:bg-green-500 active:bg-green-700">Фильтрация</button>
  <button v-if="formFilter.colFilter || formFilter.typeFilter || formFilter.valueFilter" @click="clearFilter" class="w-1/8 bg-zinc-600 text-zinc-50 px-2 hover:bg-zinc-500 active:bg-zinc-700">Очистить</button>
</form>
</template>

<script setup>
import { defineProps, ref,defineEmits, computed } from "vue";

const emit = defineEmits(["submitFilter"]);

const formFilter = ref({
  colFilter: "",
  typeFilter: "",
  valueFilter: "",
})

const columns = ref([
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
]);

const typeFilters = ref([
  {
    title: "Равно",
    value: "equally",
    for: [
      "date",
      "title",
      "count",
      "distance",
    ]
  },
  {
    title: "Содержит",
    value: "contains",
    for: [
      "title",
    ]
  },
  {
    title: "Больше",
    value: "more",
    for: [
      "date",
      "count",
      "distance",
    ]
  },
  {
    title: "Меньше",
    value: "less",
    for: [
      "date",
      "count",
      "distance",
    ]
  },
]);

const computedType = computed(() => {
  return formFilter.value.colFilter ? typeFilters.value.filter(i => i.for.join(",").includes(formFilter.value.colFilter)) : []
});

const isFullForm = computed(() => {
  return formFilter.value.colFilter && formFilter.value.typeFilter && formFilter.value.valueFilter;
});

function validateForm() {
  if (formFilter.value.colFilter === "count" || formFilter.value.colFilter === "distance") {
    formFilter.value.valueFilter = formFilter.value.valueFilter.replace(/[^0-9]/gi, "")
  }
}

function submitForm() {
  if (isFullForm.value) {
    emit('submitFilter', formFilter.value);
  }
}

function clearFilter() {
  formFilter.value.colFilter = "";
  formFilter.value.typeFilter = "";
  formFilter.value.valueFilter = "";
  emit("submitFilter", formFilter.value);
}

</script>
