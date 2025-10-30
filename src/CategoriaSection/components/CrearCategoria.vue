<template>
  <div class="login-container">
    <h1>Crear categoria</h1>
    <form class="login-form" @submit.prevent="submitForm">
      <div class="user-container">
        <label for="catgoria">Nombre Categoria</label>
        <input
          type="text"
          id="nombre_categoria"
          v-model="categoria.nombre"
          placeholder="Ingrese un Nombre"
          required
          name="catgoria"
        />
      </div>

      <button type="submit" class="submit">Crear Categoria</button>
    </form>
    <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { authService } from '@/Authentication/services/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const categoria = ref({
  nombre: '',
})
const mensaje = ref('')
const submitForm = async () => {
  try {
    const token = authService.getToken()
    const dato_actualizado = {
      nombrecategoria: categoria.value.nombre,
    }

    const response = await fetch('http://localhost:3000/api/categoria', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dato_actualizado),
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error al crear la categoria')
    }

    mensaje.value = 'Categoria creada correctamente!'

    alert('Categoria Creada correctamente')
    router.push('/cat')
  } catch (error) {
    console.error('Error:', error)
    mensaje.value = 'Error al Crear la categoria'
  }
}
</script>
<style scoped src="./CSS/CrearCategoria.css"></style>
