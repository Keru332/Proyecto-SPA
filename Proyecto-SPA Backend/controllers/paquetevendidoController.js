const PaqueteVendido = require('../models/paquetevendido');

const PaqueteVendidoController = {
  getAll: async (req, res) => {
    try {
      const data = await PaqueteVendido.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await PaqueteVendido.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: 'PaqueteVendido no encontrado' });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const nuevo = await PaqueteVendido.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const actualizado = await PaqueteVendido.update(req.params.id, req.body);
      if (!actualizado) {
        return res.status(404).json({ error: 'PaqueteVendido no encontrado' });
      }
      res.json(actualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const eliminado = await PaqueteVendido.delete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'PaqueteVendido no encontrado' });
      }
      res.json({ message: 'PaqueteVendido eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = PaqueteVendidoController;
