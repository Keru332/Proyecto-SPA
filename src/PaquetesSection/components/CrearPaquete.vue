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
                :key="tratamiento.id"
                class="list-item"
                :class="{ selected: tratamiento.selected }"
                @click="toggleSelection(tratamiento, 'paquete')"
              >
                {{ tratamiento.nombre }}
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
                :key="tratamiento.id"
                class="list-item"
                :class="{ selected: tratamiento.selected }"
                @click="toggleSelection(tratamiento, 'disponibles')"
              >
                {{ tratamiento.nombre }}
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
import {reactive, ref, computed} from 'vue'

// Datos de ejemplo para tratamientos disponibles
const tratamientosIniciales = [
  { id: 1, nombre: 'Masaje sueco', duracion: 60, precio: 50 },
  { id: 2, nombre: 'Masaje deportivo', duracion: 45, precio: 40 },
  { id: 3, nombre: 'Facial hidratante', duracion: 30, precio: 35 },

]

const paquete = reactive({
  nombrepaquete: '',
  duraciontotal: '',
  preciopaquete: '',
  tratamientos: [],
})

const mensaje = ref('')
const tratamientosDisponibles = ref([...tratamientosIniciales])
const tratamientosPaquete = ref([])


const haySeleccionadosDisponibles = computed(() => {
  return tratamientosDisponibles.value.some(t => t.selected)
})

const haySeleccionadosPaquete = computed(() => {
  return tratamientosPaquete.value.some(t => t.selected)
})


const toggleSelection = (tratamiento, lista) => {
  tratamiento.selected = !tratamiento.selected
}


const moverADerecha = () => {
  const seleccionados = tratamientosDisponibles.value.filter(t => t.selected)
 

  tratamientosDisponibles.value = tratamientosDisponibles.value.filter(t => !t.selected)
 

  seleccionados.forEach(t => {
    t.selected = false 
    tratamientosPaquete.value.push(t)
  })
 

  paquete.tratamientos = tratamientosPaquete.value.map(t => t.id)
}


const moverAIzquierda = () => {
  const seleccionados = tratamientosPaquete.value.filter(t => t.selected)
 

  tratamientosPaquete.value = tratamientosPaquete.value.filter(t => !t.selected)
 
 
  seleccionados.forEach(t => {
    t.selected = false 
    tratamientosDisponibles.value.push(t)
  })
 

  paquete.tratamientos = tratamientosPaquete.value.map(t => t.id)
}

const submitForm = () => {
  console.log('Paquete creado:', { ...paquete })
  mensaje.value = 'Paquete creado correctamente!'

  // Resetear formulario
  paquete.nombrepaquete = ''
  paquete.duraciontotal = ''
  paquete.preciopaquete = ''
  paquete.tratamientos = []
 
  // Resetear listas
  tratamientosDisponibles.value = [...tratamientosIniciales]
  tratamientosPaquete.value = []
}
</script>

<style scoped src="./CSS/CrearPaquete.css"></style>
