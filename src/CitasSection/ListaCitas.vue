<template>
  <div class="lista-cita">
    <PaqueteBanner
      v-for="(cita, index) in citas"
      :key="index"
      :cita="cita"
    />
  </div>
</template>

<script setup>
import PaqueteBanner from './CitasBanner.vue'

defineProps({
  citas: {
    type: Array,
    required: true
  }
})
</script>

<style scoped src="./CSS/ListaCitas.css"></style>
