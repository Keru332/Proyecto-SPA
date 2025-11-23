<template>
  <div class="paquetes-section">
    <div class="section-header">
      <h2>Todos Nuestros Paquetes</h2>
      <p class="section-subtitle" v-if="authService.isAuthenticated() && authService.isUser()">
        Descubre nuestras combinaciones exclusivas de tratamientos
      </p>
      <button
        class="crear-button"
        v-if="authService.isAuthenticated() && authService.isAdmin()"
        @click="
          () => {
            router.push(`/crearPaquete`)
          }
        "
      >
        Crear Paquete
      </button>
    </div>

    <div v-if="loading" class="loading">Cargando paquetes...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <ListaPaquetes v-else :paquetes="paquetesFiltrados"></ListaPaquetes>
  </div>
</template>

<script setup>
import { authService } from '@/Authentication/services/auth'
import { usePaqueteSelection } from './JS/PaqueteSelection'
import ListaPaquetes from './ListaPaquetes.vue'
import { useRouter } from 'vue-router'
const { loading, error, paquetesFiltrados } = usePaqueteSelection()
const router = useRouter()
</script>

<style scoped src="./CSS/PaquetesSelection.css"></style>
