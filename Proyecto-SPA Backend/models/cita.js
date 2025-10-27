const db = require('../config/database');

const Cita = {
  getAll: async () => {
    const result = await db.query('SELECT * FROM cita ORDER BY fecha');
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query('SELECT * FROM cita WHERE codsolicitud = $1', [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const fields = ["tratamiento__codtratamiento","tratamiento__categoria_codcategoria","cliente__idcliente","fecha","horacita","observaciones"];
    const values = fields.map(field => data[field]);
    const result = await db.query(
      'INSERT INTO cita (' + fields.join(', ') + ') VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      values
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const updateFields = ["tratamiento__codtratamiento","tratamiento__categoria_codcategoria","cliente__idcliente","fecha","horacita","observaciones"];
    const setClause = updateFields.map((field, index) => field + ' = $' + (index + 1)).join(', ');
    const values = updateFields.map(field => data[field]);
    values.push(id);
    
    const result = await db.query(
      'UPDATE cita SET ' + setClause + ' WHERE codsolicitud = $' + (updateFields.length + 1) + ' RETURNING *',
      values
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await db.query('DELETE FROM cita WHERE codsolicitud = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Cita;
