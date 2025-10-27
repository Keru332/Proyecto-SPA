const Tratamiento = require('../models/tratamiento');

const TratamientoController = {
  getAll: async (req, res) => {
    try {
      const data = await Tratamiento.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await Tratamiento.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: 'Tratamiento no encontrado' });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const nuevo = await Tratamiento.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const actualizado = await Tratamiento.update(req.params.id, req.body);
      if (!actualizado) {
        return res.status(404).json({ error: 'Tratamiento no encontrado' });
      }
      res.json(actualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

    // Agrega este método al controlador
    getMasPopular: async (req, res) => {
      try {
        const tratamientoPopular = await Tratamiento.getMasPopular();
        if (!tratamientoPopular) {
          return res.status(404).json({ error: 'No se encontraron tratamientos' });
        }
        res.json(tratamientoPopular);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

  delete: async (req, res) => {
    try {
      const eliminado = await Tratamiento.delete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Tratamiento no encontrado' });
      }
      res.json({ message: 'Tratamiento eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = TratamientoController;
