const express = require('express');
const router = express.Router()

const conexion = require('../database/db');

const authController = require('../controllers/authController')
const rolemiddlware = require('../controllers/roleMiddlware')
const UsuarioController = require('../controllers/UsuarioController')
const VentasController = require('../controllers/VentasController');
const NoCache = require('../controllers/noCache');


module.exports = router;