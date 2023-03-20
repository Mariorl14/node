const express = require('express');
///const {vistaPrincipal, vistaHome, vistaRegister} = require('../controllers/PageControllers')
const router = express.Router()

const conexion = require('../database/db');

/*
router.get('/', vistaPrincipal)
router.get('/home', vistaHome)
router.get('/register', vistaRegister)
*/

const authController = require('../controllers/authController')
const UsuarioController = require('../controllers/UsuarioController')
const VentasController = require('../controllers/VentasController')

/*ROUTER PARA VISTAS */
router.get('/', (req, res)=>{
    res.render('login', {alert:false, layout: 'login' } )
})
router.get('/home', authController.isAuthenticated, (req, res)=>{
    
    conexion.query('SELECT * FROM users', (error, results)=>{
        if(error){
            throw error
        }else{
            res.render('home', {results:results, user:req.user})
        }
    })

})
router.get('/register', (req, res)=>{
    res.render('register')
})
router.get('/layout', (req, res)=>{
    res.render('layout', {user:req.user})
})
router.get('/ventas', (req, res)=>{
    conexion.query('SELECT * FROM Ventas', (error, results)=>{
        if(error){
            throw error
        }else{
            res.render('ventas', {results:results,})
        }
    })
})
router.get('/registrarVenta', (req, res)=>{
    res.render('registrarVenta')
})

/*Editar Usuarios */
router.get('/editarUser/:id', (req, res)=>{
    const id = req.params.id;
    conexion.query('SELECT * FROM users WHERE id = ?', [id], (error, results)=>{
        if(error){
            throw error
        }else{
            res.render('editarUser', {user:results[0]});
        }
    })
})
router.get('/borrarUser/:id', (req, res)=>{
    const id = req.params.id;
    conexion.query('DELETE FROM users WHERE id = ?', [id], (error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/home');
        }
    })
});


/*ROUTER PARA METODOS DEL CONTROLLER*/ 
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
/*Router para usuarios */
router.post('/editarUser', UsuarioController.editarUser)
/*Registrar Ventas */
router.post('/registrarVenta', VentasController.registrarVenta)


module.exports = router