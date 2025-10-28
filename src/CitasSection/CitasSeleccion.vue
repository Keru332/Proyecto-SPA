<template>
  <div class="treatments-section">
    <div class="section-header">
      <h2>Todas las Citas</h2>

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
          <small>Mostrando citas: {{ textoFiltroActivo }}</small>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">Cargando citas...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <!-- Contador de citas -->
    <div class="contador-citas" v-if="!loading && !error">
      <p>Mostrando {{ citasFiltradas.length }} de {{ citas.length }} citas</p>
    </div>

    <ListaCitas :citas="citasFiltradas" v-if="!loading && !error"></ListaCitas>

    <!-- Mensaje cuando no hay citas con el filtro aplicado -->
    <div v-if="!loading && !error && citasFiltradas.length === 0" class="no-citas-filtro">
      <p>No hay citas {{ textoFiltroActivo }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { authService } from '@/Authentication/services/auth'
import ListaCitas from './ListaCitas.vue'

const citas = ref([])
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
const citasFiltradas = computed(() => {
  if (!filtroActivo.value) {
    return citas.value
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

  return citas.value.filter((cita) => {
    try {
      const fechaCita = new Date(cita.fecha)
      return fechaCita >= fechaInicio && fechaCita < fechaFin
    } catch (error) {
      console.error('Error al filtrar cita:', error)
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

const fetchCitas = async () => {
  try {
    const responseCitas = await fetch(`http://localhost:3000/api/cita/`, {
      method: 'GET',
      headers: headers,
    })
    if (!responseCitas.ok) {
      if (responseCitas.status === 401) {
        throw new Error('Token inválido o expirado')
      } else if (responseCitas.status === 403) {
        throw new Error('No tienes permisos para ver las cias')
      } else {
        throw new Error(`Error ${responseCitas.status}: ${responseCitas.statusText}`)
      }
    }
    citas.value = await responseCitas.json()
  } catch (err) {
    error.value = 'No se pudo cargar las citas'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCitas()
})
</script>

<style scoped src="./CSS/CitasSeleccion.css"></style>
