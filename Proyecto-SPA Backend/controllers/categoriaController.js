const CategoriaService = require('../services/categoriaService');

const CategoriaController = {
  getAll: async (req, res, next) => {
    try {
      const data = await CategoriaService.getAll();
      res.json(data);
    } catch (error) {
      //res.status(500).json({ error: error.message });
      next(error)
    }
  },

  getById: async (req, res, next) => {
    try {
      const data = await CategoriaService.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: 'Categoria no encontrado' });
      }
      res.json(data);
    } catch (error) {
      //res.status(500).json({ error: error.message });
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      const nuevo = await CategoriaService.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      //res.status(500).json({ error: error.message });
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const actualizado = await CategoriaService.update(req.params.id, req.body);
      if (!actualizado) {
        return res.status(404).json({ error: 'Categoria no encontrado' });
      }
      res.json(actualizado);
    } catch (error) {
      next(error)
      //res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res, next) => {
    try {
      const eliminado = await CategoriaService.delete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Categoria no encontrado' });
      }
      res.json({ message: 'Categoria eliminado correctamente' });
    } catch (error) {
      next(error)
      //res.status(500).json({ error: error.message });
    }
  }
};

module.exports = CategoriaController;
