<template>
  <div class="lista-paquetes">
    <PaqueteBanner
      v-for="(paquete, index) in paquetes"
      :key="index"
      :paquete="paquete"
    />
  </div>
</template>

<script setup>
import PaqueteBanner from './PaqueteBanner.vue'

defineProps({
  paquetes: {
    type: Array,
    required: true
  }
})
</script>

<style scoped src="./CSS/ListaPaquetes.css"></style>
