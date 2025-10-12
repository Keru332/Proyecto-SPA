<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <div class="container">
      <div class="nav-container">
        <div class="logo">
          Ray<span>Mei</span>Spa
          <img src="../assets/RayMei Logo.webp" alt="logo" class="iconLogo" />
        </div>
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/productos">Tratamientos</RouterLink>
          <RouterLink to="/paquetes">Paquetes</RouterLink>
          <RouterLink to="/paquetes">Login</RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped src="./MainHeader.css"></style>
