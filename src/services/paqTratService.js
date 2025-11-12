import api from './api'

export default {
  async getAll() {
    const res = await api.get('/paq_trat')
    return res.data
  },

  async getById(id) {
    const res = await api.get(`/paq_trat/${id}`)
    return res.data
  },

  async create(data) {
    const res = await api.post('/paq_trat', data)
    return res.data
  },

  async update(id, data) {
    const res = await api.put(`/paq_trat/${id}`, data)
    return res.data
  },

  async delete(id, id2) {
    const res = await api.delete(`/paq_trat/${id}/${id2}`)
    return res.data
  },
}
