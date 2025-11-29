const CitaService = require('../services/citaService');

const CitaController = {
  getAll: async (req, res, next) => {
    try {
      const data = await CitaService.getAll();
      res.json(data);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },
  getByPeriodo: async (req, res, next) => {
    try {
      const data = await CitaService.getByPeriodo(req.params.periodo);
      res.json(data);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },
  getByClienteFuturas: async (req, res, next) => {
    try {
      const data = await CitaService.getByClienteFuturas(req.params.id);
      res.json(data);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },
  getByClientePasadas: async (req, res, next) => {
    try {
      const data = await CitaService.getByClientePasadas(req.params.id);
      res.json(data);
    } catch (error) {
      next(error)//.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res, next) => {
    try {
      const data = await CitaService.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: 'Cita no encontrado' });
      }
      res.json(data);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res, next) => {
    try {
      const nuevo = await CitaService.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res, next) => {
    try {
      const actualizado = await CitaService.update(req.params.id, req.body);
      if (!actualizado) {
        return res.status(404).json({ error: 'Cita no encontrado' });
      }
      res.json(actualizado);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res, next) => {
    try {
      const eliminado = await CitaService.delete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Cita no encontrado' });
      }
      res.json({ message: 'Cita eliminado correctamente' });
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  }
};

module.exports = CitaController;
