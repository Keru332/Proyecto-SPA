import tratamientoService from '@/services/tratamientoService'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const tratamientoStore = defineStore('tratStore', () => {
  const tratamiento = ref(null)
  const load = ref(false)
  const setTratamiento = (data) => {
    tratamiento.value = data
  }

  const fetchTratamiento = async (tratID) => {
    load.value = true
    try {
      const response = await tratamientoService.getById(tratID)
      const tratData = await response
      setTratamiento(tratData)
    } catch (error) {
      console.log('error: ', error)
    } finally {
      load.value = false
    }
  }

  return {
    load,
    fetchTratamiento,
    tratamiento,
    setTratamiento,
  }
})
