import api from './api'

export default {
  async getAll() {
    const res = await api.get('/cita')
    return res.data
  },

  async getById(id) {
    const res = await api.get(`/cita/${id}`)
    return res.data
  },

  async create(data) {
    const res = await api.post('/cita', data)
    return res.data
  },

  async update(id, data) {
    const res = await api.put(`/cita/${id}`, data)
    return res.data
  },

  async delete(id) {
    const res = await api.delete(`/cita/${id}`)
    return res.data
  },

  async getByPeriodo(periodo) {
    const res = await api.get(`/cita/citasfiltro/${periodo}`)
    return res.data
  },

  async getByClientePasadas(id) {
    const res = await api.get(`/cita/citasUserP/${id}`)
    return res.data
  },

  async getByClienteFuturas(id) {
    const res = await api.get(`/cita/citasUserF/${id}`)
    return res.data
  },
}
