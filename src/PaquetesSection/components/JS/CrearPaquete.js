import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import tratamientoService from '@/services/tratamientoService'
import paqTratService from '@/services/paqTratService'
import paqueteService from '@/services/paqueteService'

export function useCrearPaquete() {
  const router = useRouter()

  const paquete = reactive({
    nombrepaquete: '',
    duraciontotal: '',
    preciopaquete: '',
    tratamientos: [],
  })

  const mensaje = ref('')
  const tratamientosDisponibles = ref([])
  const tratamientosPaquete = ref([])
 

  const mostrarAlerta = ref(false)
  const alertaTitulo = ref('')
  const alertaMensaje = ref('')

  const haySeleccionadosDisponibles = computed(() => {
    return tratamientosDisponibles.value.some((t) => t.selected)
  })

  const haySeleccionadosPaquete = computed(() => {
    return tratamientosPaquete.value.some((t) => t.selected)
  })

  const toggleSelection = (tratamiento) => {
    tratamiento.selected = !tratamiento.selected
  }

  const moverADerecha = () => {
    const seleccionados = tratamientosDisponibles.value.filter((t) => t.selected)

    tratamientosDisponibles.value = tratamientosDisponibles.value.filter((t) => !t.selected)

    seleccionados.forEach((t) => {
      t.selected = false
      tratamientosPaquete.value.push(t)
    })

    paquete.tratamientos = tratamientosPaquete.value.map((t) => t.codtratamiento)
  }

  const moverAIzquierda = () => {
    const seleccionados = tratamientosPaquete.value.filter((t) => t.selected)

    tratamientosPaquete.value = tratamientosPaquete.value.filter((t) => !t.selected)

    seleccionados.forEach((t) => {
      t.selected = false
      tratamientosDisponibles.value.push(t)
    })

    paquete.tratamientos = tratamientosPaquete.value.map((t) => t.codtratamiento)
  }

  const submitForm = async () => {
    try {

      const datosActualizados = {
        nombrepaquete: paquete.nombrepaquete,
        preciopaquete: parseFloat(paquete.preciopaquete),
        duraciontotal: parseInt(paquete.duraciontotal),
      }

      const response = await paqueteService.create(datosActualizados)
      const data = response

      const codpaquete = data.codpaquete
      if (tratamientosPaquete.value.length > 0) {
        await fetchCrearPaquetesConTratamientos(codpaquete)
      }

      mensaje.value = 'Paquete creado correctamente!'


      alertaTitulo.value = '¡Éxito!'
      alertaMensaje.value = 'Paquete creado correctamente'
      mostrarAlerta.value = true


      paquete.nombrepaquete = ''
      paquete.duraciontotal = ''
      paquete.preciopaquete = ''
      paquete.tratamientos = []


      tratamientosPaquete.value = []


     
    } catch (error) {
      console.error('Error:', error)
      mensaje.value = 'Error al crear el paquete'
     
      
      alertaTitulo.value = 'Error'
      alertaMensaje.value = 'Error al crear el paquete'
      mostrarAlerta.value = true
    }
  }

  const fetchTratamientos = async () => {
    try {
      const response = await tratamientoService.getAll()
      const data = response
      tratamientosDisponibles.value = data
    } catch (error) {
      console.error('Error:', error)
      mensaje.value = 'Error al cargar las tratamientos'
     
     
      alertaTitulo.value = 'Error'
      alertaMensaje.value = 'Error al cargar los tratamientos'
      mostrarAlerta.value = true
    }
  }

  const fetchCrearPaquetesConTratamientos = async (codPaquete) => {
    try {
      
      const promises = tratamientosPaquete.value.map(async (tratamiento) => {
        const relacionData = {
          paquete__codpaquete: codPaquete,
          tratamiento__codtratamiento: tratamiento.codtratamiento,
          tratamiento__categoria_codcategoria: tratamiento.categoria_codcategoria,
        }

        const response = await paqTratService.create(relacionData)

        return response
      })


      await Promise.all(promises)
      console.log(`Se crearon ${promises.length} relaciones paquete-tratamiento`)
    } catch (error) {
      console.error('Error creando relaciones:', error)
     

      alertaTitulo.value = 'Error'
      alertaMensaje.value = 'Error al crear las relaciones con los tratamientos'
      mostrarAlerta.value = true
     
      throw new Error('Error al crear las relaciones con los tratamientos: ' + error.message)
    }
  }

  onMounted(async () => {
    await fetchTratamientos()
  })

  return {
    router,
    paquete,
    tratamientosDisponibles,
    tratamientosPaquete,
    mensaje,
    mostrarAlerta,
    alertaTitulo,
    alertaMensaje,
    submitForm,
    moverADerecha,
    moverAIzquierda,
    haySeleccionadosDisponibles,
    haySeleccionadosPaquete,
    toggleSelection,
    fetchCrearPaquetesConTratamientos,
    fetchTratamientos,
  }
}
