const PaqTrat = require('../models/paq_trat');

const PaqTratController = {
  getAll: async (req, res) => {
    try {
      const data = await PaqTrat.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await PaqTrat.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: 'PaqTrat no encontrado' });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const nuevo = await PaqTrat.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const actualizado = await PaqTrat.update(req.params.id, req.body);
      if (!actualizado) {
        return res.status(404).json({ error: 'PaqTrat no encontrado' });
      }
      res.json(actualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
    const { codpaquete, codtratamiento } = req.params;
    const eliminado = await PaqTrat.delete(codpaquete, codtratamiento);
    if (!eliminado) {
      return res.status(404).json({ error: 'Relación paquete-tratamiento no encontrada' });
    }
    res.json({ message: 'Relación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  }
};

module.exports = PaqTratController;
