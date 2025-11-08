import { ref } from 'vue'
import { useRouter } from 'vue-router'

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
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usuario.value,
          password: pass.value,
          role: 'user', // Rol por defecto
          // Agregamos campos extra que podrías guardar después
          email: correo.value,
          fullname: nombre.value,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario')
      }

      // Registro exitoso
      successMessage.value = '✅ Usuario registrado exitosamente'

      // Opcional: Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      errorMessage.value = `❌ Error: ${error.message}`
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
