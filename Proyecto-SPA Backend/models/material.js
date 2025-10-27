const db = require('../config/database');

const Material = {
  getAll: async () => {
    const result = await db.query('SELECT * FROM material ORDER BY 1');
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query('SELECT * FROM material WHERE codmaterial = $1', [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const fields = ["codmaterial","nombrematerial"];
    const values = fields.map(field => data[field]);
    const result = await db.query(
      'INSERT INTO material (' + fields.join(', ') + ') VALUES ($1, $2) RETURNING *',
      values
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const updateFields = ["nombrematerial"];
    const setClause = updateFields.map((field, index) => field + ' = $' + (index + 1)).join(', ');
    const values = updateFields.map(field => data[field]);
    values.push(id);
    
    const result = await db.query(
      'UPDATE material SET ' + setClause + ' WHERE codmaterial = $' + (updateFields.length + 1) + ' RETURNING *',
      values
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await db.query('DELETE FROM material WHERE codmaterial = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Material;
