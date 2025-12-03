import { reactive, ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import tratamientoService from '@/services/tratamientoService'
import paqTratService from '@/services/paqTratService'
import paqueteService from '@/services/paqueteService'
// Importa el schema de validación de Yup
import { crearPaqueteSchema } from '../../schemas/validarCrearPaquete'

export function useCrearPaquete() {
  const router = useRouter()

  const { proxy } = getCurrentInstance()

  const paquete = reactive({
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

  const haySeleccionadosDisponibles = computed(() => {
    return tratamientosDisponibles.value.some((t) => t.selected)
  })

  const haySeleccionadosPaquete = computed(() => {
    return tratamientosPaquete.value.some((t) => t.selected)
  })

  const toggleSelection = (tratamiento) => {
    tratamiento.selected = !tratamiento.selected
    paquete.tratamientos = tratamientosPaquete.value.map((t) => t.codtratamiento)
    validateField('tratamientos')
  }

  const moverADerecha = () => {
    const seleccionados = tratamientosDisponibles.value.filter((t) => t.selected)

    tratamientosDisponibles.value = tratamientosDisponibles.value.filter((t) => !t.selected)

    seleccionados.forEach((t) => {
      t.selected = false
      tratamientosPaquete.value.push(t)
    })

    paquete.tratamientos = tratamientosPaquete.value.map((t) => t.codtratamiento)
    validateField('tratamientos')
  }

  const moverAIzquierda = () => {
    const seleccionados = tratamientosPaquete.value.filter((t) => t.selected)

    tratamientosPaquete.value = tratamientosPaquete.value.filter((t) => !t.selected)

    seleccionados.forEach((t) => {
      t.selected = false
      tratamientosDisponibles.value.push(t)
    })

    paquete.tratamientos = tratamientosPaquete.value.map((t) => t.codtratamiento)
    validateField('tratamientos')
  }

  /**
   * Valida todos los campos del formulario usando el schema de Yup.
   * @returns {boolean} true si la validación es exitosa, false en caso contrario.
   */
  const validateForm = async () => {
    // Limpiar errores anteriores
    for (const key in errors) {
      errors[key] = ''
    }

    try {
      await crearPaqueteSchema.validate(paquete, { abortEarly: false })
      return true
    } catch (err) {
      err.inner.forEach((error) => {
        errors[error.path] = error.message
      })
      return false
    }
  }
 
  /**
   * Valida un campo específico del formulario.
   * @param {string} fieldName - El nombre del campo a validar.
   */
  const validateField = async (fieldName) => {
    try {
      await crearPaqueteSchema.validateAt(fieldName, paquete)
      errors[fieldName] = ''
    } catch (err) {
      errors[fieldName] = err.message
    }
  }

  const hasError = (fieldName) => {
    return !!errors[fieldName]
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

      for (const key in errors) {
        errors[key] = ''
      }

      tratamientosPaquete.value = []

      await proxy.$alert('Paquete creado correctamente')
      router.push('/paquetes')
    } catch (error) {
      console.error('Error:', error)
      mensaje.value = 'Error al crear el paquete'
    }
  }

  const fetchTratamientos = async () => {
    try {
      const response = await tratamientoService.getAll()
      const data = response
      tratamientosDisponibles.value = data.map(t => ({...t, selected: false}))
    } catch (error) {
      console.error('Error:', error)
      mensaje.value = 'Error al cargar las tratamientos'
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
    submitForm,
    moverADerecha,
    moverAIzquierda,
    haySeleccionadosDisponibles,
    haySeleccionadosPaquete,
    toggleSelection,
    errors,
    validateField,
    hasError,
    fetchCrearPaquetesConTratamientos,
    fetchTratamientos,
  }
}
