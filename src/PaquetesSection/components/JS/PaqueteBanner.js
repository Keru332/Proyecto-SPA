import paqueteService from '@/services/paqueteService'
import { ref } from 'vue'

export function usePaqueteBanner(props) {
  const errorMessage = ref('')
  const confirmarEliminacion = () => {
    if (
      confirm(
        '¿Estás seguro de que deseas eliminar este paquete? Esta acción no se puede deshacer.',
      )
    ) {
      eliminarTratamiento()
    }
  }

  const eliminarTratamiento = async () => {
    try {
      await paqueteService.delete(props.paquete.codpaquete)

      alert('Paquete eliminado correctamente')
      window.location.reload()
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
            'No se puede eliminar este paquete porque está siendo utilizado en algun paquete vendido. Primero elimine las compras asociadas.'
        }
      } else {
        errorMessage.value = 'Error de conexión con el servidor'
      }
      alert(`Error al eliminar: ${errorMessage.value}`)
    }
  }

  return { confirmarEliminacion }
}
