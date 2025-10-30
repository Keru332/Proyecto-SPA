<template>
  <div class="usuario-panel">
    <h2>Información del Usuario</h2>

    <div v-if="usuario" class="user-info-container">
      <div class="user-card">
        <div class="user-field">
          <strong>Nombre:</strong>
          <span class="user-value">{{ usuario.username }}</span>
        </div>
        <div class="user-field">
          <strong>Correo:</strong>
          <span class="user-value">{{ usuario.correo }}</span>
        </div>
      </div>
    </div>

    <div v-else class="no-data">
      <p>No hay información del usuario cargada.</p>
    </div>
  </div>
</template>
<script setup>
import { authService } from '@/Authentication/services/auth'
import { onMounted, reactive } from 'vue'

const usuario = reactive({ id: '', username: '', email: '' })
const userData = JSON.parse(localStorage.getItem('user'))
usuario.id = userData.id

console.log(userData.id)

onMounted(async () => {
  await fetchUser()
})

const fetchUser = async () => {
  const token = authService.getToken()

  try {
    const response = await fetch(`http://localhost:3000/api/users/${usuario.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    console.log(data)

    if (!response.ok) {
      throw new Error(data.error || 'Error al cargar')
    }
    console.log(data)
    usuario.username = data.username
    usuario.correo = data.correo
  } catch (error) {}
}
</script>

<style scoped src="./CSS/usuarioPanel.css"></style>
