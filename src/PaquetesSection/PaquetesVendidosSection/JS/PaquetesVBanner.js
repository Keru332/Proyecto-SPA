import { computed } from 'vue'
import paqueteVendidoService from '@/services/paqueteVendidoService'
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
      console.log('Valores para eliminar:', {
        codpaquete: props.paquetev.paquete__codpaquete,
        idcliente: props.paquetev.cliente__idcliente,
        fechacompra: props.paquetev.fechacompra,
      })
      await paqueteVendidoService.delete(
        props.paquetev.paquete__codpaquete,
        props.paquetev.cliente__idcliente,
        props.paquetev.fechacompra,
      )

      alert('Paquete vendidos eliminado correctamente')
      window.location.reload()
    } catch (error) {
      console.error('Error eliminando paquete vendido:', error)
      alert(`Error al eliminar: ${error.message}`)
    }
  }
  return { actual, esFechaFutura, confirmarEliminacion }
}
