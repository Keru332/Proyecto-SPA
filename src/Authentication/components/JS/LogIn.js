import { ref } from 'vue'
import { useRouter } from 'vue-router'

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
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usuario.value,
          password: pass.value,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión')
      }

      // Login exitoso
      console.log('Login exitoso:', data)

      // Guardar token en localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      // Redirigir al dashboard o página principal
      router.push('/')
    } catch (error) {
      errorMessage.value = `❌ Error: ${error.message}`
    } finally {
      loading.value = false
    }
  }
  return { usuario, pass, loading, errorMessage, loginUser }
}
