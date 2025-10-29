<template>
  <div class="paquetev-section">
    <div class="section-header">
      <h2>Todos los Paquetes Vendidos</h2>

      <!-- Componente de Filtro -->
      <div class="filtro-container">
        <div class="filtro-opciones">
          <button
            class="filtro-btn"
            :class="{ active: filtroActivo === 'hoy' }"
            @click="aplicarFiltro('hoy')"
          >
            Hoy
          </button>
          <button
            class="filtro-btn"
            :class="{ active: filtroActivo === 'semana' }"
            @click="aplicarFiltro('semana')"
          >
            Esta Semana
          </button>
          <button
            class="filtro-btn"
            :class="{ active: filtroActivo === 'mes' }"
            @click="aplicarFiltro('mes')"
          >
            Este Mes
          </button>
          <button
            class="filtro-btn"
            :class="{ active: filtroActivo === 'año' }"
            @click="aplicarFiltro('año')"
          >
            Este Año
          </button>
          <button class="filtro-btn limpiar" @click="limpiarFiltro" v-if="filtroActivo">
            Limpiar Filtro
          </button>
        </div>

        <!-- Mostrar rango de fechas cuando hay filtro activo -->
        <div v-if="filtroActivo" class="filtro-info">
          <small>Mostrando paquetes vendidos: {{ textoFiltroActivo }}</small>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">Cargando paquetes vendidos...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <!-- Contador de citas -->
    <div class="contador-paquetesv" v-if="!loading && !error">
      <p>Mostrando {{ paquetesvFiltrados.length }} de {{ paquetesv.length }} paquetes vendidos</p>
    </div>

    <ListaPaquetesV :paquetesv="paquetesvFiltrados" v-if="!loading && !error"></ListaPaquetesV>

    <!-- Mensaje cuando no hay citas con el filtro aplicado -->
    <div v-if="!loading && !error && paquetesvFiltrados.length === 0" class="no-paquetesv-filtro">
      <p>No hay citas {{ textoFiltroActivo }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { authService } from '@/Authentication/services/auth'
import ListaPaquetesV from './ListaPaquetesV.vue'

const paquetesv = ref([])
const loading = ref(true)
const error = ref('')
const filtroActivo = ref('')

const headers = authService.getAuthHeaders()

// Computed para el texto del filtro activo
const textoFiltroActivo = computed(() => {
  const textos = {
    hoy: 'de hoy',
    semana: 'de esta semana',
    mes: 'de este mes',
    año: 'de este año',
  }
  return textos[filtroActivo.value] || ''
})

// Computed para las citas filtradas
const paquetesvFiltrados = computed(() => {
  if (!filtroActivo.value) {
    return paquetesv.value
  }

  const hoy = new Date()
  let fechaInicio, fechaFin
  const lunes = new Date(hoy)
  const domingo = new Date(lunes)

  switch (filtroActivo.value) {
    case 'hoy':
      fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
      fechaFin = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1)
      break

    case 'semana':
      // Lunes de esta semana

      lunes.setDate(hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1))
      fechaInicio = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate())

      // Domingo de esta semana

      domingo.setDate(lunes.getDate() + 6)
      fechaFin = new Date(domingo.getFullYear(), domingo.getMonth(), domingo.getDate() + 1)
      break

    case 'mes':
      fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1)
      break

    case 'año':
      fechaInicio = new Date(hoy.getFullYear(), 0, 1)
      fechaFin = new Date(hoy.getFullYear() + 1, 0, 1)
      break
  }

  return paquetesv.value.filter((paquetev) => {
    try {
      const fechaPaquetev = new Date(paquetev.fechafin)
      return fechaPaquetev >= fechaInicio && fechaPaquetev < fechaFin
    } catch (error) {
      console.error('Error al filtrar paquete vendido:', error)
      return false
    }
  })
})

// Métodos para aplicar filtros
const aplicarFiltro = (tipo) => {
  filtroActivo.value = tipo
}

const limpiarFiltro = () => {
  filtroActivo.value = ''
}

const fetchPaquetesV = async () => {
  try {
    const responsePaqueteV = await fetch(`http://localhost:3000/api/paquetevendido/`, {
      method: 'GET',
      headers: headers,
    })
    if (!responsePaqueteV.ok) {
      if (responsePaqueteV.status === 401) {
        throw new Error('Token inválido o expirado')
      } else if (responsePaqueteV.status === 403) {
        throw new Error('No tienes permisos para ver los paquetes vendidos')
      } else {
        throw new Error(`Error ${responsePaqueteV.status}: ${responsePaqueteV.statusText}`)
      }
    }
    paquetesv.value = await responsePaqueteV.json()
  } catch (err) {
    error.value = 'No se pudo cargar los paquetes vendidos'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPaquetesV()
})
</script>

<style scoped src="./CSS/PaquetesVSelection.css"></style>
