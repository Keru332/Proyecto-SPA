import { authService } from '@/Authentication/services/auth'
import { computed } from 'vue'

export function usePaquetesVBanner(props) {
  const actual = new Date()
  const esFechaFutura = computed(() => {
    if (!props.paquetev.fechafin) return false

    const fechaCita = new Date(props.paquetev.fechafin)
    return fechaCita > actual
  })

  const confirmarEliminacion = () => {
    if (
      confirm(
        '¿Estás seguro de que deseas cancelar este paquete vendido? Esta acción no se puede deshacer.',
      )
    ) {
      eliminarPaquetev()
    }
  }

  const eliminarPaquetev = async () => {
    try {
      // Obtener el token
      const token = authService.getToken()
      console.log('Valores para eliminar:', {
        codpaquete: props.paquetev.paquete__codpaquete,
        idcliente: props.paquetev.cliente__idcliente,
        fechacompra: props.paquetev.fechacompra,
      })

      const response = await fetch(
        `http://localhost:3000/api/paquetevendido/${props.paquetev.paquete__codpaquete}/${props.paquetev.cliente__idcliente}/${props.paquetev.fechacompra}`,
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
          throw new Error('No se puede eliminar este paquete vendido.')
        }
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      alert('Paquete vendidos eliminado correctamente')
      window.location.reload()
    } catch (error) {
      console.error('Error eliminando paquete vendido:', error)
      alert(`Error al eliminar: ${error.message}`)
    }
  }
  return { actual, esFechaFutura, confirmarEliminacion }
}
