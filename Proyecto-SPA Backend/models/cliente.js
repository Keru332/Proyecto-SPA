const db = require('../config/database');

const Cliente = {
  getAll: async () => {
    const result = await db.query('SELECT * FROM cliente ORDER BY idcliente');
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query('SELECT * FROM cliente WHERE idcliente = $1', [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const { idcliente, nombrecliente } = data;
    const result = await db.query(
      'INSERT INTO cliente (idcliente, nombrecliente) VALUES ($1, $2) RETURNING *',
      [idcliente, nombrecliente]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { nombrecliente } = data;
    const result = await db.query(
      'UPDATE cliente SET nombrecliente = $1 WHERE idcliente = $2 RETURNING *',
      [nombrecliente, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await db.query('DELETE FROM cliente WHERE idcliente = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Cliente;