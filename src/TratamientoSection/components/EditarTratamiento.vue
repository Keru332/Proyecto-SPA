<template>
  <div class="login-container">
    <h1>Editar Tratamiento</h1>
    <form class="login-form" @submit.prevent="submitForm">
      <div class="user-container">
        <label for="nombre">Nombre del Tratamiento</label>
        <input
          type="text"
          id="nombre"
          v-model="tratamiento.nombre"
          placeholder="Ejemplo: Masaje relajante"
          required
        />
      </div>

      <div class="user-container">
        <label for="descripcion">Descripción</label>
        <input
          type="text"
          id="descripcion"
          v-model="tratamiento.descripcion"
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
          v-model="tratamiento.duracion"
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
          v-model="tratamiento.precio"
          placeholder="0"
          required
        />
      </div>

      <div class="user-container">
        <label for="categoria">Categoría</label>
        <input
          type="text"
          id="categoria"
          v-model="tratamiento.categoria"
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
import { reactive } from 'vue'
import { onMounted, ref, watch } from 'vue'
import { tratamientoStore } from '@/TratamientoSection/stores/TratamientoReservar'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

const route = useRoute()
const tratStore = tratamientoStore()
const { trat } = storeToRefs(tratStore)
const tratData = trat

const CodTrat = ref(null)
const CodCategoria = ref(null)

watch(tratData, (newTratData) => {
  if (newTratData) {
    CodTrat.value = newTratData.codtratamiento
    CodCategoria.value = newTratData.codcategoria
  }
})

const tratamiento = reactive({
  nombre: '',
  descripcion: '',
  duracion: '',
  precio: '',
  categoria: '',
})

onMounted(async () => {
  const tratID = route.params.id
  await tratStore.fetchTratamiento(tratID)

  tratamiento.nombre = tratData.value.nombretratamiento
  tratamiento.descripcion = tratData.value.descripcion
  tratamiento.duracion = tratData.value.duracion
  tratamiento.precio = tratData.value.precio
  tratamiento.categoria = tratData.value.nombrecategoria
})

const mensaje = ref('')

const submitForm = () => {
  console.log('Tratamiento creado:', { ...tratamiento })
  mensaje.value = 'Tratamiento creado correctamente!'

  tratamiento.nombre = ''
  tratamiento.descripcion = ''
  tratamiento.duracion = ''
  tratamiento.precio = ''
  tratamiento.categoria = ''
}
</script>

<style scoped src="./CSS/CrearTratamiento.css"></style>
