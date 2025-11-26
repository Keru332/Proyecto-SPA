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
      futuras: 'proximas',
      pasadas: 'anteriores',
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
      let responsePaquete
      const userData = JSON.parse(localStorage.getItem('user'))
      console.log(userData)
      switch (tipo) {
        case 'hoy':
          responsePaquete = await paqueteVendidoService.getByClienteFuturas(userData.codcliente)
          responsePaquete = responsePaquete.filter((c) => {
            const hoy = new Date()
            const fechaInicio = new Date(c.fechainicio)
            const fechaFin = new Date(c.fechafin)
            return hoy >= fechaInicio && hoy <= fechaFin
          })
          break
        case 'pasadas':
          responsePaquete = await paqueteVendidoService.getByClientePasadas(userData.codcliente)
          break
        case 'futuras':
          responsePaquete = await paqueteVendidoService.getByClienteFuturas(userData.codcliente)
          break
      }

      paquetesv.value = responsePaquete
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
