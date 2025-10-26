<template>
  <div class="Agendar-Panel">
    <h1>Agendar Cita</h1>
    <div class="container">
      <TratamientoBanner :tratamiento="tratData"></TratamientoBanner>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <form @submit="agendar">
        <div class="form-input">
          <label for="fecha">Fecha de Cita</label>
          <input type="date" v-model="fechaC" name="fecha" required />
        </div>
        <div class="form-input">
          <label for="hora">Hora de Cita</label>
          <input type="time" v-model="hora" name="hora" required />
        </div>
        <input type="submit" value="Agendar Cita" />
      </form>
    </div>
  </div>
</template>

<style scoped src="./CSS/AgendarCita.css"></style>

<script setup>
import TratamientoBanner from '@/TratamientoSection/components/TratamientoBanner.vue'
import { onMounted, ref, watch } from 'vue'
import { authService } from '@/Authentication/services/auth'
import { tratamientoStore } from '@/TratamientoSection/stores/TratamientoReservar'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

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

    const response = await fetch('http://localhost:3000/api/cita', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        codsolicitud: 'z7ccd3cf-dd97-4e81-83af-fae01e33f261',
        tratamiento__codtratamiento: CodTrat.value,
        tratamiento__categoria_codcategoria: CodCategoria.value,
        cliente__idcliente: cliente,
        fecha: fechaC.value,
        horacita: hora.value,
        observaciones: '',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error al registrar usuario')
    }
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
  if (selectedDate.getDay() === 0) {
    return 'No se pueden agendar citas los domingos'
  }

  // Validar tratamiento
  if (!CodTrat.value || !CodCategoria.value) {
    return 'Debe seleccionar un tratamiento válido'
  }

  return null
}
</script>
