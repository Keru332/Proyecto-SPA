<template>
  <div class="usuario-panel">
    <h2>Información del Usuario</h2>

    <div v-if="usuario" class="user-info-container">
      <div class="user-card">
        <div class="user-field">
          <strong>Nombre:</strong>
          <span class="user-value">{{ usuario.nombre }}</span>
        </div>
        <div class="user-field">
          <strong>Correo:</strong>
          <span class="user-value">{{ usuario.email }}</span>
        </div>
      </div>
    </div>

    <div v-else class="no-data">
      <p>No hay información del usuario cargada.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "usuarioPanel",
  data() {
    return {
      usuario: null
    };
  },
  mounted() {
    // Recuperar los datos del usuario guardados al iniciar sesión
    const userData = localStorage.getItem("user");

    if (userData) {
      this.usuario = JSON.parse(userData); // convertir de texto a objeto
    }
  }
};
</script>

<style scoped src="./CSS/usuarioPanel.css"></style>
