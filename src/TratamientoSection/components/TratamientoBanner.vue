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
    <div
      class="trat-footer"
      v-if="
        !$route.path.includes('/agendarCita/') && tratamiento.nombretratamiento != 'Cargando...'
      "
    >
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
        v-if="authService.isAuthenticated() && authService.isUser()"
      >
        Reservar ahora
      </button>

      <button
        class="btn-editar"
        @click="
          () => {
            if (tratamiento.nombretratamiento != '') {
              storeTrat.setTratamiento(tratamiento)
              router.push(`/EditarTratamiento/${tratamiento.codtratamiento}`)
            }
          }
        "
        v-if="authService.isAuthenticated() && authService.isAdmin()"
      >
        Editar
      </button>

      <button
        class="btn-eliminar"
        @click="confirmarEliminacion"
        v-if="authService.isAuthenticated() && authService.isAdmin()"
      >
        Eliminar
      </button>
    </div>

    <AlertaConfirmacion />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { tratamientoStore } from '../stores/TratamientoReservar'
import { authService } from '@/Authentication/services/auth'
import { useTratamientoBanner } from './JS/TratamientoBanner'
import AlertaConfirmacion from '@/components/Alertas/AlertaConfirmacion.vue'

const router = useRouter()
const storeTrat = tratamientoStore()
const props = defineProps({
  tratamiento: {
    type: Object,
    required: true,
    default: () => ({
      codtratamiento: '',
      nombretratamiento: '',
      nombrecategoria: '',
      precio: '0.00',
      duracion: 0,
      descripcion: '',
    }),
  },
})

const { confirmarEliminacion } = useTratamientoBanner(props)
</script>

<style scoped src="./CSS/TratamientoBanner.css"></style>