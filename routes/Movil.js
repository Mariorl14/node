const express = require('express');
const {google} = require("googleapis");
const router = express.Router()

const conexion = require('../database/db');

const authController = require('../controllers/authController')
const UsuarioController = require('../controllers/UsuarioController')
const VentasController = require('../controllers/VentasController');
const NoCache = require('../controllers/noCache');
const moment = require('moment');


/*EDITAR HOMEE */
router.get('/editHOME/:rowId', async (req, res) => {
  
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
  
    try {
      const client = await auth.getClient();
      const googleSheets = google.sheets({ version: "v4", auth: client });
  
      const rowId = req.params.rowId;
      const spreadsheetId = '1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY';
      const range = `Respuestas_Formulario!A${rowId}:AV${rowId}`;
  
      const response = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
  
      const rowValues = response.data.values ? response.data.values[0] : null;
      
      if (!rowValues) {
        res.send('No data found for the specified row.');
        return;
      }
  
      res.render('editarHOME', { rowId, rowValues });
    } catch (err) {
      console.error('Error accessing Google Sheets API:', err);
      res.send('Error retrieving row data');
    }
  });
router.post('/editHOME/:rowId', async (req, res) => {
  
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
        req.body.column42,
        req.body.column43,
        req.body.column44,
        req.body.column45,
        req.body.column46,
        req.body.column47,
        req.body.column48
      ];
    
      // Set up authentication as mentioned in the previous response
    
      const spreadsheetId = '1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY';
      const range = `Respuestas_Formulario!A${rowId}:AV${rowId}`;
    
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
    
        res.redirect('/home'); // Redirect to the main page or any other desired location
      });
    });

    /*HOME */
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
          range: "Respuestas_Formulario!A2:AN",
      })
  
      var user = req.user;
      const rows = ventas.data.values;
  
      if(rows==undefined){
          rows="";
      }
      let query1 = 'SELECT * FROM users';
      let results = {};
      
      conexion.query(query1, (error, data) => {
          if (error) {
              throw error;
          } else {
              results.users = data;
              // check if the second query has also been executed
                  res.render('home', {rows:rows, data: results, user: req.user });
          }
      });
  
      
  
  });

  /*HOME BD  No activadas*/
  router.get('/homeTest', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{
    
    conexion.query('SELECT * FROM VentasMovil where Activada = "No Activada" AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH) AND Fecha <= CURDATE();', (error, results)=>{
      if(error){
          throw error
      }else{
          res.render('homeTest', {results:results, user:req.user})
      }
  })

});

 /*Ventas Vendedor*/
 router.get('/MovilVendedor', authController.isAuthenticated, NoCache.nocache, authController.TicocelLVFTIC,  async (req, res)=>{

  const user = req.user;
  
  conexion.query('select * from VentasMovil temp join users us on temp.Nombre_Vendedor = us.nombre where temp.Nombre_Vendedor = ? AND temp.Fecha >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH) AND temp.Fecha <= CURDATE() ;', [user.nombre], (error, results)=>{
    if(error){
        throw error
    }else{
      console.log(results)
        res.render('MovilVendedor', {results:results, user:req.user})
    }
})

});

 /*HOME BD Activadas */
 router.get('/Activadas', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{

  /* AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE() ; */
    
  conexion.query('SELECT * FROM VentasMovil where Activada = "Activada" AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH) AND Fecha <= CURDATE();', (error, results)=>{
    if(error){
        throw error
    }else{
        res.render('Activadas', {results:results, user:req.user})
    }
})

});

/*HOME BD Pendientes Activacion */
router.get('/PendientesActivacion', authController.isAuthenticated, authController.authRol, NoCache.nocache, async (req, res) => {

  /*AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE(); */
  conexion.query('SELECT * FROM VentasMovil WHERE Activada = "Pendiente" AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH) AND Fecha <= CURDATE();', (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render('PendientesActivacion', { results: results, user: req.user }); // Ensure results is passed here
    }
  });
});


/*HOME BD Pendientes Entrega */
router.get('/PendientesEntrega', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{
  
  /* AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE() ; */

  conexion.query('SELECT * FROM VentasMovil where Entregada = "Pendiente" AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH) AND Fecha <= CURDATE();', (error, results)=>{
    if(error){
        throw error
    }else{
        res.render('PendientesEntrega', {results:results, user:req.user})
    }
})

});

