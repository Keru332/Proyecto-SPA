<template>
  <div class="login-container">
    <h1>Editar Paquete</h1>
    <form class="login-form" @submit.prevent="submitForm">
      <div class="user-container">
        <label for="nombre">Nombre del Paquete</label>
        <input
          type="text"
          id="nombre"
          v-model="paqueteF.nombrepaquete"
          placeholder="Ejemplo: Masaje relajante"
          required
        />
      </div>

      <div class="user-container">
        <label for="duracion">Duración (minutos)</label>
        <input
          type="number"
          id="duracion"
          min="5"
          max="1000"
          v-model="paqueteF.duraciontotal"
          placeholder="0"
          required
        />
      </div>

      <div class="user-container">
        <label for="precio">Precio ($)</label>
        <input
          type="number"
          id="precio"
          min="1"
          max="9999"
          v-model="paqueteF.preciopaquete"
          placeholder="0"
          required
        />
      </div>

      <div class="listas">
        <div class="container">
          <div class="list-container">
            <div class="list-title">Tratamientos del Paquete</div>
            <div class="list">
              <div
                v-for="tratamiento in tratamientosPaquete"
                :key="tratamiento.codtratamiento"
                class="list-item"
                :class="{ selected: tratamiento.selected }"
                @click="toggleSelection(tratamiento, 'paquete')"
              >
                {{ tratamiento.nombretratamiento }}
              </div>
            </div>
          </div>

          <div class="controls">
            <button
              type="button"
              class="transfer-left"
              @click="moverADerecha"
              :disabled="!haySeleccionadosDisponibles"
            >
              &lt;
            </button>
            <button
              type="button"
              class="transfer-right"
              @click="moverAIzquierda"
              :disabled="!haySeleccionadosPaquete"
            >
              &gt;
            </button>
          </div>

          <div class="list-container">
            <div class="list-title">Tratamientos Disponibles</div>
            <div class="list">
              <div
                v-for="tratamiento in tratamientosDisponibles"
                :key="tratamiento.codtratamiento"
                class="list-item"
                :class="{ selected: tratamiento.selected }"
                @click="toggleSelection(tratamiento, 'disponibles')"
              >
                {{ tratamiento.nombretratamiento }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button type="submit" class="submit">Actualizar Paquete</button>

      <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
    </form>
  </div>
</template>

<script setup>
import { useEditarPaquete } from './JS/EditarPaquete'

const {
  paqueteF,
  tratamientosDisponibles,
  tratamientosPaquete,
  mensaje,
  submitForm,
  moverADerecha,
  moverAIzquierda,
  haySeleccionadosDisponibles,
  haySeleccionadosPaquete,
  toggleSelection,
} = useEditarPaquete()
</script>

<style scoped src="./CSS/CrearPaquete.css"></style>
