<script setup>
import { ref } from 'vue'
</script>

<template>
  <div class="login-container">
    <h1>Login</h1>
    <img src="../../MainView/assets/RayMei Logo.webp" alt="logo" width="150px" />
    <form action="" class="login-form">
      <div class="user-container">
        <label for="user">Usuario</label>
        <input type="text" class="user" placeholder="Escriba su Nombre" v-model="usuario" />
      </div>
      <div class="password-container">
        <label for="password">Contraseña</label>
        <input type="password" placeholder="Escriba su Contraseña" v-model="pass" />
      </div>
      <input type="submit" value="Iniciar Sesion" class="submit" />
    </form>
    <div class="footer">
      <h3>
        ¿No está registrado? <span> <RouterLink to="/register">Registrar</RouterLink></span>
      </h3>
    </div>
  </div>
</template>

<script>
const usuario = ref('')
const pass = ref('')
</script>

<style scoped src="./CSS/Login.css"></style>
