const express = require('express');
const {vistaPrincipal, vistaLogin, vistaRegister} = require('../controllers/PageControllers')
const router = express.Router()

router.get('/', vistaPrincipal)
router.get('/login', vistaLogin)
router.get('/register', vistaRegister)


module.exports = {routes: router}