<script setup lang="ts">
import TratamientoBanner from './TratamientoBanner.vue'

const tratamientoMasPopular = {
  nombreTratamiento: 'Tierras',
  categoria: 'ehe',
  precioTrat: 10,
  duracion: 20,
  descripcion: 'La vida es eterna como la todopoderosa Raiden Shogun',
}
</script>

<template>
  <div class="banner-container">
    <div class="text-contaner">
      <h1>Bienvenido a nuestro Spa</h1>
      <h2>Donde tu felicidad va a ser Eterna</h2>
      <p>
        Disfruta de nuestros servicios de calidad y recibe la bendicion de nuestra poderosa Raiden
        Shogun
      </p>
    </div>
    <TratamientoBanner :tratamiento="tratamientoMasPopular"></TratamientoBanner>
  </div>
</template>

<style scoped>
.banner-container {
  display: flex;
  align-items: center;
  position: relative;
}
</style>
