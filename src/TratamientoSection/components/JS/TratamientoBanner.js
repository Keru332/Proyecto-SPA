import { ref, getCurrentInstance } from 'vue'
import tratamientoService from '@/services/tratamientoService'
export function useTratamientoBanner(props) {
  const errorMessage = ref('')
  const { proxy } = getCurrentInstance()

  const confirmarEliminacion = async () => {
    try {
      const result = await proxy.$confirm(
        '¿Estás seguro de que deseas eliminar este tratamiento? Esta acción no se puede deshacer.',
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
      const response = await tratamientoService.delete(props.tratamiento.codtratamiento)
      console.log(response)

      await proxy.$alert('tratamiento eliminado correctamente')
      window.location.reload()
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
            'No se puede eliminar este tratamiento porque está siendo utilizado en alguna cita. Primero elimine las compras asociadas.'
        }
      } else {
        errorMessage.value = 'Error de conexión con el servidor'
      }
      await proxy.$alert(`Error al eliminar: ${errorMessage.value}`)
    }
  }

  return { confirmarEliminacion }
}
