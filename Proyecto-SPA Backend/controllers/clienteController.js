const ClienteService = require('../services/clienteService');

const ClienteController = {
  getAll: async (req, res, next) => {
    try {
      const data = await ClienteService.getAll();
      res.json(data);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res, next) => {
    try {
      const data = await ClienteService.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      res.json(data);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res, next) => {
    try {
      const nuevo = await ClienteService.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res, next) => {
    try {
      const actualizado = await ClienteService.update(req.params.id, req.body);
      if (!actualizado) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      res.json(actualizado);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res, next) => {
    try {
      const eliminado = await ClienteService.delete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ClienteController;
