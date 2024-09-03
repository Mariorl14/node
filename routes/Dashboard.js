const express = require('express');
const {google} = require("googleapis");
const router = express.Router()

const conexion = require('../database/db');

const authController = require('../controllers/authController')
const UsuarioController = require('../controllers/UsuarioController')
const VentasController = require('../controllers/VentasController');
const NoCache = require('../controllers/noCache');
const moment = require('moment');


router.get('/Dash', (req, res) => {
  conexion.query(`
    SELECT Nombre_Vendedor, COUNT(*) as salesCount
    FROM VentasMovil
    WHERE STR_TO_DATE(Fecha, '%Y/%m/%d') BETWEEN '2024-04-01' AND '2024-06-30'
      AND Activada = 'Activada'
    GROUP BY Nombre_Vendedor;
  `, (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      res.status(500).send('Internal Server Error');
    } else {
      // Convert results to JSON string and escape it
      const escapedResults = JSON.stringify(results).replace(/</g, '\\u003c');
      res.render('Dash', { results: escapedResults, user: req.user });
    }
  });
});

    module.exports = router;