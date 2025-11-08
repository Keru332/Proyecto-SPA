<template>
  <div class="usuario-panel">
    <h2>Información del Usuario</h2>

    <div v-if="usuario" class="user-info-container">
      <div class="user-card">
        <!-- Información del usuario -->
        <div v-if="!editando">
          <div class="user-field">
            <strong>Usuario:</strong>
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
import { useUsuarioPanel } from './JS/usuarioPanel'

const {
  usuario,
  form,
  editando,
  modalPasswordVisible,
  passwordForm,
  editar,
  cancelar,
  guardar,
  abrirModalPassword,
  guardarPassword,
  cerrarModalPassword,
} = useUsuarioPanel()
</script>

<style scoped src="./CSS/usuarioPanel.css"></style>
