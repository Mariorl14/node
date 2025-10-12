const express = require('express');
const {google} = require("googleapis");
const router = express.Router()
const moment = require('moment');
const conexion = require('../database/db');

const authController = require('../controllers/authController')
const UsuarioController = require('../controllers/UsuarioController')
const VentasController = require('../controllers/VentasController');
const NoCache = require('../controllers/noCache');
const rolemiddlware = require('../controllers/roleMiddlware')


/* Visualizacion */
router.get('/bdFijo',authController.isAuthenticated, NoCache.nocache, rolemiddlware.TicocelBDF, rolemiddlware.authRolFavtelNIC,  async  (req, res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
  
  /// client instance for auth
    const client = await auth.getClient();
  
    /// Instance of google sheets api 
    const googleSheets = google.sheets({ version: "v4", auth: client});
  
  
    const spreadsheetId = "1TknOQx2VYSYUPBoCIOiK-wFCh9vHXPnlbLUv2FH1RdI";
    // Get DATA 
  
  
  
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });
  
    /// rows from spreadsheet
  
   
  
    const ventas = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Base Madre!A2:S",
    })
  
    var user = req.user;
    const rows = ventas.data.values;
  
  
    res.render('bdFijo', {rows, user:user});
  })

   /*EDITAR BASE FIJO */
   router.get('/editVentasFijo/:rowId', async  (req, res) => {

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
    const range = `Registro_Ventas_Fijo!A${rowId}:AP${rowId}`;
  
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
      res.render('editarListaFijo', { rowId, rowValues }); // Assumes you have an 'update.ejs' view/template
    });
  });

  router.post('/editVentasFijo/:rowId', async (req, res) => {

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
      req.body.column37,
      req.body.column38,
      req.body.column39,
      req.body.column40,
      req.body.column41,
      req.body.column42
    ];
  
    // Set up authentication as mentioned in the previous response
  
    const spreadsheetId = '1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY';
    const range = `Registro_Ventas_Fijo!A${rowId}:AP${rowId}`;
  
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
  
      res.redirect('/ListarVentasGoogleFijo'); // Redirect to the main page or any other desired location
    });
  });

  router.get('/baseFijo', authController.isAuthenticated, NoCache.nocache,  async (req, res)=>{
try {
    const userName = req.user.nombre;
    const userRole = req.user.rol;

    let sql;
    let params = [];

    // If not admin, show only their own records
    if (userRole !== 'admin') {
      sql = 'SELECT * FROM baseFijo WHERE asesor = ?';
      params = [userName];
    } else {
      sql = 'SELECT * FROM baseFijo';
    }

    const [results] = await conexion.query(sql, params);

    res.render('baseFijo', { results, user: req.user });
  } catch (error) {
    console.error('❌ Error loading baseFijo:', error);
    res.status(500).send('Error loading baseFijo');
  }
  });

  /* Editar Ventas Activadas*/
  router.get('/editBaseFijo/:consecutivo', authController.isAuthenticated, (req, res) => {
    const consecutivo = req.params.consecutivo;
  
    conexion.query('SELECT * FROM baseFijo WHERE consecutivo = ?', [consecutivo], (error, results) => {
      if (error) {
        throw error;
      } else if (results.length === 0) {
        return res.status(404).send("Registro no encontrado");
      }
  
      let saleData = results[0];
  
      // Format date and time fields for HTML inputs
      saleData.formattedDia = saleData.dia ? moment(saleData.dia).format('YYYY-MM-DD') : '';
      saleData.formattedHora = saleData.hora ? moment(saleData.hora, 'HH:mm:ss').format('HH:mm') : '';
  
      res.render('EditarBaseFijo', { SaleId: saleData, user: req.user });
    });
  });

  router.post('/editBaseFijo', authController.isAuthenticated, (req, res) => {
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
  
    conexion.query('UPDATE baseFIjo SET ? WHERE consecutivo = ?', [data, consecutivo], (error, results) => {
      if (error) {
        console.error("Error updating:", error);
        res.status(500).send("Error updating data.");
      } else {
        console.log("Updated record consecutivo:", consecutivo);
        res.redirect('/baseFijo');
      }
    });
  });

  router.post('/delete-databaseFijo', (req, res) => {
    const databaseName = 'baseFijo'; // set your DB name
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
  
  router.post('/create-tableFijo', (req, res) => {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS baseFijo (
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
      res.send('Table baseFijo created successfully');
    });
  });

  /*test */

  module.exports = router;