<template>
  <div class="ListaTrat-Container">
    <TratamientoBanner
      v-for="tratamiento in tratamientos"
      :key="tratamiento.id"
      :tratamiento="tratamiento"
    />
    <p v-if="tratamientos.length === 0">No hay Tratamientos</p>
  </div>
</template>

<script setup>
import TratamientoBanner from './TratamientoBanner.vue'
import { ref } from 'vue'

const tratamientos = ref([
  {
    id: 1,
    nombreTratamiento: 'Aguas',
    categoria: 'ehe',
    precioTrat: 7,
    duracion: 9,
    descripcion: 'La vida es eterna como la todopoderosa Raiden Shogun',
  },
  {
    id: 2,
    nombreTratamiento: 'Tierras',
    categoria: 'ehe',
    precioTrat: 10,
    duracion: 20,
    descripcion: 'La vida es eterna como la todopoderosa Raiden Shogun',
  },
])
</script>

<style scoped>
.ListaTrat-Container {
  display: flex;
}
</style>
