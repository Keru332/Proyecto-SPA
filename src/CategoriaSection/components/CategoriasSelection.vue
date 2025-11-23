<template>
  <div class="categorias-section">
    <div class="section-header">
      <h2>Todas las Categorias</h2>
      <button
        class="crear-button"
        @click="
          () => {
            router.push(`/crearCategoria`)
          }
        "
      >
        Crear Categoria
      </button>
    </div>
    <div v-if="loading" class="loading">Cargando categorias...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <ListaCategorias v-else :categorias="categorias"></ListaCategorias>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCategoriasSelection } from './JS/CategoriasSelection'
import ListaCategorias from './ListaCategorias.vue'

const router = useRouter()

const { categorias, loading, error } = useCategoriasSelection()
</script>

<style scoped src="./CSS/CategoriasSelection.css"></style>
