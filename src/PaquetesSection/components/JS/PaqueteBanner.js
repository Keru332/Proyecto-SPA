import { authService } from '@/Authentication/services/auth'

export function usePaqueteBanner(props) {
  const confirmarEliminacion = () => {
    if (
      confirm(
        '¿Estás seguro de que deseas eliminar este paquete? Esta acción no se puede deshacer.',
      )
    ) {
      eliminarTratamiento()
    }
  }

  const eliminarTratamiento = async () => {
    try {
      // Obtener el token
      const token = authService.getToken()

      const response = await fetch(
        `http://localhost:3000/api/paquete/${props.paquete.codpaquete}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        // Detectar violación de FK por el mensaje de error
        if (
          errorText.includes('foreign key') ||
          errorText.includes('FK_') ||
          errorText.includes('violates foreign key') ||
          errorText.includes('restrict') ||
          errorText.includes('REFERENCE')
        ) {
          throw new Error(
            'No se puede eliminar este paquete porque está siendo utilizado en paquetes comprados. Primero elimine las compras asociadas.',
          )
        }
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      alert('Paquete eliminado correctamente')
      window.location.reload()
    } catch (error) {
      console.error('Error eliminando paquete:', error)
      alert(`Error al eliminar: ${error.message}`)
    }
  }

  return { confirmarEliminacion }
}
