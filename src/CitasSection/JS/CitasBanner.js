import citaService from '@/services/citaService'
import { computed, ref, getCurrentInstance } from 'vue'

export function useCitaBanner(props) {
  const errorMessage = ref('')
  const actual = new Date()
  const { proxy } = getCurrentInstance()
  const esFechaFutura = computed(() => {
    if (!props.cita.fecha) return false

    const fechaCita = new Date(props.cita.fecha)
    return fechaCita > actual
  })

  const confirmarEliminacion = async () => {
    try {
      const result = await proxy.$confirm(
        '¿Estás seguro de que deseas eliminar esta Cita? Esta acción no se puede deshacer.',
      )
      if (result) {
        eliminarCita()
      }
    } catch {
      console.log('cancelado')
    }
  }

  const eliminarCita = async () => {
    try {
      const response = await citaService.delete(props.cita.codsolicitud)
      console.log(response)

      await proxy.$alert('cita eliminada correctamente')
      window.location.reload()
    } catch (error) {
      if (error.response) {
        errorMessage.value = `${error.response.data?.error || 'Error al eliminar cita'}: ${error.response.data?.message}`
        const errorText = JSON.stringify(error.response.data)

        if (
          errorText.includes('foreign key') ||
          errorText.includes('FK_') ||
          errorText.includes('violates foreign key') ||
          errorText.includes('restrict') ||
          errorText.includes('REFERENCE')
        ) {
          errorMessage.value =
            'No se puede eliminar este cita porque está siendo utilizado en algo.'
        }
      } else {
        errorMessage.value = 'Error de conexión con el servidor'
      }
      await proxy.$alert(`Error al eliminar: ${errorMessage.value}`)
    }
  }
  return { actual, esFechaFutura, confirmarEliminacion }
}
