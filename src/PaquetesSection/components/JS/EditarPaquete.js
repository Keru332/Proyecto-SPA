import { reactive, ref, computed, onMounted, watch, getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { paqueteStore } from '@/PaquetesSection/stores/PaqueteReservar'
import tratamientoService from '@/services/tratamientoService'
import paqTratService from '@/services/paqTratService'
import paqueteService from '@/services/paqueteService'
import { editarPaqueteSchema } from '../../schemas/validarEditarPaquete'

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
    tratamientos: [],
  })

  const errors = reactive({
    nombrepaquete: '',
    duraciontotal: '',
    preciopaquete: '',
    tratamientos: '',
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
    paqueteF.tratamientos = tratamientosPaquete.value.map((t) => t.codtratamiento)
    validateField('tratamientos')
  }

  const moverADerecha = () => {
    const seleccionados = tratamientosDisponibles.value.filter((t) => t.selected)

    tratamientosDisponibles.value = tratamientosDisponibles.value.filter((t) => !t.selected)

    seleccionados.forEach((t) => {
      t.selected = false
      tratamientosPaquete.value.push(t)
    })

    paqueteF.tratamientos = tratamientosPaquete.value.map((t) => t.codtratamiento)
    validateField('tratamientos')
  }

  const moverAIzquierda = () => {
    const seleccionados = tratamientosPaquete.value.filter((t) => t.selected)

    tratamientosPaquete.value = tratamientosPaquete.value.filter((t) => !t.selected)

    seleccionados.forEach((t) => {
      t.selected = false
      tratamientosDisponibles.value.push(t)
    })

    paqueteF.tratamientos = tratamientosPaquete.value.map((t) => t.codtratamiento)
    validateField('tratamientos')
  } /**
   * Valida un campo específico del formulario.
   * @param {string} fieldName - El nombre del campo a validar.
   */
  const validateField = async (fieldName) => {
    try {
      await editarPaqueteSchema.validateAt(fieldName, paqueteF)
      errors[fieldName] = '' // Limpiar error si es válido
    } catch (err) {
      errors[fieldName] = err.message
    }
  } /**
   * Valida todos los campos del formulario usando el schema de Yup.
   * @returns {boolean} true si la validación es exitosa, false en caso contrario.
   */

  const validateForm = async () => {
    for (const key in errors) {
      errors[key] = ''
    }

    try {
      await editarPaqueteSchema.validate(paqueteF, { abortEarly: false })
      return true
    } catch (err) {
      err.inner.forEach((error) => {
        errors[error.path] = error.message
      })
      return false
    }
  }

  const hasError = (fieldName) => {
    return !!errors[fieldName]
  }
  const fetchTratamientos = async () => {
    try {
      const response = await tratamientoService.getAll()
      const data = response

      const tratamientosConSelected = data.map((tratamiento) => ({
        ...tratamiento,
        selected: false,
      }))

      tratamientosDisponibles.value = tratamientosConSelected
    } catch (error) {
      console.error('Error:', error)
      if (error.response) {
        mensaje.value = `${error.response.data?.error || 'Error al cargar tratamientos'}: ${error.response.data?.message}`
      } else {
        mensaje.value = 'Error de conexión con el servidor'
      }
    }
  }

  const submitForm = async () => {
    mensaje.value = ''

    const isValid = await validateForm()
    if (!isValid) {
      mensaje.value = 'Por favor, corrija los errores del formulario.'
      return
    }

    try {
      const datosActualizados = {
        nombrepaquete: paqueteF.nombrepaquete,
        preciopaquete: parseFloat(paqueteF.preciopaquete),
        duraciontotal: parseInt(paqueteF.duraciontotal),
      }

      await paqueteService.update(paqueteF.codpaquete, datosActualizados)
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
      const tratamientosOriginalesIds = tratamientosOriginales.value.map((t) => t.codtratamiento)
      const tratamientosNuevosIds = tratamientosPaquete.value.map((t) => t.codtratamiento)
      const tratamientosAEliminar = tratamientosOriginalesIds.filter(
        (id) => !tratamientosNuevosIds.includes(id),
      )

      const tratamientosAAgregar = tratamientosNuevosIds.filter(
        (id) => !tratamientosOriginalesIds.includes(id),
      )

      const deletePromises = tratamientosAEliminar.map(async (tratamientoId) => {
        await paqTratService.delete(paqueteF.codpaquete, tratamientoId)
      })

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

      await Promise.all([...deletePromises, ...addPromises])
      console.log('Relaciones actualizadas correctamente')
    } catch (error) {
      console.error('Error actualizando relaciones:', error)
      throw new Error('Error al actualizar las relaciones con los tratamientos: ' + error.message)
    }
  }

  watch(paquete, (newPaqueteData) => {
    if (newPaqueteData) {
      paqueteF.codpaquete = newPaqueteData.codpaquete
      paqueteF.nombrepaquete = newPaqueteData.nombrepaquete
      paqueteF.duraciontotal = newPaqueteData.duraciontotal
      paqueteF.preciopaquete = newPaqueteData.preciopaquete

      if (newPaqueteData.tratamientos && newPaqueteData.tratamientos.length > 0) {
        const tratamientosConSelected = newPaqueteData.tratamientos.map((tratamiento) => ({
          ...tratamiento,
          selected: false,
        }))

        tratamientosPaquete.value = tratamientosConSelected
        tratamientosOriginales.value = [...tratamientosConSelected]

        paqueteF.tratamientos = tratamientosConSelected.map((t) => t.codtratamiento)

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
    await fetchTratamientos()

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
    errors,
    validateField,
    hasError,
  }
}
