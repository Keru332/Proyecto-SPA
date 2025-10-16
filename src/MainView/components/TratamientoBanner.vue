<template>
  <div class="trat-container">
    <div class="trat-badge">
      <span>{{ tratamiento.nombrecategoria }}</span>
    </div>
    <div class="trat-header">
      <h1>{{ tratamiento.nombretratamiento }}</h1>
    </div>
    <p>{{ tratamiento.descripcion }}</p>
    <div class="trat-informacion">
      <div class="price-tag">
        <h4>${{ tratamiento.precio }}</h4>
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
      codtratamiento: Object,
      nombretratamiento: '',
      categoria: '',
      precioTrat: 0,
      duracion: 0,
      descripcion: '',
    }),
  },
})
</script>

<style scoped src="./CSS/TratamientoBanner.css"></style>
