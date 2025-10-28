<template>
  <div class="cita-container">
    <div class="cita-header">
      <h1>Cita</h1>
    </div>
    <h3>Cliente: {{ cita.nombrecliente }}</h3>

    <h3>Tratamiento: {{ cita.nombretratamiento }}</h3>

    <div class="cita-informacion">
      <div class="price-tag">
        <h4>Fecha:{{ fechaFormateada }}</h4>
        <h4>Hora:{{ horaFormateada }}</h4>
      </div>
    </div>

    <div class="cita-footer">
      <button
        class="btn-eliminar"
        v-if="authService.isAdmin() && esFechaFutura"
        @click="confirmarEliminacion"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { authService } from '@/Authentication/services/auth'
import { computed } from 'vue'

const props = defineProps({
  cita: {
    type: Object,
    required: true,
    default: () => ({
      codcita: Object,
      nombrecliente: '',
      nombretratamiento: '',
      horacita: '',
      fecha: new Date(),
    }),
  },
})

const actual = new Date()
const esFechaFutura = computed(() => {
  if (!props.cita.fecha) return false

  const fechaCita = new Date(props.cita.fecha)
  return fechaCita > actual
})

const fechaFormateada = computed(() => {
  if (!props.cita.fecha) return ''

  const fecha = new Date(props.cita.fecha)
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
})

// Computed para formatear hora (hora:minuto)
const horaFormateada = computed(() => {
  if (!props.cita.horacita) return ''

  const hora = new Date(`2000-01-01T${props.cita.horacita}`)
  return hora.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
})

const confirmarEliminacion = () => {
  if (
    confirm('¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.')
  ) {
    eliminarCita()
  }
}

const eliminarCita = async () => {
  try {
    // Obtener el token
    const token = authService.getToken()

    const response = await fetch(`http://localhost:3000/api/cita/${props.cita.codsolicitud}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      // Detectar violación de FK por el mensaje de error
      if (
        errorText.includes('foreign key') ||
        errorText.includes('FK_') ||
        errorText.includes('violates foreign key') ||
        errorText.includes('restrict') ||
        errorText.includes('REFERENCE')
      ) {
        throw new Error('No se puede eliminar esta cita.')
      }
      throw new Error(`Error ${response.status}: ${errorText}`)
    }

    alert('Cita eliminada correctamente')
    window.location.reload()
  } catch (error) {
    console.error('Error eliminando Cita:', error)
    alert(`Error al eliminar: ${error.message}`)
  }
}
</script>

<style scoped src="./CSS/CitasBanner.css"></style>
