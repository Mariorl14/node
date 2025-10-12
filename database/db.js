const mysql = require('mysql2/promise'); // notice mysql2, not mysql

const pool = mysql.createPool({
  host: 'serverfavtel.mysql.database.azure.com',
  user: 'adminFavtel', // ✅ use your correct username
  password: 'FAvaRO1202',
  database: 'favtel',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: true } // required for Azure
});

module.exports = pool;
