const express = require('express');
const {google} = require("googleapis");
const apiKey = 'AIzaSyDelxqh4i74UrJ1Rpdbxv91a8ksOgUGOEI';
const {promisify} = require('util');
const xlsx = require('xlsx');
const fs = require('fs');
///const {vistaPrincipal, vistaHome, vistaRegister} = require('../controllers/PageControllers')
const router = express.Router()

const conexion = require('../database/db');
const app = express();

/*
router.get('/', vistaPrincipal)
router.get('/home', vistaHome)
router.get('/register', vistaRegister)
*/

const authController = require('../controllers/authController')
const UsuarioController = require('../controllers/UsuarioController')
const VentasController = require('../controllers/VentasController');
const NoCache = require('../controllers/noCache');

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
router.get('/layout',  (req, res)=>{
    /*
    res.render('layout', {
        user: req.user,
      })
      */

      var user = req.user;

     res.send({user:user})
})
router.get('/plantilla',  (req, res)=>{
    res.render('plantilla', {user:req.user})
})
router.get('/Upload',authController.isAuthenticated, authController.authRol, NoCache.nocache,(req, res)=>{
    res.render('Upload', {user:req.user})
})
router.get('/UploadFijo', authController.isAuthenticated, authController.authRol ,NoCache.nocache,  (req, res)=>{
    res.render('UploadFijo', {user:req.user})
})
router.get('/UploadTelefonos', authController.isAuthenticated, authController.authRol,NoCache.nocache,(req, res)=>{
    res.render('UploadTelefonos', {user:req.user})
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


    res.render('dashboard', {rows:rows,  user:user});

    
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
  router.get('/editVentas/:rowId', async  (req, res) => {

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });
      
      // Create the client instance for authentication
      const client = await auth.getClient();
      
      // Create an instance of the Google Sheets API
      const googleSheets = google.sheets({ version: "v4", auth: client });

    // Get DATA 
    const rowId = req.params.rowId;
  
    // Step 2: Retrieve row data from Google Sheets
    // Set up authentication as mentioned in the previous response
  
    const spreadsheetId = '1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY';
    const range = `Respuestas_Formulario!A${rowId}:AJ${rowId}`;
  
    googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    }, (err, response) => {
      if (err) {
        console.error('The API returned an error:', err);
        res.send('Error retrieving row data');
        return;
      }
  
      const rowValues = response.data.values[0];
  
      // Step 3: Render the update view with retrieved data
      res.render('editarVentas', { rowId, rowValues }); // Assumes you have an 'update.ejs' view/template
    });
  });

 router.post('/editVentasGoogle/:rowId', async (req, res) => {

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });
      
      // Create the client instance for authentication
      const client = await auth.getClient();
      
      // Create an instance of the Google Sheets API
      const googleSheets = google.sheets({ version: "v4", auth: client });

    const rowId = req.params.rowId;
    const updatedValues = [
      req.body.column1,
      req.body.column2,
      req.body.column3,
      req.body.column4,
      req.body.column5,
      req.body.column6,
      req.body.column7,
      req.body.column8,
      req.body.column9,
      req.body.column10,
      req.body.column11,
      req.body.column12,
      req.body.column13,
      req.body.column14,
      req.body.column15,
      req.body.column16,
      req.body.column17,
      req.body.column18,
      req.body.column19,
      req.body.column20,
      req.body.column21,
      req.body.column22,
      req.body.column23,
      req.body.column24,
      req.body.column25,
      req.body.column26,
      req.body.column27,
      req.body.column28,
      req.body.column29,
      req.body.column30,
      req.body.column31,
      req.body.column32,
      req.body.column33,
      req.body.column34,
      req.body.column35,
      req.body.column36,
    ];
  
    // Set up authentication as mentioned in the previous response
  
    const spreadsheetId = '1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY';
    const range = `Respuestas_Formulario!A${rowId}:AJ${rowId}`;
  
    const requestBody = {
      values: [updatedValues],
    };
  
    googleSheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: requestBody,
    }, (err, response) => {
      if (err) {
        console.error('The API returned an error:', err);
        res.send('Error updating row');
        return;
      }
  
      res.redirect('/listarVentasGoogle'); // Redirect to the main page or any other desired location
    });
  });

/*ROUTER PARA METODOS DEL CONTROLLER*/ 
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

/*Router para usuarios */
router.post('/editarUser', UsuarioController.editarUser)
/*Registrar Ventas */
router.post('/registrarVenta', VentasController.registrarVenta)

router.post('/pruebagoogle',   VentasController.registrarVenta)
router.post('/pruebagoogle1',  VentasController.registrarVentaFijo)
router.post('/pruebagoogle2',  VentasController.registrarVentaFijoTicocel)

module.exports = router
