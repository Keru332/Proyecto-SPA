import { jwtDecode } from 'jwt-decode'

export const authService = {
  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = this.getToken()
    return !!token && this.isTokenValid(token)
  },

  isTokenValid(token) {
    if (!token) return false

    try {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000
      const isValid = decoded.exp > currentTime

      console.log('🔍 Estado del token:', {
        expira: new Date(decoded.exp * 1000).toLocaleTimeString(),
        ahora: new Date().toLocaleTimeString(),
        valido: isValid,
        segundosRestantes: Math.round(decoded.exp - currentTime),
      })

      return isValid
    } catch (error) {
      console.log('❌ Error decodificando token:', error)
      return false
    }
  },

  // Obtener el token
  getToken() {
    return localStorage.getItem('authToken')
  },

  // Obtener datos del usuario
  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAdmin() {
    const user = this.getUser()
    return user.role == 'admin'
  },

  isUser() {
    const user = this.getUser()
    return user.role === 'user'
  },

  // Cerrar sesión
  logout(redirectToLogin = true) {
    console.log('🚪 Cerrando sesión - Limpiando almacenamiento')
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')

    if (redirectToLogin) {
      // Redirigir al login
      window.location.href = '/home'
    }
  },

  getAuthHeaders() {
    const token = this.getToken()
    return token
      ? {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      : {}
  },

  initialize() {
    const token = this.getToken()
    if (token && !this.isTokenValid(token)) {
      console.log('🔄 Inicialización: Token expirado encontrado, limpiando...')
      this.logout(false)
    }
  },
}
