<template>
  <div class="trat-container">
    <div class="trat-badge">
      <span>{{ tratamiento.categoria }}</span>
    </div>
    <div class="trat-header">
      <h1>{{ tratamiento.nombreTratamiento }}</h1>
    </div>
    <p>{{ tratamiento.descripcion }}</p>
    <div class="trat-informacion">
      <div class="price-tag">
        <h4>${{ tratamiento.precioTrat }}</h4>
        <span>{{ tratamiento.duracion }} minutos</span>
      </div>
    </div>
    <div class="trat-footer">
      <button class="btn-reservar">Reservar ahora</button>
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

<style scoped src="./TratamientoBanner.css"></style>
