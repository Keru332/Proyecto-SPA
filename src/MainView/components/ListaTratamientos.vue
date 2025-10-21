<template>
  <div class="ListaTrat-Container">
    <TratamientoBanner
      v-for="tratamiento in tratamientos"
      :key="tratamiento.codtratamiento"
      :tratamiento="tratamiento"
      class="tratamiento"
    />
    <p v-if="tratamientos.length === 0">No hay Tratamientos</p>
  </div>
</template>

<script setup>
import TratamientoBanner from '../../TratamientoSection/components/TratamientoBanner.vue'

defineProps({
  tratamientos: {
    type: Array,
    required: true,
    default: () => [],
  },
})
</script>

<style scoped>
.ListaTrat-Container {
  display: flex;
  flex-wrap: wrap;
}

.tratamiento {
  width: 100%;
}

@media (max-width: 768px) {
  .ListaTrat-Container {
    flex-direction: column;
  }
}
</style>
