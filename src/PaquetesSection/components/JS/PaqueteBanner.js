import paqueteService from '@/services/paqueteService'
import { ref, getCurrentInstance } from 'vue'

export function usePaqueteBanner(props) {
  const errorMessage = ref('')
  const { proxy } = getCurrentInstance()
  const confirmarEliminacion = async () => {
    try {
      const result = await proxy.$confirm(
        '¿Estás seguro de que deseas eliminar este Paquete? Esta acción no se puede deshacer.',
      )
      if (result) {
        eliminarTratamiento()
      }
    } catch {
      console.log('cancelado')
    }
  }

  const eliminarTratamiento = async () => {
    try {
      await paqueteService.delete(props.paquete.codpaquete)

      await proxy.$alert('Paquete eliminado correctamente')
      window.location.reload()
    } catch (error) {
      if (error.response) {
        errorMessage.value = `${error.response.data?.error || 'Error al eliminar paquete'}: ${error.response.data?.message}`
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
      await proxy.$alert(`Error al eliminar: ${errorMessage.value}`)
    }
  }

  return { confirmarEliminacion }
}
