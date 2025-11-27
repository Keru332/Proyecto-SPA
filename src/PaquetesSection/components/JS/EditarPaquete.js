import { reactive, ref, computed, onMounted, watch, getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { paqueteStore } from '@/PaquetesSection/stores/PaqueteReservar'
import tratamientoService from '@/services/tratamientoService'
import paqTratService from '@/services/paqTratService'
import paqueteService from '@/services/paqueteService'

export function useEditarPaquete() {
  const route = useRoute()
  const router = useRouter()
  const paqStore = paqueteStore()
  const { paquete } = storeToRefs(paqStore)

  const { proxy } = getCurrentInstance()

  const paqueteF = reactive({
    codpaquete: null,
    nombrepaquete: '',
    duraciontotal: '',
    preciopaquete: '',
  })

  const mensaje = ref('')
  const tratamientosDisponibles = ref([])
  const tratamientosPaquete = ref([])
  const tratamientosOriginales = ref([])

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
  }

  const moverAIzquierda = () => {
    const seleccionados = tratamientosPaquete.value.filter((t) => t.selected)

    tratamientosPaquete.value = tratamientosPaquete.value.filter((t) => !t.selected)

    seleccionados.forEach((t) => {
      t.selected = false
      tratamientosDisponibles.value.push(t)
    })
  }

  // Función para cargar todos los tratamientos disponibles
  const fetchTratamientos = async () => {
    try {
      const response = await tratamientoService.getAll()
      const data = response

      // Agregar propiedad selected a cada tratamiento
      const tratamientosConSelected = data.map((tratamiento) => ({
        ...tratamiento,
        selected: false,
      }))

      tratamientosDisponibles.value = tratamientosConSelected
    } catch (error) {
      console.error('Error:', error)
      mensaje.value = 'Error al cargar los tratamientos'
    }
  }

  // Función para actualizar el paquete
  const submitForm = async () => {
    try {
      // 1. Actualizar datos básicos del paquete
      const datosActualizados = {
        nombrepaquete: paqueteF.nombrepaquete,
        preciopaquete: parseFloat(paqueteF.preciopaquete),
        duraciontotal: parseInt(paqueteF.duraciontotal),
      }

      await paqueteService.update(paqueteF.codpaquete, datosActualizados)

      // 2. Actualizar relaciones con tratamientos
      await actualizarRelacionesTratamientos()

      mensaje.value = 'Paquete actualizado correctamente!'

      await proxy.$alert('Paquete actualizado correctamente')
      router.push('/paquetes')
    } catch (error) {
      console.error('Error:', error)
      mensaje.value = 'Error al actualizar el paquete: ' + error.message
    }
  }

  const actualizarRelacionesTratamientos = async () => {
    try {
      // Obtener IDs de tratamientos actuales y nuevos
      const tratamientosOriginalesIds = tratamientosOriginales.value.map((t) => t.codtratamiento)
      const tratamientosNuevosIds = tratamientosPaquete.value.map((t) => t.codtratamiento)

      // Identificar tratamientos a eliminar (estaban pero ya no están)
      const tratamientosAEliminar = tratamientosOriginalesIds.filter(
        (id) => !tratamientosNuevosIds.includes(id),
      )

      // Identificar tratamientos a agregar (no estaban pero ahora están)
      const tratamientosAAgregar = tratamientosNuevosIds.filter(
        (id) => !tratamientosOriginalesIds.includes(id),
      )

      // Eliminar relaciones que ya no existen
      const deletePromises = tratamientosAEliminar.map(async (tratamientoId) => {
        await paqTratService.delete(paqueteF.codpaquete, tratamientoId)
      })

      // Agregar nuevas relaciones
      const addPromises = tratamientosAAgregar.map(async (tratamientoId) => {
        const tratamiento = tratamientosPaquete.value.find(
          (t) => t.codtratamiento === tratamientoId,
        )
        const relacionData = {
          paquete__codpaquete: paqueteF.codpaquete,
          tratamiento__codtratamiento: tratamiento.codtratamiento,
          tratamiento__categoria_codcategoria: tratamiento.categoria_codcategoria,
        }

        const response = await paqTratService.create(relacionData)

        return await response
      })

      // Esperar a que todas las operaciones se completen
      await Promise.all([...deletePromises, ...addPromises])
      console.log('Relaciones actualizadas correctamente')
    } catch (error) {
      console.error('Error actualizando relaciones:', error)
      throw new Error('Error al actualizar las relaciones con los tratamientos: ' + error.message)
    }
  }

  // Watcher para cuando se cargan los datos del paquete
  watch(paquete, (newPaqueteData) => {
    if (newPaqueteData) {
      // Actualizar el formulario con los datos del paquete
      paqueteF.codpaquete = newPaqueteData.codpaquete
      paqueteF.nombrepaquete = newPaqueteData.nombrepaquete
      paqueteF.duraciontotal = newPaqueteData.duraciontotal
      paqueteF.preciopaquete = newPaqueteData.preciopaquete

      // Configurar tratamientos del paquete
      if (newPaqueteData.tratamientos && newPaqueteData.tratamientos.length > 0) {
        const tratamientosConSelected = newPaqueteData.tratamientos.map((tratamiento) => ({
          ...tratamiento,
          selected: false,
        }))

        tratamientosPaquete.value = tratamientosConSelected
        tratamientosOriginales.value = [...tratamientosConSelected]

        // Actualizar tratamientos disponibles (excluyendo los que ya están en el paquete)
        if (tratamientosDisponibles.value.length > 0) {
          const tratamientosPaqueteIds = tratamientosConSelected.map((t) => t.codtratamiento)
          tratamientosDisponibles.value = tratamientosDisponibles.value.filter(
            (t) => !tratamientosPaqueteIds.includes(t.codtratamiento),
          )
        }
      }
    }
  })

  onMounted(async () => {
    // Cargar todos los tratamientos disponibles
    await fetchTratamientos()

    // Cargar datos del paquete
    const paqID = route.params.id
    await paqStore.fetchPaquete(paqID)
  })

  return {
    paqueteF,
    paquete,
    tratamientosDisponibles,
    tratamientosPaquete,
    tratamientosOriginales,
    mensaje,
    submitForm,
    moverADerecha,
    moverAIzquierda,
    haySeleccionadosDisponibles,
    haySeleccionadosPaquete,
    toggleSelection,
    fetchTratamientos,
    actualizarRelacionesTratamientos,
  }
}
