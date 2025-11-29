const Tratamiento = require('../models/tratamiento');
const CategoriaService = require('./categoriaService');
const { ValidationError, NotFoundError} = require('../middleware/appError');
const {isValidEmail,isStrongPassword,isValidUUID,isValidTime} = require('../middleware/validators')


const TratamientoService = {
  getAll: async () => {
    return await Tratamiento.getAll();
  },

  getById: async (id) => {
    if (!isValidUUID(id)) {
      throw new ValidationError('ID de tratamiento no válido');
    }
    const tratamiento = await Tratamiento.getById(id);
    if (!tratamiento) throw new NotFoundError('Tratamiento no encontrado');
    return tratamiento;
  },

  create: async (data) => {
    if (!data.nombretratamiento || !data.categoria_codcategoria) {
      throw new ValidationError('Nombre y categoría son requeridos');
    }

    if (data.nombretratamiento.length > 25) {
      throw new ValidationError('El nombre del tratamiento no puede exceder 25 caracteres');
    }

    if (data.descripcion && data.descripcion.length > 200) {
      throw new ValidationError('La descripción no puede exceder 200 caracteres');
    }

    if (data.frecuenciadesolicitudmensual && (!Number.isInteger(data.frecuenciadesolicitudmensual) || data.frecuenciadesolicitudmensual < 0)) {
      throw new ValidationError('La frecuencia mensual debe ser un entero positivo');
    }

    if (data.duracion && (!Number.isInteger(data.duracion) || data.duracion <= 0)) {
      throw new ValidationError('La duración debe ser un entero positivo');
    }

    if (data.precio && (typeof data.precio !== 'number' || data.precio < 0)) {
      throw new ValidationError('El precio debe ser un número positivo');
    }

    if (data.precio && !/^\d+(\.\d{1,2})?$/.test(data.precio.toString())) {
      throw new ValidationError('El precio no puede tener más de 2 decimales');
    }

    if (!isValidUUID(data.categoria_codcategoria)) {
      throw new ValidationError('ID de categoría no válido');
    }
    await CategoriaService.getById(data.categoria_codcategoria);

    return await Tratamiento.create(data);
  },

  update: async (id, data) => {
    if (!isValidUUID(id)) {
      throw new ValidationError('ID de tratamiento no válido');
    }

    if (data.nombretratamiento && data.nombretratamiento.length > 25) {
      throw new ValidationError('El nombre del tratamiento no puede exceder 25 caracteres');
    }

    if (data.descripcion && data.descripcion.length > 200) {
      throw new ValidationError('La descripción no puede exceder 200 caracteres');
    }

    if (data.precio && (typeof data.precio !== 'number' || data.precio < 0)) {
      throw new ValidationError('El precio debe ser un número positivo');
    }

    if (data.categoria_codcategoria) {
      if (!isValidUUID(data.categoria_codcategoria)) {
        throw new ValidationError('ID de categoría no válido');
      }
      await CategoriaService.getById(data.categoria_codcategoria);
    }

    await TratamientoService.getById(id);
    return await Tratamiento.update(id, data);
  },

  getMasPopular: async () => {
    const tratamiento = await Tratamiento.getMasPopular();
    if (!tratamiento) throw new NotFoundError('No se encontraron tratamientos');
    return tratamiento;
  },

  delete: async (id) => {
    if (!isValidUUID(id)) {
      throw new ValidationError('ID de tratamiento no válido');
    }
    await TratamientoService.getById(id);
    return await Tratamiento.delete(id);
  }
};


module.exports = TratamientoService;