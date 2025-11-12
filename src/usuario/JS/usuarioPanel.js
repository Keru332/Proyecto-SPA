import { onMounted, reactive, ref } from 'vue'
import userService from '@/services/userService'

export function useUsuarioPanel() {
  const usuario = reactive({ id: '', username: '', correo: '' })
  const form = reactive({ username: '', correo: '' })
  const editando = ref(false)

  // Modal de contraseña
  const modalPasswordVisible = ref(false)
  const passwordForm = reactive({ oldPassword: '', newPassword: '' })

  // Cargar datos de usuario
  const userData = JSON.parse(localStorage.getItem('user'))
  usuario.id = userData.id

  onMounted(async () => {
    await fetchUser()
  })

  const fetchUser = async () => {
    try {
      const data = await userService.getById(usuario.id)
      usuario.username = data.username
      usuario.correo = data.correo
    } catch (error) {
      console.error(error)
    }
  }

  // Editar perfil
  const editar = () => {
    form.username = usuario.username
    form.correo = usuario.correo
    editando.value = true
  }
  const cancelar = () => (editando.value = false)
  const guardar = async () => {
    const body = JSON.stringify({ username: form.username, correo: form.correo })
    try {
      const data = await userService.editProfile(usuario.id, body)

      usuario.username = data.user.username
      usuario.correo = data.user.correo
      editando.value = false
    } catch (error) {
      console.error(error)
      alert('No se pudo actualizar el perfil')
    }
  }

  // Modal de contraseña
  const abrirModalPassword = () => {
    modalPasswordVisible.value = true
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
  }
  const cerrarModalPassword = () => (modalPasswordVisible.value = false)

  // Guardar contraseña
  const guardarPassword = async () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      alert('Debes llenar ambos campos')
      return
    }

    try {
      const body = JSON.stringify({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      })
      await userService.editPassword(usuario.id, body)

      alert('Contraseña actualizada correctamente')
      cerrarModalPassword()
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  return {
    usuario,
    form,
    editando,
    modalPasswordVisible,
    passwordForm,
    userData,
    fetchUser,
    editar,
    cancelar,
    guardar,
    abrirModalPassword,
    guardarPassword,
    cerrarModalPassword,
  }
}
