<script setup>
import { ref } from 'vue'
</script>

<template>
  <div class="login-container">
    <div class="header">
      <img src="../../MainView/assets/RayMei Logo.webp" alt="logo" width="150px" />
      <h1>Registrarse</h1>
    </div>

    <form action="" class="login-form">
      <div class="user-container">
        <label for="user">Usuario</label>
        <input
          type="text"
          class="user"
          placeholder="Escriba su nombre de usuario"
          v-model="usuario"
        />
      </div>

      <div class="user-container">
        <label for="Fullname">Nombre y Apellidos</label>
        <input
          type="text"
          class="Fullname"
          placeholder="Escriba su nombre completo"
          v-model="nombre"
        />
      </div>

      <div class="user-container">
        <label for="correo">Correo Electrónico</label>
        <input
          type="email"
          class="correo"
          placeholder="Escriba su correo electrónico"
          v-model="correo"
        />
      </div>

      <div class="password-container">
        <label for="password">Contraseña</label>
        <input
          type="password"
          id="password"
          placeholder="Cree una contraseña segura"
          v-model="pass"
        />
      </div>

      <div class="password-container">
        <label for="confirm-password">Confirmar Contraseña</label>
        <input type="password" id="confirm-password" placeholder="Repita su contraseña" />
      </div>

      <input type="submit" value="Crear Cuenta" class="submit" />
    </form>

    <div class="footer">
      <h3>
        ¿Ya tienes una cuenta? <span><RouterLink to="/login">Iniciar Sesión</RouterLink></span>
      </h3>
    </div>
  </div>
</template>
<script>
const usuario = ref('')
const pass = ref('')
const correo = ref('')
const nombre = ref('')
</script>
<style scoped src="./CSS/SignIn.css"></style>
