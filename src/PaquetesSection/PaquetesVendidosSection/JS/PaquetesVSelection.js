import { ref, onMounted, computed } from 'vue'
import paqueteVendidoService from '@/services/paqueteVendidoService'
export function usePaquetesVSelection() {
  const paquetesv = ref([])
  const loading = ref(true)
  const error = ref('')
  const filtroActivo = ref('')

  // Computed para el texto del filtro activo
  const textoFiltroActivo = computed(() => {
    const textos = {
      hoy: 'de hoy',
      semana: 'de esta semana',
      mes: 'de este mes',
      año: 'de este año',
    }
    return textos[filtroActivo.value] || ''
  })

  // Computed para las citas filtradas
  const paquetesvFiltrados = computed(() => {
    if (!filtroActivo.value) {
      return paquetesv.value
    }

    const hoy = new Date()
    let fechaInicio, fechaFin
    const lunes = new Date(hoy)
    const domingo = new Date(lunes)

    switch (filtroActivo.value) {
      case 'hoy':
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
        fechaFin = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1)
        break

      case 'semana':
        // Lunes de esta semana

        lunes.setDate(hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1))
        fechaInicio = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate())

        // Domingo de esta semana

        domingo.setDate(lunes.getDate() + 6)
        fechaFin = new Date(domingo.getFullYear(), domingo.getMonth(), domingo.getDate() + 1)
        break

      case 'mes':
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1)
        break

      case 'año':
        fechaInicio = new Date(hoy.getFullYear(), 0, 1)
        fechaFin = new Date(hoy.getFullYear() + 1, 0, 1)
        break
    }

    return paquetesv.value.filter((paquetev) => {
      try {
        const fechaPaquetev = new Date(paquetev.fechafin)
        return fechaPaquetev >= fechaInicio && fechaPaquetev < fechaFin
      } catch (error) {
        console.error('Error al filtrar paquete vendido:', error)
        return false
      }
    })
  })

  // Métodos para aplicar filtros
  const aplicarFiltro = (tipo) => {
    filtroActivo.value = tipo
  }

  const limpiarFiltro = () => {
    filtroActivo.value = ''
  }

  const fetchPaquetesV = async () => {
    try {
      const responsePaqueteV = await paqueteVendidoService.getAll()
      paquetesv.value = responsePaqueteV
    } catch (err) {
      error.value = 'No se pudo cargar los paquetes vendidos'
      console.error('Error:', err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchPaquetesV()
  })

  return {
    paquetesv,
    loading,
    error,
    filtroActivo,
    textoFiltroActivo,
    paquetesvFiltrados,
    aplicarFiltro,
    limpiarFiltro,
  }
}
