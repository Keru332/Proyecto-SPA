const db = require('../config/database');

const Tratamiento = {
  getAll: async () => {
    const result = await db.query(`
      SELECT * FROM tratamiento 
      JOIN categoria ON categoria_codcategoria = codcategoria 
      ORDER BY codtratamiento
    `);
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query(`
      SELECT * FROM tratamiento 
      JOIN categoria ON categoria_codcategoria = codcategoria 
      WHERE codtratamiento = $1
    `, [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const { nombretratamiento, descripcion, frecuenciadesolicitudmensual, duracion, precio, categoria_codcategoria } = data;
    const result = await db.query(
      'INSERT INTO tratamiento (nombretratamiento, descripcion, frecuenciadesolicitudmensual, duracion, precio, categoria_codcategoria) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombretratamiento, descripcion, frecuenciadesolicitudmensual, duracion, precio, categoria_codcategoria]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { nombretratamiento, descripcion, duracion, precio, categoria_codcategoria } = data;
    const result = await db.query(
      'UPDATE tratamiento SET nombretratamiento = $1, descripcion = $2, duracion = $3, precio = $4, categoria_codcategoria = $5 WHERE codtratamiento = $6 RETURNING *',
      [nombretratamiento, descripcion, duracion, precio, categoria_codcategoria, id]
    );
    return result.rows[0];
  },

  getMasPopular: async () => {
    const result = await db.query(`
      SELECT *
      FROM tratamiento 
      JOIN categoria ON categoria_codcategoria = codcategoria
      ORDER BY frecuenciadesolicitudmensual DESC
      LIMIT 1
    `);
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await db.query('DELETE FROM tratamiento WHERE codtratamiento = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Tratamiento;
