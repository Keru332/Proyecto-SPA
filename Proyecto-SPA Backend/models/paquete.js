const db = require('../config/database');

const Paquete = {
  getAll: async () => {
    const result = await db.query('SELECT * FROM paquete ORDER BY codpaquete');
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query('SELECT * FROM paquete WHERE codpaquete = $1', [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const { nombrepaquete, preciopaquete, duraciontotal } = data;
    const result = await db.query(
      'INSERT INTO paquete (nombrepaquete, preciopaquete, duraciontotal) VALUES ($1, $2, $3) RETURNING *',
      [nombrepaquete, preciopaquete, duraciontotal]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { nombrepaquete, preciopaquete, duraciontotal } = data;
    const result = await db.query(
      'UPDATE paquete SET nombrepaquete = $1, preciopaquete = $2, duraciontotal = $3 WHERE codpaquete = $4 RETURNING *',
      [nombrepaquete, preciopaquete, duraciontotal, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await db.query('DELETE FROM paquete WHERE codpaquete = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Paquete;
