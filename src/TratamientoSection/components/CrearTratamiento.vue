<template>
  <div class="login-container">
    <h1>Crear Tratamiento</h1>
    <form class="login-form" @submit.prevent="submitForm">
      <div class="user-container">
        <label for="nombre">Nombre del Tratamiento</label>
        <input
          type="text"
          id="nombre"
          v-model="tratamiento.nombre"
          placeholder="Ejemplo: Masaje relajante"
          required
        />
      </div>

      <div class="user-container">
        <label for="descripcion">Descripción</label>
        <textarea
          type="text"
          id="descripcion"
          v-model="tratamiento.descripcion"
          placeholder="Describe el tratamiento"
          rows="4"
          cols="40"
          maxlength="250"
          required
        ></textarea>
      </div>

      <div class="user-container">
        <label for="duracion">Duración (minutos)</label>
        <input
          type="number"
          id="duracion"
          min="5"
          max="300"
          v-model="tratamiento.duracion"
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
          v-model="tratamiento.precio"
          placeholder="0"
          required
        />
      </div>

      <div class="user-container">
        <label for="categoria">Categoría</label>
        <select id="categoria" v-model="tratamiento.codcategoria" required>
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

      <button type="submit" class="submit">Crear Tratamiento</button>

      <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
    </form>
  </div>
</template>

<script setup>
import { useCrearTratamiento } from './JS/CrearTratamiento'

const { tratamiento, categorias, submitForm, mensaje } = useCrearTratamiento()
</script>

<style scoped src="./CSS/CrearTratamiento.css"></style>
