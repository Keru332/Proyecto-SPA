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
    return result.rows[0];
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
  }
};

module.exports = PaqueteVendido;