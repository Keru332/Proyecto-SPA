<template>
  <div class="Agendar-Panel">
    <h1>Comprar Paquete</h1>
    <div class="container">
      <PaqueteBanner :paquete="paqData"></PaqueteBanner>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <form @submit="agendar">
        <div class="form-input">
          <label for="fecha">Fecha de Inicio</label>
          <input type="date" v-model="fechaI" name="fecha" required />
        </div>
        <div class="form-input">
          <label for="fechaF">Fecha de Fin</label>
          <input type="date" v-model="fechaF" name="fechaF" required />
        </div>
        <input type="submit" value="Comprar Paquete" />
      </form>
    </div>
  </div>
</template>

<style scoped src="./CSS/AgendarCita.css"></style>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { authService } from '@/Authentication/services/auth'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { paqueteStore } from '@/PaquetesSection/stores/PaqueteReservar'
import PaqueteBanner from '@/PaquetesSection/components/PaqueteBanner.vue'

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

    const response = await fetch('http://localhost:3000/api/paquetevendido', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cliente__idcliente: cliente,
        paquete__codpaquete: CodPaquete.value,
        fechacompra: new Date(),
        fechainicio: fechaI.value,
        fechafin: fechaF.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error al registrar usuario')
    }

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
</script>

<style scoped>
.container >>> .paquete-container {
  margin: auto;
}
</style>
