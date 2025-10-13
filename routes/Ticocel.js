const express = require('express');
const router = express.Router()

const conexion = require('../database/db');

const authController = require('../controllers/authController')
const UsuarioController = require('../controllers/UsuarioController')
const VentasController = require('../controllers/VentasController');
const NoCache = require('../controllers/noCache');

/* BASE DE DATS FIJO TICOCEL */
router.get('/BDFijoTicocel',authController.isAuthenticated, NoCache.nocache,  async  (req, res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
  
  /// client instance for auth
    const client = await auth.getClient();
  
    /// Instance of google sheets api 
    const googleSheets = google.sheets({ version: "v4", auth: client});
  
  
    const spreadsheetId = "1xa7gfu3a0zLXMfu-ifkIZNlB-v059WQkujYlyVjrOFQ";
    // Get DATA 
  
  
  
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });
  
    /// rows from spreadsheet
  
   
  
    const ventas = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Base Madre!A2:J",
    })
  
    var user = req.user;
    const rows = ventas.data.values;
  
  
    res.render('BDFijoTicocel', {rows, user:user});
  })
  /* TABLA DE VENTAS FIJOOO DE TICOCEL */
  router.get('/listarVentasGoogleFijoTicocel', authController.isAuthenticated, NoCache.nocache, async (req, res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
  
  /// client instance for auth
    const client = await auth.getClient();
  
    /// Instance of google sheets api 
    const googleSheets = google.sheets({ version: "v4", auth: client});
  
  
    const spreadsheetId = "14_KcaSpPh6wl13u8WvXnihr1czzu52TD9_JP9YVitRc";
    // Get DATA 
  
  
  
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });
  
    /// rows from spreadsheet
  
   
  
    const ventas = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Registro_Ventas_Fijo_NIC!A2:AH",
    })
  
    var user = req.user;
    const rows = ventas.data.values;
  
  
    res.render('listarVentasGoogleFijoTicocel', {rows, user:user});
    
  })

   /* EDITAR BD FIJO TICOCEL */

   router.get('/editBDFijoTicocel/:rowId', async  (req, res) => {

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
  
    const spreadsheetId = '1xa7gfu3a0zLXMfu-ifkIZNlB-v059WQkujYlyVjrOFQ';
    const range = `Base Madre!A${rowId}:J${rowId}`;
  
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
      res.render('updateViewBDFijoTicocel', { rowId, rowValues }); // Assumes you have an 'update.ejs' view/template
    });
  });
 router.post('/editBDFijoTicocel/:rowId', async (req, res) => {

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
    ];
  
    // Set up authentication as mentioned in the previous response
  
    const spreadsheetId = '1xa7gfu3a0zLXMfu-ifkIZNlB-v059WQkujYlyVjrOFQ';
    const range = `Base Madre!A${rowId}:J${rowId}`;
  
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
  
      res.redirect('/BDFijoTicocel'); // Redirect to the main page or any other desired location
    });
  });

  /* REGISTRAR VENTA TICOCEL */
router.get('/registrarVentaTicocelFijo', authController.isAuthenticated,NoCache.nocache,(req, res)=>{
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
                res.render('registrarVentaTicocelFijo', { data: results, user: req.user });
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
                res.render('registrarVentaTicocelFijo', { data: results, user: req.user });
            }
        }
    });
  })
  



module.exports = router;