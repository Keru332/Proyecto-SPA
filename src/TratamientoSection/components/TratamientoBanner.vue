<template>
  <div class="trat-container">
    <div class="trat-badge">
      <span>{{ tratamiento.nombrecategoria }}</span>
    </div>
    <div class="trat-header">
      <h1>{{ tratamiento.nombretratamiento }}</h1>
    </div>
    <p>{{ tratamiento.descripcion }}</p>
    <div class="trat-informacion">
      <div class="price-tag">
        <h4>${{ tratamiento.precio }}</h4>
        <span>{{ tratamiento.duracion }} minutos</span>
      </div>
    </div>
    <div class="trat-footer" v-if="!$route.path.includes('/agendarCita/')">
      <button
        class="btn-reservar"
        @click="
          () => {
            if (tratamiento.nombretratamiento != '') {
              storeTrat.setTratamiento(tratamiento)
              router.push(`/agendarCita/${tratamiento.codtratamiento}`)
            }
          }
        "
        v-if="authService.isUser()"
      >
        Reservar ahora
      </button>

      <button
        class="btn-reservar"
        @click="
          () => {
            if (tratamiento.nombretratamiento != '') {
              storeTrat.setTratamiento(tratamiento)
              router.push(`/agendarCita/${tratamiento.codtratamiento}`)
            }
          }
        "
        v-if="authService.isAdmin()"
      >
        Editar
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { tratamientoStore } from '../stores/TratamientoReservar'
import { authService } from '@/Authentication/services/auth'

const router = useRouter()
const storeTrat = tratamientoStore()
defineProps({
  tratamiento: {
    type: Object,
    required: true,
    default: () => ({
      codtratamiento: Object,
      nombretratamiento: '',
      categoria: '',
      precioTrat: 0,
      duracion: 0,
      descripcion: '',
    }),
  },
})
</script>

<style scoped src="./CSS/TratamientoBanner.css"></style>
