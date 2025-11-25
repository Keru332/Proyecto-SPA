<template>
  <div class="login-container">
    <h1>Editar Tratamiento</h1>
    <form class="login-form" @submit.prevent="submitForm">
      <div class="user-container">
        <label for="nombre">Nombre del Tratamiento</label>
        <input
          type="text"
          id="nombre"
          v-model="tratamientoF.nombre"
          placeholder="Ejemplo: Masaje relajante"
          required
        />
      </div>

      <div class="user-container">
        <label for="descripcion">Descripción</label>
        <input
          type="text"
          id="descripcion"
          v-model="tratamientoF.descripcion"
          placeholder="Describe el tratamiento"
          required
        />
      </div>

      <div class="user-container">
        <label for="duracion">Duración (minutos)</label>
        <input
          type="number"
          id="duracion"
          min="5"
          max="300"
          v-model="tratamientoF.duracion"
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
          v-model="tratamientoF.precio"
          placeholder="0"
          required
        />
      </div>

      <div class="user-container">
        <label for="categoria">Categoría</label>
        <select id="categoria" v-model="tratamientoF.codcategoria" required>
          <option value="" disabled>Selecciona una categoría</option>
          <option
            v-for="categoria in categorias"
            :key="categoria.codcategoria"
            :value="categoria.codcategoria"
          >
            {{ categoria.nombrecategoria }}
          </option>
        </select>
      </div>

      <button type="submit" class="submit">Editar Tratamiento</button>

      <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
    </form>
  </div>
</template>

<script setup>
import { useEditarTratamiento } from './JS/EditarTratamiento'

const { tratamientoF, mensaje, categorias, submitForm } = useEditarTratamiento()
</script>

<style scoped src="./CSS/CrearTratamiento.css"></style>
