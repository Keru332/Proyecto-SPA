const Cliente = require('../models/cliente');

const ClienteController = {
  getAll: async (req, res) => {
    try {
      const data = await Cliente.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await Cliente.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const nuevo = await Cliente.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const actualizado = await Cliente.update(req.params.id, req.body);
      if (!actualizado) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      res.json(actualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const eliminado = await Cliente.delete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ClienteController;
