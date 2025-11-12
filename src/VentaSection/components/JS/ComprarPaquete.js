import { onMounted, ref, watch } from 'vue'
import { authService } from '@/Authentication/services/auth'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { paqueteStore } from '@/PaquetesSection/stores/PaqueteReservar'
import paqueteVendidoService from '@/services/paqueteVendidoService'

export function useComprarPaquete() {
  const route = useRoute()
  const router = useRouter()
  const paqStore = paqueteStore()
  const { paquete } = storeToRefs(paqStore)
  const paqData = paquete

  const fechaI = ref('')
  const fechaF = ref('')
  const CodPaquete = ref(null)
  const cliente = authService.getUser().codcliente
  const loading = ref(false)
  const errorMessage = ref('')

  watch(paqData, (newTratData) => {
    if (newTratData) {
      CodPaquete.value = newTratData.codpaquete
    }
  })

  onMounted(async () => {
    const paqID = route.params.id
    await paqStore.fetchPaquete(paqID)
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
        cliente__idcliente: cliente,
        paquete__codpaquete: CodPaquete.value,
        fechacompra: new Date(),
        fechainicio: fechaI.value,
        fechafin: fechaF.value,
      })

      await paqueteVendidoService.create(body)

      alert('Paquete Comprado correctamente')
      router.push('/')
    } catch (error) {
      errorMessage.value = `❌ Error: ${error.message}`
    } finally {
      loading.value = false
    }
  }

  const validateForm = () => {
    // Validar fecha
    if (!fechaI.value) {
      return 'La fecha es requerida'
    }

    // Validar que la fecha no sea en el pasado
    const selectedDate = new Date(fechaI.value)
    const fechaFinDate = new Date(fechaF.value)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset hours to compare only dates

    if (selectedDate < today) {
      return 'No puedes agendar citas en fechas pasadas'
    }

    if (selectedDate > fechaFinDate) {
      return 'Fecha inicio no puede ser mayor que fecha fin'
    }

    return null
  }

  return { route, router, agendar, fechaI, fechaF, errorMessage, paqData }
}
