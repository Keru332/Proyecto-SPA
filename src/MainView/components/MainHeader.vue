<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/Authentication/services/auth'

const router = useRouter()
const user = ref(null)

onMounted(() => {
  if (!authService.isAuthenticated() && !router.currentRoute.value === '/') {
    router.push('/login')
    return
  }
  user.value = authService.getUser()
})

const logout = () => {
  authService.logout()
  router.push('/login')
}
</script>

<template>
  <header>
    <div class="container">
      <div class="nav-container">
        <div class="logo">
          Ray<span>Mei</span>Spa
          <img src="../assets/RayMei Logo.webp" alt="logo" class="iconLogo" />
        </div>
        <nav v-if="authService.isAuthenticated() && authService.isUser()">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/productos">Tratamientos</RouterLink>
          <RouterLink to="/paquetes">Paquetes</RouterLink>
          <RouterLink to="/user">Usuario</RouterLink>
          <button @click="logout" class="logout">Logout</button>
        </nav>
        <nav v-else-if="authService.isAuthenticated() && authService.isAdmin()">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/productos">Tratamientos</RouterLink>
          <RouterLink to="/paquetes">Paquetes</RouterLink>
          <RouterLink to="/citas">Citas</RouterLink>
          <RouterLink to="/cat">Categorías</RouterLink>
          <RouterLink to="/admin">Admin Panel</RouterLink>
          <button @click="logout" class="logout">Logout</button>
        </nav>
        <nav v-else>
          <RouterLink to="/register" class="ButtonSigLog">Registrar</RouterLink>
          <RouterLink to="/login" class="ButtonSigLog" @click="authenticarPrueba">Login</RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped src="./CSS/MainHeader.css"></style>
