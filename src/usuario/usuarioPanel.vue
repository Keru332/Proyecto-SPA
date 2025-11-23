<template>
  <div class="usuario-panel">
    <h2>Información del Usuario</h2>

    <div v-if="usuario" class="user-info-container">
      <div class="user-card">

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

        <div v-else>
          <Form :validation-schema="editSchema" @submit="guardar">
            <div class="user-field">
              <strong>Nombre:</strong>
              <Field name="Fullname" v-model="form.username" />
              <ErrorMessage name="Fullname" class="errorMessage" />
            </div>

            <div class="user-field">
              <strong>Correo:</strong>
              <Field name="correo" type="email" v-model="form.correo" />
              <ErrorMessage name="correo" class="errorMessage" />
            </div>

            <div class="edit-actions action-buttons">
              <button type="submit" class="save-btn">Guardar</button>
              <button type="button" @click="cancelar" class="cancel-btn">Cancelar</button>
            </div>
          </Form>
        </div>
      </div>
    </div>

    <div v-else class="no-data">
      <p>No hay información del usuario cargada.</p>
    </div>

    <!-- MODAL CAMBIAR CONTRASEÑA -->
    <div v-if="modalPasswordVisible" class="password-modal">
      <div class="modal-content">
        <h3>Cambiar contraseña</h3>

        <!-- 🔥 Formulario con validación -->
        <Form :validation-schema="changePasswordSchema" @submit="guardarPassword">

          <div class="modal-field">
            <label>Contraseña actual</label>
            <Field name="oldPassword" type="password" v-model="passwordForm.oldPassword" />
            <ErrorMessage name="oldPassword" class="errorMessage" />
          </div>

          <div class="modal-field">
            <label>Nueva contraseña</label>
            <Field name="newPassword" type="password" v-model="passwordForm.newPassword" />
            <ErrorMessage name="newPassword" class="errorMessage" />
          </div>

          <div class="modal-field">
            <label>Confirmar contraseña</label>
            <Field name="confirmPassword" type="password" v-model="passwordForm.confirmPassword" />
            <ErrorMessage name="confirmPassword" class="errorMessage" />
          </div>

          <div class="modal-actions">
            <button type="submit" class="save-btn">Guardar</button>
            <button type="button" @click="cerrarModalPassword" class="cancel-btn">Cancelar</button>
          </div>

        </Form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { editSchema } from './schemas/validarEditarPerfil'
import { changePasswordSchema } from './schemas/validarCambiarContraseña'

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
