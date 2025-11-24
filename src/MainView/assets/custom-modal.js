export default {
  install(app) {
    // Crear una referencia reactiva para el modal
    let modalInstance = null

    // Método para registrar la instancia del modal
    app.config.globalProperties.$registerModal = (instance) => {
      modalInstance = instance
    }

    const modal = {
      alert(message, title = 'Alerta') {
        if (!modalInstance) {
          console.error('Modal no está registrado')
          return Promise.resolve()
        }
        return modalInstance.show({
          type: 'alert',
          message,
          title,
          showCloseButton: false,
        })
      },

      confirm(message, title = 'Confirmar') {
        if (!modalInstance) {
          console.error('Modal no está registrado')
          return Promise.resolve(false)
        }
        return modalInstance.show({
          type: 'confirm',
          message,
          title,
        })
      },

      prompt(message, defaultValue = '', title = 'Ingresar texto') {
        if (!modalInstance) {
          console.error('Modal no está registrado')
          return Promise.resolve(null)
        }
        return modalInstance.show({
          type: 'prompt',
          message,
          title,
          defaultValue,
        })
      },
    }

    app.config.globalProperties.$alert = modal.alert
    app.config.globalProperties.$confirm = modal.confirm
    app.config.globalProperties.$prompt = modal.prompt
  },
}
