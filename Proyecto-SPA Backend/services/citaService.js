const Cita = require('../models/cita');
const TratamientoService = require('./tratamientoService');
const ClienteService = require('./clienteService');

const CitaService = {
  getAll: async () => {
    return await Cita.getAll();
  },

  getById: async (id) => {
    if (!isValidUUID(id)) {
      throw new Error('ID de cita no válido');
    }
    const cita = await Cita.getById(id);
    if (!cita) throw new Error('Cita no encontrado');
    return cita;
  },

  create: async (data) => {
    // Validar que los IDs sean UUID válidos
    if (!isValidUUID(data.tratamiento__codtratamiento)) {
      throw new Error('ID de tratamiento no válido');
    }
    if (!isValidUUID(data.categoria_codcategoria)) {
      throw new Error('ID de categoría no válido');
    }
    if (!isValidUUID(data.cliente__idcliente)) {
      throw new Error('ID de cliente no válido');
    }

    // Validar que tratamiento y cliente existan
    const tratamiento = await TratamientoService.getById(data.tratamiento__codtratamiento);
    await ClienteService.getById(data.cliente__idcliente);

    // Validar que la categoría coincida con el tratamiento
    if (tratamiento.categoria_codcategoria !== data.categoria_codcategoria) {
      throw new Error('La categoría no coincide con el tratamiento seleccionado');
    }

    // Validaciones de fecha
    const fechaCita = new Date(data.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaCita < hoy) {
      throw new Error('La fecha de la cita no puede ser anterior a la fecha actual');
    }

    if (fechaCita.getFullYear() > 2100) {
      throw new Error('El año de la cita no puede ser mayor a 2100');
    }

    // Validar hora (formato y horario laboral)
    if (!isValidTime(data.horacita)) {
      throw new Error('Formato de hora no válido. Use HH:MM');
    }

    const hora = parseInt(data.horacita.split(':')[0]);
    if (hora < 9 || hora > 18) {
      throw new Error('Las citas solo están disponibles entre 9:00 y 18:00 horas');
    }

    // Validar observaciones
    if (data.observaciones && data.observaciones.length > 500) {
      throw new Error('Las observaciones no pueden exceder 500 caracteres');
    }

    // Validar conflictos de horario (necesitarías implementar esta función)
    await validarDisponibilidadCita(data.fecha, data.horacita, data.tratamiento__codtratamiento);

    return await Cita.create(data);
  },

  update: async (id, data) => {
    if (!isValidUUID(id)) {
      throw new Error('ID de cita no válido');
    }
    await CitaService.getById(id);
    return await Cita.update(id, data);
  },

  delete: async (id) => {
    if (!isValidUUID(id)) {
      throw new Error('ID de cita no válido');
    }
    await CitaService.getById(id);
    return await Cita.delete(id);
  }
};

// Función auxiliar para validar disponibilidad (debes implementarla según tus necesidades)
async function validarDisponibilidadCita(fecha, hora, tratamientoId) {
  // Implementar lógica para verificar que no hay citas en el mismo horario
  // para el mismo tratamiento
  const citasExistentes = await Cita.getAll();
  const conflicto = citasExistentes.some(cita => 
    cita.fecha === fecha && 
    cita.horacita === hora && 
    cita.tratamiento__codtratamiento === tratamientoId
  );

  if (conflicto) {
    throw new Error('Ya existe una cita programada para este tratamiento en la misma fecha y hora');
  }
}

function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

function isValidTime(time) {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

module.exports = CitaService;