const db = require('../config/database');

const PaqueteVendido = {
  getAll: async () => {
    const result = await db.query(`SELECT 
paquetevendido.*,
 TO_CHAR(paquetevendido.fechacompra, 'DD/MM/YYYY') as fechacompraf,
 TO_CHAR(paquetevendido.fechainicio, 'DD/MM/YYYY') as fechainiciof,
 TO_CHAR(paquetevendido.fechafin, 'DD/MM/YYYY') as fechafinf
 FROM paquetevendido JOIN cliente ON cliente__idcliente = idcliente JOIN paquete ON paquete__codpaquete = codpaquete ORDER BY 1`);
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query('SELECT * FROM paquetevendido WHERE cliente__idcliente = $1', [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const fields = ["cliente__idcliente","paquete__codpaquete","fechacompra","fechainicio","fechafin"];
    const values = fields.map(field => data[field]);
    const result = await db.query(
      'INSERT INTO paquetevendido (' + fields.join(', ') + ') VALUES ($1, $2, $3, $4, $5) RETURNING *',
      values
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const updateFields = ["paquete__codpaquete","fechacompra","fechainicio","fechafin"];
    const setClause = updateFields.map((field, index) => field + ' = $' + (index + 1)).join(', ');
    const values = updateFields.map(field => data[field]);
    values.push(id);
    
    const result = await db.query(
      'UPDATE paquetevendido SET ' + setClause + ' WHERE cliente__idcliente = $' + (updateFields.length + 1) + ' RETURNING *',
      values
    );
    return result.rows[0];
  },

  delete: async (id, id2, id3) => {
    const result = await db.query('DELETE FROM paquetevendido WHERE paquete__codpaquete = $1 AND cliente__idcliente = $2 AND fechacompra = $3 RETURNING *', [id, id2, new Date(id3)]);
    return result.rows[0];
  }
};

module.exports = PaqueteVendido;
