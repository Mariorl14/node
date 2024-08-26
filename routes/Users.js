const express = require('express');
const {google} = require("googleapis");
const router = express.Router()

const conexion = require('../database/db');

const authController = require('../controllers/authController')
const UsuarioController = require('../controllers/UsuarioController')
const VentasController = require('../controllers/VentasController');
const NoCache = require('../controllers/noCache');

/*Registrar users */
router.get('/register', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{
    res.render('register', {user:req.user})
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

module.exports = router;