import { ref, onMounted } from 'vue'
import { authService } from '@/Authentication/services/auth'
import { computed } from 'vue'

export function usePaqueteSelection() {
  const paquetes = ref([])
  const loading = ref(true)
  const error = ref('')

  const paquetesFiltrados = computed(() => {
    if (authService.isUser()) {
      return paquetes.value.filter((e) => e.tratamientos && e.tratamientos.length > 0)
    }
    return paquetes.value
  })

  const fetchPaquetes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/paquete/')
      if (!response.ok) throw new Error(`Error ${response.status}`)
      paquetes.value = await response.json()
      await fetchPaquetesTratamiento()
    } catch (err) {
      console.error('Error cargando paquetes:', err)
      error.value = 'No se pudieron cargar los paquetes.'
    } finally {
      loading.value = false
      if (authService.isUser()) {
        paquetes.value = paquetes.value.filter((e) => e.tratamientos && e.tratamientos.length > 0)
      }
    }
  }
  const fetchPaquetesTratamiento = async () => {
    const promises = paquetes.value.map(async (paquete, index) => {
      try {
        const response = await fetch(`http://localhost:3000/api/paq_trat/${paquete.codpaquete}`)
        if (!response.ok) throw new Error(`Error ${response.status}`)
        paquetes.value[index].tratamientos = []
        paquetes.value[index].tratamientos = await response.json()
      } catch (err) {
        console.error('Error cargando paquetes:', err)
      }
    })
    await Promise.all(promises)
  }

  onMounted(fetchPaquetes)

  return { paquetes, loading, error, paquetesFiltrados }
}
