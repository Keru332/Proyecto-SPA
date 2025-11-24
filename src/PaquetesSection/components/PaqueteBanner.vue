<template>
  <div class="paquete-container">
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

    <div class="paquete-footer" v-if="!$route.path.includes('/comprarPaquete/')">
      <button
        class="btn-reservar"
        v-if="authService.isUser()"
        @click="
          () => {
            if (paquete.nombrepaquete != '') {
              router.push(`/comprarPaquete/${paquete.codpaquete}`)
            }
          }
        "
      >
        Reservar paquete
      </button>
      <button
        class="btn-editar"
        v-if="authService.isAdmin()"
        @click="
          () => {
            if (paquete.nombrepaquete != '') {
              router.push(`/EditarPaquete/${paquete.codpaquete}`)
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

    <AlertaConfirmacion />
  </div>
</template>

<script setup>
import { authService } from '@/Authentication/services/auth'
import { useRouter } from 'vue-router'
import { usePaqueteBanner } from './JS/PaqueteBanner'
import AlertaConfirmacion from '@/plantilla confirmacion/Plantilla confirmacion.vue'

const router = useRouter()
const props = defineProps({
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

const { confirmarEliminacion } = usePaqueteBanner(props)
</script>

<style scoped src="./CSS/PaqueteBanner.css"></style>
