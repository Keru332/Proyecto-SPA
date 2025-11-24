const db = require('../config/database');

const PaqTrat = {
  getAll: async () => {
    const result = await db.query('SELECT * FROM paq_trat ORDER BY paquete__codpaquete, tratamiento__codtratamiento');
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query(
      'SELECT * FROM paq_trat JOIN tratamiento ON tratamiento__codtratamiento = codtratamiento WHERE paquete__codpaquete = $1', 
      [id]
    );
    return result.rows;
  },

  create: async (data) => {
    const { tratamiento__codtratamiento, tratamiento__categoria_codcategoria, paquete__codpaquete } = data;
    const result = await db.query(
      'INSERT INTO paq_trat (tratamiento__codtratamiento, tratamiento__categoria_codcategoria, paquete__codpaquete) VALUES ($1, $2, $3) RETURNING *',
      [tratamiento__codtratamiento, tratamiento__categoria_codcategoria, paquete__codpaquete]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { tratamiento__categoria_codcategoria, paquete__codpaquete } = data;
    const result = await db.query(
      'UPDATE paq_trat SET tratamiento__categoria_codcategoria = $1, paquete__codpaquete = $2 WHERE tratamiento__codtratamiento = $3 RETURNING *',
      [tratamiento__categoria_codcategoria, paquete__codpaquete, id]
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