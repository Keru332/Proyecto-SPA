const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'proyecto_final_pw',
  password: process.env.DB_PASSWORD || 'arsenico',
  port: process.env.DB_PORT || 1234,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};

