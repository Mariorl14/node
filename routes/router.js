const express = require('express');
///const {vistaPrincipal, vistaHome, vistaRegister} = require('../controllers/PageControllers')
const router = express.Router()
/*
router.get('/', vistaPrincipal)
router.get('/home', vistaHome)
router.get('/register', vistaRegister)
*/

const authController = require('../controllers/authController')

/*ROUTER PARA VISTAS */
router.get('/', (req, res)=>{
    res.render('login', {alert:false})
})
router.get('/home', authController.isAuthenticated, (req, res)=>{
    res.render('home', {user:req.user})
})
router.get('/register', (req, res)=>{
    res.render('register')
})


/*ROUTER PARA METODOS DEL CONTROLLER*/ 
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)


module.exports = router