/*HOME BD Pendientes Activacion */
router.get('/PendientesEntregaYactivacion', authController.isAuthenticated, authController.authRol, NoCache.nocache, async (req, res) => {

  /*AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE(); */
  conexion.query('SELECT * FROM VentasMovil WHERE Activada = "Pendiente" AND Entregada = "Pendiente" AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE();', (error, results) => {
    if (error) {
      throw error;
    } else {
      res.render('PendientesEntregaYactivacion', { results: results, user: req.user }); // Ensure results is passed here
    }
  });
});

/* Editar Ventas NO Activadas*/
router.get('/editHOME1/:SaleId', async (req, res) => {

  const SaleId = req.params.SaleId

  conexion.query('Select * from VentasMovil where SaleId = ?', [SaleId], (error, results)=>{
    if (error) {
      throw error;
    } else {
      let saleData = results[0];
  
      // Assuming the two date fields are `Fecha_Activacion` and `Fecha_Entrega`
      let dbDate1 = saleData.Fecha_Activacion; // Replace `Fecha_Activacion` with your actual date field name
      let dbDate2 = saleData.Fecha_Entrega; // Replace `Fecha_Entrega` with your actual date field name
      let dbDate3 = saleData.Fecha_Ultima_Actualizacion; // Replace `Fecha_Entrega` with your actual date field name
  
      // Helper function to handle date formatting
      function processDate(date) {
        if (date && date.endsWith('/00')) {
          date = date.replace('/00', '/01');
        }
        return formatDateToYYYYMMDD(date);
      }
  
      // Function to format the date from "YYYY/MM/DD" to "YYYY-MM-DD"
      function formatDateToYYYYMMDD(dateString) {
        // Use moment to parse the date with explicit format
        const momentDate = moment(dateString, 'YYYY/MM/DD');
        if (!momentDate.isValid()) {
          return ''; // Return empty or handle invalid date cases
        }
        return momentDate.format('YYYY-MM-DD');
      }
  
      // Format both dates
      const formattedDate1 = processDate(dbDate1);
      const formattedDate2 = processDate(dbDate2);
      const formattedDate3 = processDate(dbDate3);
  
      // Add the formatted dates back to the results object or as new fields
      saleData.formattedFechaActivacion = formattedDate1;
      saleData.formattedFechaEntrega = formattedDate2;
      saleData.formattedFechaUltimaActualizacion = formattedDate3;
  
      // Render the template with the formatted dates
      res.render('editarHOME1', { SaleId: saleData, user: req.user });
    }
})
});

