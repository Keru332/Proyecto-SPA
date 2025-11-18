import { onMounted, ref, watch } from 'vue'
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

      await citaService.create(body)

      alert('Cita agendada correctamente')
      router.push('/')
    } catch (error) {
      errorMessage.value = `❌ Error: ${error.message}`
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

    // Validar horario laboral (ejemplo: 8:00 - 18:00)
    const [hours] = hora.value.split(':').map(Number)
    if (hours < 8 || hours > 18) {
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
