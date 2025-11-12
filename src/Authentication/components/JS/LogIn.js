import { ref } from 'vue'
import { useRouter } from 'vue-router'
import userService from '@/services/userService'

export function useLogin() {
  const router = useRouter()
  const usuario = ref('')
  const pass = ref('')
  const loading = ref(false)
  const errorMessage = ref('')

  // Función para hacer login
  const loginUser = async (event) => {
    event.preventDefault()
    loading.value = true
    errorMessage.value = ''

    // Validaciones básicas
    if (!usuario.value || !pass.value) {
      errorMessage.value = 'Usuario y contraseña son obligatorios'
      loading.value = false
      return
    }

    try {
      const body = JSON.stringify({
        username: usuario.value,
        password: pass.value,
      })
      const response = await userService.login(body)
      const data = response

      if (data.token) {
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      router.push('/')
    } catch (error) {
      if (error.response) {
        errorMessage.value = `Error: ${error.response.data?.error || 'Error al iniciar sesión'}`
      } else {
        errorMessage.value = 'Error de conexión con el servidor'
      }
    } finally {
      loading.value = false
    }
  }
  return { usuario, pass, loading, errorMessage, loginUser }
}
