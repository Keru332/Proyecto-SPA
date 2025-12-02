const Cita = require('../models/cita');
const TratamientoService = require('./tratamientoService');
const ClienteService = require('./clienteService');
const { ValidationError, NotFoundError} = require('../middleware/appError');
const {isValidEmail,isStrongPassword,isValidUUID,isValidTime} = require('../middleware/validators')


const CitaService = {
  getAll: async () => {
    return await Cita.getAll();
  },
  getByPeriodo: async (periodo) => {
    const periodosValidos = ['hoy', 'semana', 'mes', 'anno'];
    if (!periodosValidos.includes(periodo)) {
      throw new ValidationError('Período no válido. Use: hoy, semana, mes, anno');
    }
    return await Cita.getByPeriodo(periodo);
  },
  getByClienteFuturas: async (id) => {
    await ClienteService.getById(id);
    return await Cita.getByClienteFuturas(id);
  },
  getByClientePasadas: async (id) => {
    await ClienteService.getById(id);
    return await Cita.getByClientePasadas(id);
  },

  getById: async (id) => {
    if (!isValidUUID(id)) {
      throw new ValidationError('ID de cita no válido');
    }
    const cita = await Cita.getById(id);
    if (!cita) throw new NotFoundError('Cita no encontrado');
    return cita;
  },

  create: async (data) => {
    if (!isValidUUID(data.tratamiento__codtratamiento)) {
      throw new ValidationError('ID de tratamiento no válido');
    }
    if (!isValidUUID(data.cliente__idcliente)) {
      throw new ValidationError('ID de cliente no válido');
    }

    const tratamiento = await TratamientoService.getById(data.tratamiento__codtratamiento);
    const cliente = await ClienteService.getById(data.cliente__idcliente);

    const fechaCita = new Date(data.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaCita < hoy) {
      throw new ValidationError('La fecha de la cita no puede ser anterior a la fecha actual');
    }

    if (fechaCita.getFullYear() > 2100) {
      throw new ValidationError('El año de la cita no puede ser mayor a 2100');
    }

    if (!isValidTime(data.horacita)) {
      throw new ValidationError('Formato de hora no válido. Use HH:MM');
    }

    const hora = parseInt(data.horacita.split(':')[0]);
    if (hora < 9 || hora > 21) {
      throw new ValidationError('Las citas solo están disponibles entre 9:00 y 18:00 horas');
    }

    if (data.observaciones && data.observaciones.length > 500) {
      throw new ValidationError('Las observaciones no pueden exceder 500 caracteres');
    }


    data.horacita = await validarDisponibilidadCita(data.fecha, data.horacita, data.tratamiento__codtratamiento);

    if( ( Number(cliente.balance) - Number(tratamiento.precio) ) < 0){
      throw new ValidationError('No tiene suficiente dinero para comprar este tratamiento.');
    } else {
      await ClienteService.updateBalance(data.cliente__idcliente, Number(cliente.balance) - Number(tratamiento.precio))
    }

    return await Cita.create(data);
  },

  update: async (id, data) => {
    if (!isValidUUID(id)) {
      throw new ValidationError('ID de cita no válido');
    }
    await CitaService.getById(id);
    return await Cita.update(id, data);
  },

  delete: async (id) => {
    if (!isValidUUID(id)) {
      throw new ValidationError('ID de cita no válido');
    }
    const cita = await CitaService.getById(id);
    const fechaCita = new Date(cita.fecha);
    const hoy = new Date();
    if (fechaCita < hoy) {
      throw new ValidationError('No se puede eliminar una cita ya realizada');
    }
    const tratamiento = await TratamientoService.getById(cita.tratamiento__codtratamiento);
    const cliente = await ClienteService.getById(cita.cliente__idcliente);


    await ClienteService.updateBalance(cita.cliente__idcliente, Number(cliente.balance) + Number(tratamiento.precio));

    console.log(`Devolviendo $${tratamiento.precio} al cliente ${cliente.nombre} por eliminación de cita ${id}`);
    return await Cita.delete(id);
  }
};

async function validarDisponibilidadCita(fecha, hora, tratamientoId) {
  const horarioApertura = 9;
  let sumaTiempoCita = await Cita.getSumDuracionDiaria(fecha);
  sumaTiempoCita.sum = Number(sumaTiempoCita.sum)

  if(sumaTiempoCita.sum >= 720){
    throw new ValidationError('No hay disponibilidad para su cita en ese dia.');
  }

  console.log(sumaTiempoCita.sum)

  let tratDuracion = await TratamientoService.getById(tratamientoId)
  tratDuracion.duracion = Number(tratDuracion.duracion)
  if((sumaTiempoCita.sum + tratDuracion.duracion) >= 720){
    throw new ValidationError('No hay disponibilidad para su cita en ese dia.');
  }

  /*
  // Calcular la hora automáticamente basada en el tiempo acumulado
  const minutosDesdeApertura = sumaTiempoCita.sum;
  const horaDisponible = Math.floor(minutosDesdeApertura / 60) + horarioApertura;
  const minutosDisponible = minutosDesdeApertura % 60;

  const horaAsignada = `${horaDisponible.toString().padStart(2, '0')}:${minutosDisponible.toString().padStart(2, '0')}`;
*/
  return "21:00"
}

module.exports = CitaService;
