<template>
  <div class="trat-container">
    <div class="trat-header">
      <h2>{{ tratamiento.nombreTratamiento }}</h2>
      <h3>{{ tratamiento.categoria }}</h3>
    </div>
    <p>{{ tratamiento.descripcion }}</p>
    <div class="trat-informacion">
      <h4>Precio: {{ tratamiento.precioTrat }}</h4>
      <h4>Duracion: {{ tratamiento.duracion }}</h4>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tratamiento: {
    type: Object,
    required: true,
    default: () => ({
      id: Object,
      nombreTratamiento: '',
      categoria: '',
      precioTrat: 0,
      duracion: 0,
      descripcion: '',
    }),
  },
})
</script>

<style scoped></style>
