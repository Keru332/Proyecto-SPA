import { ref } from 'vue'
import tratamientoService from '@/services/tratamientoService'
import { useAlertaConfirmacion } from '@/plantilla confirmacion/Plantilla confirmacion.vue'

export function useTratamientoBanner(props) {
  const errorMessage = ref('')
  const { mostrarConfirmacion } = useAlertaConfirmacion()

  const confirmarEliminacion = () => {
    mostrarConfirmacion({
      titulo: 'Confirmar Eliminación',
      mensaje: '¿Estás seguro de que deseas eliminar este tratamiento? Esta acción no se puede deshacer.',
      tipo: 'peligro',
      textoAceptar: 'Sí, eliminar',
      textoCancelar: 'Cancelar',
      onAceptar: eliminarTratamiento
    })
  }

  const eliminarTratamiento = async () => {
    try {
      const response = await tratamientoService.delete(props.tratamiento.codtratamiento)
      console.log(response)

      mostrarConfirmacion({
        titulo: '¡Éxito!',
        mensaje: 'Tratamiento eliminado correctamente',
        tipo: 'exito',
        textoAceptar: 'Aceptar',
        onAceptar: () => window.location.reload()
      })
     
    } catch (error) {
      if (error.response) {
        errorMessage.value = `Error: ${error.response.data?.error || 'Error al eliminar tratamiento'}`
        const errorText = JSON.stringify(error.response.data)

        if (
          errorText.includes('foreign key') ||
          errorText.includes('FK_') ||
          errorText.includes('violates foreign key') ||
          errorText.includes('restrict') ||
          errorText.includes('REFERENCE')
        ) {
          errorMessage.value =
            'No se puede eliminar este tratamiento porque está siendo utilizado en alguna cita.'
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