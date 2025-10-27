const Cita = require('../models/cita');

const CitaController = {
  getAll: async (req, res) => {
    try {
      const data = await Cita.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await Cita.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: 'Cita no encontrado' });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const nuevo = await Cita.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const actualizado = await Cita.update(req.params.id, req.body);
      if (!actualizado) {
        return res.status(404).json({ error: 'Cita no encontrado' });
      }
      res.json(actualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const eliminado = await Cita.delete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Cita no encontrado' });
      }
      res.json({ message: 'Cita eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = CitaController;
