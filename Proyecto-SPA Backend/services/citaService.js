const Cita = require('../models/cita');
const TratamientoService = require('./tratamientoService');
const ClienteService = require('./clienteService');

const CitaService = {
  getAll: async () => {
    return await Cita.getAll();
  },
  getByPeriodo: async (periodo) => {
    const periodosValidos = ['hoy', 'semana', 'mes', 'anno'];
    if (!periodosValidos.includes(periodo)) {
      throw new Error('Período no válido. Use: hoy, semana, mes, anno');
    }
    return await Cita.getByPeriodo(periodo);
  },
  getByClienteFuturas: async (id) => {
    await ClienteService.getById(id);
    return await Cita.getByClienteFuturas(id);
  },
  getByClientePasadas: async (id) => {
    await ClienteService.getById(id);
    return await Cita.getAll(id);
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
    if (!isValidUUID(data.cliente__idcliente)) {
      throw new Error('ID de cliente no válido');
    }

    // Validar que tratamiento y cliente existan
    const tratamiento = await TratamientoService.getById(data.tratamiento__codtratamiento);
    const cliente = await ClienteService.getById(data.cliente__idcliente);

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
    if (hora < 9 || hora > 21) {
      throw new Error('Las citas solo están disponibles entre 9:00 y 18:00 horas');
    }

    // Validar observaciones
    if (data.observaciones && data.observaciones.length > 500) {
      throw new Error('Las observaciones no pueden exceder 500 caracteres');
    }


    data.horacita = await validarDisponibilidadCita(data.fecha, data.horacita, data.tratamiento__codtratamiento);

    if( ( Number(cliente.balance) - Number(tratamiento.precio) ) < 0){
      throw new Error('No tiene suficiente dinero para comprar este tratamiento.');
    } else {
      await ClienteService.updateBalance(data.cliente__idcliente, Number(cliente.balance) - Number(tratamiento.precio))
    }

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

async function validarDisponibilidadCita(fecha, hora, tratamientoId) {
  const horarioApertura = 9;
  let sumaTiempoCita = await Cita.getSumDuracionDiaria(fecha);
  sumaTiempoCita.sum = Number(sumaTiempoCita.sum)

  if(sumaTiempoCita.sum >= 720){
    console.log('paso por aqui')
    throw new Error('No hay disponibilidad para su cita en ese dia.');
  }

  console.log(sumaTiempoCita.sum)
  
  let tratDuracion = await TratamientoService.getById(tratamientoId)
  tratDuracion.duracion = Number(tratDuracion.duracion)
  if((sumaTiempoCita.sum + tratDuracion.duracion) >= 720){
    throw new Error('No hay disponibilidad para su cita en ese dia.');
  }

  
  // Calcular la hora automáticamente basada en el tiempo acumulado
  const minutosDesdeApertura = sumaTiempoCita.sum;
  const horaDisponible = Math.floor(minutosDesdeApertura / 60) + horarioApertura;
  const minutosDisponible = minutosDesdeApertura % 60;
  
  const horaAsignada = `${horaDisponible.toString().padStart(2, '0')}:${minutosDisponible.toString().padStart(2, '0')}`;

  return horaAsignada
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
