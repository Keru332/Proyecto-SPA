const db = require('../config/database');

const Tratamiento = {
  getAll: async () => {
    const result = await db.query('SELECT * FROM tratamiento JOIN categoria ON categoria_codcategoria = codcategoria ORDER BY 1');
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query('SELECT * FROM tratamiento JOIN categoria ON categoria_codcategoria = codcategoria WHERE codtratamiento = $1', [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const fields = ["nombretratamiento","descripcion","frecuenciadesolicitudmensual","duracion","precio","categoria_codcategoria"];
    const values = fields.map(field => data[field]);
    const result = await db.query(
      'INSERT INTO tratamiento (' + fields.join(', ') + ') VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      values
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const updateFields = ["nombretratamiento","descripcion","duracion","precio","categoria_codcategoria"];
    const setClause = updateFields.map((field, index) => field + ' = $' + (index + 1)).join(', ');
    const values = updateFields.map(field => data[field]);
    values.push(id);
    
    const result = await db.query(
      'UPDATE tratamiento SET ' + setClause + ' WHERE codtratamiento = $' + (updateFields.length + 1) + ' RETURNING *',
      values
    );
    return result.rows[0];
  },

    // Agrega este método al modelo Tratamiento
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
