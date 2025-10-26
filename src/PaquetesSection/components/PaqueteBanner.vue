<template>
  <div class="paquete-container">
    <div class="paquete-badge">
      <span>Paquete</span>
    </div>

    <div class="paquete-header">
      <h1>{{ paquete.nombrepaquete }}</h1>
    </div>

    <p>{{ paquete.descripcion }}</p>

    <div class="paquete-informacion">
      <div class="price-tag">
        <h4>${{ paquete.preciopaquete }}</h4>
        <span>{{ paquete.duraciontotal }} minutos</span>
      </div>
    </div>

    <div class="paquete-tratamientos">
      <h3>Tratamientos incluidos:</h3>
      <ul>
        <li v-for="(t, i) in paquete.tratamientos" :key="i">
          {{ t.nombretratamiento }}
        </li>
      </ul>
    </div>

    <div class="paquete-footer">
      <button class="btn-reservar">Reservar paquete</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  paquete: {
    type: Object,
    required: true,
    default: () => ({
      codpaquete: Object,
      nombrepaquete: '',
      duraciontotal: 0,
      preciopaquete: 0,
      tratamientos: [],
    }),
  },
})
</script>

<style scoped src="./CSS/PaqueteBanner.css"></style>
