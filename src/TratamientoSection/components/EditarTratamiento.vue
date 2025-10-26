<template>
  <div class="login-container">
    <h1>Editar Tratamiento</h1>
    <form class="login-form" @submit.prevent="submitForm">
      <div class="user-container">
        <label for="nombre">Nombre del Tratamiento</label>
        <input
          type="text"
          id="nombre"
          v-model="tratamientoF.nombre"
          placeholder="Ejemplo: Masaje relajante"
          required
        />
      </div>

      <div class="user-container">
        <label for="descripcion">Descripción</label>
        <input
          type="text"
          id="descripcion"
          v-model="tratamientoF.descripcion"
          placeholder="Describe el tratamiento"
          required
        />
      </div>

      <div class="user-container">
        <label for="duracion">Duración (minutos)</label>
        <input
          type="number"
          id="duracion"
          min="5"
          v-model="tratamientoF.duracion"
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
          v-model="tratamientoF.precio"
          placeholder="0"
          required
        />
      </div>

      <div class="user-container">
        <label for="categoria">Categoría</label>
        <input
          type="text"
          id="categoria"
          v-model="tratamientoF.categoria"
          placeholder="Relajación, Terapia, etc."
          required
        />
      </div>

      <button type="submit" class="submit">Editar Tratamiento</button>

      <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const tratamientoF = reactive({
  codtratamiento: Object,
  nombre: '',
  descripcion: '',
  duracion: '',
  precio: '',
  categoria: '',
})

const mensaje = ref('')

const submitForm = () => {
  console.log('Tratamiento creado:', { ...tratamiento })
  mensaje.value = 'Tratamiento creado correctamente!'

  tratamientoF.nombre = ''
  tratamientoF.descripcion = ''
  tratamientoF.duracion = ''
  tratamientoF.precio = ''
  tratamientoF.categoria = ''
}

import { onMounted, watch } from 'vue'
import { tratamientoStore } from '@/TratamientoSection/stores/TratamientoReservar'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

const route = useRoute()
const tratStore = tratamientoStore()
const { tratamiento } = storeToRefs(tratStore)
const tratData = tratamiento

const CodTrat = ref(null)
const CodCategoria = ref(null)

watch(tratData, (newTratData) => {
  if (newTratData) {
    CodTrat.value = newTratData.codtratamiento
    CodCategoria.value = newTratData.codcategoria
  }
})

onMounted(async () => {
  const tratID = route.params.id
  await tratStore.fetchTratamiento(tratID)

  tratamientoF.nombre = tratamiento.value.nombretratamiento
  tratamientoF.descripcion = tratamiento.value.descripcion
  tratamientoF.duracion = tratamiento.value.duracion
  tratamientoF.precio = tratamiento.value.precio
  tratamientoF.categoria = tratamiento.value.nombrecategoria
})
</script>

<style scoped src="./CSS/CrearTratamiento.css"></style>
