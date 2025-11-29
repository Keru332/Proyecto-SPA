const db = require('../config/database');

const PaqueteVendido = {
  getAll: async () => {
    const result = await db.query(`
      SELECT 
        *,
        TO_CHAR(paquetevendido.fechacompra, 'DD/MM/YYYY') as fechacompraf,
        TO_CHAR(paquetevendido.fechainicio, 'DD/MM/YYYY') as fechainiciof,
        TO_CHAR(paquetevendido.fechafin, 'DD/MM/YYYY') as fechafinf
      FROM paquetevendido 
      JOIN cliente ON cliente__idcliente = idcliente 
      JOIN paquete ON paquete__codpaquete = codpaquete 
      ORDER BY paquetevendido.fechacompra
    `);
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query('SELECT * FROM paquetevendido WHERE cliente__idcliente = $1', [id]);
    return result.rows;
  },
  getByID3: async (codpaquete, idCliente, fechaCompra) => {
    const result = await db.query(
      `SELECT 
        *,
        TO_CHAR(paquetevendido.fechacompra, 'DD/MM/YYYY') as fechacompraf,
        TO_CHAR(paquetevendido.fechainicio, 'DD/MM/YYYY') as fechainiciof,
        TO_CHAR(paquetevendido.fechafin, 'DD/MM/YYYY') as fechafinf
       FROM paquetevendido 
       JOIN cliente ON cliente__idcliente = idcliente 
       JOIN paquete ON paquete__codpaquete = codpaquete 
       WHERE paquete__codpaquete = $1 
       AND cliente__idcliente = $2 
       AND fechacompra = $3`,
      [codpaquete, idCliente, new Date(fechaCompra)]
    );
    return result.rows[0]; // Devuelve un solo objeto
  },

  create: async (data) => {
    const { cliente__idcliente, paquete__codpaquete, fechacompra, fechainicio, fechafin } = data;
    const result = await db.query(
      'INSERT INTO paquetevendido (cliente__idcliente, paquete__codpaquete, fechacompra, fechainicio, fechafin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [cliente__idcliente, paquete__codpaquete, fechacompra, fechainicio, fechafin]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { paquete__codpaquete, fechacompra, fechainicio, fechafin } = data;
    const result = await db.query(
      'UPDATE paquetevendido SET paquete__codpaquete = $1, fechacompra = $2, fechainicio = $3, fechafin = $4 WHERE cliente__idcliente = $5 RETURNING *',
      [paquete__codpaquete, fechacompra, fechainicio, fechafin, id]
    );
    return result.rows[0];
  },

  delete: async (id, id2, id3) => {
    const result = await db.query(
      'DELETE FROM paquetevendido WHERE paquete__codpaquete = $1 AND cliente__idcliente = $2 AND fechacompra = $3 RETURNING *', 
      [id, id2, new Date(id3)]
    );
    return result.rows[0];
  },

  getByPeriodo: async (periodo, tipoFecha = 'fechacompra') => {
    let fechaFiltro = '';
    
    switch(periodo) {
      case 'hoy':
        fechaFiltro = `${tipoFecha} = CURRENT_DATE`;
        break;
      case 'semana':
        fechaFiltro = `${tipoFecha} BETWEEN DATE_TRUNC('week', CURRENT_DATE) AND DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days'`;
        break;
      case 'mes':
        fechaFiltro = `EXTRACT(MONTH FROM ${tipoFecha}) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM ${tipoFecha}) = EXTRACT(YEAR FROM CURRENT_DATE)`;
        break;
      case 'anno':
        fechaFiltro = `EXTRACT(YEAR FROM ${tipoFecha}) = EXTRACT(YEAR FROM CURRENT_DATE)`;
        break;
      default:
        fechaFiltro = `${tipoFecha} >= CURRENT_DATE`;
    }

    const result = await db.query(`
      SELECT 
        *,
        TO_CHAR(paquetevendido.fechacompra, 'DD/MM/YYYY') as fechacompraf,
        TO_CHAR(paquetevendido.fechainicio, 'DD/MM/YYYY') as fechainiciof,
        TO_CHAR(paquetevendido.fechafin, 'DD/MM/YYYY') as fechafinf
      FROM paquetevendido 
      JOIN cliente ON cliente__idcliente = idcliente 
      JOIN paquete ON paquete__codpaquete = codpaquete 
      WHERE ${fechaFiltro}
      ORDER BY paquetevendido.fechacompra
    `);
    return result.rows;
  },

  // Paquetes por cliente - Activos (fecha fin en futuro o vigentes)
  getByClienteActivos: async (idCliente) => {
    const result = await db.query(`
      SELECT 
        *,
        TO_CHAR(paquetevendido.fechacompra, 'DD/MM/YYYY') as fechacompraf,
        TO_CHAR(paquetevendido.fechainicio, 'DD/MM/YYYY') as fechainiciof,
        TO_CHAR(paquetevendido.fechafin, 'DD/MM/YYYY') as fechafinf
      FROM paquetevendido 
      JOIN cliente ON cliente__idcliente = idcliente 
      JOIN paquete ON paquete__codpaquete = codpaquete 
      WHERE cliente__idcliente = $1 
        AND (fechafin >= CURRENT_DATE OR fechainicio >= CURRENT_DATE)
      ORDER BY fechafin ASC
    `, [idCliente]);
    return result.rows;
  },

  // Paquetes por cliente - Expirados (fecha fin en pasado)
  getByClienteExpirados: async (idCliente) => {
    const result = await db.query(`
      SELECT 
        *,
        TO_CHAR(paquetevendido.fechacompra, 'DD/MM/YYYY') as fechacompraf,
        TO_CHAR(paquetevendido.fechainicio, 'DD/MM/YYYY') as fechainiciof,
        TO_CHAR(paquetevendido.fechafin, 'DD/MM/YYYY') as fechafinf
      FROM paquetevendido 
      JOIN cliente ON cliente__idcliente = idcliente 
      JOIN paquete ON paquete__codpaquete = codpaquete 
      WHERE cliente__idcliente = $1 
        AND fechafin < CURRENT_DATE
      ORDER BY fechafin DESC
    `, [idCliente]);
    return result.rows;
  },
};

module.exports = PaqueteVendido;