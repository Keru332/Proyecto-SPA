import { ref, onMounted } from 'vue'
import { authService } from '@/Authentication/services/auth'

export function useTratamientoSeleccion() {
  const tratamientos = ref([])

  const loading = ref(true)
  const error = ref('')

  const headers = authService.getAuthHeaders()

  const fetchTratamientos = async () => {
    try {
      const responseTratamiento = await fetch(`http://localhost:3000/api/tratamiento/`, {
        method: 'GET',
        headers: headers,
      })
      if (!responseTratamiento.ok) {
        if (responseTratamiento.status === 401) {
          throw new Error('Token inválido o expirado')
        } else if (responseTratamiento.status === 403) {
          throw new Error('No tienes permisos para ver los tratamientos')
        } else {
          throw new Error(`Error ${responseTratamiento.status}: ${responseTratamiento.statusText}`)
        }
      }
      tratamientos.value = await responseTratamiento.json()
    } catch (err) {
      tratamientos.value.error
      error.value = 'No se pudo cargar el tratamiento'
      console.error('Error:', err)
    } finally {
      loading.value = false
    }
    tratamientos.value
  }

  // Cargar el tratamiento al montar el componente
  onMounted(() => {
    fetchTratamientos()
  })

  return { tratamientos, loading, error }
}
