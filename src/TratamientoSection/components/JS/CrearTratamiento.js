import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import categoriaService from '@/services/categoriaService'
import tratamientoService from '@/services/tratamientoService'

export function useCrearTratamiento() {
  const router = useRouter()
  const tratamiento = reactive({
    codtratamiento: Object,
    nombre: '',
    descripcion: '',
    duracion: '',
    precio: '',
    codcategoria: Object,
  })
  const categorias = ref([])

  const mostrarAlerta = ref(false)
  const alertaTitulo = ref('')
  const alertaMensaje = ref('')

  const mensaje = ref('')

  const fetchCategorias = async () => {
    try {
      const data = await categoriaService.getAll()
      categorias.value = data
    } catch (error) {
      console.error('Error:', error)
      mensaje.value = 'Error al cargar las categorías'
     

      alertaTitulo.value = 'Error'
      alertaMensaje.value = 'Error al cargar las categorías'
      mostrarAlerta.value = true
    }
  }

  const submitForm = async () => {
    try {
     
      const datosActualizados = {
        nombretratamiento: tratamiento.nombre,
        descripcion: tratamiento.descripcion,
        frecuenciadesolicitudmensual: 0,
        duracion: parseInt(tratamiento.duracion),
        precio: parseFloat(tratamiento.precio),
        categoria_codcategoria: tratamiento.codcategoria,
      }

      await tratamientoService.create(datosActualizados)

      mensaje.value = 'Tratamiento creado correctamente!'

     
      alertaTitulo.value = '¡Éxito!'
      alertaMensaje.value = 'Tratamiento creado correctamente'
      mostrarAlerta.value = true


      tratamiento.nombre = ''
      tratamiento.descripcion = ''
      tratamiento.duracion = ''
      tratamiento.precio = ''
      tratamiento.codcategoria = ''


     
    } catch (error) {
      console.error('Error:', error)
      mensaje.value = 'Error al crear el tratamiento'
     

      alertaTitulo.value = 'Error'
      alertaMensaje.value = 'Error al crear el tratamiento'
      mostrarAlerta.value = true
    }
  }

  onMounted(async () => {

    await fetchCategorias()
  })

  return {
    router,
    tratamiento,
    categorias,
    submitForm,
    mensaje,
    mostrarAlerta,
    alertaTitulo,
    alertaMensaje
  }
}
