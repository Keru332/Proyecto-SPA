import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
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
    codcategoria: '',
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

      await proxy.$alert('Tratamiento creado correctamente')
      router.push('/productos')
    } catch (error) {
<<<<<<< Updated upstream
      console.log(error)
      mensaje.value = 'Error al crear el tratamiento'
=======
      console.error('Error:', error)
      if (error.response) {
        mensaje.value = `${error.response.data?.error || 'Error al crear el tratamiento'}: ${error.response.data?.message}`
      } else {
        mensaje.value = 'Error de conexión con el servidor'
      }
>>>>>>> Stashed changes
    }
  }

  onMounted(async () => {
    // Cargar categorías
    await fetchCategorias()
  })

  return { router, tratamiento, categorias, submitForm, mensaje }
}
