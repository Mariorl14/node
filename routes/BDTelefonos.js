const express = require('express');
const {google} = require("googleapis");
const router = express.Router()

const conexion = require('../database/db');
const moment = require('moment');
const authController = require('../controllers/authController')
const UsuarioController = require('../controllers/UsuarioController')
const VentasController = require('../controllers/VentasController');
const NoCache = require('../controllers/noCache');
const rolemiddlware = require('../controllers/roleMiddlware')

/* BASE TELEFONOS */

router.get('/bdTelefonos',authController.isAuthenticated, NoCache.nocache,rolemiddlware.TicocelBDF, rolemiddlware.FavtelNicaraguaKolbi, async  (req, res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
  
  /// client instance for auth
    const client = await auth.getClient();
  
    /// Instance of google sheets api 
    const googleSheets = google.sheets({ version: "v4", auth: client});
  
  
    const spreadsheetId = "1ewvh5iI-xF9n6j1VNYdeYwY8DrJW-j7z-XV2J3RpdNc";
    // Get DATA 
  
  
  
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });
  
    /// rows from spreadsheet
  
   
  
    const ventas = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Base Madre!A2:I",
    })
  
    var user = req.user;
    const rows = ventas.data.values;
  
  
    res.render('bdTelefonos', {rows, user:user});
  })



/*EDITAR BASE Telefonos */
  router.get('/editBdTelefonos/:rowId', async  (req, res) => {

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
  
    const spreadsheetId = '1ewvh5iI-xF9n6j1VNYdeYwY8DrJW-j7z-XV2J3RpdNc';
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
      res.render('updateViewBDTelefonos', { rowId, rowValues }); // Assumes you have an 'update.ejs' view/template
    });
  });

  router.post('/editBdTelefonos/:rowId', async (req, res) => {

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
  
    const spreadsheetId = '1ewvh5iI-xF9n6j1VNYdeYwY8DrJW-j7z-XV2J3RpdNc';
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
  
      res.redirect('/bdTelefonos'); // Redirect to the main page or any other desired location
    });
  });

  router.get('/baseTelefonos', authController.isAuthenticated, NoCache.nocache,  async (req, res)=>{
try {
    const userName = req.user.nombre;
    const userRole = req.user.rol;

    let sql;
    let params = [];

    // If not admin, show only their own records
    if (userRole !== 'admin') {
      sql = 'SELECT * FROM baseTelefonos WHERE asesor = ?';
      params = [userName];
    } else {
      sql = 'SELECT * FROM baseITX';
    }

    const [results] = await conexion.query(sql, params);

    res.render('baseTelefonos', { results, user: req.user });
  } catch (error) {
    console.error('❌ Error loading baseTelefonos:', error);
    res.status(500).send('Error loading baseTelefonos');
  }
  });

  /* Editar Ventas Activadas*/
  router.get('/editBaseTelefonos/:consecutivo', authController.isAuthenticated, (req, res) => {
    const consecutivo = req.params.consecutivo;
  
    conexion.query('SELECT * FROM baseTelefonos WHERE consecutivo = ?', [consecutivo], (error, results) => {
      if (error) {
        throw error;
      } else if (results.length === 0) {
        return res.status(404).send("Registro no encontrado");
      }
  
      let saleData = results[0];
  
      // Format date and time fields for HTML inputs
      saleData.formattedDia = saleData.dia ? moment(saleData.dia).format('YYYY-MM-DD') : '';
      saleData.formattedHora = saleData.hora ? moment(saleData.hora, 'HH:mm:ss').format('HH:mm') : '';
  
      res.render('EditarBaseTelefonos', { SaleId: saleData, user: req.user });
    });
  });

  router.post('/editBaseTelefonos', authController.isAuthenticated, (req, res) => {
    const consecutivo = req.body.consecutivo;
  
     // Use current date and time
     const now = moment(); // requires: const moment = require('moment');
     const dia = now.format('YYYY-MM-DD');
     const hora = now.format('HH:mm:ss');
  
    const data = {
      numero: req.body.numero,
      cedula: req.body.cedula,
      nombre: req.body.nombre,
      asesor: req.body.asesor,
      detalle: req.body.detalle,
      dia: dia,
      hora: hora,
      comentario: req.body.comentario,
      pre_post_pago: req.body.pre_post_pago,
      fijo: req.body.fijo,
      operador_fijo: req.body.operador_fijo,
      operador_movil: req.body.operador_movil,
      genero: req.body.genero,
      whatsapp: req.body.whatsapp,
      cobertura_fijo: req.body.cobertura_fijo,
      coordenadas: req.body.coordenadas
    };
  
    conexion.query('UPDATE baseTelefonos SET ? WHERE consecutivo = ?', [data, consecutivo], (error, results) => {
      if (error) {
        console.error("Error updating:", error);
        res.status(500).send("Error updating data.");
      } else {
        console.log("Updated record consecutivo:", consecutivo);
        res.redirect('/baseTelefonos');
      }
    });
  });

  router.post('/delete-databaseTelefonos', (req, res) => {
    const databaseName = 'baseTelefonos'; // set your DB name
    const sql = `DROP table ??`;
  
    conexion.query(sql, [databaseName], (err, result) => {
      if (err) {
        console.error('Error deleting database:', err);
        return res.status(500).send('Database deletion failed');
      }
      console.log('Database deleted');
      res.send('Database deleted successfully');
    });
  });
  
  router.post('/create-tableTelefonos', (req, res) => {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS baseTelefonos (
        consecutivo INT AUTO_INCREMENT PRIMARY KEY,
        numero INT,
        cedula VARCHAR(512),
        nombre VARCHAR(512),
        asesor VARCHAR(512),
        detalle VARCHAR(512),
        dia DATE,
        hora TIME,
        comentario VARCHAR(512),
        pre_post_pago VARCHAR(512),
        fijo VARCHAR(512),
        operador_fijo VARCHAR(512),
        operador_movil VARCHAR(512),
        genero VARCHAR(512),
        whatsapp VARCHAR(512),
        cobertura_fijo VARCHAR(512),
        coordenadas VARCHAR(512)
      );
    `;
  
    conexion.query(createTableSQL, (err, result) => {
      if (err) {
        console.error('Error creating table:', err);
        return res.status(500).send('Failed to create table');
      }
      res.send('Table baseTelefonos created successfully');
    });
  });



module.exports = router;