const TratamientoService = require('../services/tratamientoService');

const TratamientoController = {
  getAll: async (req, res, next) => {
    try {
      const data = await TratamientoService.getAll();
      res.json(data);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res, next) => {
    try {
      const data = await TratamientoService.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: 'Tratamiento no encontrado' });
      }
      res.json(data);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res, next) => {
    try {
      const nuevo = await TratamientoService.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res, next) => {
    try {
      const actualizado = await TratamientoService.update(req.params.id, req.body);
      if (!actualizado) {
        return res.status(404).json({ error: 'Tratamiento no encontrado' });
      }
      res.json(actualizado);
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  },

    getMasPopular: async (req, res, next) => {
      try {
        const tratamientoPopular = await TratamientoService.getMasPopular();
        if (!tratamientoPopular) {
          return res.status(404).json({ error: 'No se encontraron tratamientos' });
        }
        res.json(tratamientoPopular);
      } catch (error) {
        next(error)//res.status(500).json({ error: error.message });
      }
    },

  delete: async (req, res, next) => {
    try {
      const eliminado = await TratamientoService.delete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Tratamiento no encontrado' });
      }
      res.json({ message: 'Tratamiento eliminado correctamente' });
    } catch (error) {
      next(error)//res.status(500).json({ error: error.message });
    }
  }
};

module.exports = TratamientoController;
