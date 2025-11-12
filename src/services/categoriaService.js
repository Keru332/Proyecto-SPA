import api from './api'

export default {
  async getAll() {
    const res = await api.get('/categoria')
    return res.data
  },

  async getById(id) {
    const res = await api.get(`/categoria/${id}`)
    return res.data
  },

  async create(data) {
    const res = await api.post('/categoria', data)
    return res.data
  },

  async update(id, data) {
    const res = await api.put(`/categoria/${id}`, data)
    return res.data
  },

  async delete(id) {
    const res = await api.delete(`/categoria/${id}`)
    return res.data
  },
}
