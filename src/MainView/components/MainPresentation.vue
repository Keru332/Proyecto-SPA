<template>
  <div class="home">
    <SpaBanner></SpaBanner>
    <div class="treatments-section">
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

import { ref, onMounted } from 'vue'
import { authService } from '@/Authentication/services/auth'

const tratamientos = ref([])

const loading = ref(true)
const error = ref('')

// Obtener headers completos
const headers = authService.getAuthHeaders()

const fetchTratamientos = async () => {
  try {
    const responseTratamiento = await fetch(`http://localhost:3000/api/tratamiento/`, {
      method: 'GET',
      headers: headers,
    })
    if (!responseTratamiento.ok) {
      if (responseTratamiento.status === 401) {
        throw new Error('Token inválido o expirado')
      } else if (responseTratamiento.status === 403) {
        throw new Error('No tienes permisos para ver los tratamientos')
      } else {
        throw new Error(`Error ${responseTratamiento.status}: ${responseTratamiento.statusText}`)
      }
    }
    tratamientos.value = await responseTratamiento.json()
  } catch (err) {
    tratamientos.value.error
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
