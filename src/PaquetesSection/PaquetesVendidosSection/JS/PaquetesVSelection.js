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
      anno: 'de este año',
    }
    return textos[filtroActivo.value] || ''
  })

  const paquetesvFiltrados = computed(() => {
    return paquetesv.value
  })

  const aplicarFiltro = async (tipo) => {
    filtroActivo.value = tipo
    loading.value = true
    error.value = ''

    try {
      const responsePaq = await paqueteVendidoService.getByPeriodo(tipo)
      paquetesv.value = responsePaq
    } catch (err) {
      error.value = 'No se pudo cargar las paquetes'
      console.error('Error:', err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    aplicarFiltro('hoy')
  })

  return {
    paquetesv,
    loading,
    error,
    filtroActivo,
    textoFiltroActivo,
    paquetesvFiltrados,
    aplicarFiltro,
  }
}
