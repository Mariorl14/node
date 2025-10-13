const express = require('express');
const router = express.Router();
const moment = require('moment');
const pool = require('../database/db'); // ✅ use your mysql2 promise pool
const authController = require('../controllers/authController');
const NoCache = require('../controllers/noCache');



  router.post('/delete-database', (req, res) => {
    const databaseName = 'baseITX'; // set your DB name
    const sql = `DROP table ??`;
  
    conexion.query(sql, [databaseName], (err, result) => {
      if (err) {
        console.error('Error deleting database:', err);
        return res.status(500).send('Database deletion failed');
      }
      console.log('Database deleted');
      res.send('Database deleted successfully');
    });
  });
  
  router.post('/create-table', (req, res) => {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS baseITX (
        consecutivo INT AUTO_INCREMENT PRIMARY KEY,
        numero INT,
        cedula VARCHAR(512),
        nombre VARCHAR(512),
        asesor VARCHAR(512),
        detalle VARCHAR(512),
        dia DATE,
        hora TIME,
        comentario VARCHAR(512),
        pre_post_pago VARCHAR(512),
        fijo VARCHAR(512),
        operador_fijo VARCHAR(512),
        operador_movil VARCHAR(512),
        genero VARCHAR(512),
        whatsapp VARCHAR(512),
        cobertura_fijo VARCHAR(512),
        coordenadas VARCHAR(512)
      );
    `;
  
    conexion.query(createTableSQL, (err, result) => {
      if (err) {
        console.error('Error creating table:', err);
        return res.status(500).send('Failed to create table');
      }
      res.send('Table baseITX created successfully');
    });
  });

 

  module.exports = router;
  