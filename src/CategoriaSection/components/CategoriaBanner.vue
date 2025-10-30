<template>
  <div class="categoria-container">
    <div class="categoria-badge">
      <span>Categoria</span>
    </div>

    <div class="categoria-header">
      <h1>{{ categoria.nombrecategoria }}</h1>
    </div>
    <div class="categoria-footer">
      <button
        class="btn-editar"
        v-if="authService.isAdmin()"
        @click="
          () => {
            if (categoria.nombrecategoria != '') {
              router.push(`/catEditar/${categoria.codcategoria}`)
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
  categoria: {
    type: Object,
    required: true,
    default: () => ({
      codcategoria: Object,
      nombrecategoria: '',
    }),
  },
})

const confirmarEliminacion = () => {
  if (
    confirm(
      '¿Estás seguro de que deseas eliminar esta categoria? Esta acción no se puede deshacer.',
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
      `http://localhost:3000/api/categoria/${props.categoria.codcategoria}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

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
          'No se puede eliminar este categoria porque está siendo utilizado en algun tratamiento. Primero elimine las compras asociadas.',
        )
      }
      throw new Error(`Error ${response.status}: ${errorText}`)
    }

    alert('categoria eliminado correctamente')
    window.location.reload()
  } catch (error) {
    console.error('Error eliminando categoria:', error)
    alert(`Error al eliminar: ${error.message}`)
  }
}
</script>

<style scoped src="./CSS/CategoriaBanner.css"></style>
