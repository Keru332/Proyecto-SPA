<template>
  <div class="lista-categorias">
    <CategoriaBanner v-for="(categoria, index) in categorias" :key="index" :categoria="categoria" />
  </div>
</template>

<script setup>
import CategoriaBanner from './CategoriaBanner.vue'

defineProps({
  categorias: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped src="./CSS/ListaCategorias.css"></style>
