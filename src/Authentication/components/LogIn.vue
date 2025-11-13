<script setup>
import { schema } from '../schemas/LogInValidate'
import { useLogin } from './JS/LogIn'
import { Form, ErrorMessage, Field } from 'vee-validate'

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

    <Form @submit="loginUser" class="login-form" :validation-schema="schema" v-slot="{ errors }">
      <div class="user-container">
        <label for="user">Usuario</label>
        <Field
          type="text"
          class="user"
          name="user"
          placeholder="Escriba su Nombre"
          v-model="usuario"
          :class="{ 'error-field': errors.user }"
        />
        <ErrorMessage name="user" class="vee-error-message"></ErrorMessage>
      </div>
      <div class="password-container">
        <label for="password">Contraseña</label>
        <Field
          name="password"
          type="password"
          placeholder="Escriba su Contraseña"
          v-model="pass"
          :class="{ 'error-field': errors.password }"
        />
        <ErrorMessage name="password" class="vee-error-message"></ErrorMessage>
      </div>
      <input
        type="submit"
        :value="loading ? 'Iniciando sesión...' : 'Iniciar Sesion'"
        class="submit"
        :disabled="loading"
      />
    </Form>
    <div class="footer">
      <h3>
        ¿No está registrado? <span> <RouterLink to="/register">Registrar</RouterLink></span>
      </h3>
    </div>
  </div>
</template>

<style scoped src="./CSS/Login.css"></style>
