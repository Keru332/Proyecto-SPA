<template>
  <div class="categorias-section">
    <div class="section-header">
      <h2>Todas las Categorias</h2>
    </div>
    <div v-if="loading" class="loading">Cargando categorias...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <ListaCategorias v-else :categorias="categorias"></ListaCategorias>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ListaCategorias from './ListaCategorias.vue'
//import { authService } from '@/Authentication/services/auth'

const categorias = ref([])
const loading = ref(true)
const error = ref('')

const fetchcategorias = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/categoria/')
    if (!response.ok) throw new Error(`Error ${response.status}`)
    categorias.value = await response.json()
  } catch (err) {
    console.error('Error cargando categorias:', err)
    error.value = 'No se pudieron cargar los categorias.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchcategorias)
</script>

<style scoped src="./CSS/CategoriasSelection.css"></style>
