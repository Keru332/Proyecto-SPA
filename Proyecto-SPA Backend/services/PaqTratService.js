const PaqTrat = require('../models/paq_trat');
const PaqueteService = require('./paqueteService');
const TratamientoService = require('./tratamientoService');
const { ValidationError, NotFoundError} = require('../middleware/appError');
const {isValidEmail,isStrongPassword,isValidUUID,isValidTime} = require('../middleware/validators')


const PaqTratService = {
  getAll: async () => {
    return await PaqTrat.getAll();
  },

  getById: async (id) => {
    if (!isValidUUID(id)) {
      throw new ValidationError('ID de paquete no válido');
    }
    await PaqueteService.getById(id);
    return await PaqTrat.getById(id);
  },

  create: async (data) => {
    if (!isValidUUID(data.paquete__codpaquete)) {
      throw new ValidationError('ID de paquete no válido');
    }
    if (!isValidUUID(data.tratamiento__codtratamiento)) {
      throw new ValidationError('ID de tratamiento no válido');
    }
    if (!isValidUUID(data.tratamiento__categoria_codcategoria)) {
      throw new ValidationError('ID de categoría no válido');
    }

    const tratamiento = await TratamientoService.getById(data.tratamiento__codtratamiento);
    await PaqueteService.getById(data.paquete__codpaquete);

    if (tratamiento.categoria_codcategoria !== data.tratamiento__categoria_codcategoria) {
      throw new ValidationError('La categoría no coincide con el tratamiento seleccionado');
    }

    const relacionesExistentes = await PaqTrat.getAll();
    const relacionExistente = relacionesExistentes.some(rel => 
      rel.paquete__codpaquete === data.paquete__codpaquete && 
      rel.tratamiento__codtratamiento === data.tratamiento__codtratamiento
    );

    if (relacionExistente) {
      throw new ValidationError('Este tratamiento ya está asociado al paquete');
    }

    return await PaqTrat.create(data);
  },

  delete: async (codpaquete, codtratamiento) => {
    if (!isValidUUID(codpaquete)) {
      throw new ValidationError('ID de paquete no válido');
    }
    if (!isValidUUID(codtratamiento)) {
      throw new ValidationError('ID de tratamiento no válido');
    }

    await PaqueteService.getById(codpaquete);
    await TratamientoService.getById(codtratamiento);
    
    const tratamientosDelPaquete = await PaqTrat.getById(codpaquete);
    if (tratamientosDelPaquete.length <= 1) {
      throw new ValidationError('No se puede eliminar el único tratamiento del paquete');
    }
    
    const eliminado = await PaqTrat.delete(codpaquete, codtratamiento);
    if (!eliminado) throw new NotFoundError('Relación paquete-tratamiento no encontrada');
    return eliminado;
  }
};


module.exports = PaqTratService;