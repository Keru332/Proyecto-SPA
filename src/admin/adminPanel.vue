<script setup>
import formpaq from '@/PaquetesSection/components/CrearPaquete.vue'
import formtrat from '@/TratamientoSection/components/CrearTratamiento.vue'
import CrearCategoria from '@/CategoriaSection/components/CrearCategoria.vue'
import { ref } from 'vue'
const op = ref(0)

function Trat() {
  op.value = 2
}
function Paq() {
  op.value = 1
}
function Cat() {
  op.value = 3
}
</script>
<template>
  <div class="admin-container">
    <div class="sidebar">
      <div class="logo">
        <h1>Panel Admin</h1>
      </div>
      <ul class="menu">
        <li>
          <a href="#" @click="Trat()"><i>➕</i>Tratamientos</a>
        </li>
        <li>
          <a href="#" @click="Paq()"><i>➕</i>Paquetes</a>
        </li>
        <li>
          <a href="#" @click="Cat()"><i>➕</i>Categoria</a>
        </li>
      </ul>
    </div>

    <div class="main-content">
      <div class="form">
        <div v-if="op == 0">
          <h1>Bienvenido al Panel Administrativo</h1>
        </div>
        <div class="Paquetes" v-if="op == 1">
          <formpaq></formpaq>
        </div>
        <div class="Tratamientos" v-else-if="op == 2">
          <formtrat></formtrat>
        </div>
        <div class="Categorias" v-else-if="op == 3">
          <CrearCategoria></CrearCategoria>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped src="./CSS/admin.css"></style>
