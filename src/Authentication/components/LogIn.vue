<script setup>
import { useLogin } from './JS/LogIn'
const { usuario, pass, loading, errorMessage, loginUser } = useLogin()
</script>

<template>
  <div class="login-container">
    <h1>Login</h1>
    <img src="../../MainView/assets/RayMei Logo.webp" alt="logo" width="150px" />

    <!-- Mensaje de error -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <form @submit="loginUser" class="login-form">
      <div class="user-container">
        <label for="user">Usuario</label>
        <input
          type="text"
          class="user"
          placeholder="Escriba su Nombre"
          v-model="usuario"
          required
        />
      </div>
      <div class="password-container">
        <label for="password">Contraseña</label>
        <input type="password" placeholder="Escriba su Contraseña" v-model="pass" required />
      </div>
      <input
        type="submit"
        :value="loading ? 'Iniciando sesión...' : 'Iniciar Sesion'"
        class="submit"
        :disabled="loading"
      />
    </form>
    <div class="footer">
      <h3>
        ¿No está registrado? <span> <RouterLink to="/register">Registrar</RouterLink></span>
      </h3>
    </div>
  </div>
</template>

<style scoped src="./CSS/Login.css"></style>
