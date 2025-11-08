import { authService } from '@/Authentication/services/auth'
import { computed } from 'vue'

export function useCitaBanner(props) {
  const actual = new Date()
  const esFechaFutura = computed(() => {
    if (!props.cita.fecha) return false

    const fechaCita = new Date(props.cita.fecha)
    return fechaCita > actual
  })

  const confirmarEliminacion = () => {
    if (
      confirm('¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.')
    ) {
      eliminarCita()
    }
  }

  const eliminarCita = async () => {
    try {
      // Obtener el token
      const token = authService.getToken()

      const response = await fetch(`http://localhost:3000/api/cita/${props.cita.codsolicitud}`, {
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
          throw new Error('No se puede eliminar esta cita.')
        }
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      alert('Cita eliminada correctamente')
      window.location.reload()
    } catch (error) {
      console.error('Error eliminando Cita:', error)
      alert(`Error al eliminar: ${error.message}`)
    }
  }
  return { actual, esFechaFutura, confirmarEliminacion }
}
