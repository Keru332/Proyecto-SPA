import { ref } from 'vue'
import { useRouter } from 'vue-router'
import categoriaService from '@/services/categoriaService'

export function useCrearCategoria() {
  const router = useRouter()

  const categoria = ref({
    nombre: '',
  })

  const mostrarAlerta = ref(false)
  const alertaTitulo = ref('')
  const alertaMensaje = ref('')

  const mensaje = ref('')

  const submitForm = async () => {
    try {
      const dato_actualizado = {
        nombrecategoria: categoria.value.nombre,
      }

      await categoriaService.create(dato_actualizado)

      alertaTitulo.value = '¡Éxito!'
      alertaMensaje.value = 'Categoria creada correctamente!'
      mostrarAlerta.value = true  
     
      mensaje.value = 'Categoria creada correctamente!' 
     

     
    } catch (error) {
      if (error.response) {
        
        alertaTitulo.value = 'Error'
        alertaMensaje.value = `Error: ${error.response.data?.error || 'Error al crear la categoria'}`
        mostrarAlerta.value = true
       
        mensaje.value = `Error: ${error.response.data?.error || 'Error al crear la categoria'}`
      } else {
        alertaTitulo.value = 'Error'
        alertaMensaje.value = 'Error de conexión con el servidor'
        mostrarAlerta.value = true
       
        mensaje.value = 'Error de conexión con el servidor'
      }
    }
  }

  return {
    router,
    categoria,
    mensaje,
    
    mostrarAlerta,
    alertaTitulo,
    alertaMensaje,
    submitForm
  }
}

