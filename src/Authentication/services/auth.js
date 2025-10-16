// Servicio para manejar la autenticación
export const authService = {
  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('authToken')
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

  // Cerrar sesión
  logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
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
}
