<template>
  <div class="login-container">
    <h1>Crear Tratamiento</h1>
    <form class="login-form" @submit.prevent="submitForm">

      <div class="user-container">
        <label for="nombre">Nombre del Tratamiento</label>
        <input type="text" id="nombre" v-model="tratamiento.nombre" placeholder="Ejemplo: Masaje relajante" required />
      </div>

      <div class="user-container">
        <label for="descripcion">Descripción</label>
        <input type="text" id="descripcion" v-model="tratamiento.descripcion" placeholder="Describe el tratamiento" required />
      </div>

      <div class="user-container">
        <label for="duracion">Duración (minutos)</label>
        <input type="number" id="duracion" min="5" v-model="tratamiento.duracion" placeholder="0" required />
      </div>

      <div class="user-container">
        <label for="precio">Precio ($)</label>
        <input type="number" id="precio" min="1" v-model="tratamiento.precio" placeholder="0" required />
      </div>

      <div class="user-container">
        <label for="categoria">Categoría</label>
        <input type="text" id="categoria" v-model="tratamiento.categoria" placeholder="Relajación, Terapia, etc." required />
      </div>

      <button type="submit" class="submit">Crear Tratamiento</button>

      <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const tratamiento = reactive({
  nombre: '',
  descripcion: '',
  duracion: '',
  precio: '',
  categoria: ''
})

const mensaje = ref('')

const submitForm = () => {
  console.log('Tratamiento creado:', { ...tratamiento })
  mensaje.value = 'Tratamiento creado correctamente!'

  tratamiento.nombre = ''
  tratamiento.descripcion = ''
  tratamiento.duracion = ''
  tratamiento.precio = ''
  tratamiento.categoria = ''
}
</script>

<style scoped src="../Authentication/components/CSS/Login.css"></style>
