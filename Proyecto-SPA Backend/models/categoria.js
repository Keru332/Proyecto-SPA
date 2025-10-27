const db = require('../config/database');

const Categoria = {
  getAll: async () => {
    const result = await db.query('SELECT * FROM categoria ORDER BY 1');
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query('SELECT * FROM categoria WHERE codcategoria = $1', [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const fields = ["codcategoria","nombrecategoria"];
    const values = fields.map(field => data[field]);
    const result = await db.query(
      'INSERT INTO categoria (' + fields.join(', ') + ') VALUES ($1, $2) RETURNING *',
      values
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const updateFields = ["nombrecategoria"];
    const setClause = updateFields.map((field, index) => field + ' = $' + (index + 1)).join(', ');
    const values = updateFields.map(field => data[field]);
    values.push(id);
    
    const result = await db.query(
      'UPDATE categoria SET ' + setClause + ' WHERE codcategoria = $' + (updateFields.length + 1) + ' RETURNING *',
      values
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await db.query('DELETE FROM categoria WHERE codcategoria = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Categoria;
