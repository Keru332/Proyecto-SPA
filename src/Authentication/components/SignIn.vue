<script setup>
import { useRegister } from './JS/SignIn'

const {
  usuario,
  pass,
  correo,
  nombre,
  confirmPass,
  loading,
  errorMessage,
  successMessage,
  registerUser,
} = useRegister()
</script>

<template>
  <div class="login-container">
    <div class="header">
      <img src="../../MainView/assets/RayMei Logo.webp" alt="logo" width="150px" />
      <h1>Registrarse</h1>
    </div>

    <!-- Mensajes de éxito/error -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <form @submit="registerUser" class="login-form">
      <div class="user-container">
        <label for="user">Usuario</label>
        <input
          type="text"
          class="user"
          placeholder="Escriba su nombre de usuario"
          v-model="usuario"
          required
        />
      </div>

      <div class="user-container">
        <label for="Fullname">Nombre y Apellidos</label>
        <input
          type="text"
          class="Fullname"
          placeholder="Escriba su nombre completo"
          v-model="nombre"
          required
        />
      </div>

      <div class="user-container">
        <label for="correo">Correo Electrónico</label>
        <input
          type="email"
          class="correo"
          placeholder="Escriba su correo electrónico"
          v-model="correo"
          required
        />
      </div>

      <div class="password-container">
        <label for="password">Contraseña</label>
        <input
          type="password"
          id="password"
          placeholder="Cree una contraseña segura"
          v-model="pass"
          required
        />
      </div>

      <div class="password-container">
        <label for="confirm-password">Confirmar Contraseña</label>
        <input
          type="password"
          id="confirm-password"
          placeholder="Repita su contraseña"
          required
          v-model="confirmPass"
        />
      </div>

      <input
        type="submit"
        :value="loading ? 'Registrando...' : 'Crear Cuenta'"
        class="submit"
        :disabled="loading"
      />
    </form>

    <div class="footer">
      <h3>
        ¿Ya tienes una cuenta? <span><RouterLink to="/login">Iniciar Sesión</RouterLink></span>
      </h3>
    </div>
  </div>
</template>
<style scoped src="./CSS/SignIn.css"></style>
