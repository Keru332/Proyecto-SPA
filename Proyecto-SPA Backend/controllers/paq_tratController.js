const PaqTratService = require('../services/PaqTratService');

const PaqTratController = {
  getAll: async (req, res, next) => {
    try {
      const data = await PaqTratService.getAll();
      res.json(data);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res, next) => {
    try {
      const data = await PaqTratService.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: 'PaqTrat no encontrado' });
      }
      res.json(data);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res, next) => {
    try {
      const nuevo = await PaqTratService.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res, next) => {
    try {
      const actualizado = await PaqTratService.update(req.params.id, req.body);
      if (!actualizado) {
        return res.status(404).json({ error: 'PaqTrat no encontrado' });
      }
      res.json(actualizado);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res, next) => {
    try {
    const { codpaquete, codtratamiento } = req.params;
    const eliminado = await PaqTratService.delete(codpaquete, codtratamiento);
    if (!eliminado) {
      return res.status(404).json({ error: 'Relación paquete-tratamiento no encontrada' });
    }
    res.json({ message: 'Relación eliminada correctamente' });
  } catch (error) {
    next(error)//res.status(500).json({ error: error.message });
  }
  }
};

module.exports = PaqTratController;
