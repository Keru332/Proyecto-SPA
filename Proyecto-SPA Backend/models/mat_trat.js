const db = require('../config/database');

const MatTrat = {
  getAll: async () => {
    const result = await db.query('SELECT * FROM mat_trat ORDER BY 1');
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query('SELECT * FROM mat_trat WHERE tratamiento__codtratamiento = $1', [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const fields = ["tratamiento__codtratamiento","tratamiento__categoria_codcategoria","material__codmaterial"];
    const values = fields.map(field => data[field]);
    const result = await db.query(
      'INSERT INTO mat_trat (' + fields.join(', ') + ') VALUES ($1, $2, $3) RETURNING *',
      values
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const updateFields = ["tratamiento__categoria_codcategoria","material__codmaterial"];
    const setClause = updateFields.map((field, index) => field + ' = $' + (index + 1)).join(', ');
    const values = updateFields.map(field => data[field]);
    values.push(id);
    
    const result = await db.query(
      'UPDATE mat_trat SET ' + setClause + ' WHERE tratamiento__codtratamiento = $' + (updateFields.length + 1) + ' RETURNING *',
      values
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await db.query('DELETE FROM mat_trat WHERE tratamiento__codtratamiento = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = MatTrat;
