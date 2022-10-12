<template>
  <div class="">
    <div>
      <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <a href="#" class="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">
          <span class="sr-only">Previous</span>
          &lt;
        </a>

        <template v-for="page in pages" :key="page">
          <a v-if="page < innerSelected+5 && page > innerSelected-5"
             @click="handlePageSelected(page)"
             href="#"
             :class="page === innerSelected ? activeClass : defaultClass "
             class="relative inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20">
            {{ page }}</a>
        </template>

        <a href="#" class="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">
          <span class="sr-only">Next</span>
          >
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup>
import {ref, defineProps, defineEmits, watch} from "vue";

const props = defineProps({
  pages: {
    type: Number,
     required: true,
  },
  modelValue: {
    type: Number,
    default: 0,
  },
  defaultClass: {
    type: String,
    default: 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
  },
  activeClass:{
    type: String,
    default: 'z-10 bg-gray-100 border-primary text-primary'
  }
});

const emit = defineEmits(["update:modelValue"]);

const innerSelected = ref(1);

watch(() => props.modelValue, () => {
  console.log("12")
  emit('update:modelValue');
});

function handlePageSelected(selected){
  if (innerSelected === selected) return
  innerSelected.value = selected
  emit('update:modelValue', selected)
}
</script>
