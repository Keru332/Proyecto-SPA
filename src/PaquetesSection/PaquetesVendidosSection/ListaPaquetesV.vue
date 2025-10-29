<template>
  <div class="lista-paquetev">
    <PaquetesVBanner v-for="(paquetev, index) in paquetesv" :key="index" :paquetev="paquetev" />
  </div>
</template>

<script setup>
import PaquetesVBanner from './PaquetesVBanner.vue'

defineProps({
  paquetesv: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped src="./CSS/ListaPaquetesV.css"></style>
