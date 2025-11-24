<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button v-if="showCloseButton" @click="close" class="close-button">&times;</button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <p>{{ message }}</p>
      </div>

      <!-- Footer - Botones dinámicos según el tipo -->
      <div class="modal-footer">
        <template v-if="type === 'alert'">
          <button @click="confirm" class="btn btn-primary">
            {{ confirmText }}
          </button>
        </template>

        <template v-else-if="type === 'confirm'">
          <button @click="cancel" class="btn btn-secondary">
            {{ cancelText }}
          </button>
          <button @click="confirm" class="btn btn-primary">
            {{ confirmText }}
          </button>
        </template>

        <template v-else-if="type === 'prompt'">
          <input
            v-model="inputValue"
            @keyup.enter="confirm"
            class="prompt-input"
            :placeholder="placeholder"
          />
          <div class="prompt-buttons">
            <button @click="cancel" class="btn btn-secondary">
              {{ cancelText }}
            </button>
            <button @click="confirm" class="btn btn-primary">
              {{ confirmText }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomModal',
  data() {
    return {
      visible: false,
      title: '',
      message: '',
      type: 'alert', // 'alert', 'confirm', 'prompt'
      confirmText: 'Aceptar',
      cancelText: 'Cancelar',
      placeholder: 'Escribe aquí...',
      inputValue: '',
      showCloseButton: true,
      resolvePromise: null,
      rejectPromise: null,
    }
  },
  mounted() {
    // Registra esta instancia cuando el componente se monte
    if (this.$registerModal) {
      this.$registerModal(this)
    }
  },

  methods: {
    show(options) {
      this.visible = true
      this.title = options.title || ''
      this.message = options.message || ''
      this.type = options.type || 'alert'
      this.confirmText = options.confirmText || 'Aceptar'
      this.cancelText = options.cancelText || 'Cancelar'
      this.placeholder = options.placeholder || 'Escribe aquí...'
      this.showCloseButton = options.showCloseButton !== false
      this.inputValue = options.defaultValue || ''

      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve
        this.rejectPromise = reject
      })
    },

    confirm() {
      this.visible = false
      if (this.resolvePromise) {
        if (this.type === 'prompt') {
          this.resolvePromise(this.inputValue)
        } else {
          this.resolvePromise(true)
        }
      }
      this.cleanup()
    },

    cancel() {
      this.visible = false
      if (this.rejectPromise) {
        if (this.type === 'prompt') {
          this.resolvePromise(null)
        } else {
          this.rejectPromise(false)
        }
      }
      this.cleanup()
    },

    close() {
      this.visible = false
      if (this.rejectPromise) {
        this.rejectPromise(false)
      }
      this.cleanup()
    },

    handleOverlayClick() {
      if (this.showCloseButton) {
        this.close()
      }
    },

    cleanup() {
      this.resolvePromise = null
      this.rejectPromise = null
      this.inputValue = ''
    },
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in-out;
}

.modal-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 400px;
  animation: slideIn 0.2s ease-out;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-button:hover {
  background-color: #f5f5f5;
  color: #333;
}

.modal-content {
  padding: 1.5rem;
  color: #555;
  line-height: 1.5;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e5e5;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  min-width: 80px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.prompt-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.prompt-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.prompt-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
