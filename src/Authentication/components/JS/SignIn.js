import { ref } from 'vue'
import { useRouter } from 'vue-router'
import userService from '@/services/userService'

export function useRegister() {
  const router = useRouter()
  const usuario = ref('')
  const pass = ref('')
  const correo = ref('')
  const nombre = ref('')
  const confirmPass = ref('')
  const loading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  // Función para registrar usuario
  const registerUser = async (event) => {
    event.preventDefault()
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // Validaciones básicas
    if (!usuario.value || !pass.value || !correo.value || !nombre.value) {
      errorMessage.value = 'Todos los campos son obligatorios'
      loading.value = false
      return
    }
    if (!(pass.value == confirmPass.value)) {
      errorMessage.value = 'Verifique bien la contraseña'
      loading.value = false
      return
    }

    if (pass.value.length < 6) {
      errorMessage.value = 'La contraseña debe tener al menos 6 caracteres'
      loading.value = false
      return
    }

    try {
      const body = JSON.stringify({
        username: usuario.value,
        password: pass.value,
        role: 'user', // Rol por defecto
        // Agregamos campos extra que podrías guardar después
        email: correo.value,
        fullname: nombre.value,
      })
      const response = await userService.register(body)
      console.log(response)

      // Registro exitoso
      successMessage.value = '✅ Usuario registrado exitosamente'

      // Opcional: Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      if (error.response) {
        errorMessage.value = `Error: ${error.response.data?.error || 'Error al registrarse'}`
      } else {
        errorMessage.value = 'Error de conexión con el servidor'
      }
    } finally {
      loading.value = false
    }
  }
  return {
    usuario,
    pass,
    correo,
    nombre,
    confirmPass,
    loading,
    errorMessage,
    successMessage,
    registerUser,
  }
}
