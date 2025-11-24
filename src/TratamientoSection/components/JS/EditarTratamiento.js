import { reactive, ref, onMounted, watch } from 'vue'
import { tratamientoStore } from '@/TratamientoSection/stores/TratamientoReservar'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import categoriaService from '@/services/categoriaService'
import tratamientoService from '@/services/tratamientoService'
import { useAlertaConfirmacion } from '@/plantilla confirmacion/Plantilla confirmacion.vue'
export function useEditarTratamiento() {
  const route = useRoute()
  const router = useRouter()
  const tratStore = tratamientoStore()
  const { tratamiento } = storeToRefs(tratStore)
  const tratData = tratamiento

  const tratamientoF = reactive({
    codtratamiento: Object,
    nombre: '',
    descripcion: '',
    duracion: '',
    precio: '',
    codcategoria: '',
  })

  const mensaje = ref('')
  const categorias = ref([])
  const CodTrat = ref(null)
  const CodCategoria = ref(null)
 

  const { mostrarConfirmacion } = useAlertaConfirmacion()


  const fetchCategorias = async () => {
    try {
      const data = await categoriaService.getAll()
      categorias.value = data
    } catch (error) {
      console.error('Error:', error)
      mensaje.value = 'Error al cargar las categorías'
     

      mostrarConfirmacion({
        titulo: 'Error',
        mensaje: 'Error al cargar las categorías',
        tipo: 'peligro',
        textoAceptar: 'Aceptar'
      })
    }
  }

  
  const submitForm = () => {
    mostrarConfirmacion({
      titulo: 'Confirmar Edición',
      mensaje: '¿Estás seguro de que deseas guardar los cambios en este tratamiento?',
      tipo: 'info',
      textoAceptar: 'Sí, guardar',
      textoCancelar: 'Cancelar',
      onAceptar: confirmarEdicion  
    })
  }


  const confirmarEdicion = async () => {
    try {
      const datosActualizados = {
        nombretratamiento: tratamientoF.nombre,
        descripcion: tratamientoF.descripcion,
        duracion: parseInt(tratamientoF.duracion),
        precio: parseFloat(tratamientoF.precio),
        categoria_codcategoria: tratamientoF.codcategoria,
      }

      await tratamientoService.update(tratamientoF.codtratamiento, datosActualizados)

      mensaje.value = 'Tratamiento actualizado correctamente!'

      // Limpiar formulario
      tratamientoF.nombre = ''
      tratamientoF.descripcion = ''
      tratamientoF.duracion = ''
      tratamientoF.precio = ''
      tratamientoF.codcategoria = ''


      mostrarConfirmacion({
        titulo: '¡Éxito!',
        mensaje: 'Tratamiento editado correctamente',
        tipo: 'exito',
        textoAceptar: 'Aceptar',
        onAceptar: () => router.push('/')  // 🔥 Redirigir después de aceptar
      })
     
    } catch (error) {
      console.error('Error:', error)
      mensaje.value = 'Error al actualizar el tratamiento'
     

      mostrarConfirmacion({
        titulo: 'Error',
        mensaje: 'Error al actualizar el tratamiento',
        tipo: 'peligro',
        textoAceptar: 'Aceptar'
      })
    }
  }

  watch(tratData, (newTratData) => {
    if (newTratData) {
      CodTrat.value = newTratData.codtratamiento
      CodCategoria.value = newTratData.codcategoria

      // Actualizar el formulario con los datos del tratamiento
      tratamientoF.codtratamiento = newTratData.codtratamiento
      tratamientoF.nombre = newTratData.nombretratamiento
      tratamientoF.descripcion = newTratData.descripcion
      tratamientoF.duracion = newTratData.duracion
      tratamientoF.precio = newTratData.precio
      tratamientoF.codcategoria = newTratData.codcategoria
    }
  })

  onMounted(async () => {
    // Cargar categorías
    await fetchCategorias()

    // Cargar datos del tratamiento
    const tratID = route.params.id
    await tratStore.fetchTratamiento(tratID)
  })

  return {
    tratData,
    tratamientoF,
    mensaje,
    categorias,
    submitForm
  }
}
