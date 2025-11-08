<template>
  <div class="paquetes-section">
    <div class="section-header">
      <h2>Todos Nuestros Paquetes</h2>
      <p class="section-subtitle">Descubre nuestras combinaciones exclusivas de tratamientos</p>
    </div>

    <div v-if="loading" class="loading">Cargando paquetes...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <ListaPaquetes v-else :paquetes="paquetesFiltrados"></ListaPaquetes>
  </div>
</template>

<script setup>
import { usePaqueteSelection } from './JS/PaqueteSelection'
import ListaPaquetes from './ListaPaquetes.vue'
const { loading, error, paquetesFiltrados } = usePaqueteSelection()
</script>

<style scoped src="./CSS/PaquetesSelection.css"></style>
