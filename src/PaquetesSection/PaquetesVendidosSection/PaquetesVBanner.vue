<template>
  <div class="paquetev-container">
    <div class="paquetev-header">
      <h1>Paquete Vendido</h1>
    </div>
    <h3>Cliente: {{ paquetev.nombrecliente }}</h3>

    <h3>Paquete: {{ paquetev.nombrepaquete }}</h3>

    <div class="paquetev-informacion">
      <div class="price-tag">
        <h4>Fecha Compra:{{ paquetev.fechacompraf }}</h4>
        <h4>Fecha Inicio:{{ paquetev.fechainiciof }}</h4>
        <h4>Fecha Fin:{{ paquetev.fechafinf }}</h4>
      </div>
    </div>

    <div class="paquetev-footer">
      <button
        class="btn-eliminar"
        v-if="
          (authService.isAdmin() && esFechaFutura) ||
          (authService.isUser() && isDeleteable() && esFechaFutura)
        "
        @click="confirmarEliminacion"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { authService } from '@/Authentication/services/auth'
import { usePaquetesVBanner } from './JS/PaquetesVBanner'

function isDeleteable() {
  const userData = JSON.parse(localStorage.getItem('user'))
  return props.paquetev.cliente__idcliente == userData.codcliente
}

const props = defineProps({
  paquetev: {
    type: Object,
    required: true,
    default: () => ({
      codpaquetev: Object,
      nombrecliente: '',
      nombrepaquete: '',
      fechacompra: new Date(),
      fechainicio: new Date(),
      fechafin: new Date(),
    }),
  },
})

const { esFechaFutura, confirmarEliminacion } = usePaquetesVBanner(props)
</script>

<style scoped src="./CSS/PaquetesVBanner.css"></style>
