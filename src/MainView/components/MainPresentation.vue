<template>
  <div class="home">
    <SpaBanner></SpaBanner>
    <div class="treatments-4">
      <div class="section-header">
        <h2>Algunos de nuestros tratamientos</h2>
        <p class="section-subtitle">
          Descubre nuestra selección de experiencias únicas para tu bienestar
        </p>
      </div>
      <!-- Estados de carga y error -->
      <div v-if="loading" class="loading">Cargando tratamientos...</div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <ListaTratamientos v-else :tratamientos="tratamientos"></ListaTratamientos>
    </div>
  </div>
</template>

<script setup>
import ListaTratamientos from './ListaTratamientos.vue'
import SpaBanner from './SpaBanner.vue'
import tratamientoService from '@/services/tratamientoService'

import { ref, onMounted } from 'vue'
const tratamientos = ref([])

const loading = ref(true)
const error = ref('')

const fetchTratamientos = async () => {
  try {
    const responseTratamiento = await tratamientoService.getAll()
    tratamientos.value = responseTratamiento
  } catch (err) {
    error.value = 'No se pudo cargar el tratamiento'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
  tratamientos.value.splice(4)
}

// Cargar el tratamiento al montar el componente
onMounted(() => {
  fetchTratamientos()
})
</script>

<style scoped src="./CSS/MainPresentation.css"></style>
