<template>
  <div class="treatments-section">
    <div class="section-header">
      <h2>Todos Nuestros Tratamientos</h2>
      <p class="section-subtitle">Agende su cita ya para ser atendido en nuestro glorioso Spa</p>
    </div>
    <div v-if="loading" class="loading">Cargando tratamientos...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <ListaTratamientos v-else :tratamientos="tratamientos"></ListaTratamientos>
  </div>
</template>

<script setup>
import ListaTratamientos from '@/MainView/components/ListaTratamientos.vue'
import { useTratamientoSeleccion } from './JS/TratamientosSeleccion'

const { tratamientos, loading, error } = useTratamientoSeleccion()
</script>

<style scoped src="./CSS/TratmientosSeleccion.css"></style>
