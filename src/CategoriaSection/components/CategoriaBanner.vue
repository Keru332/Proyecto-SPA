<template>
  <div class="categoria-container">
    <div class="categoria-header">
      <h1>{{ categoria.nombrecategoria }}</h1>
    </div>
    <div class="categoria-footer">
      <button
        class="btn-editar"
        v-if="authService.isAdmin()"
        @click="
          () => {
            if (categoria.nombrecategoria != '') {
              router.push(`/catEditar/${categoria.codcategoria}`)
            }
          }
        "
      >
        Editar
      </button>
      <button class="btn-eliminar" v-if="authService.isAdmin()" @click="confirmarEliminacion">
        Eliminar
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCategoriaBanner } from './JS/CategoriaBanner'
import { authService } from '@/Authentication/services/auth'

const props = defineProps({
  categoria: {
    type: Object,
    required: true,
    default: () => ({
      codcategoria: Object,
      nombrecategoria: '',
    }),
  },
})
const { router, confirmarEliminacion } = useCategoriaBanner(props)
</script>

<style scoped src="./CSS/CategoriaBanner.css"></style>
