const PaqTrat = require('../models/paq_trat');
const PaqueteService = require('./paqueteService');
const TratamientoService = require('./tratamientoService');

const PaqTratService = {
  getAll: async () => {
    return await PaqTrat.getAll();
  },

  getById: async (id) => {
    if (!isValidUUID(id)) {
      throw new Error('ID de paquete no válido');
    }
    await PaqueteService.getById(id); // Valida que el paquete existe
    return await PaqTrat.getById(id);
  },

  create: async (data) => {
    // Validar que los IDs sean UUID válidos
    if (!isValidUUID(data.paquete__codpaquete)) {
      throw new Error('ID de paquete no válido');
    }
    if (!isValidUUID(data.tratamiento__codtratamiento)) {
      throw new Error('ID de tratamiento no válido');
    }
    if (!isValidUUID(data.tratamiento__categoria_codcategoria)) {
      throw new Error('ID de categoría no válido');
    }

    // Validar que paquete y tratamiento existan
    const tratamiento = await TratamientoService.getById(data.tratamiento__codtratamiento);
    await PaqueteService.getById(data.paquete__codpaquete);

    // Validar que la categoría coincida con el tratamiento
    if (tratamiento.categoria_codcategoria !== data.tratamiento__categoria_codcategoria) {
      throw new Error('La categoría no coincide con el tratamiento seleccionado');
    }

    // Verificar si la relación ya existe
    const relacionesExistentes = await PaqTrat.getAll();
    const relacionExistente = relacionesExistentes.some(rel => 
      rel.paquete__codpaquete === data.paquete__codpaquete && 
      rel.tratamiento__codtratamiento === data.tratamiento__codtratamiento
    );

    if (relacionExistente) {
      throw new Error('Este tratamiento ya está asociado al paquete');
    }

    return await PaqTrat.create(data);
  },

  delete: async (codpaquete, codtratamiento) => {
    if (!isValidUUID(codpaquete)) {
      throw new Error('ID de paquete no válido');
    }
    if (!isValidUUID(codtratamiento)) {
      throw new Error('ID de tratamiento no válido');
    }

    await PaqueteService.getById(codpaquete);
    await TratamientoService.getById(codtratamiento);
    
    // Verificar que no es el único tratamiento del paquete
    const tratamientosDelPaquete = await PaqTrat.getById(codpaquete);
    if (tratamientosDelPaquete.length <= 1) {
      throw new Error('No se puede eliminar el único tratamiento del paquete');
    }
    
    const eliminado = await PaqTrat.delete(codpaquete, codtratamiento);
    if (!eliminado) throw new Error('Relación paquete-tratamiento no encontrada');
    return eliminado;
  }
};

function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

module.exports = PaqTratService;