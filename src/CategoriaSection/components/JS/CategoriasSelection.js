import { ref, onMounted } from 'vue'

//import { authService } from '@/Authentication/services/auth'
export function useCategoriasSelection() {
  const categorias = ref([])
  const loading = ref(true)
  const error = ref('')

  const fetchcategorias = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/categoria/')
      if (!response.ok) throw new Error(`Error ${response.status}`)
      categorias.value = await response.json()
    } catch (err) {
      console.error('Error cargando categorias:', err)
      error.value = 'No se pudieron cargar los categorias.'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchcategorias)

  return { categorias, loading, error, fetchcategorias }
}
