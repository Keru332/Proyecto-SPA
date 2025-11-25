import paqTratService from '@/services/paqTratService'
import paqueteService from '@/services/paqueteService'
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
      const response = await paqueteService.getById(paqID)
      console.log(response)
      const paqData = await response
      paqData.tratamientos = []

      const response2 = await paqTratService.getById(paqData.codpaquete)
      console.log(response2)

      paqData.tratamientos = await response2
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
