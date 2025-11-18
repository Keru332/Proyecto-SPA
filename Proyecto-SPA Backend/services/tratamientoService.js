const Tratamiento = require('../models/tratamiento');
const CategoriaService = require('./categoriaService');

const TratamientoService = {
  getAll: async () => {
    return await Tratamiento.getAll();
  },

  getById: async (id) => {
    if (!isValidUUID(id)) {
      throw new Error('ID de tratamiento no válido');
    }
    const tratamiento = await Tratamiento.getById(id);
    if (!tratamiento) throw new Error('Tratamiento no encontrado');
    return tratamiento;
  },

  create: async (data) => {
    // Validaciones requeridas
    if (!data.nombretratamiento || !data.categoria_codcategoria) {
      throw new Error('Nombre y categoría son requeridos');
    }

    // Validaciones específicas
    if (data.nombretratamiento.length > 25) {
      throw new Error('El nombre del tratamiento no puede exceder 25 caracteres');
    }

    if (data.descripcion && data.descripcion.length > 200) {
      throw new Error('La descripción no puede exceder 200 caracteres');
    }

    if (data.frecuenciadesolicitudmensual && (!Number.isInteger(data.frecuenciadesolicitudmensual) || data.frecuenciadesolicitudmensual < 0)) {
      throw new Error('La frecuencia mensual debe ser un entero positivo');
    }

    if (data.duracion && (!Number.isInteger(data.duracion) || data.duracion <= 0)) {
      throw new Error('La duración debe ser un entero positivo');
    }

    if (data.precio && (typeof data.precio !== 'number' || data.precio < 0)) {
      throw new Error('El precio debe ser un número positivo');
    }

    if (data.precio && !/^\d+(\.\d{1,2})?$/.test(data.precio.toString())) {
      throw new Error('El precio no puede tener más de 2 decimales');
    }

    // Validar que la categoría existe
    if (!isValidUUID(data.categoria_codcategoria)) {
      throw new Error('ID de categoría no válido');
    }
    await CategoriaService.getById(data.categoria_codcategoria);

    return await Tratamiento.create(data);
  },

  update: async (id, data) => {
    if (!isValidUUID(id)) {
      throw new Error('ID de tratamiento no válido');
    }

    // Aplicar las mismas validaciones que en create
    if (data.nombretratamiento && data.nombretratamiento.length > 25) {
      throw new Error('El nombre del tratamiento no puede exceder 25 caracteres');
    }

    if (data.descripcion && data.descripcion.length > 200) {
      throw new Error('La descripción no puede exceder 200 caracteres');
    }

    if (data.precio && (typeof data.precio !== 'number' || data.precio < 0)) {
      throw new Error('El precio debe ser un número positivo');
    }

    if (data.categoria_codcategoria) {
      if (!isValidUUID(data.categoria_codcategoria)) {
        throw new Error('ID de categoría no válido');
      }
      await CategoriaService.getById(data.categoria_codcategoria);
    }

    await TratamientoService.getById(id);
    return await Tratamiento.update(id, data);
  },

  getMasPopular: async () => {
    const tratamiento = await Tratamiento.getMasPopular();
    if (!tratamiento) throw new Error('No se encontraron tratamientos');
    return tratamiento;
  },

  delete: async (id) => {
    if (!isValidUUID(id)) {
      throw new Error('ID de tratamiento no válido');
    }
    await TratamientoService.getById(id);
    return await Tratamiento.delete(id);
  }
};

function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

module.exports = TratamientoService;