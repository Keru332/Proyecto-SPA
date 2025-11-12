import api from './api'

export default {
  async getAll() {
    const res = await api.get('/cliente')
    return res.data
  },

  async getById(id) {
    const res = await api.get(`/cliente/${id}`)
    return res.data
  },

  async create(data) {
    const res = await api.post('/cliente', data)
    return res.data
  },

  async update(id, data) {
    const res = await api.put(`/cliente/${id}`, data)
    return res.data
  },

  async delete(id) {
    const res = await api.delete(`/cliente/${id}`)
    return res.data
  },
}
