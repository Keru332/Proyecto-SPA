import { ref, onMounted } from 'vue'
import tratamientoService from '@/services/tratamientoService'

export function useTratamientoSeleccion() {
  const tratamientos = ref([])

  const loading = ref(true)
  const error = ref('')

  const fetchTratamientos = async () => {
    try {
      const responseTratamiento = await tratamientoService.getAll()
      tratamientos.value = responseTratamiento
    } catch (err) {
      error.value = 'No se pudo cargar el tratamiento'
      console.error('Error:', err)
    } finally {
      loading.value = false
    }
  }

  // Cargar el tratamiento al montar el componente
  onMounted(() => {
    fetchTratamientos()
  })

  return { tratamientos, loading, error }
}
