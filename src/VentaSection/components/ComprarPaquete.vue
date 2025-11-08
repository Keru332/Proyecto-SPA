<template>
  <div class="Agendar-Panel">
    <h1>Comprar Paquete</h1>
    <div class="container">
      <PaqueteBanner :paquete="paqData" v-if="paqData && paqData.codpaquete"></PaqueteBanner>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <form @submit="agendar">
        <div class="form-input">
          <label for="fecha">Fecha de Inicio</label>
          <input type="date" v-model="fechaI" name="fecha" required />
        </div>
        <div class="form-input">
          <label for="fechaF">Fecha de Fin</label>
          <input type="date" v-model="fechaF" name="fechaF" required />
        </div>
        <input type="submit" value="Comprar Paquete" />
      </form>
    </div>
  </div>
</template>

<style scoped src="./CSS/AgendarCita.css"></style>

<script setup>
import PaqueteBanner from '@/PaquetesSection/components/PaqueteBanner.vue'
import { useComprarPaquete } from './JS/ComprarPaquete'
const { agendar, fechaI, fechaF, errorMessage, paqData } = useComprarPaquete()
</script>

<style scoped>
.container >>> .paquete-container {
  margin: auto;
}
</style>
