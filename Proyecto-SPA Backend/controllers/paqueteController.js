const PaqueteService = require('../services/paqueteService');

const PaqueteController = {
  getAll: async (req, res) => {
    try {
      const data = await PaqueteService.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await PaqueteService.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: 'Paquete no encontrado' });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const nuevo = await PaqueteService.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const actualizado = await PaqueteService.update(req.params.id, req.body);
      if (!actualizado) {
        return res.status(404).json({ error: 'Paquete no encontrado' });
      }
      res.json(actualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const eliminado = await PaqueteService.delete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Paquete no encontrado' });
      }
      res.json({ message: 'Paquete eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = PaqueteController;
