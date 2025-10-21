<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const usuario = ref('')
const pass = ref('')
const loading = ref(false)
const errorMessage = ref('')

// Función para hacer login
const loginUser = async (event) => {
  event.preventDefault()
  loading.value = true
  errorMessage.value = ''

  // Validaciones básicas
  if (!usuario.value || !pass.value) {
    errorMessage.value = 'Usuario y contraseña son obligatorios'
    loading.value = false
    return
  }

  try {
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: usuario.value,
        password: pass.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión')
    }

    // Login exitoso
    console.log('Login exitoso:', data)

    // Guardar token en localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    // Redirigir al dashboard o página principal
    router.push('/')
  } catch (error) {
    errorMessage.value = `❌ Error: ${error.message}`
  } finally {
    loading.value = false
  }
}
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
