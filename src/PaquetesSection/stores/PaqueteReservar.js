import { defineStore } from 'pinia'
import { ref } from 'vue'

export const paqueteStore = defineStore('paqStore', () => {
  const paquete = ref(null)
  const load = ref(false)
  const setPaquete = (data) => {
    paquete.value = data
  }

  const fetchPaquete = async (paqID) => {
    load.value = true
    try {
      const response = await fetch(`http://localhost:3000/api/paquete/${paqID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const paqData = await response.json()
      paqData.tratamientos = []

      const response2 = await fetch(`http://localhost:3000/api/paq_trat/${paqData.codpaquete}`)
      if (!response2.ok) throw new Error(`Error ${response.status}`)

      paqData.tratamientos = await response2.json()
      setPaquete(paqData)
    } catch (error) {
      console.log('error: ', error)
    } finally {
      load.value = false
    }
  }

  return {
    load,
    fetchPaquete,
    paquete,
    setPaquete,
  }
})
