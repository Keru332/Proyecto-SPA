<script setup>
import { useRegister } from './JS/SignIn'
import { Form, ErrorMessage, Field } from 'vee-validate'
import { schema } from '../schemas/SignInValidate'

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

    <Form @submit="registerUser" class="login-form" :validation-schema="schema" v-slot="{ errors }">
      <div class="user-container">
        <label for="user">Usuario</label>
        <Field
          type="text"
          class="user"
          name="user"
          placeholder="Escriba su nombre de usuario"
          v-model="usuario"
          :class="{ 'error-field': errors.user }"
        />
        <ErrorMessage name="user" class="vee-error-message"></ErrorMessage>
      </div>

      <div class="user-container">
        <label for="Fullname">Nombre y Apellidos</label>
        <Field
          type="text"
          class="Fullname"
          name="Fullname"
          placeholder="Escriba su nombre completo"
          v-model="nombre"
          :class="{ 'error-field': errors.Fullname }"
        />
        <ErrorMessage name="Fullname" class="vee-error-message"></ErrorMessage>
      </div>

      <div class="user-container">
        <label for="correo">Correo Electrónico</label>
        <Field
          type="email"
          class="correo"
          name="correo"
          placeholder="Escriba su correo electrónico"
          v-model="correo"
          :class="{ 'error-field': errors.correo }"
        />
        <ErrorMessage name="correo" class="vee-error-message"></ErrorMessage>
      </div>

      <div class="password-container">
        <label for="password">Contraseña</label>
        <Field
          type="password"
          id="password"
          name="password"
          placeholder="Cree una contraseña segura"
          v-model="pass"
          :class="{ 'error-field': errors.password }"
        />
        <ErrorMessage name="password" class="vee-error-message"></ErrorMessage>
      </div>

      <div class="password-container">
        <label for="confirm-password">Confirmar Contraseña</label>
        <Field
          type="password"
          id="confirm-password"
          name="confirmPassword"
          placeholder="Repita su contraseña"
          required
          v-model="confirmPass"
          :class="{ 'error-field': errors.confirmPassword }"
        />
        <ErrorMessage name="confirmPassword" class="vee-error-message"></ErrorMessage>
      </div>

      <input
        type="submit"
        :value="loading ? 'Registrando...' : 'Crear Cuenta'"
        class="submit"
        :disabled="loading"
      />
    </Form>

    <div class="footer">
      <h3>
        ¿Ya tienes una cuenta? <span><RouterLink to="/login">Iniciar Sesión</RouterLink></span>
      </h3>
    </div>
  </div>
</template>
<style scoped src="./CSS/SignIn.css"></style>
