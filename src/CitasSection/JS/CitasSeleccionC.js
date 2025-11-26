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
      futuras: 'proximas',
      pasadas: 'anteriores',
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
      let responseCitas
      const userData = JSON.parse(localStorage.getItem('user'))
      console.log(userData)
      switch (tipo) {
        case 'hoy':
          responseCitas = await citaService.getByClienteFuturas(userData.codcliente)
          responseCitas = responseCitas.filter((c) => {
            return c.fecha == new Date()
          })
          break
        case 'pasadas':
          responseCitas = await citaService.getByClientePasadas(userData.codcliente)
          break
        case 'futuras':
          responseCitas = await citaService.getByClienteFuturas(userData.codcliente)
          break
      }

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
