<template>
  <div class="login-container">
    <h1>Editar categoria</h1>
    <form class="login-form" @submit.prevent="submitForm">
      <div class="user-container">
        <label for="catgoria">Nombre Categoria</label>
        <input
          type="text"
          id="nombre_categoria"
          v-model="categoria_actualizada.nombrecategoria"
          placeholder="Ingrese un Nombre"
          required
          name="catgoria"
        />
      </div>

      <button type="submit" class="submit">Editar Categoria</button>

      <AlertaConfirmacion />

      <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
    </form>
  </div>
</template>

<script setup>
import { useEditarCategoria } from './JS/EditarCategoria'

import AlertaConfirmacion from '@/plantilla confirmacion/Plantilla confirmacion.vue'


const { submitForm, categoria_actualizada, mensaje } = useEditarCategoria()
</script>

<style scoped src="./CSS/CrearCategoria.css"></style>
