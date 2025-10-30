import { defineStore } from 'pinia'
import { ref } from 'vue'

export const categoriaStore = defineStore('catStore', () => {
  const categoria = ref(null)
  const load = ref(false)
  const setcategoria = (data) => {
    categoria.value = data
  }

  const fetchcategoria = async (catID) => {
    load.value = true
    try {
      const response = await fetch(`http://localhost:3000/api/categoria/${catID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const catData = await response.json()
      setcategoria(catData)
    } catch (error) {
      console.log('error: ', error)
    } finally {
      load.value = false
    }
  }

  return {
    load,
    fetchcategoria,
    categoria,
    setcategoria,
  }
})
