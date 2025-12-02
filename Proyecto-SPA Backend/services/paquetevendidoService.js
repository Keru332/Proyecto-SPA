const PaqueteVendido = require('../models/paquetevendido');
const ClienteService = require('./clienteService');
const PaqueteService = require('./paqueteService');
const PaqTratService = require('./PaqTratService');
const { ValidationError} = require('../middleware/appError');
const {isValidEmail,isStrongPassword,isValidUUID,isValidTime} = require('../middleware/validators')


const PaqueteVendidoService = {
  getAll: async () => {
    return await PaqueteVendido.getAll();
  },

  getById: async (codpaquete, idCliente, fechaCompra) => {
    if (!isValidUUID(codpaquete)) {
      throw new ValidationError('ID de paquete no válido');
    }
    if (!isValidUUID(idCliente)) {
      throw new ValidationError('ID de cliente no válido');
    }
    
    await ClienteService.getById(idCliente);
    
    return await PaqueteVendido.getByID3(codpaquete, idCliente, fechaCompra);
  },

  create: async (data) => {

    cliente = await ClienteService.getById(data.cliente__idcliente);
    paquete = await PaqueteService.getById(data.paquete__codpaquete);

    const tratamientosPaquete = await PaqTratService.getById(data.paquete__codpaquete);
    if (!tratamientosPaquete || tratamientosPaquete.length === 0) {
      throw new ValidationError('El paquete no tiene tratamientos asociados');
    }

    const fechaInicio = new Date(data.fechainicio);
    const fechaFin = new Date(data.fechafin);
    const fechaCompra = new Date(data.fechacompra);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaInicio < hoy) {
      throw new ValidationError('La fecha de inicio no puede ser anterior a la fecha actual');
    }

    if (fechaInicio.getFullYear() > 2100 || fechaFin.getFullYear() > 2100) {
      throw new ValidationError('El año de las fechas no puede ser mayor a 2100');
    }

    if (fechaInicio > fechaFin) {
      throw new ValidationError('La fecha de inicio no puede ser posterior a la fecha fin');
    }

    const paquetesCliente = await PaqueteVendido.getAll();
    const paqueteActivo = paquetesCliente.some(pv => 
      pv.cliente__idcliente === data.cliente__idcliente && 
      pv.paquete__codpaquete === data.paquete__codpaquete &&
      new Date(pv.fechafin) >= hoy
    );

    if (paqueteActivo) {
      throw new ValidationError('El cliente ya tiene este paquete activo');
    }

    console.log(Number(cliente.balance))
    console.log(Number(paquete.preciopaquete))
    console.log(( Number(cliente.balance) - Number(paquete.preciopaquete) ))
    if( ( Number(cliente.balance) - Number(paquete.preciopaquete) ) < 0){
        throw new ValidationError('No tiene suficiente dinero para comprar este paquete.');
    } else {
        await ClienteService.updateBalance(data.cliente__idcliente, Number(cliente.balance) - Number(paquete.preciopaquete))
    }
    
    return await PaqueteVendido.create(data);
  },

  update: async (id, data) => {
    await PaqueteVendidoService.getByClienteId(id);
    return await PaqueteVendido.update(id, data);
  },

  delete: async (codpaquete, idCliente, fechaCompra) => {
    if (!isValidUUID(codpaquete)) {
      throw new ValidationError('ID de paquete no válido');
    }
    if (!isValidUUID(idCliente)) {
      throw new ValidationError('ID de cliente no válido');
    }

    const paquete = await PaqueteService.getById(codpaquete);
    const cliente = await ClienteService.getById(idCliente);
    const paqueteVendido = await PaqueteVendido.getByID3(codpaquete, idCliente, fechaCompra)

    const hoy = new Date();
    const fechaInicio = new Date(paqueteVendido.fechainicio);
    const fechaFin = new Date(paqueteVendido.fechafin);
    
    if (hoy >= fechaInicio) {
      throw new ValidationError('No se puede eliminar un paquete que ya ha comenzado su período de uso');
    }
    
    if (hoy > fechaFin) {
      throw new ValidationError('No se puede eliminar un paquete que ya ha expirado');
    }

    await ClienteService.updateBalance(idCliente, Number(cliente.balance) + Number(paquete.preciopaquete));

    console.log(`Devolviendo $${paquete.preciopaquete} al cliente ${cliente.nombre} por eliminación de paquete ${paquete.nombre}`);
    
    const eliminado = await PaqueteVendido.delete(codpaquete, idCliente, fechaCompra);
    if (!eliminado) throw new ValidationError('Paquete vendido no encontrado');
    return eliminado;
  },

  getByPeriodo: async (periodo) => {
    console.log(periodo)
    const periodosValidos = ['hoy', 'semana', 'mes', 'anno'];
    if (!periodosValidos.includes(periodo)) {
      throw new ValidationError('Período no válido. Use: hoy, semana, mes, anno');
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


module.exports = PaqueteVendidoService;