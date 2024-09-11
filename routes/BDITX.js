const express = require('express');
const {google} = require("googleapis");
const router = express.Router()

const conexion = require('../database/db');

const authController = require('../controllers/authController')
const UsuarioController = require('../controllers/UsuarioController')
const VentasController = require('../controllers/VentasController');
const NoCache = require('../controllers/noCache');


/* base ITX */
router.get('/bdITX',authController.isAuthenticated, NoCache.nocache,authController.TicocelBDF, authController.FavtelNicaraguaKolbi, async  (req, res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
  
  /// client instance for auth
    const client = await auth.getClient();
  
    /// Instance of google sheets api 
    const googleSheets = google.sheets({ version: "v4", auth: client});
  
  
    const spreadsheetId = "1aLHA7UdBSUrxC9k-cOL5CG650hoP8WesvpktDs-PRAg";
    // Get DATA 
  
  
  
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });
  
    /// rows from spreadsheet
  
   
  
    const ventas = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Base Madre!A2:Q",
    })
  
    var user = req.user;
    const rows = ventas.data.values;
  
  
    res.render('bdITX', {rows, user:user});
  })


  /*EDITAR BASE ITX */
  router.get('/editITX/:rowId', async  (req, res) => {

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
  
    const spreadsheetId = '1aLHA7UdBSUrxC9k-cOL5CG650hoP8WesvpktDs-PRAg';
    const range = `Base Madre!A${rowId}:Q${rowId}`;
  
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
      res.render('updateViewBDITX', { rowId, rowValues }); // Assumes you have an 'update.ejs' view/template
    });
  });

  router.post('/editITX/:rowId', async (req, res) => {

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
      req.body.column17
    ];
  
    // Set up authentication as mentioned in the previous response
  
    const spreadsheetId = '1aLHA7UdBSUrxC9k-cOL5CG650hoP8WesvpktDs-PRAg';
    const range = `Base Madre!A${rowId}:Q${rowId}`;
  
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
  
      res.redirect('/bdITX'); // Redirect to the main page or any other desired location
    });
  });


  module.exports = router;
  