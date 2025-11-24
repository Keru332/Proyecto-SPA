import { ref } from 'vue'
import categoriaService from '@/services/categoriaService'
import { useAlertaConfirmacion } from '@/plantilla confirmacion/Plantilla confirmacion.vue'

export function useCategoriaBanner(props) {
  const errorMessage = ref('')
  const { mostrarConfirmacion } = useAlertaConfirmacion()

  const confirmarEliminacion = () => {
    mostrarConfirmacion({
      titulo: 'Confirmar Eliminación',
      mensaje: '¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.',
      tipo: 'peligro',
      textoAceptar: 'Sí, eliminar',
      textoCancelar: 'Cancelar',
      onAceptar: eliminarCategoria
    })
  }

  const eliminarCategoria = async () => {
    try {
      const response = await categoriaService.delete(props.categoria.codcategoria)
      console.log(response)

      mostrarConfirmacion({
        titulo: '¡Éxito!',
        mensaje: 'Categoría eliminada correctamente',
        tipo: 'exito',
        textoAceptar: 'Aceptar',
        onAceptar: () => window.location.reload()
      })
     
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
            'No se puede eliminar esta categoría porque está siendo utilizada en algún tratamiento.'
        }
      } else {
        errorMessage.value = 'Error de conexión con el servidor'
      }
     
      mostrarConfirmacion({
        titulo: 'Error',
        mensaje: `Error al eliminar: ${errorMessage.value}`,
        tipo: 'peligro',
        textoAceptar: 'Aceptar'
      })
    }
  }

  return { confirmarEliminacion }
}