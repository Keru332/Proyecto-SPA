const Categoria = require('../models/categoria');
const { ValidationError, NotFoundError, DuplicateError, InvalidIdError } = require('../middleware/appError');


const CategoriaService = {
  getAll: async () => {
    return await Categoria.getAll();
  },

  getById: async (id) => {
    if (!isValidUUID(id)) {
      throw new ValidationError('ID de categoría no válido');
    }
    const categoria = await Categoria.getById(id);
    if (!categoria) throw new NotFoundError('Categoria no encontrado');
    return categoria;
  },

  create: async (data) => {
    // Validaciones de negocio
    if (!data.nombrecategoria || data.nombrecategoria.trim() === '') {
      throw new ValidationError('El nombre de la categoría es requerido');
    }
    
    if (data.nombrecategoria.length > 20) {
      throw new ValidationError('El nombre de la categoría no puede exceder 20 caracteres');
    }

    // Verificar unicidad (necesitarías agregar este método al modelo)
    const categoriasExistentes = await Categoria.getAll();
    const nombreExiste = categoriasExistentes.some(
      cat => cat.nombrecategoria.toLowerCase() === data.nombrecategoria.toLowerCase()
    );
    
    if (nombreExiste) {
      throw new DuplicateError('Ya existe una categoría con este nombre');
    }

    return await Categoria.create(data);
  },

  update: async (id, data) => {
    if (!isValidUUID(id)) {
      throw new ValidationError('ID de categoría no válido');
    }
    
    if (data.nombrecategoria && data.nombrecategoria.length > 20) {
      throw new ValidationError('El nombre de la categoría no puede exceder 20 caracteres');
    }

    await CategoriaService.getById(id); // Verifica que existe
    return await Categoria.update(id, data);
  },

  delete: async (id) => {
    if (!isValidUUID(id)) {
      throw new ValidationError('ID de categoría no válido');
    }
    await CategoriaService.getById(id);// Verifica que existe
    return await Categoria.delete(id);
  }
};

// Función auxiliar para validar UUID
function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

module.exports = CategoriaService;