const Paquete = require('../models/paquete');

const PaqueteController = {
  getAll: async (req, res) => {
    try {
      const data = await Paquete.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await Paquete.getById(req.params.id);
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
      const nuevo = await Paquete.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const actualizado = await Paquete.update(req.params.id, req.body);
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
      const eliminado = await Paquete.delete(req.params.id);
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
