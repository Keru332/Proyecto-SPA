<template>
  <div class="paquete-container">
    <div class="paquete-badge">
      <span>Paquete</span>
    </div>

    <div class="paquete-header">
      <h1>{{ paquete.nombrepaquete }}</h1>
    </div>

    <p>{{ paquete.descripcion }}</p>

    <div class="paquete-informacion">
      <div class="price-tag">
        <h4>${{ paquete.preciopaquete }}</h4>
        <span>{{ paquete.duraciontotal }} minutos</span>
      </div>
    </div>

    <div class="paquete-tratamientos">
      <h3>Tratamientos incluidos:</h3>
      <ul>
        <li v-for="(t, i) in paquete.tratamientos" :key="i">
          {{ t.nombretratamiento }}
        </li>
      </ul>
    </div>

    <div class="paquete-footer" v-if="!$route.path.includes('/comprarPaquete/')">
      <button
        class="btn-reservar"
        v-if="authService.isUser()"
        @click="
          () => {
            if (paquete.nombrepaquete != '') {
              router.push(`/comprarPaquete/${paquete.codpaquete}`)
            }
          }
        "
      >
        Reservar paquete
      </button>
      <button
        class="btn-editar"
        v-if="authService.isAdmin()"
        @click="
          () => {
            if (paquete.nombrepaquete != '') {
              router.push(`/EditarPaquete/${paquete.codpaquete}`)
            }
          }
        "
      >
        Editar
      </button>
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
  paquete: {
    type: Object,
    required: true,
    default: () => ({
      codpaquete: Object,
      nombrepaquete: '',
      duraciontotal: 0,
      preciopaquete: 0,
      tratamientos: [],
    }),
  },
})

const confirmarEliminacion = () => {
  if (
    confirm('¿Estás seguro de que deseas eliminar este paquete? Esta acción no se puede deshacer.')
  ) {
    eliminarTratamiento()
  }
}

const eliminarTratamiento = async () => {
  try {
    // Obtener el token
    const token = authService.getToken()

    const response = await fetch(`http://localhost:3000/api/paquete/${props.paquete.codpaquete}`, {
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
          'No se puede eliminar este paquete porque está siendo utilizado en paquetes comprados. Primero elimine las compras asociadas.',
        )
      }
      throw new Error(`Error ${response.status}: ${errorText}`)
    }

    alert('Paquete eliminado correctamente')
    window.location.reload()
  } catch (error) {
    console.error('Error eliminando paquete:', error)
    alert(`Error al eliminar: ${error.message}`)
  }
}
</script>

<style scoped src="./CSS/PaqueteBanner.css"></style>
