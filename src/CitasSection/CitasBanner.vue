<template>
  <div class="cita-container">
    <div class="cita-header">
      <h1>Cita</h1>
    </div>
    <h3>Cliente: {{ cita.nombrecliente }}</h3>

    <h3>Tratamiento: {{ cita.nombretratamiento }}</h3>

    <div class="cita-informacion">
      <div class="price-tag">
        <h4>Fecha:{{ cita.fecha_formateada }}</h4>
        <h4>Hora:{{ cita.hora_formateada }}</h4>
      </div>
    </div>

    <div class="cita-footer">
      <button
        class="btn-eliminar"
        v-if="authService.isAdmin() && esFechaFutura"
        @click="confirmarEliminacion"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { authService } from '@/Authentication/services/auth'
import { useCitaBanner } from './JS/CitasBanner'

const props = defineProps({
  cita: {
    type: Object,
    required: true,
    default: () => ({
      codsolicitud: Object,
      nombrecliente: '',
      nombretratamiento: '',
      horacita: '',
      fecha: new Date(),
    }),
  },
})

const { esFechaFutura, confirmarEliminacion } = useCitaBanner(props)
</script>

<style scoped src="./CSS/CitasBanner.css"></style>
