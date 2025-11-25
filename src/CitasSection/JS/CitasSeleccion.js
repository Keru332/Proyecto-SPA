import { ref, onMounted, computed } from 'vue'
import citaService from '@/services/citaService'

export function useCitasSeleccion() {
  const citas = ref([])
  const loading = ref(true)
  const error = ref('')
  const filtroActivo = ref('')

  const textoFiltroActivo = computed(() => {
    const textos = {
      hoy: 'de hoy',
      semana: 'de esta semana',
      mes: 'de este mes',
      anno: 'de este año',
    }
    return textos[filtroActivo.value] || ''
  })

  const citasFiltradas = computed(() => {
    return citas.value
  })

  // Métodos para aplicar filtros
  const aplicarFiltro = async (tipo) => {
    filtroActivo.value = tipo
    loading.value = true
    error.value = ''

    try {
      const responseCitas = await citaService.getByPeriodo(tipo)
      citas.value = responseCitas
    } catch (err) {
      error.value = 'No se pudo cargar las citas'
      console.error('Error:', err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    aplicarFiltro('hoy')
  })

  return {
    citas,
    loading,
    error,
    filtroActivo,
    textoFiltroActivo,
    citasFiltradas,
    aplicarFiltro,
  }
}
