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
        range: "Respuestas_Formulario!A2:Z",
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
    res.render('layout', {
        user: req.user,
      })
})
router.get('/colilla',  (req, res)=>{
    res.render('colilla', {user:req.user})
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
        range: "Respuestas_Formulario!A2:Z",
    })

    var user = req.user;
    const rows = ventas.data.values;


    res.render('listarVentasGoogle', {rows, user:user});
    
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

router.get('/registrarVenta1', (req, res)=>{
    res.render('registrarVenta')
})

router.get('/registrarVenta', authController.isAuthenticated,NoCache.nocache,(req, res)=>{
    conexion.query('SELECT * FROM users', (error, results)=>{
        if(error){
            throw error
        }else{
            res.render('registrarVenta', {results:results, user:req.user})
        }
    })
})
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
    var query = "SELECT telefono, user, salario FROM users WHERE nombre = ?";
    conexion.query(query, [employeeName], function (err, results) {
      if (err) throw err;
  
      res.send(results);
    });
  });
  
  

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

router.post('/pruebagoogle',  VentasController.registrarVentaGoogle, VentasController.registrarVenta)


module.exports = router