router.post('/editNOActivadas', (req, res) => {
  const SaleId = req.body.SaleId;

  // Format the date fields as "YYYY/MM/DD"
  const Fecha = moment(req.body.column23).format('YYYY/MM/DD');
  var FechaActivacion = moment(req.body.column33).format('YYYY/MM/DD');
  var FechaEntrega = moment(req.body.column34).format('YYYY/MM/DD');
  var FechaUltimaActualizacion = moment(req.body.FechaUA).format('YYYY/MM/DD');

  if(FechaActivacion == "Invalid date"){
   var FechaActivacion1 = null
  }else{
    FechaActivacion1 = FechaActivacion
  }

  if(FechaEntrega == "Invalid date"){
    var FechaEntrega1 = null
   }else{
    FechaEntrega1 = FechaEntrega
   }

   if(FechaUltimaActualizacion == "Invalid date"){
    var FechaUltimaActualizacion1 = null
   }else{
    FechaUltimaActualizacion1 = FechaUltimaActualizacion
   }

  // Rest of the fields
  const data = {
    Nombre_Cliente: req.body.column1,
    Segundo_Nombre_Cliente: req.body.column2,
    Primer_Apellido_Cliente: req.body.column3,
    Segundo_Apellido_Cliente: req.body.column4,
    Documento_Identidad: req.body.column5,
    Numero_Documento: req.body.column6,
    Nacionalidad: req.body.column7,
    Celular_Tramite: req.body.column8,
    Tipo_Tramite: req.body.column9,
    Numero_Contrato: req.body.column10,
    Numero_Abonado: req.body.column11,
    Numero_Contacto_1: req.body.column12,
    Numero_Contacto_2: req.body.column13,
    Portabilidad: req.body.column14,
    Plan_Contratar: req.body.column15,
    Valor_Plan: req.body.column16,
    Direccion_Exacta: req.body.column17,
    Provincia: req.body.column18,
    Canton: req.body.column19,
    Distrito: req.body.column20,
    Tipo_Llamada: req.body.column21,
    Nombre_Vendedor: req.body.column22,
    Fecha: Fecha,
    Vendedor_Freelance: req.body.column24,
    Cobro_Envío: req.body.column25,
    Activada: req.body.column26,
    Entregada: req.body.column27,
    Rechazada: req.body.column28,
    Detalle: req.body.column29,
    Entregador: req.body.column30,
    Estados: req.body.column31,
    Llamada_Activacion: req.body.column32,
    Fecha_Activacion: FechaActivacion1,
    Fecha_Entrega: req.body.column34,
    Primera_Revision: req.body.column35,
    Segunda_Revision: req.body.column36,
    NIP: req.body.column37,
    Detalle_Activacion: req.body.column38,
    MOVICHECK: req.body.column39,
    Fecha_Entrega: FechaEntrega1,
    Bloqueo_Desbloqueo: req.body.column40,
    Activadora: req.body.column41,
    MES_TRABAJADA: req.body.column42,
    Terminal: req.body.column43,
    Pago_Comision: req.body.column44,
    Numero_Provisional: req.body.column45,
    Genero: req.body.column45,
    Numero_Provisional: req.body.column45,
    Genero: req.body.Genero,
    Correo_Cliente: req.body.Correo,
    Fecha_Ultima_Actualizacion: FechaUltimaActualizacion1,
    Modelo_Terminal: req.body.Modelo_Terminal,
    Tipo_Cliente: req.body.tipoCliente
  };
console.log(data.Fecha_Activacion)
  conexion.query('UPDATE VentasMovil SET ? WHERE SaleId = ?', [data, SaleId], (error, results) => {
    if (error) {
      console.error("Error updating the database:", error);
      res.status(500).send("An error occurred while updating the database."); // Handle the error properly
    } else {
      console.log("Updated SaleId:", SaleId);
      res.redirect('homeTest');
    }
  });
});

/* Editar Ventas Activadas*/
router.get('/editActivadas/:SaleId', async (req, res) => {

  const SaleId = req.params.SaleId

  conexion.query('Select * from VentasMovil where SaleId = ?', [SaleId], (error, results)=>{
    if (error) {
      throw error;
    } else {
      let saleData = results[0];
  
      // Assuming the two date fields are `Fecha_Activacion` and `Fecha_Entrega`
      let dbDate1 = saleData.Fecha_Activacion; // Replace `Fecha_Activacion` with your actual date field name
      let dbDate2 = saleData.Fecha_Entrega; // Replace `Fecha_Entrega` with your actual date field name
      let dbDate3 = saleData.Fecha_Ultima_Actualizacion; // Replace `Fecha_Entrega` with your actual date field name
  
      // Helper function to handle date formatting
      function processDate(date) {
        if (date && date.endsWith('/00')) {
          date = date.replace('/00', '/01');
        }
        return formatDateToYYYYMMDD(date);
      }
  
      // Function to format the date from "YYYY/MM/DD" to "YYYY-MM-DD"
      function formatDateToYYYYMMDD(dateString) {
        // Use moment to parse the date with explicit format
        const momentDate = moment(dateString, 'YYYY/MM/DD');
        if (!momentDate.isValid()) {
          return ''; // Return empty or handle invalid date cases
        }
        return momentDate.format('YYYY-MM-DD');
      }
  
      // Format both dates
      const formattedDate1 = processDate(dbDate1);
      const formattedDate2 = processDate(dbDate2);
      const formattedDate3 = processDate(dbDate3);
  
      // Add the formatted dates back to the results object or as new fields
      saleData.formattedFechaActivacion = formattedDate1;
      saleData.formattedFechaEntrega = formattedDate2;
      saleData.formattedFechaUltimaActualizacion = formattedDate3;
  
      // Render the template with the formatted dates
      res.render('editarActivadas', { SaleId: saleData, user: req.user });
    }
})

});

