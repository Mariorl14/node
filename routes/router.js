const express = require('express');
const {google} = require("googleapis");
const {promisify} = require('util');
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
const VentasController = require('../controllers/VentasController');
const NoCache = require('../controllers/noCache');
const pdfMaker = require('../controllers/pdfMaker');

/*ROUTER PARA VISTAS */
router.get('/', (req, res)=>{
    res.render('login', {alert:false, layout: 'login' } )
})

router.get('/listarUsuarios', authController.isAuthenticated,authController.authRol, NoCache.nocache, (req, res)=>{
    
    conexion.query('SELECT * FROM users', (error, results)=>{
        if(error){
            throw error
        }else{
            res.render('listarUsuarios', {results:results, user:req.user})
        }
    })

})
router.get('/listaBDVentas', authController.isAuthenticated,authController.authRol, NoCache.nocache, (req, res)=>{
    
    conexion.query('SELECT * FROM Ventas', (error, results)=>{
        if(error){
            throw error
        }else{
            res.render('listaBDVentas', {results:results, user:req.user})
        }
    })

})


router.get('/home', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{
    
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

/// client instance for auth
    const client = await auth.getClient();

    /// Instance of google sheets api 
    const googleSheets = google.sheets({ version: "v4", auth: client});


    const spreadsheetId = "1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY";
    // Get DATA 



    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });

    /// rows from spreadsheet

   

    const ventas = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Respuestas_Formulario!A2:AB",
    })

    var user = req.user;
    const rows = ventas.data.values;

    if(rows==undefined){
        rows="";
    }
    

    res.render('home', {rows:rows,user:user});

})
router.get('/register',  (req, res)=>{
    res.render('register', {user:req.user})
})
router.get('/layout',  (req, res)=>{
    /*
    res.render('layout', {
        user: req.user,
      })
      */

      var user = req.user;

     res.send({user:user})
})
router.get('/colilla',  (req, res)=>{
    res.render('colilla', {user:req.user})
})
router.get('/colillaFijo',  (req, res)=>{
    res.render('colillaFijo', {user:req.user})
})
router.get('/plantilla',  (req, res)=>{
    res.render('plantilla', {user:req.user})
})
router.get('/ventas',authController.isAuthenticated, (req, res)=>{
    conexion.query('SELECT * FROM Ventas', (error, results)=>{
        if(error){
            throw error
        }else{
            res.render('ventas', {results:results,})
        }
    })
})

router.get('/listarVentasGoogle', authController.isAuthenticated, NoCache.nocache,async (req, res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

/// client instance for auth
    const client = await auth.getClient();

    /// Instance of google sheets api 
    const googleSheets = google.sheets({ version: "v4", auth: client});


    const spreadsheetId = "1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY";
    // Get DATA 



    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });

    /// rows from spreadsheet

   

    const ventas = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Respuestas_Formulario!A2:AB",
    })

    var user = req.user;
    const rows = ventas.data.values;


    res.render('listarVentasGoogle', {rows, user:user});
    
})
router.get('/listarVentasFijo', authController.isAuthenticated, NoCache.nocache,async (req, res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

/// client instance for auth
    const client = await auth.getClient();

    /// Instance of google sheets api 
    const googleSheets = google.sheets({ version: "v4", auth: client});


    const spreadsheetId = "1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY";
    // Get DATA 



    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });

    /// rows from spreadsheet

   

    const ventas = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Registro_Ventas_Fijo!A2:Z",
    })

    var user = req.user;
    const rows = ventas.data.values;


    res.render('listarVentasFijo', {rows, user:user});
    
})
router.get('/misEstadisticas', authController.isAuthenticated, NoCache.nocache,async (req, res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

/// client instance for auth
    const client = await auth.getClient();

    /// Instance of google sheets api 
    const googleSheets = google.sheets({ version: "v4", auth: client});


    const spreadsheetId = "1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY";
    // Get DATA 



    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });

    /// rows from spreadsheet

   

    const ventas = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Gerencial!A2:L",
    })

    var user = req.user;
    const rows = ventas.data.values;

    console.log(rows);

    res.render('misEstadisticas', {rows:rows,  user:user});

    
})

