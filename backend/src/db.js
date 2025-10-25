const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'taskdb',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5433,
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL ✅'))
  .catch(err => console.error('Error connecting to PostgreSQL ❌', err));

module.exports = pool;
