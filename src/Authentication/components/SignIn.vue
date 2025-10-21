<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const usuario = ref('')
const pass = ref('')
const correo = ref('')
const nombre = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Función para registrar usuario
const registerUser = async (event) => {
  event.preventDefault()
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  // Validaciones básicas
  if (!usuario.value || !pass.value || !correo.value || !nombre.value) {
    errorMessage.value = 'Todos los campos son obligatorios'
    loading.value = false
    return
  }

  if (pass.value.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres'
    loading.value = false
    return
  }

  try {
    const response = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: usuario.value,
        password: pass.value,
        role: 'user', // Rol por defecto
        // Agregamos campos extra que podrías guardar después
        email: correo.value,
        fullname: nombre.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error al registrar usuario')
    }

    // Registro exitoso
    successMessage.value = '✅ Usuario registrado exitosamente'

    // Opcional: Redirigir después de 2 segundos
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    errorMessage.value = `❌ Error: ${error.message}`
  } finally {
    loading.value = false
  }
}
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
        <input type="password" id="confirm-password" placeholder="Repita su contraseña" required />
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
