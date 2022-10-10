<template>
<div v-if="load.isLoad" class="flex top-0 left-0 fixed justify-center items-center w-screen h-screen bg-[#00000010]">
  <div class="lds-dual-ring"></div>
</div>
</template>

<script setup>
import { useLoadStore } from "@/stores/load";
const load = useLoadStore();
</script>

<style scoped>
.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #b71fb7;
  border-color: #dc09dc transparent #dc10dc transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
