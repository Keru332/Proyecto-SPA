<template>
  <div class="login-container">
    <h1>Crear Paquete</h1>
    <form class="login-form" @submit.prevent="submitForm">
      <div class="user-container">
        <label for="nombre">Nombre del Paquete</label>
        <input
          type="text"
          id="nombre"
          v-model="paquete.nombrepaquete"
          placeholder="Ejemplo: Masaje relajante"
          required
        />
      </div>

      <div class="user-container">
        <label for="duracion">Duración (minutos)</label>
        <input
          type="number"
          id="duracion"
          min="5"
          max="1000"
          v-model="paquete.duraciontotal"
          placeholder="0"
          required
        />
      </div>

      <div class="user-container">
        <label for="precio">Precio ($)</label>
        <input
          type="number"
          id="precio"
          min="1"
          max="9999"
          v-model="paquete.preciopaquete"
          placeholder="0"
          required
        />
      </div>

      <div class="listas">
        <div class="container">
          <div class="list-container">
            <div class="list-title">Tratamientos del Paquete</div>
            <div class="list">
              <div
                v-for="tratamiento in tratamientosPaquete"
                :key="tratamiento.codtratamiento"
                class="list-item"
                :class="{ selected: tratamiento.selected }"
                @click="toggleSelection(tratamiento, 'paquete')"
              >
                {{ tratamiento.nombretratamiento }}
              </div>
            </div>
          </div>

          <div class="controls">
            <button
              type="button"
              class="transfer-left"
              @click="moverADerecha"
              :disabled="!haySeleccionadosDisponibles"
            >
              &lt;
            </button>
            <button
              type="button"
              class="transfer-right"
              @click="moverAIzquierda"
              :disabled="!haySeleccionadosPaquete"
            >
              &gt;
            </button>
          </div>

          <div class="list-container">
            <div class="list-title">Tratamientos Disponibles</div>
            <div class="list">
              <div
                v-for="tratamiento in tratamientosDisponibles"
                :key="tratamiento.codtratamiento"
                class="list-item"
                :class="{ selected: tratamiento.selected }"
                @click="toggleSelection(tratamiento, 'disponibles')"
              >
                {{ tratamiento.nombretratamiento }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button type="submit" class="submit">Crear Paquete</button>

      <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { authService } from '@/Authentication/services/auth'
import { useRouter } from 'vue-router'

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
    const token = authService.getToken()
    // Preparar los datos para enviar
    const datosActualizados = {
      nombrepaquete: paquete.nombrepaquete,
      preciopaquete: parseFloat(paquete.preciopaquete),
      duraciontotal: parseInt(paquete.duraciontotal),
    }

    const response = await fetch(`http://localhost:3000/api/paquete/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datosActualizados),
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error al crear el paquete')
    }
    const codpaquete = data.codpaquete
    if (tratamientosPaquete.value.length > 0) {
      await fetchCrearPaquetesConTratamientos(codpaquete)
    }

    mensaje.value = 'Paquete creado correctamente!'

    // Resetear formulario
    paquete.nombrepaquete = ''
    paquete.duraciontotal = ''
    paquete.preciopaquete = ''
    paquete.tratamientos = []

    // Resetear listas
    tratamientosPaquete.value = []

    alert('Paquete creado correctamente')
    router.push('/paquetes')
  } catch (error) {
    console.error('Error:', error)
    mensaje.value = 'Error al crear el paquete'
  }
}

const fetchTratamientos = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/tratamiento')
    if (!response.ok) {
      throw new Error('Error al cargar tratamientos')
    }
    const data = await response.json()
    tratamientosDisponibles.value = data
  } catch (error) {
    console.error('Error:', error)
    mensaje.value = 'Error al cargar las tratamientos'
  }
}

const fetchCrearPaquetesConTratamientos = async (codPaquete) => {
  const token = authService.getToken()
  try {
    // Crear una relación por cada tratamiento en el paquete
    const promises = tratamientosPaquete.value.map(async (tratamiento) => {
      const relacionData = {
        paquete__codpaquete: codPaquete,
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
        throw new Error(`Error al crear relación con tratamiento ${tratamiento.nombretratamiento}`)
      }

      return await response.json()
    })

    // Esperar a que todas las relaciones se creen
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
</script>

<style scoped src="./CSS/CrearPaquete.css"></style>
