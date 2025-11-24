import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categoriaStore } from '../../stores/CategoriaStore'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
import categoriaService from '@/services/categoriaService'
import { useAlertaConfirmacion } from '@/plantilla confirmacion/Plantilla confirmacion.vue'
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
  const { mostrarConfirmacion } = useAlertaConfirmacion()

  watch(catData, (newCatData) => {
    if (newCatData) {
      categoria_actualizada.codcategoria = newCatData.codcategoria
      categoria_actualizada.nombrecategoria = newCatData.nombrecategoria
    }
  })

  const submitForm = () => {
    mostrarConfirmacion({
      titulo: 'Confirmar Edición',
      mensaje: '¿Estás seguro de que deseas guardar los cambios en esta categoría?',
      tipo: 'info',
      textoAceptar: 'Sí, guardar',
      textoCancelar: 'Cancelar',
      onAceptar: confirmarEdicion
    })
  }

  const confirmarEdicion = async () => {
    try {
      const dato_actualizado = {
        nombrecategoria: categoria_actualizada.nombrecategoria,
      }

      await categoriaService.update(categoria_actualizada.codcategoria, dato_actualizado)

      mensaje.value = 'Categoría actualizada correctamente!'

      categoria_actualizada.nombre = ''
     
      mostrarConfirmacion({
        titulo: '¡Éxito!',
        mensaje: 'Categoría editada correctamente',
        tipo: 'exito',
        textoAceptar: 'Aceptar',
        onAceptar: () => router.push('/cat')
      })
     
    } catch (error) {
      if (error.response) {
        mensaje.value = `Error: ${error.response.data?.error || 'Error al actualizar la categoria'}`
      } else {
        mensaje.value = 'Error de conexión con el servidor'
      }
     
      mostrarConfirmacion({
        titulo: 'Error',
        mensaje: mensaje.value,
        tipo: 'peligro',
        textoAceptar: 'Aceptar'
      })
    }
  }

  onMounted(async () => {
    const catID = route.params.id
    await catStore.fetchcategoria(catID)
  })

  return {
    route,
    catStore,
    catData,
    categoria,
    submitForm,
    categoria_actualizada,
    mensaje,
    router
  }
}
