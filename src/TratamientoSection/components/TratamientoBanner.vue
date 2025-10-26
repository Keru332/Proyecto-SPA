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
        class="btn-editar"
        @click="
          () => {
            if (tratamiento.nombretratamiento != '') {
              storeTrat.setTratamiento(tratamiento)
              router.push(`/EditarTratamiento/${tratamiento.codtratamiento}`)
            }
          }
        "
        v-if="authService.isAdmin()"
      >
        Editar
      </button>

      <button class="btn-eliminar" @click="confirmarEliminacion" v-if="authService.isAdmin()">
        Eliminar
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
const props = defineProps({
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

const confirmarEliminacion = () => {
  if (
    confirm(
      '¿Estás seguro de que deseas eliminar este tratamiento? Esta acción no se puede deshacer.',
    )
  ) {
    eliminarTratamiento()
  }
}

const eliminarTratamiento = async () => {
  try {
    // Obtener el token
    const token = authService.getToken()

    const response = await fetch(
      `http://localhost:3000/api/tratamiento/${props.tratamiento.codtratamiento}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Error ${response.status}: ${errorText}`)
    }

    alert('Tratamiento eliminado correctamente')
    window.location.reload()
  } catch (error) {
    console.error('Error eliminando tratamiento:', error)
    alert(`Error al eliminar: ${error.message}`)
  }
}
</script>

<style scoped src="./CSS/TratamientoBanner.css"></style>