router.post('/editActivadas', (req, res) => {
  const SaleId = req.body.SaleId;

  // Format the date fields as "YYYY/MM/DD"
  const Fecha = moment(req.body.column23).format('YYYY/MM/DD');
  var FechaActivacion = moment(req.body.column33).format('YYYY/MM/DD');
  var FechaEntrega = moment(req.body.column34).format('YYYY/MM/DD');
  var FechaUltimaActualizacion = moment(req.body.FechaUA).format('YYYY/MM/DD');

  if(FechaActivacion == "Invalid date"){
   var FechaActivacion1 = null
  }else{
    FechaActivacion1 = FechaActivacion
  }

  if(FechaEntrega == "Invalid date"){
    var FechaEntrega1 = null
   }else{
    FechaEntrega1 = FechaEntrega
   }

   if(FechaUltimaActualizacion == "Invalid date"){
    var FechaUltimaActualizacion1 = null
   }else{
    FechaUltimaActualizacion1 = FechaUltimaActualizacion
   }

  // Rest of the fields
  const data = {
    Nombre_Cliente: req.body.column1,
    Segundo_Nombre_Cliente: req.body.column2,
    Primer_Apellido_Cliente: req.body.column3,
    Segundo_Apellido_Cliente: req.body.column4,
    Documento_Identidad: req.body.column5,
    Numero_Documento: req.body.column6,
    Nacionalidad: req.body.column7,
    Celular_Tramite: req.body.column8,
    Tipo_Tramite: req.body.column9,
    Numero_Contrato: req.body.column10,
    Numero_Abonado: req.body.column11,
    Numero_Contacto_1: req.body.column12,
    Numero_Contacto_2: req.body.column13,
    Portabilidad: req.body.column14,
    Plan_Contratar: req.body.column15,
    Valor_Plan: req.body.column16,
    Direccion_Exacta: req.body.column17,
    Provincia: req.body.column18,
    Canton: req.body.column19,
    Distrito: req.body.column20,
    Tipo_Llamada: req.body.column21,
    Nombre_Vendedor: req.body.column22,
    Fecha: Fecha,
    Vendedor_Freelance: req.body.column24,
    Cobro_Envío: req.body.column25,
    Activada: req.body.column26,
    Entregada: req.body.column27,
    Rechazada: req.body.column28,
    Detalle: req.body.column29,
    Entregador: req.body.column30,
    Estados: req.body.column31,
    Llamada_Activacion: req.body.column32,
    Fecha_Activacion: FechaActivacion1,
    Fecha_Entrega: req.body.column34,
    Primera_Revision: req.body.column35,
    Segunda_Revision: req.body.column36,
    NIP: req.body.column37,
    Detalle_Activacion: req.body.column38,
    MOVICHECK: req.body.column39,
    Fecha_Entrega: FechaEntrega1,
    Bloqueo_Desbloqueo: req.body.column40,
    Activadora: req.body.column41,
    MES_TRABAJADA: req.body.column42,
    Terminal: req.body.column43,
    Pago_Comision: req.body.column44,
    Numero_Provisional: req.body.column45,
    Genero: req.body.column45,
    Numero_Provisional: req.body.column45,
    Genero: req.body.Genero,
    Correo_Cliente: req.body.Correo,
    Fecha_Ultima_Actualizacion: FechaUltimaActualizacion1,
    Modelo_Terminal: req.body.Modelo_Terminal,
    Tipo_Cliente: req.body.tipoCliente
  };
console.log(data.Fecha_Activacion)
  conexion.query('UPDATE VentasMovil SET ? WHERE SaleId = ?', [data, SaleId], (error, results) => {
    if (error) {
      console.error("Error updating the database:", error);
      res.status(500).send("An error occurred while updating the database."); // Handle the error properly
    } else {
      console.log("Updated SaleId:", SaleId);
      res.redirect('Activadas');
    }
  });
});

