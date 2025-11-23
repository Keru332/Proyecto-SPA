<template>
  <div class="treatments-section">
    <div class="section-header">
      <h2>Todos Nuestros Tratamientos</h2>
      <p class="section-subtitle" v-if="authService.isAuthenticated() && authService.isUser()">
        Agende su cita ya para ser atendido en nuestro glorioso Spa
      </p>
      <button
        class="crear-button"
        v-if="authService.isAuthenticated() && authService.isAdmin()"
        @click="
          () => {
            router.push(`/crearTrat`)
          }
        "
      >
        Crear Tratamiento
      </button>
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
import { authService } from '@/Authentication/services/auth'
import { useRouter } from 'vue-router'

const { tratamientos, loading, error } = useTratamientoSeleccion()
const router = useRouter()
</script>

<style scoped src="./CSS/TratmientosSeleccion.css"></style>
