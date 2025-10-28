<template>
  <div class="lista-cita">
    <CitasBanner v-for="(cita, index) in citas" :key="index" :cita="cita" />
  </div>
</template>

<script setup>
import CitasBanner from './CitasBanner.vue'

defineProps({
  citas: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped src="./CSS/ListaCitas.css"></style>
