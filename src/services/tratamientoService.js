import api from './api'

export default {
  async getAll() {
    const res = await api.get('/tratamiento')
    return res.data
  },

  async getById(id) {
    const res = await api.get(`/tratamiento/${id}`)
    return res.data
  },

  async create(data) {
    const res = await api.post('/tratamiento', data)
    return res.data
  },

  async update(id, data) {
    const res = await api.put(`/tratamiento/${id}`, data)
    return res.data
  },

  async delete(id) {
    const res = await api.delete(`/tratamiento/${id}`)
    return res.data
  },
}
