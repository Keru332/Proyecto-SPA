<template>
  <div class="login-container">
    <h1>Crear categoria</h1>
    <form class="login-form" @submit.prevent="submitForm">
      <div class="user-container">
        <label for="catgoria">Nombre Categoria</label>
        <input
          type="text"
          id="nombre_categoria"
          v-model="categoria.nombre"
          placeholder="Ingrese un Nombre"
          required
          name="catgoria"
        />
      </div>

      <button type="submit" class="submit">Crear Categoria</button>

      <PlantillaAlertaCrearCat
        v-model:visible="mostrarAlerta"
        :titulo="alertaTitulo"
        :mensaje="alertaMensaje"
        texto-aceptar="Aceptar"
        @aceptar="manejarAceptar"
      />
    </form>
    <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
  </div>
</template>

<script setup>
import PlantillaAlertaCrearCat from '@/plantilla alerta/PlantillaAlerta.vue';
import { useCrearCategoria } from './JS/CrearCategoria'

const {
  categoria,
  mensaje,
  submitForm,
  mostrarAlerta,
  alertaTitulo,
  alertaMensaje,
  router
} = useCrearCategoria()


const manejarAceptar = () => {

  if (alertaTitulo === '¡Éxito!') {
    router.push('/cat')
  }
}
</script>

<style scoped src="./CSS/CrearCategoria.css"></style>
