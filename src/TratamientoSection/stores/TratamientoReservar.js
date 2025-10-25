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
      const response = await fetch(`http://localhost:3000/api/tratamiento/${tratID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const tratData = await response.json()
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
