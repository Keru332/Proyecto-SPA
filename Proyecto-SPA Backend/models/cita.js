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
  },

  getByPeriodo: async (periodo) => {
    let fechaFiltro = '';
    
    switch(periodo) {
      case 'hoy':
        fechaFiltro = 'fecha = CURRENT_DATE';
        break;
      case 'semana':
        fechaFiltro = `fecha BETWEEN DATE_TRUNC('week', CURRENT_DATE) AND DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days'`;
        break;
      case 'mes':
        fechaFiltro = 'EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)';
        break;
      case 'anno':
        fechaFiltro = 'EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)';
        break;
      default:
        fechaFiltro = 'fecha >= CURRENT_DATE';
    }

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
      WHERE ${fechaFiltro}
      ORDER BY fecha, horacita
    `);
    return result.rows;
  },

  getByClienteFuturas: async (id) => {
    const result = await db.query(`
      SELECT 
        cita.*,
        tratamiento.nombretratamiento,
        cliente.nombrecliente,
        TO_CHAR(cita.fecha, 'DD/MM/YYYY') as fecha_formateada,
        TO_CHAR(cita.horacita::time, 'HH24:MI') as hora_formateada,
        fecha
      FROM cita 
      JOIN tratamiento ON tratamiento__codtratamiento = codtratamiento 
      JOIN cliente ON cliente__idcliente = idcliente 
      WHERE cliente__idcliente = $1 
        AND (fecha > CURRENT_DATE OR (fecha = CURRENT_DATE AND horacita >= CURRENT_TIME))
      ORDER BY fecha, horacita
    `, [id]);
    return result.rows;
  },


  getByClientePasadas: async (id) => {
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
      WHERE cliente__idcliente = $1 
        AND (fecha < CURRENT_DATE OR (fecha = CURRENT_DATE AND horacita < CURRENT_TIME))
      ORDER BY fecha DESC, horacita DESC
    `, [id]);
    return result.rows;
  },
};

module.exports = Cita;