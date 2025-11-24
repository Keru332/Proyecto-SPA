const db = require('../config/database');

const Cita = {
  getAll: async () => {
    const result = await db.query(`
      SELECT 
        cita.*,
        tratamiento.nombretratamiento,
        cliente.nombrecliente,
        TO_CHAR(cita.fecha, 'DD/MM/YYYY') as fecha_formateada,
        TO_CHAR(cita.horacita::time, 'HH24:MI') as hora_formateada
      FROM cita 
      JOIN tratamiento ON tratamiento__codtratamiento = codtratamiento 
      JOIN cliente ON cliente__idcliente = idcliente 
      ORDER BY fecha
    `);
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query('SELECT * FROM cita WHERE codsolicitud = $1', [id]);
    return result.rows[0];
  },

  getSumDuracionDiaria: async (dia) => {
    const result = await db.query(`
      SELECT SUM(duracion) 
      FROM cita 
      JOIN tratamiento ON tratamiento__codtratamiento = codtratamiento 
      WHERE fecha = $1`, [dia]);
    return result.rows[0];
  },

  create: async (data) => {
    const { tratamiento__codtratamiento, tratamiento__categoria_codcategoria, cliente__idcliente, fecha, horacita, observaciones } = data;
    const result = await db.query(
      'INSERT INTO cita (tratamiento__codtratamiento, tratamiento__categoria_codcategoria, cliente__idcliente, fecha, horacita, observaciones) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [tratamiento__codtratamiento, tratamiento__categoria_codcategoria, cliente__idcliente, fecha, horacita, observaciones]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { tratamiento__codtratamiento, tratamiento__categoria_codcategoria, cliente__idcliente, fecha, horacita, observaciones } = data;
    const result = await db.query(
      'UPDATE cita SET tratamiento__codtratamiento = $1, tratamiento__categoria_codcategoria = $2, cliente__idcliente = $3, fecha = $4, horacita = $5, observaciones = $6 WHERE codsolicitud = $7 RETURNING *',
      [tratamiento__codtratamiento, tratamiento__categoria_codcategoria, cliente__idcliente, fecha, horacita, observaciones, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await db.query('DELETE FROM cita WHERE codsolicitud = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Cita;