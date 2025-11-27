import { reactive, ref, onMounted, getCurrentInstance} from 'vue'
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
  const { proxy } = getCurrentInstance()

  // Función para cargar las categorías desde la API
  const fetchCategorias = async () => {
    try {
      const data = await categoriaService.getAll()
      categorias.value = data
    } catch (error) {
      console.error('Error:', error)
      mensaje.value = 'Error al cargar las categorías'
    }
  }

  const mensaje = ref('')

  const submitForm = async () => {
    try {
      // Preparar los datos para enviar
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

      // Limpiar formulario
      tratamiento.nombre = ''
      tratamiento.descripcion = ''
      tratamiento.duracion = ''
      tratamiento.precio = ''
      tratamiento.codcategoria = ''

      await proxy.$alert('Tratamiento creado correctamente')
      router.push('/productos')
    } catch (error) {
      console.error('Error:', error)
      mensaje.value = 'Error al crear el tratamiento'
    }
  }

  onMounted(async () => {
    // Cargar categorías
    await fetchCategorias()
  })

  return { router, tratamiento, categorias, submitForm, mensaje }
}
