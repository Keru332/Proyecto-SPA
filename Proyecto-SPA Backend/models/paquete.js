const db = require('../config/database');

const Paquete = {
  getAll: async () => {
    const result = await db.query('SELECT * FROM paquete ORDER BY 1');
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query('SELECT * FROM paquete WHERE codpaquete = $1', [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const fields = ["nombrepaquete","preciopaquete","duraciontotal"];
    const values = fields.map(field => data[field]);
    const result = await db.query(
      'INSERT INTO paquete (' + fields.join(', ') + ') VALUES ($1, $2, $3) RETURNING *',
      values
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const updateFields = ["nombrepaquete","preciopaquete","duraciontotal"];
    const setClause = updateFields.map((field, index) => field + ' = $' + (index + 1)).join(', ');
    const values = updateFields.map(field => data[field]);
    values.push(id);
    
    const result = await db.query(
      'UPDATE paquete SET ' + setClause + ' WHERE codpaquete = $' + (updateFields.length + 1) + ' RETURNING *',
      values
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await db.query('DELETE FROM paquete WHERE codpaquete = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Paquete;
