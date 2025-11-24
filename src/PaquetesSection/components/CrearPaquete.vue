<template>
  <div class="login-container">
    <h1>Crear Paquete</h1>
    <form class="login-form" @submit.prevent="submitForm">
      <div class="user-container">
        <label for="nombre">Nombre del Paquete</label>
        <input
          type="text"
          id="nombre"
          v-model="paquete.nombrepaquete"
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
          v-model="paquete.duraciontotal"
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
          v-model="paquete.preciopaquete"
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

      <button type="submit" class="submit">Crear Paquete</button>

      <PlantillaAlertaCrearCat
        v-model:visible="mostrarAlerta"
        :titulo="alertaTitulo"
        :mensaje="alertaMensaje"
        texto-aceptar="Aceptar"
        @aceptar="manejarAceptar"
      />

      <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
    </form>
  </div>
</template>

<script setup>
import PlantillaAlertaCrearCat from '@/plantilla alerta/PlantillaAlerta.vue'
import { useCrearPaquete } from './JS/CrearPaquete'

const {
  paquete,
  tratamientosDisponibles,
  tratamientosPaquete,
  mensaje,
  mostrarAlerta,
  alertaTitulo,
  alertaMensaje,
  router,
  submitForm,
  moverADerecha,
  moverAIzquierda,
  haySeleccionadosDisponibles,
  haySeleccionadosPaquete,
  toggleSelection,
} = useCrearPaquete()


const manejarAceptar = () => {

  if (alertaTitulo === '¡Éxito!') {
    router.push('/paquetes')
  }
}
</script>

<style scoped src="./CSS/CrearPaquete.css"></style>
