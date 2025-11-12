import api from './api'

export default {
  async getAll() {
    const res = await api.get('/users')
    return res.data
  },

  async getById(id) {
    const res = await api.get(`/users/${id}`)
    return res.data
  },

  async create(data) {
    const res = await api.post('/users', data)
    return res.data
  },

  async update(id, data) {
    const res = await api.put(`/users/${id}`, data)
    return res.data
  },

  async delete(id) {
    const res = await api.delete(`/users/${id}`)
    return res.data
  },

  async editProfile(id, data) {
    const res = await api.put(`/users/${id}/profile`, data)
    return res.data
  },

  async editPassword(id, data) {
    const res = await api.put(`/users/${id}/password`, data)
    return res.data
  },
  async register(data) {
    const res = await api.post('/users/register', data)
    return res.data
  },
  async login(data) {
    const res = await api.post('/users/login', data)
    return res.data
  },
}
