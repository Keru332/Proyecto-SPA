import { ref, reactive, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categoriaStore } from '../../stores/CategoriaStore'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
import categoriaService from '@/services/categoriaService'

export function useEditarCategoria() {
  const route = useRoute()
  const catStore = categoriaStore()
  const { categoria } = storeToRefs(catStore)
  const catData = categoria
  const { proxy } = getCurrentInstance()

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
      const dato_actualizado = {
        nombrecategoria: categoria_actualizada.nombrecategoria,
      }

      await categoriaService.update(categoria_actualizada.codcategoria, dato_actualizado)

      mensaje.value = 'categoria actualizada correctamente!'

      categoria_actualizada.nombre = ''
      await proxy.$alert('Categoria editada correctamente')
      router.push('/cat')
    } catch (error) {
      if (error.response) {
        mensaje.value = `Error: ${error.response.data?.error || 'Error al actualizar la categoria'}`
      } else {
        mensaje.value = 'Error de conexión con el servidor'
      }
    }
  }

  onMounted(async () => {
    const catID = route.params.id
    await catStore.fetchcategoria(catID)
  })

  return { route, catStore, catData, categoria, submitForm, categoria_actualizada, mensaje, router }
}
