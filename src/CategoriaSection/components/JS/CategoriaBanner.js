import { useRouter } from 'vue-router'
import categoriaService from '@/services/categoriaService'
import { ref } from 'vue'
export function useCategoriaBanner(props) {
  const router = useRouter()
  const errorMessage = ref('')
  const confirmarEliminacion = () => {
    if (
      confirm(
        '¿Estás seguro de que deseas eliminar esta categoria? Esta acción no se puede deshacer.',
      )
    ) {
      eliminarCategoria()
    }
  }

  const eliminarCategoria = async () => {
    try {
      const response = await categoriaService.delete(props.categoria.codcategoria)
      console.log(response)

      alert('categoria eliminado correctamente')
      window.location.reload()
    } catch (error) {
      if (error.response) {
        errorMessage.value = `Error: ${error.response.data?.error || 'Error al eliminar categoria'}`
        const errorText = JSON.stringify(error.response.data)

        if (
          errorText.includes('foreign key') ||
          errorText.includes('FK_') ||
          errorText.includes('violates foreign key') ||
          errorText.includes('restrict') ||
          errorText.includes('REFERENCE')
        ) {
          errorMessage.value =
            'No se puede eliminar este categoria porque está siendo utilizado en algun tratamiento. Primero elimine las compras asociadas.'
        }
      } else {
        errorMessage.value = 'Error de conexión con el servidor'
      }
      alert(`Error al eliminar: ${errorMessage.value}`)
    }
  }

  return { router, confirmarEliminacion, eliminarCategoria }
}
