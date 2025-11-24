const db = require('../config/database');

const Categoria = {
  getAll: async () => {
    const result = await db.query('SELECT * FROM categoria ORDER BY codcategoria');
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query('SELECT * FROM categoria WHERE codcategoria = $1', [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const { nombrecategoria } = data;
    const result = await db.query(
      'INSERT INTO categoria (nombrecategoria) VALUES ($1) RETURNING *',
      [nombrecategoria]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { nombrecategoria } = data;
    const result = await db.query(
      'UPDATE categoria SET nombrecategoria = $1 WHERE codcategoria = $2 RETURNING *',
      [nombrecategoria, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await db.query('DELETE FROM categoria WHERE codcategoria = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Categoria;