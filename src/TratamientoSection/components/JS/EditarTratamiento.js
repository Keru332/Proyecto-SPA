import { reactive, ref, onMounted, watch } from 'vue'
import { tratamientoStore } from '@/TratamientoSection/stores/TratamientoReservar'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/Authentication/services/auth'

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

  // Función para actualizar el tratamiento
  const submitForm = async () => {
    try {
      const token = authService.getToken()
      // Preparar los datos para enviar
      const datosActualizados = {
        nombretratamiento: tratamientoF.nombre,
        descripcion: tratamientoF.descripcion,
        duracion: parseInt(tratamientoF.duracion),
        precio: parseFloat(tratamientoF.precio),
        categoria_codcategoria: tratamientoF.codcategoria,
      }

      const response = await fetch(
        `http://localhost:3000/api/tratamiento/${tratamientoF.codtratamiento}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(datosActualizados),
        },
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el tratamiento')
      }

      mensaje.value = 'Tratamiento actualizado correctamente!'

      // Limpiar formulario
      tratamientoF.nombre = ''
      tratamientoF.descripcion = ''
      tratamientoF.duracion = ''
      tratamientoF.precio = ''
      tratamientoF.codcategoria = ''

      alert('Tratamiento editado correctamente')
      router.push('/')
    } catch (error) {
      console.error('Error:', error)
      mensaje.value = 'Error al actualizar el tratamiento'
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

  return { tratData, tratamientoF, mensaje, categorias, submitForm }
}
