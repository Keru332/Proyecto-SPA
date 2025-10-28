<template>
  <div class="login-container">
    <h1>Crear Tratamiento</h1>
    <form class="login-form" @submit.prevent="submitForm">
      <div class="user-container">
        <label for="nombre">Nombre del Tratamiento</label>
        <input
          type="text"
          id="nombre"
          v-model="tratamiento.nombre"
          placeholder="Ejemplo: Masaje relajante"
          required
        />
      </div>

      <div class="user-container">
        <label for="descripcion">Descripción</label>
        <input
          type="text"
          id="descripcion"
          v-model="tratamiento.descripcion"
          placeholder="Describe el tratamiento"
          required
        />
      </div>

      <div class="user-container">
        <label for="duracion">Duración (minutos)</label>
        <input
          type="number"
          id="duracion"
          min="5"
          max="300"
          v-model="tratamiento.duracion"
          placeholder="0"
          required
        />
      </div>

      <div class="user-container">
        <label for="precio">Precio ($)</label>
        <input
          type="number"
          id="precio"
          min="1"
          max="9999"
          v-model="tratamiento.precio"
          placeholder="0"
          required
        />
      </div>

      <div class="user-container">
        <label for="categoria">Categoría</label>
        <select id="categoria" v-model="tratamiento.codcategoria" required>
          <option value="" disabled>Selecciona una categoría</option>
          <option
            v-for="categoria in categorias"
            :key="categoria.codcategoria"
            :value="categoria.codcategoria"
          >
            {{ categoria.nombrecategoria }}
          </option>
        </select>
      </div>

      <button type="submit" class="submit">Crear Tratamiento</button>

      <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/Authentication/services/auth'

const router = useRouter()

const tratamiento = reactive({
  codtratamiento: Object,
  nombre: '',
  descripcion: '',
  duracion: '',
  precio: '',
  codcategoria: Object,
})

const categorias = ref([])

// Función para cargar las categorías desde la API
const fetchCategorias = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/categoria')
    if (!response.ok) {
      throw new Error('Error al cargar categorías')
    }
    const data = await response.json()
    categorias.value = data
  } catch (error) {
    console.error('Error:', error)
    mensaje.value = 'Error al cargar las categorías'
  }
}

const mensaje = ref('')

const submitForm = async () => {
  try {
    const token = authService.getToken()
    // Preparar los datos para enviar
    const datosActualizados = {
      nombretratamiento: tratamiento.nombre,
      descripcion: tratamiento.descripcion,
      frecuenciadesolicitudmensual: 0,
      duracion: parseInt(tratamiento.duracion),
      precio: parseFloat(tratamiento.precio),
      categoria_codcategoria: tratamiento.codcategoria,
    }

    const response = await fetch(`http://localhost:3000/api/tratamiento/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datosActualizados),
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error al actualizar el tratamiento')
    }

    mensaje.value = 'Tratamiento creado correctamente!'

    // Limpiar formulario
    tratamiento.nombre = ''
    tratamiento.descripcion = ''
    tratamiento.duracion = ''
    tratamiento.precio = ''
    tratamiento.codcategoria = ''

    alert('Tratamiento creado correctamente')
    router.push('/productos')
  } catch (error) {
    console.error('Error:', error)
    mensaje.value = 'Error al crear el tratamiento'
  }
}

onMounted(async () => {
  // Cargar categorías
  await fetchCategorias()
})
</script>

<style scoped src="./CSS/CrearTratamiento.css"></style>
