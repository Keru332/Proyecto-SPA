<template>
  <div v-if="visible" class="alerta-overlay">
    <div class="alerta-contenido">
      <h3>{{ titulo }}</h3>
      <p>{{ mensaje }}</p>
      <button @click="$emit('aceptar')">{{ textoAceptar }}</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    titulo: String,
    mensaje: String,
    textoAceptar: String
  },
  emits: ['aceptar', 'update:visible']
}
</script>

<style scoped src="./CSS/PlantillaAlerta.css"></style>

