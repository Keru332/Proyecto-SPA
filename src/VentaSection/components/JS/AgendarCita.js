import { onMounted, ref, watch, getCurrentInstance} from 'vue'
import { authService } from '@/Authentication/services/auth'
import { tratamientoStore } from '@/TratamientoSection/stores/TratamientoReservar'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import citaService from '@/services/citaService'

export function useAgendarCita() {
  const route = useRoute()
  const router = useRouter()
  const tratStore = tratamientoStore()
  const { tratamiento } = storeToRefs(tratStore)
  const tratData = tratamiento
  const { proxy } = getCurrentInstance()

  const fechaC = ref('')
  const hora = ref('')
  const CodTrat = ref(null)
  const CodCategoria = ref(null)
  const cliente = authService.getUser().codcliente
  const loading = ref(false)
  const errorMessage = ref('')

  watch(tratData, (newTratData) => {
    if (newTratData) {
      CodTrat.value = newTratData.codtratamiento
      CodCategoria.value = newTratData.codcategoria
    }
  })

  onMounted(async () => {
    const tratID = route.params.id
    await tratStore.fetchTratamiento(tratID)
  })

  const agendar = async (event) => {
    event.preventDefault()
    loading.value = true
    errorMessage.value = ''
    try {
      const validationError = validateForm()

      if (validationError) {
        throw new Error(validationError)
      }
      const body = JSON.stringify({
        codsolicitud: 'z7ccd3cf-dd97-4e81-83af-fae01e33f261',
        tratamiento__codtratamiento: CodTrat.value,
        tratamiento__categoria_codcategoria: CodCategoria.value,
        cliente__idcliente: cliente,
        fecha: fechaC.value,
        horacita: hora.value,
        observaciones: 'No hay.',
      })

      console.log(body)
      await citaService.create(body)

      await proxy.$alert('Cita agendada correctamente')
      router.push('/')
    } catch (error) {
      console.error('Error completo en agendar:', error)

      if (error.response) {
        errorMessage.value = `${error.response.data?.error || 'Error al agendar cita'}: ${error.response.data?.message}`
      } else {
        errorMessage.value = 'Error de conexión con el servidor'
      }
    } finally {
      loading.value = false
    }
  }

  const validateForm = () => {
    // Validar fecha
    if (!fechaC.value) {
      return 'La fecha es requerida'
    }

    // Validar que la fecha no sea en el pasado
    const selectedDate = new Date(fechaC.value)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset hours to compare only dates

    if (selectedDate < today) {
      return 'No puedes agendar citas en fechas pasadas'
    }

    // Validar hora
    if (!hora.value) {
      return 'La hora es requerida'
    }

    // Validar formato de hora
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(hora.value)) {
      return 'Formato de hora inválido'
    }

    const [hours] = hora.value.split(':').map(Number)
    if (hours < 9 || hours > 21) {
      return 'El horario de atención es de 8:00 AM a 6:00 PM'
    }

    // Validar que no sea domingo
    if (selectedDate.getDay() === 6) {
      return 'No se pueden agendar citas los domingos'
    }

    // Validar tratamiento
    if (!CodTrat.value || !CodCategoria.value) {
      return 'Debe seleccionar un tratamiento válido'
    }

    return null
  }

  return {
    route,
    router,
    tratData,
    tratStore,
    tratamiento,
    fechaC,
    hora,
    cliente,
    loading,
    errorMessage,
    agendar,
  }
}
