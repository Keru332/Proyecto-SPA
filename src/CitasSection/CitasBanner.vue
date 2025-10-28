<template>
  <div class="cita-container">
    <div class="cita-header">
      <h1>Cita</h1>
    </div>
      <h3>Cliente:{{ cita.nombrecliente}}</h3>

      <h3>Tratamiento:{{ cita.nombretratamiento}}</h3>


    <div class="cita-informacion">
      <div class="price-tag">
        <h4>Fecha:{{ cita.fecha}}</h4>
        <h4>Hora:{{ cita.hora}}</h4>
      </div>
    </div>

    <div class="cita-footer">

      <button class="btn-editar" v-if="authService.isAdmin()">Editar</button>
      <button class="btn-eliminar" v-if="authService.isAdmin()" @click="confirmarEliminacion">
        Eliminar
      </button>
    </div>
  </div>
</template>

<script setup>
import { authService } from '@/Authentication/services/auth'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
  cita: {
    type: Object,
    required: true,
    default: () => ({
      codcita: Object,
      nombrecliente: '',
      nombretratamiento: '',
      hora: '',
      fecha: '',
    }),
  },
})

const confirmarEliminacion = () => {
  if (
    confirm('¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer.')
  ) {
    eliminarCita()
  }
}

const eliminarCita = async () => {
  try {
    // Obtener el token
    const token = authService.getToken()

    const response = await fetch(`http://localhost:3000/api/cita/${props.cita.codcita}`, {
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
        throw new Error(
          'No se puede eliminar esta cita.',
        )
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
