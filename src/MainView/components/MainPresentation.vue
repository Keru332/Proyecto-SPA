<template>
  <div class="home">
    <SpaBanner></SpaBanner>
    <div class="treatments-section">
      <div class="section-header">
        <h2>Algunos de nuestros tratamientos</h2>
        <p class="section-subtitle">
          Descubre nuestra selección de experiencias únicas para tu bienestar
        </p>
      </div>
      <ListaTratamientos></ListaTratamientos>
    </div>
  </div>
</template>

<script setup>
import ListaTratamientos from './ListaTratamientos.vue'
import SpaBanner from './SpaBanner.vue'
</script>

<style scoped src="./MainPresentation.css"></style>
