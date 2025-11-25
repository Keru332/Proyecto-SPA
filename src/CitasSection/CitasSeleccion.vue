<template>
  <div class="treatments-section">
    <div class="section-header">
      <h2>Todas las Citas</h2>

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
          <small>Mostrando citas: {{ textoFiltroActivo }}</small>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">Cargando citas...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <!-- Contador de citas -->
    <div class="contador-citas" v-if="!loading && !error">
      <p>Mostrando {{ citasFiltradas.length }} de {{ citas.length }} citas</p>
    </div>

    <ListaCitas :citas="citasFiltradas" v-if="!loading && !error"></ListaCitas>

    <!-- Mensaje cuando no hay citas con el filtro aplicado -->
    <div v-if="!loading && !error && citasFiltradas.length === 0" class="no-citas-filtro">
      <p>No hay citas {{ textoFiltroActivo }}</p>
    </div>
  </div>
</template>

<script setup>
import { useCitasSeleccion } from './JS/CitasSeleccion'
import ListaCitas from './ListaCitas.vue'

const { citas, loading, error, filtroActivo, textoFiltroActivo, citasFiltradas, aplicarFiltro } =
  useCitasSeleccion()
</script>

<style scoped src="./CSS/CitasSeleccion.css"></style>
