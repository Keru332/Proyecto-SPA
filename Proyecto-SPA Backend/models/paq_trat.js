const db = require('../config/database');

const PaqTrat = {
  getAll: async () => {
    const result = await db.query('SELECT * FROM paq_trat ORDER BY 1');
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query('SELECT * FROM paq_trat JOIN tratamiento ON tratamiento__codtratamiento = codtratamiento WHERE paquete__codpaquete = $1', [id]);
    return result.rows;
  },

  create: async (data) => {
    const fields = ["tratamiento__codtratamiento","tratamiento__categoria_codcategoria","paquete__codpaquete"];
    const values = fields.map(field => data[field]);
    const result = await db.query(
      'INSERT INTO paq_trat (' + fields.join(', ') + ') VALUES ($1, $2, $3) RETURNING *',
      values
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const updateFields = ["tratamiento__categoria_codcategoria","paquete__codpaquete"];
    const setClause = updateFields.map((field, index) => field + ' = $' + (index + 1)).join(', ');
    const values = updateFields.map(field => data[field]);
    values.push(id);
    
    const result = await db.query(
      'UPDATE paq_trat SET ' + setClause + ' WHERE tratamiento__codtratamiento = $' + (updateFields.length + 1) + ' RETURNING *',
      values
    );
    return result.rows[0];
  },

  delete: async (codpaquete, codtratamiento) => {
  const result = await db.query(
    'DELETE FROM paq_trat WHERE paquete__codpaquete = $1 AND tratamiento__codtratamiento = $2 RETURNING *', 
    [codpaquete, codtratamiento]
  );
  return result.rows[0];
}
};

module.exports = PaqTrat;
