import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import categoriaService from '@/services/categoriaService'

export function useCrearCategoria() {
  const router = useRouter()
  const { proxy } = getCurrentInstance()

  const categoria = ref({
    nombre: '',
  })
  const mensaje = ref('')
  const submitForm = async () => {
    try {
      const dato_actualizado = {
        nombrecategoria: categoria.value.nombre,
      }

      await categoriaService.create(dato_actualizado)

      await proxy.$alert('Categoria Creada correctamente')
      router.push('/cat')
    } catch (error) {
      if (error.response) {
        mensaje.value = `${error.response.data?.error || 'Error al crear la categoria'}: ${error.response.data?.message}`
      } else {
        mensaje.value = 'Error de conexión con el servidor'
      }
    }
  }
  return { router, categoria, mensaje, submitForm }
}
