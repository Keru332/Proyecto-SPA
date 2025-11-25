const db = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  getAll: async () => {
    const result = await db.query('SELECT id, username, role, created_at FROM users ORDER BY id');
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query(
  'SELECT id, username, role, created_at, idcliente, nombrecliente, correo, balance FROM users JOIN cliente ON codcliente = idcliente WHERE id = $1',[id]);
    return result.rows[0];
  },

  create: async (data) => {
    const { username, password, role = 'user', email, fullname} = data;

    // Hashear la contraseña antes de guardarla
    const passwordHash = await bcrypt.hash(password, 10);

    const clienteResult = await db.query(
      'INSERT INTO cliente (nombrecliente, correo) VALUES ($1, $2) RETURNING idcliente',
      [fullname, email]
    )

    const result = await db.query(
      'INSERT INTO users (username, password_hash, role, codcliente) VALUES ($1, $2, $3, $4) RETURNING id, username, role, created_at',
      [username, passwordHash, role, clienteResult.rows[0].idcliente]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { username, role } = data;
    const result = await db.query(
      'UPDATE users SET username = $1, role = $2 WHERE id = $3 RETURNING id, username, role, created_at',
      [username, role, id]
    );
    return result.rows[0];
  },

  updateProfile: async (id, data) => {
  const { username, correo } = data;

  await db.query('UPDATE users SET username = $1 WHERE id = $2', [username, id]);

  await db.query(`
    UPDATE cliente
    SET correo = $1
    WHERE idcliente = (
      SELECT idcliente
      FROM users
      JOIN cliente ON codcliente = idcliente
      WHERE id = $2
    )
  `, [correo, id]);

  const result = await db.query(`
    SELECT id, username, role, created_at, idcliente, nombrecliente, correo
    FROM users
    JOIN cliente ON codcliente = idcliente
    WHERE id = $1
  `, [id]);

  return result.rows[0];
},

  delete: async (id) => {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id, username, role', [id]);
    return result.rows[0];
  },

  // Métodos especiales para users
  findByUsername: async (username) => {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  },

  updatePassword: async (id, newPassword) => {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const result = await db.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, username, role',
      [passwordHash, id]
    );
    return result.rows[0];
  },

  verifyPassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  getHashed: async (id) => {
    const result = await db.query(
          'SELECT * FROM users WHERE id = $1',
          [id]
        );
        return result.rows[0];
},
};

module.exports = User;
