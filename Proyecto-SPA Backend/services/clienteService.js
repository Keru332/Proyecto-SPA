const Cliente = require('../models/cliente');
const { ValidationError, NotFoundError} = require('../middleware/appError');
const {isValidEmail,isStrongPassword,isValidUUID,isValidTime} = require('../middleware/validators')



const ClienteService = {
  getAll: async () => {
    return await Cliente.getAll();
  },

  getById: async (id) => {
    const cliente = await Cliente.getById(id);
    if (!cliente) throw new NotFoundError('Cliente no encontrado');
    return cliente;
  },

  create: async (data) => {
    if (!data.nombrecliente || data.nombrecliente.trim() === '') {
      throw new ValidationError('El nombre del cliente es requerido');
    }

    if (data.nombrecliente.length > 50) {
      throw new ValidationError('El nombre del cliente no puede exceder 50 caracteres');
    }

    if (data.correo) {
      if (data.correo.length > 70) {
        throw new ValidationError('El correo no puede exceder 70 caracteres');
      }
      if (!isValidEmail(data.correo)) {
        throw new ValidationError('El formato del correo electrónico no es válido');
      }
    }

    return await Cliente.create(data);
  },

  update: async (id, data) => {
    if (!isValidUUID(id)) {
      throw new ValidationError('ID de cliente no válido');
    }

    if (data.nombrecliente && data.nombrecliente.length > 50) {
      throw new ValidationError('El nombre del cliente no puede exceder 50 caracteres');
    }

    if (data.correo) {
      if (data.correo.length > 70) {
        throw new ValidationError('El correo no puede exceder 70 caracteres');
      }
      if (!isValidEmail(data.correo)) {
        throw new ValidationError('El formato del correo electrónico no es válido');
      }
    }

    await ClienteService.getById(id);
    return await Cliente.update(id, data);
  },

  delete: async (id) => {
    if (!isValidUUID(id)) {
      throw new ValidationError('ID de cliente no válido');
    }
    await ClienteService.getById(id);
    return await Cliente.delete(id);
  },
  updateBalance: async (id, data) => {
    if (!isValidUUID(id)) {
      throw new ValidationError('ID de cliente no válido');
    }
    await ClienteService.getById(id);
    return await Cliente.updateBalance(id, data);
  },
};


module.exports = ClienteService;