/* Editar Ventas Pendientes Activacion*/
router.get('/editPendientesActivacion/:SaleId', async (req, res) => {

  const SaleId = req.params.SaleId

  conexion.query('Select * from VentasMovil where SaleId = ?', [SaleId], (error, results)=>{
    if (error) {
      throw error;
    } else {
      let saleData = results[0];
  
      // Assuming the two date fields are `Fecha_Activacion` and `Fecha_Entrega`
      let dbDate1 = saleData.Fecha_Activacion; // Replace `Fecha_Activacion` with your actual date field name
      let dbDate2 = saleData.Fecha_Entrega; // Replace `Fecha_Entrega` with your actual date field name
      let dbDate3 = saleData.Fecha_Ultima_Actualizacion; // Replace `Fecha_Entrega` with your actual date field name
  
      // Helper function to handle date formatting
      function processDate(date) {
        if (date && date.endsWith('/00')) {
          date = date.replace('/00', '/01');
        }
        return formatDateToYYYYMMDD(date);
      }
  
      // Function to format the date from "YYYY/MM/DD" to "YYYY-MM-DD"
      function formatDateToYYYYMMDD(dateString) {
        // Use moment to parse the date with explicit format
        const momentDate = moment(dateString, 'YYYY/MM/DD');
        if (!momentDate.isValid()) {
          return ''; // Return empty or handle invalid date cases
        }
        return momentDate.format('YYYY-MM-DD');
      }
  
      // Format both dates
      const formattedDate1 = processDate(dbDate1);
      const formattedDate2 = processDate(dbDate2);
      const formattedDate3 = processDate(dbDate3);
  
      // Add the formatted dates back to the results object or as new fields
      saleData.formattedFechaActivacion = formattedDate1;
      saleData.formattedFechaEntrega = formattedDate2;
      saleData.formattedFechaUltimaActualizacion = formattedDate3;
  
      // Render the template with the formatted dates
      res.render('editarPendientesActivacion', { SaleId: saleData, user: req.user });
    }
})

});

router.post('/editPendientesActivacion', (req, res) => {
  const SaleId = req.body.SaleId;

  // Format the date fields as "YYYY/MM/DD"
  const Fecha = moment(req.body.column23).format('YYYY/MM/DD');
  var FechaActivacion = moment(req.body.column33).format('YYYY/MM/DD');
  var FechaEntrega = moment(req.body.column34).format('YYYY/MM/DD');
  var FechaUltimaActualizacion = moment(req.body.FechaUA).format('YYYY/MM/DD');

  if(FechaActivacion == "Invalid date"){
   var FechaActivacion1 = null
  }else{
    FechaActivacion1 = FechaActivacion
  }

  if(FechaEntrega == "Invalid date"){
    var FechaEntrega1 = null
   }else{
    FechaEntrega1 = FechaEntrega
   }

   if(FechaUltimaActualizacion == "Invalid date"){
    var FechaUltimaActualizacion1 = null
   }else{
    FechaUltimaActualizacion1 = FechaUltimaActualizacion
   }

  // Rest of the fields
  const data = {
    Nombre_Cliente: req.body.column1,
    Segundo_Nombre_Cliente: req.body.column2,
    Primer_Apellido_Cliente: req.body.column3,
    Segundo_Apellido_Cliente: req.body.column4,
    Documento_Identidad: req.body.column5,
    Numero_Documento: req.body.column6,
    Nacionalidad: req.body.column7,
    Celular_Tramite: req.body.column8,
    Tipo_Tramite: req.body.column9,
    Numero_Contrato: req.body.column10,
    Numero_Abonado: req.body.column11,
    Numero_Contacto_1: req.body.column12,
    Numero_Contacto_2: req.body.column13,
    Portabilidad: req.body.column14,
    Plan_Contratar: req.body.column15,
    Valor_Plan: req.body.column16,
    Direccion_Exacta: req.body.column17,
    Provincia: req.body.column18,
    Canton: req.body.column19,
    Distrito: req.body.column20,
    Tipo_Llamada: req.body.column21,
    Nombre_Vendedor: req.body.column22,
    Fecha: Fecha,
    Vendedor_Freelance: req.body.column24,
    Cobro_Envío: req.body.column25,
    Activada: req.body.column26,
    Entregada: req.body.column27,
    Rechazada: req.body.column28,
    Detalle: req.body.column29,
    Entregador: req.body.column30,
    Estados: req.body.column31,
    Llamada_Activacion: req.body.column32,
    Fecha_Activacion: FechaActivacion1,
    Fecha_Entrega: req.body.column34,
    Primera_Revision: req.body.column35,
    Segunda_Revision: req.body.column36,
    NIP: req.body.column37,
    Detalle_Activacion: req.body.column38,
    MOVICHECK: req.body.column39,
    Fecha_Entrega: FechaEntrega1,
    Bloqueo_Desbloqueo: req.body.column40,
    Activadora: req.body.column41,
    MES_TRABAJADA: req.body.column42,
    Terminal: req.body.column43,
    Pago_Comision: req.body.column44,
    Numero_Provisional: req.body.column45,
    Genero: req.body.column45,
    Numero_Provisional: req.body.column45,
    Genero: req.body.Genero,
    Correo_Cliente: req.body.Correo,
    Fecha_Ultima_Actualizacion: FechaUltimaActualizacion1,
    Modelo_Terminal: req.body.Modelo_Terminal,
    Tipo_Cliente: req.body.tipoCliente
  };
console.log(data.Fecha_Activacion)
  conexion.query('UPDATE VentasMovil SET ? WHERE SaleId = ?', [data, SaleId], (error, results) => {
    if (error) {
      console.error("Error updating the database:", error);
      res.status(500).send("An error occurred while updating the database."); // Handle the error properly
    } else {
      console.log("Updated SaleId:", SaleId);
      res.redirect('PendientesActivacion');
    }
  });
});

