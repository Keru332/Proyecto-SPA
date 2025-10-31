<template>
  <div class="usuario-panel">
    <h2>Información del Usuario</h2>

    <div v-if="usuario" class="user-info-container">
      <div class="user-card">
        <!-- Información del usuario -->
        <div v-if="!editando">
          <div class="user-field">
            <strong>Nombre:</strong>
            <span class="user-value">{{ usuario.username }}</span>
          </div>
          <div class="user-field">
            <strong>Correo:</strong>
            <span class="user-value">{{ usuario.correo }}</span>
          </div>

          <div class="action-buttons">
            <button @click="editar" class="edit-btn">Editar perfil</button>
            <button @click="abrirModalPassword" class="edit-btn">Cambiar contraseña</button>
          </div>
        </div>

        <!-- Editar perfil -->
        <div v-else>
          <div class="user-field">
            <strong>Nombre:</strong>
            <input v-model="form.username" type="text" />
          </div>
          <div class="user-field">
            <strong>Correo:</strong>
            <input v-model="form.correo" type="email" />
          </div>

          <div class="edit-actions action-buttons">
            <button @click="guardar" class="save-btn">Guardar</button>
            <button @click="cancelar" class="cancel-btn">Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-data">
      <p>No hay información del usuario cargada.</p>
    </div>

    <!-- Modal de cambio de contraseña -->
    <div v-if="modalPasswordVisible" class="password-modal">
      <div class="modal-content">
        <h3>Cambiar contraseña</h3>
        <div class="modal-field">
          <label>Contraseña actual</label>
          <input type="password" v-model="passwordForm.oldPassword" />
        </div>
        <div class="modal-field">
          <label>Nueva contraseña</label>
          <input type="password" v-model="passwordForm.newPassword" />
        </div>
        <div class="modal-actions">
          <button @click="guardarPassword" class="save-btn">Guardar</button>
          <button @click="cerrarModalPassword" class="cancel-btn">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { authService } from '@/Authentication/services/auth'
import { onMounted, reactive, ref } from 'vue'

const usuario = reactive({ id: '', username: '', correo: '' })
const form = reactive({ username: '', correo: '' })
const editando = ref(false)

// Modal de contraseña
const modalPasswordVisible = ref(false)
const passwordForm = reactive({ oldPassword: '', newPassword: '' })

// Cargar datos de usuario
const userData = JSON.parse(localStorage.getItem('user'))
usuario.id = userData.id

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
    if (!response.ok) throw new Error(data.error || 'Error al cargar usuario')
    usuario.username = data.username
    usuario.correo = data.correo
  } catch (error) {
    console.error(error)
  }
}

// Editar perfil
const editar = () => {
  form.username = usuario.username
  form.correo = usuario.correo
  editando.value = true
}
const cancelar = () => editando.value = false
const guardar = async () => {
  const token = authService.getToken()
  try {
    const response = await fetch(`http://localhost:3000/api/users/${usuario.id}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username: form.username, correo: form.correo }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Error al actualizar perfil')
    usuario.username = data.user.username
    usuario.correo = data.user.correo
    editando.value = false
  } catch (error) {
    console.error(error)
    alert('No se pudo actualizar el perfil')
  }
}

// Modal de contraseña
const abrirModalPassword = () => {
  modalPasswordVisible.value = true
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
}
const cerrarModalPassword = () => modalPasswordVisible.value = false

// Guardar contraseña
const guardarPassword = async () => {
  if (!passwordForm.oldPassword || !passwordForm.newPassword) {
    alert('Debes llenar ambos campos')
    return
  }

  const token = authService.getToken()
  try {
    const response = await fetch(`http://localhost:3000/api/users/${usuario.id}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      }),
    });

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Error al actualizar contraseña')

    alert('Contraseña actualizada correctamente')
    cerrarModalPassword()
  } catch (error) {
    console.error(error)
    alert(error.message)
  }
}
</script>

<style scoped src="./CSS/usuarioPanel.css"></style>


