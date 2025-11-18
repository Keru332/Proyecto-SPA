const Paquete = require('../models/paquete');

const PaqueteService = {
  getAll: async () => {
    return await Paquete.getAll();
  },

  getById: async (id) => {
    if (!isValidUUID(id)) {
      throw new Error('ID de paquete no válido');
    }
    const paquete = await Paquete.getById(id);
    if (!paquete) throw new Error('Paquete no encontrado');
    return paquete;
  },

  create: async (data) => {
    if (!data.nombrepaquete || !data.preciopaquete) {
      throw new Error('Nombre y precio del paquete son requeridos');
    }

    if (data.nombrepaquete.length > 25) {
      throw new Error('El nombre del paquete no puede exceder 25 caracteres');
    }

    if (typeof data.preciopaquete !== 'number' || data.preciopaquete < 0) {
      throw new Error('El precio debe ser un número positivo');
    }

    if (!/^\d+(\.\d{1,2})?$/.test(data.preciopaquete.toString())) {
      throw new Error('El precio no puede tener más de 2 decimales');
    }

    if (data.duraciontotal && (!Number.isInteger(data.duraciontotal) || data.duraciontotal <= 0)) {
      throw new Error('La duración total debe ser un entero positivo');
    }

    return await Paquete.create(data);
  },

  update: async (id, data) => {
    if (!isValidUUID(id)) {
      throw new Error('ID de paquete no válido');
    }

    if (data.nombrepaquete && data.nombrepaquete.length > 25) {
      throw new Error('El nombre del paquete no puede exceder 25 caracteres');
    }

    if (data.preciopaquete && (typeof data.preciopaquete !== 'number' || data.preciopaquete < 0)) {
      throw new Error('El precio debe ser un número positivo');
    }

    await PaqueteService.getById(id);
    return await Paquete.update(id, data);
  },

  delete: async (id) => {
    if (!isValidUUID(id)) {
      throw new Error('ID de paquete no válido');
    }
    await PaqueteService.getById(id);
    return await Paquete.delete(id);
  }
};

function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

module.exports = PaqueteService;