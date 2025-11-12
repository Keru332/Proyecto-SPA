import { ref, onMounted } from 'vue'
import categoriaService from '@/services/categoriaService'

//import { authService } from '@/Authentication/services/auth'
export function useCategoriasSelection() {
  const categorias = ref([])
  const loading = ref(true)
  const error = ref('')

  const fetchcategorias = async () => {
    try {
      const response = await categoriaService.getAll()
      categorias.value = response
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