/* Editar Ventas Pendientes Entrega*/
router.get('/editPendientesEntrega/:SaleId', async (req, res) => {

  const SaleId = req.params.SaleId

  conexion.query('Select * from VentasMovil where SaleId = ?', [SaleId], (error, results)=>{
    if (error) {
      throw error;
    } else {
      let saleData = results[0];
  
      // Assuming the two date fields are `Fecha_Activacion` and `Fecha_Entrega`
      let dbDate1 = saleData.Fecha_Activacion; // Replace `Fecha_Activacion` with your actual date field name
      let dbDate2 = saleData.Fecha_Entrega; // Replace `Fecha_Entrega` with your actual date field name
      let dbDate3 = saleData.Fecha_Ultima_Actualizacion; // Replace `Fecha_Entrega` with your actual date field name
  
      // Helper function to handle date formatting
      function processDate(date) {
        if (date && date.endsWith('/00')) {
          date = date.replace('/00', '/01');
        }
        return formatDateToYYYYMMDD(date);
      }
  
      // Function to format the date from "YYYY/MM/DD" to "YYYY-MM-DD"
      function formatDateToYYYYMMDD(dateString) {
        // Use moment to parse the date with explicit format
        const momentDate = moment(dateString, 'YYYY/MM/DD');
        if (!momentDate.isValid()) {
          return ''; // Return empty or handle invalid date cases
        }
        return momentDate.format('YYYY-MM-DD');
      }
  
      // Format both dates
      const formattedDate1 = processDate(dbDate1);
      const formattedDate2 = processDate(dbDate2);
      const formattedDate3 = processDate(dbDate3);
  
      // Add the formatted dates back to the results object or as new fields
      saleData.formattedFechaActivacion = formattedDate1;
      saleData.formattedFechaEntrega = formattedDate2;
      saleData.formattedFechaUltimaActualizacion = formattedDate3;
  
      // Render the template with the formatted dates
      res.render('editarPendientesEntrega', { SaleId: saleData, user: req.user });
    }
})

});

