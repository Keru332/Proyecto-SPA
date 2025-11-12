import api from './api'

export default {
  async getAll() {
    const res = await api.get('/paquete')
    return res.data
  },

  async getById(id) {
    const res = await api.get(`/paquete/${id}`)
    return res.data
  },

  async create(data) {
    const res = await api.post('/paquete', data)
    return res.data
  },

  async update(id, data) {
    const res = await api.put(`/paquete/${id}`, data)
    return res.data
  },

  async delete(id) {
    const res = await api.delete(`/paquete/${id}`)
    return res.data
  },
}
