<template>
  <div class="paquetes-section">
    <div class="section-header">
      <h2>Todos Nuestros Paquetes</h2>
      <p class="section-subtitle">Descubre nuestras combinaciones exclusivas de tratamientos</p>
    </div>

    <div v-if="loading" class="loading">Cargando paquetes...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <ListaPaquetes v-else :paquetes="paquetes"></ListaPaquetes>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ListaPaquetes from '@/MainView/components/ListaPaquetes.vue'

const paquetes = ref([])
const loading = ref(true)
const error = ref('')

const fetchPaquetes = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/paquete/')
    if (!response.ok) throw new Error(`Error ${response.status}`)
    paquetes.value = await response.json()
  } catch (err) {
    console.error('Error cargando paquetes:', err)
    error.value = 'No se pudieron cargar los paquetes.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchPaquetes)
</script>

<style scoped src="./CSS/PaquetesSelection.css"></style>


