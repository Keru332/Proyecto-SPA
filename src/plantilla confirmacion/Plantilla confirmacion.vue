Alerta confirm
<template>
  <div v-if="visible" class="alerta-overlay">
    <div class="alerta-contenido">
      
      <div class="alerta-icono" :class="tipo">
        <span v-if="tipo === 'peligro'">⚠️</span>
        <span v-else-if="tipo === 'exito'">✅</span>
        <span v-else-if="tipo === 'advertencia'">⚠️</span>
        <span v-else>ℹ️</span>
      </div>
     
      
      <div class="alerta-body">
        <h3>{{ titulo }}</h3>
        <p>{{ mensaje }}</p>
      </div>
     
      
      <div class="alerta-botones">
        <button
          @click="$emit('cancelar')"
          class="btn-cancelar"
          :class="{ 'btn-secundario': !esPeligro }"
        >
          {{ textoCancelar }}
        </button>
        <button
          @click="$emit('aceptar')"
          class="btn-aceptar"
          :class="{
            'btn-peligro': esPeligro,
            'btn-exito': tipo === 'exito',
            'btn-advertencia': tipo === 'advertencia'
          }"
        >
          {{ textoAceptar }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertaConfirmacion',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    titulo: {
      type: String,
      default: 'Confirmar acción'
    },
    mensaje: {
      type: String,
      required: true
    },
    tipo: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'exito', 'advertencia', 'peligro'].includes(value)
    },
    textoAceptar: {
      type: String,
      default: 'Aceptar'
    },
    textoCancelar: {
      type: String,
      default: 'Cancelar'
    }
  },
  emits: ['aceptar', 'cancelar', 'update:visible'],
  computed: {
    esPeligro() {
      return this.tipo === 'peligro'
    }
  }
}
</script>
<style scoped src="./CSS/Plantilla confirmacion.css"></style>

