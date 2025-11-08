import { reactive, ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/Authentication/services/auth'
import { paqueteStore } from '../stores/PaqueteReservar'

export function useEditarPaquete() {
  const route = useRoute()
  const router = useRouter()
  const paqStore = paqueteStore()
  const { paquete } = storeToRefs(paqStore)

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
      const response = await fetch('http://localhost:3000/api/tratamiento')
      if (!response.ok) {
        throw new Error('Error al cargar tratamientos')
      }
      const data = await response.json()

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
      const token = authService.getToken()

      // 1. Actualizar datos básicos del paquete
      const datosActualizados = {
        nombrepaquete: paqueteF.nombrepaquete,
        preciopaquete: parseFloat(paqueteF.preciopaquete),
        duraciontotal: parseInt(paqueteF.duraciontotal),
      }

      const response = await fetch(`http://localhost:3000/api/paquete/${paqueteF.codpaquete}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datosActualizados),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el paquete')
      }

      // 2. Actualizar relaciones con tratamientos
      await actualizarRelacionesTratamientos()

      mensaje.value = 'Paquete actualizado correctamente!'

      alert('Paquete actualizado correctamente')
      router.push('/paquetes')
    } catch (error) {
      console.error('Error:', error)
      mensaje.value = 'Error al actualizar el paquete: ' + error.message
    }
  }

  const actualizarRelacionesTratamientos = async () => {
    const token = authService.getToken()

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
        const response = await fetch(
          `http://localhost:3000/api/paq_trat/${paqueteF.codpaquete}/${tratamientoId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!response.ok) {
          throw new Error(`Error al eliminar relación con tratamiento ${tratamientoId}`)
        }
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

        const response = await fetch(`http://localhost:3000/api/paq_trat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(relacionData),
        })

        if (!response.ok) {
          throw new Error(`Error al crear relación con tratamiento ${tratamientoId}`)
        }

        return await response.json()
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
