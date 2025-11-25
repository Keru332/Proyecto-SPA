<template>
  <div class="paquetev-section">
    <div class="section-header">
      <h2>Todos los Paquetes Vendidos</h2>

      <!-- Componente de Filtro -->
      <div class="filtro-container">
        <div class="filtro-opciones">
          <button
            class="filtro-btn"
            :class="{ active: filtroActivo === 'hoy' }"
            @click="aplicarFiltro('hoy')"
          >
            Hoy
          </button>
          <button
            class="filtro-btn"
            :class="{ active: filtroActivo === 'semana' }"
            @click="aplicarFiltro('semana')"
          >
            Esta Semana
          </button>
          <button
            class="filtro-btn"
            :class="{ active: filtroActivo === 'mes' }"
            @click="aplicarFiltro('mes')"
          >
            Este Mes
          </button>
          <button
            class="filtro-btn"
            :class="{ active: filtroActivo === 'anno' }"
            @click="aplicarFiltro('anno')"
          >
            Este Año
          </button>
        </div>

        <!-- Mostrar rango de fechas cuando hay filtro activo -->
        <div v-if="filtroActivo" class="filtro-info">
          <small>Mostrando paquetes vendidos: {{ textoFiltroActivo }}</small>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">Cargando paquetes vendidos...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <!-- Contador de citas -->
    <div class="contador-paquetesv" v-if="!loading && !error">
      <p>Mostrando {{ paquetesvFiltrados.length }} de {{ paquetesv.length }} paquetes vendidos</p>
    </div>

    <ListaPaquetesV :paquetesv="paquetesvFiltrados" v-if="!loading && !error"></ListaPaquetesV>

    <!-- Mensaje cuando no hay citas con el filtro aplicado -->
    <div v-if="!loading && !error && paquetesvFiltrados.length === 0" class="no-paquetesv-filtro">
      <p>No hay citas {{ textoFiltroActivo }}</p>
    </div>
  </div>
</template>

<script setup>
import { usePaquetesVSelection } from './JS/PaquetesVSelection'
import ListaPaquetesV from './ListaPaquetesV.vue'
const {
  paquetesv,
  loading,
  error,
  filtroActivo,
  textoFiltroActivo,
  paquetesvFiltrados,
  aplicarFiltro,
} = usePaquetesVSelection()
</script>

<style scoped src="./CSS/PaquetesVSelection.css"></style>