router.get('/dashboard', authController.isAuthenticated,authController.authRol, NoCache.nocache,async (req, res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

/// client instance for auth
    const client = await auth.getClient();

    /// Instance of google sheets api 
    const googleSheets = google.sheets({ version: "v4", auth: client});


    const spreadsheetId = "1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY";
    // Get DATA 



    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });

    /// rows from spreadsheet

   

    const ventas = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Gerencial!A2:L",
    })

    var user = req.user;
    const rows = ventas.data.values;

    console.log(rows);

    res.render('dashboard', {rows:rows,  user:user});

    
})

router.get('/registrarVenta1', authController.isAuthenticated,NoCache.nocache,(req, res)=>{

    res.render('registrarVenta1', {user:req.user})
})
router.get('/registrarVenta', authController.isAuthenticated, NoCache.nocache, (req, res) => {
    let query1 = 'SELECT * FROM users';
    let query2 = 'SELECT nombre FROM users WHERE rol = "freelance"';
    let results = {};

    conexion.query(query1, (error, data) => {
        if (error) {
            throw error;
        } else {
            results.users = data;
            // check if the second query has also been executed
            if (results.hasOwnProperty('freelancers')) {
                res.render('registrarVenta', { data: results, user: req.user });
            }
        }
    });

    conexion.query(query2, (error, data) => {
        if (error) {
            throw error;
        } else {
            results.freelancers = data;
            // check if the first query has also been executed
            if (results.hasOwnProperty('users')) {
                res.render('registrarVenta', { data: results, user: req.user });
            }
        }
    });
});

router.get('/generatePayslip',authController.isAuthenticated,authController.authRol, NoCache.nocache, authController.authColillas, function(req, res, next){

    conexion.query('SELECT * FROM users', function (error, data) {
        res.render('generatePayslip', {user:req.user, data:data} );
    })
    /*
    res.render('generatePayslip', {user:req.user})
    */
})
router.post("/getEmployeeNumberAndEmail", function (req, res) {
    var employeeName = req.body.employeeName;
  
    // Query the database to fetch the employee number and email
    // Replace this with your actual database query
    var query = "SELECT telefono, user, salario, codigoEmpleado FROM users WHERE nombre = ?";
    conexion.query(query, [employeeName], function (err, results) {
      if (err) throw err;
  
      res.send(results);
    });
  });
router.get('/registrarVentaFijo', authController.isAuthenticated,NoCache.nocache,(req, res)=>{
    let query1 = 'SELECT * FROM users';
    let query2 = 'SELECT nombre FROM users WHERE rol = "freelance"';
    let results = {};

    conexion.query(query1, (error, data) => {
        if (error) {
            throw error;
        } else {
            results.users = data;
            // check if the second query has also been executed
            if (results.hasOwnProperty('freelancers')) {
                res.render('registrarVentaFijo', { data: results, user: req.user });
            }
        }
    });

    conexion.query(query2, (error, data) => {
        if (error) {
            throw error;
        } else {
            results.freelancers = data;
            // check if the first query has also been executed
            if (results.hasOwnProperty('users')) {
                res.render('registrarVentaFijo', { data: results, user: req.user });
            }
        }
    });
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
router.post('/generatePayslip', pdfMaker.generatePayslip );

/*Router para usuarios */
router.post('/editarUser', UsuarioController.editarUser)
/*Registrar Ventas */
router.post('/registrarVenta', VentasController.registrarVenta)
router.post('/registrarVenta1', VentasController.registrarVenta)

router.post('/pruebagoogle',  VentasController.registrarVentaGoogle, VentasController.registrarVenta)
router.post('/pruebagoogle1',  VentasController.registrarVentaFijo)

module.exports = router