router.post('/editPendientesEntrega', (req, res) => {
  const SaleId = req.body.SaleId;

  // Format the date fields as "YYYY/MM/DD"
  const Fecha = moment(req.body.column23).format('YYYY/MM/DD');
  var FechaActivacion = moment(req.body.column33).format('YYYY/MM/DD');
  var FechaEntrega = moment(req.body.column34).format('YYYY/MM/DD');
  var FechaUltimaActualizacion = moment(req.body.FechaUA).format('YYYY/MM/DD');

  if(FechaActivacion == "Invalid date"){
   var FechaActivacion1 = null
  }else{
    FechaActivacion1 = FechaActivacion
  }

  if(FechaEntrega == "Invalid date"){
    var FechaEntrega1 = null
   }else{
    FechaEntrega1 = FechaEntrega
   }

   if(FechaUltimaActualizacion == "Invalid date"){
    var FechaUltimaActualizacion1 = null
   }else{
    FechaUltimaActualizacion1 = FechaUltimaActualizacion
   }

  // Rest of the fields
  const data = {
    Nombre_Cliente: req.body.column1,
    Segundo_Nombre_Cliente: req.body.column2,
    Primer_Apellido_Cliente: req.body.column3,
    Segundo_Apellido_Cliente: req.body.column4,
    Documento_Identidad: req.body.column5,
    Numero_Documento: req.body.column6,
    Nacionalidad: req.body.column7,
    Celular_Tramite: req.body.column8,
    Tipo_Tramite: req.body.column9,
    Numero_Contrato: req.body.column10,
    Numero_Abonado: req.body.column11,
    Numero_Contacto_1: req.body.column12,
    Numero_Contacto_2: req.body.column13,
    Portabilidad: req.body.column14,
    Plan_Contratar: req.body.column15,
    Valor_Plan: req.body.column16,
    Direccion_Exacta: req.body.column17,
    Provincia: req.body.column18,
    Canton: req.body.column19,
    Distrito: req.body.column20,
    Tipo_Llamada: req.body.column21,
    Nombre_Vendedor: req.body.column22,
    Fecha: Fecha,
    Vendedor_Freelance: req.body.column24,
    Cobro_Envío: req.body.column25,
    Activada: req.body.column26,
    Entregada: req.body.column27,
    Rechazada: req.body.column28,
    Detalle: req.body.column29,
    Entregador: req.body.column30,
    Estados: req.body.column31,
    Llamada_Activacion: req.body.column32,
    Fecha_Activacion: FechaActivacion1,
    Fecha_Entrega: req.body.column34,
    Primera_Revision: req.body.column35,
    Segunda_Revision: req.body.column36,
    NIP: req.body.column37,
    Detalle_Activacion: req.body.column38,
    MOVICHECK: req.body.column39,
    Fecha_Entrega: FechaEntrega1,
    Bloqueo_Desbloqueo: req.body.column40,
    Activadora: req.body.column41,
    MES_TRABAJADA: req.body.column42,
    Terminal: req.body.column43,
    Pago_Comision: req.body.column44,
    Numero_Provisional: req.body.column45,
    Genero: req.body.column45,
    Numero_Provisional: req.body.column45,
    Genero: req.body.Genero,
    Correo_Cliente: req.body.Correo,
    Fecha_Ultima_Actualizacion: FechaUltimaActualizacion1,
    Modelo_Terminal: req.body.Modelo_Terminal,
    Tipo_Cliente: req.body.tipoCliente
  };
console.log(data.Fecha_Activacion)
  conexion.query('UPDATE VentasMovil SET ? WHERE SaleId = ?', [data, SaleId], (error, results) => {
    if (error) {
      console.error("Error updating the database:", error);
      res.status(500).send("An error occurred while updating the database."); // Handle the error properly
    } else {
      console.log("Updated SaleId:", SaleId);
      res.redirect('PendientesEntrega');
    }
  });
});



/*Register */
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

/* Lista ventas Vendedores */
router.get('/listarVentasGoogle', authController.isAuthenticated, NoCache.nocache, authController.TicocelLVFTIC,  async (req, res)=>{
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
      range: "Respuestas_Formulario!A2:AJ",
  })

  var user = req.user;
  const rows = ventas.data.values;


  res.render('listarVentasGoogle', {rows, user:user});
  
})

  /* Edit POST VENTAS Movil */
  router.get('/editPostVentaMovil/:rowId', async  (req, res) => {

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
    const range = `PostVenta Movil!A${rowId}:T${rowId}`;
  
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
      res.render('editarPostVentasMovil', { rowId, rowValues }); // Assumes you have an 'update.ejs' view/template
    });
  });

  router.post('/editPostVentaMovil/:rowId', async (req, res) => {

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
      req.body.column20
    ];
  
    // Set up authentication as mentioned in the previous response
  
    const spreadsheetId = '1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY';
    const range = `PostVenta Movil!A${rowId}:T${rowId}`;
  
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
  
      res.redirect('/PostVentaMovil'); // Redirect to the main page or any other desired location
    });
  });

  /* POSTVENTA MOVIL */
router.get('/PostVentaMovil', authController.isAuthenticated, NoCache.nocache, authController.TicocelLVFTIC,async (req, res)=>{
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
      range: "PostVenta Movil!A2:T",
  })

  var user = req.user;
  const rows = ventas.data.values;


  res.render('PostVentaMovil', {rows, user:user});
  
})

/*Colilla */
router.get('/colilla',  (req, res)=>{
  res.render('colilla', {user:req.user})
})

    module.exports = router;