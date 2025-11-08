import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/Authentication/services/auth'

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

  // Función para cargar las categorías desde la API
  const fetchCategorias = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/categoria')
      if (!response.ok) {
        throw new Error('Error al cargar categorías')
      }
      const data = await response.json()
      categorias.value = data
    } catch (error) {
      console.error('Error:', error)
      mensaje.value = 'Error al cargar las categorías'
    }
  }

  const mensaje = ref('')

  const submitForm = async () => {
    try {
      const token = authService.getToken()
      // Preparar los datos para enviar
      const datosActualizados = {
        nombretratamiento: tratamiento.nombre,
        descripcion: tratamiento.descripcion,
        frecuenciadesolicitudmensual: 0,
        duracion: parseInt(tratamiento.duracion),
        precio: parseFloat(tratamiento.precio),
        categoria_codcategoria: tratamiento.codcategoria,
      }

      const response = await fetch(`http://localhost:3000/api/tratamiento/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datosActualizados),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el tratamiento')
      }

      mensaje.value = 'Tratamiento creado correctamente!'

      // Limpiar formulario
      tratamiento.nombre = ''
      tratamiento.descripcion = ''
      tratamiento.duracion = ''
      tratamiento.precio = ''
      tratamiento.codcategoria = ''

      alert('Tratamiento creado correctamente')
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
