const Cliente = require('../models/cliente');

const ClienteService = {
  getAll: async () => {
    return await Cliente.getAll();
  },

  getById: async (id) => {
    if (!isValidUUID(id)) {
      throw new Error('ID de cliente no válido');
    }
    const cliente = await Cliente.getById(id);
    if (!cliente) throw new Error('Cliente no encontrado');
    return cliente;
  },

  create: async (data) => {
    if (!data.nombrecliente || data.nombrecliente.trim() === '') {
      throw new Error('El nombre del cliente es requerido');
    }

    if (data.nombrecliente.length > 50) {
      throw new Error('El nombre del cliente no puede exceder 50 caracteres');
    }

    if (data.correo) {
      if (data.correo.length > 70) {
        throw new Error('El correo no puede exceder 70 caracteres');
      }
      if (!isValidEmail(data.correo)) {
        throw new Error('El formato del correo electrónico no es válido');
      }
    }

    return await Cliente.create(data);
  },

  update: async (id, data) => {
    if (!isValidUUID(id)) {
      throw new Error('ID de cliente no válido');
    }

    if (data.nombrecliente && data.nombrecliente.length > 50) {
      throw new Error('El nombre del cliente no puede exceder 50 caracteres');
    }

    if (data.correo) {
      if (data.correo.length > 70) {
        throw new Error('El correo no puede exceder 70 caracteres');
      }
      if (!isValidEmail(data.correo)) {
        throw new Error('El formato del correo electrónico no es válido');
      }
    }

    await ClienteService.getById(id);
    return await Cliente.update(id, data);
  },

  delete: async (id) => {
    if (!isValidUUID(id)) {
      throw new Error('ID de cliente no válido');
    }
    await ClienteService.getById(id);
    return await Cliente.delete(id);
  },
  updateBalance: async (id, data) => {
    if (!isValidUUID(id)) {
      throw new Error('ID de cliente no válido');
    }
    await ClienteService.getById(id);
    return await Cliente.updateBalance(id, data);
  },
};

function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = ClienteService;