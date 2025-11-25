const PaqueteVendido = require('../models/paquetevendido');
const ClienteService = require('./clienteService');
const PaqueteService = require('./paqueteService');
const PaqTratService = require('./PaqTratService');

const PaqueteVendidoService = {
  getAll: async () => {
    return await PaqueteVendido.getAll();
  },

  getById: async (id) => {
    if (!isValidUUID(id)) {
      throw new Error('ID de cliente no válido');
    }
    await ClienteService.getById(id);
    return await PaqueteVendido.getById(id);
  },

  create: async (data) => {
    // Validar que cliente y paquete existan

    cliente = await ClienteService.getById(data.cliente__idcliente);
    paquete = await PaqueteService.getById(data.paquete__codpaquete);

    // Validar que el paquete tenga tratamientos
    const tratamientosPaquete = await PaqTratService.getById(data.paquete__codpaquete);
    if (!tratamientosPaquete || tratamientosPaquete.length === 0) {
      throw new Error('El paquete no tiene tratamientos asociados');
    }

    // Validar lógica de fechas
    const fechaInicio = new Date(data.fechainicio);
    const fechaFin = new Date(data.fechafin);
    const fechaCompra = new Date(data.fechacompra);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaInicio < hoy) {
      throw new Error('La fecha de inicio no puede ser anterior a la fecha actual');
    }

    if (fechaInicio.getFullYear() > 2100 || fechaFin.getFullYear() > 2100) {
      throw new Error('El año de las fechas no puede ser mayor a 2100');
    }

    if (fechaInicio > fechaFin) {
      throw new Error('La fecha de inicio no puede ser posterior a la fecha fin');
    }

    // Verificar que el cliente no tiene el mismo paquete activo
    const paquetesCliente = await PaqueteVendido.getAll();
    const paqueteActivo = paquetesCliente.some(pv => 
      pv.cliente__idcliente === data.cliente__idcliente && 
      pv.paquete__codpaquete === data.paquete__codpaquete &&
      new Date(pv.fechafin) >= hoy
    );

    if (paqueteActivo) {
      throw new Error('El cliente ya tiene este paquete activo');
    }

    console.log(Number(cliente.balance))
    console.log(Number(paquete.preciopaquete))
    console.log(( Number(cliente.balance) - Number(paquete.preciopaquete) ))
    if( ( Number(cliente.balance) - Number(paquete.preciopaquete) ) < 0){
        throw new Error('No tiene suficiente dinero para comprar este paquete.');
    } else {
        await ClienteService.updateBalance(data.cliente__idcliente, Number(cliente.balance) - Number(paquete.precio))
    }
    
    return await PaqueteVendido.create(data);
  },

  update: async (id, data) => {
    if (!isValidUUID(id)) {
      throw new Error('ID de cliente no válido');
    }
    await PaqueteVendidoService.getByClienteId(id);
    return await PaqueteVendido.update(id, data);
  },

  delete: async (codpaquete, idCliente, fechaCompra) => {
    if (!isValidUUID(codpaquete)) {
      throw new Error('ID de paquete no válido');
    }
    if (!isValidUUID(idCliente)) {
      throw new Error('ID de cliente no válido');
    }

    const eliminado = await PaqueteVendido.delete(codpaquete, idCliente, fechaCompra);
    if (!eliminado) throw new Error('Paquete vendido no encontrado');
    return eliminado;
  },

  getByPeriodo: async (periodo) => {
    console.log(periodo)
    const periodosValidos = ['hoy', 'semana', 'mes', 'anno'];
    if (!periodosValidos.includes(periodo)) {
      throw new Error('Período no válido. Use: hoy, semana, mes, anno');
    }
    return await PaqueteVendido.getByPeriodo(periodo);
  },

  getByClienteActivos: async (idCliente) => {
    await ClienteService.getById(idCliente);
    return await PaqueteVendido.getByClienteActivos(idCliente);
  },

  getByClienteExpirados: async (idCliente) => {
    await ClienteService.getById(idCliente);
    return await PaqueteVendido.getByClienteExpirados(idCliente);
  },
};

function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

module.exports = PaqueteVendidoService;