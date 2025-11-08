import { ref, reactive } from 'vue'
import { authService } from '@/Authentication/services/auth'
import { useRoute, useRouter } from 'vue-router'
import { categoriaStore } from '../../stores/CategoriaStore'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'

export function useEditarCategoria() {
  const route = useRoute()
  const catStore = categoriaStore()
  const { categoria } = storeToRefs(catStore)
  const catData = categoria

  const categoria_actualizada = reactive({
    codcategoria: Object,
    nombrecategoria: '',
  })
  const mensaje = ref('')
  const router = useRouter()

  watch(catData, (newCatData) => {
    if (newCatData) {
      categoria_actualizada.codcategoria = newCatData.codcategoria
      categoria_actualizada.nombrecategoria = newCatData.nombrecategoria
    }
  })

  const submitForm = async () => {
    try {
      const token = authService.getToken()
      const dato_actualizado = {
        nombrecategoria: categoria_actualizada.nombrecategoria,
      }

      const response = await fetch(
        `http://localhost:3000/api/categoria/${categoria_actualizada.codcategoria}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dato_actualizado),
        },
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar la categoria')
      }

      mensaje.value = 'categoria actualizada correctamente!'

      categoria_actualizada.nombre = ''
      alert('Categoria editada correctamente')
      router.push('/cat')
    } catch (error) {
      console.error('Error:', error)
      mensaje.value = 'Error al actualizar la categoria'
    }
  }

  onMounted(async () => {
    const catID = route.params.id
    await catStore.fetchcategoria(catID)
  })

  return { route, catStore, catData, categoria, submitForm, categoria_actualizada, mensaje, router }
}
