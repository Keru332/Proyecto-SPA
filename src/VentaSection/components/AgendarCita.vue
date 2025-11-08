<template>
  <div class="Agendar-Panel">
    <h1>Agendar Cita</h1>
    <div class="container">
      <div class="treatments-section">
        <TratamientoBanner
          :tratamiento="tratData"
          v-if="tratData && tratData.codtratamiento"
        ></TratamientoBanner>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <form @submit="agendar">
        <div class="form-input">
          <label for="fecha">Fecha de Cita</label>
          <input type="date" v-model="fechaC" name="fecha" required />
        </div>
        <div class="form-input">
          <label for="hora">Hora de Cita</label>
          <input type="time" v-model="hora" name="hora" required />
        </div>
        <input type="submit" value="Agendar Cita" />
      </form>
    </div>
  </div>
</template>

<style scoped src="./CSS/AgendarCita.css"></style>

<script setup>
import TratamientoBanner from '@/TratamientoSection/components/TratamientoBanner.vue'
import { useAgendarCita } from './JS/AgendarCita'
const { tratData, fechaC, hora, errorMessage, agendar } = useAgendarCita()
</script>
