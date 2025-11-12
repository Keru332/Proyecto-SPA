import api from './api'

export default {
  async getAll() {
    const res = await api.get('/paquetevendido')
    return res.data
  },

  async getById(id) {
    const res = await api.get(`/paquetevendido/${id}`)
    return res.data
  },

  async create(data) {
    const res = await api.post('/paquetevendido', data)
    return res.data
  },

  async update(id, data) {
    const res = await api.put(`/paquetevendido/${id}`, data)
    return res.data
  },

  async delete(id, id2, id3) {
    const res = await api.delete(`/paquetevendido/${id}/${id2}/${id3}`)
    return res.data
  },
}
