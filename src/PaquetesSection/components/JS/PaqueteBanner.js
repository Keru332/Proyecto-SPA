import paqueteService from '@/services/paqueteService'
import { ref } from 'vue'
import { useAlertaConfirmacion } from '@/plantilla confirmacion/Plantilla confirmacion.vue'

export function usePaqueteBanner(props) {
  const errorMessage = ref('')
  const { mostrarConfirmacion } = useAlertaConfirmacion()

  const confirmarEliminacion = () => {
    mostrarConfirmacion({
      titulo: 'Confirmar Eliminación',
      mensaje: '¿Estás seguro de que deseas eliminar este paquete? Esta acción no se puede deshacer.',
      tipo: 'peligro',
      textoAceptar: 'Sí, eliminar',
      textoCancelar: 'Cancelar',
      onAceptar: eliminarPaquete
    })
  }

  const eliminarPaquete = async () => {
    try {
      await paqueteService.delete(props.paquete.codpaquete)

      mostrarConfirmacion({
        titulo: '¡Éxito!',
        mensaje: 'Paquete eliminado correctamente',
        tipo: 'exito',
        textoAceptar: 'Aceptar',
        onAceptar: () => window.location.reload()
      })
     
    } catch (error) {
      if (error.response) {
        errorMessage.value = `Error: ${error.response.data?.error || 'Error al eliminar paquete'}`
        const errorText = JSON.stringify(error.response.data)

        if (
          errorText.includes('foreign key') ||
          errorText.includes('FK_') ||
          errorText.includes('violates foreign key') ||
          errorText.includes('restrict') ||
          errorText.includes('REFERENCE')
        ) {
          errorMessage.value =
            'No se puede eliminar este paquete porque está siendo utilizado en algún paquete vendido.'
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
