<script setup>
import TratamientoBanner from '../../TratamientoSection/components/TratamientoBanner.vue'
import { ref, onMounted } from 'vue'

const goTrat = () => {
  window.location.href = '/productos'
}
// Datos del tratamiento más popular

const tratamientoMasPopular = ref({
  nombretratamiento: 'Cargando...',
  nombrecategoria: 'Cargando...',
  precio: 0,
  duracion: 0,
  descripcion: 'Cargando descripción...',
  frecuenciadesolicitudmensual: 0,
  categoria_codcategoria: 0,
})

const loading = ref(true)
const error = ref('')

const fetchTratamientoPopular = async () => {
  try {
    const responseTratamiento = await fetch(`http://localhost:3000/api/tratamiento/mas-popular`)
    if (!responseTratamiento.ok) throw new Error('Tratamiento no encontrado')

    tratamientoMasPopular.value = await responseTratamiento.json()
  } catch (err) {
    error.value = 'No se pudo cargar el tratamiento más popular'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

// Cargar el tratamiento al montar el componente
onMounted(() => {
  fetchTratamientoPopular()
})
</script>

<template>
  <div class="banner-container">
    <div class="text-container">
      <div class="welcome-content">
        <h1>Bienvenido a nuestro Spa</h1>
        <h2>Donde tu felicidad va a ser Eterna</h2>
        <p>
          Disfruta de nuestros servicios de calidad y recibe la bendicion de nuestra poderosa Raiden
          Shogun
        </p>
        <button class="cta-button" @click="goTrat()">Descubrir Tratamientos</button>
      </div>
    </div>
    <div class="popular-container">
      <div class="popular-header">
        <h2>Nuestro Tratamiento más popular</h2>
      </div>
      <!-- Estado de carga -->
      <div v-if="loading" class="loading">Cargando tratamiento más popular...</div>

      <!-- Estado de error -->
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      <TratamientoBanner :tratamiento="tratamientoMasPopular"></TratamientoBanner>
    </div>
  </div>
</template>

<style scoped src="./CSS/SpaBanner.css"></style>
