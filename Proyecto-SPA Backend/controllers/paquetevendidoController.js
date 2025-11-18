const PaqueteVendidoService = require('../services/paquetevendidoService');

const PaqueteVendidoController = {
  getAll: async (req, res) => {
    try {
      const data = await PaqueteVendidoService.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await PaqueteVendidoService.getById(req.params.id);
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
      const nuevo = await PaqueteVendidoService.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const actualizado = await PaqueteVendidoService.update(req.params.id, req.body);
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
      const eliminado = await PaqueteVendidoService.delete(req.params.id, req.params.id2, req.params.id3);
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
