const express = require('express');
const {google} = require("googleapis");
const router = express.Router()

const conexion = require('../database/db');

const authController = require('../controllers/authController')
const UsuarioController = require('../controllers/UsuarioController')
const VentasController = require('../controllers/VentasController');
const NoCache = require('../controllers/noCache');

const moment = require('moment');

/* EDIT BD FIJO */
router.get('/editBDFijo/:rowId', async  (req, res) => {

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
  
    const spreadsheetId = '1TknOQx2VYSYUPBoCIOiK-wFCh9vHXPnlbLUv2FH1RdI';
    const range = `Base Madre!A${rowId}:V${rowId}`;
  
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
      res.render('updateViewBDFijo', { rowId, rowValues }); // Assumes you have an 'update.ejs' view/template
    });
  });
 router.post('/editBDFijo/:rowId', async (req, res) => {

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
      req.body.column22
    ];
  
    // Set up authentication as mentioned in the previous response
  
    const spreadsheetId = '1TknOQx2VYSYUPBoCIOiK-wFCh9vHXPnlbLUv2FH1RdI';
    const range = `Base Madre!A${rowId}:V${rowId}`;
  
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
  
      res.redirect('/bdFijo'); // Redirect to the main page or any other desired location
    });
  });

  /*Fijo BD  No Instaladas*/
  router.get('/FijoNoInstalada', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{
    
    conexion.query('SELECT * FROM TempFijo where Entregada = "No Instalada" AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE() ;', (error, results)=>{
      if(error){
          throw error
      }else{
          res.render('FijoNoInstalada', {results:results, user:req.user})
      }
  })

});
 /*Fijo BD  Instaladas*/
 router.get('/FijoInstalada', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{
    
  conexion.query('SELECT * FROM TempFijo where Entregada = "Instalada" AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE() ;', (error, results)=>{
    if(error){
        throw error
    }else{
        res.render('FijoInstalada', {results:results, user:req.user})
    }
})

});

/*Fijo BD  Instaladas*/
router.get('/FijoPendiente', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{
    
  conexion.query('SELECT * FROM TempFijo where Entregada = "Pendiente" AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE() ;', (error, results)=>{
    if(error){
        throw error
    }else{
        res.render('FijoPendiente', {results:results, user:req.user})
    }
})

});

/*Ventas Vendedor*/
router.get('/FijoVendedor', authController.isAuthenticated, NoCache.nocache, authController.TicocelLVFTIC,  async (req, res)=>{

  const user = req.user;
  
  conexion.query('select * from TempFijo temp join users us on temp.Nombre_Vendedor = us.nombre where temp.Nombre_Vendedor = ? AND temp.Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND temp.Fecha <= CURDATE() ;', [user.nombre], (error, results)=>{
    if(error){
        throw error
    }else{
      console.log(results)
        res.render('FijoVendedor', {results:results, user:req.user})
    }
})

});


/* EDICIONES */
/* Editar Ventas NO Instaladas*/
router.get('/editFijoNoInstalada/:SaleId', async (req, res) => {

  const SaleId = req.params.SaleId

  conexion.query('Select * from TempFijo where SaleId = ?', [SaleId], (error, results)=>{
    if (error) {
      throw error;
    } else {
      let saleData = results[0];
  
      // Assuming the two date fields are `Fecha_Activacion` and `Fecha_Entrega`
      let dbDate1 = saleData.Fecha_Activacion; // Replace `Fecha_Activacion` with your actual date field name
      let dbDate2 = saleData.Fecha_Instalacion; // Replace `Fecha_Entrega` with your actual date field name
  
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
  
      // Add the formatted dates back to the results object or as new fields
      saleData.formattedFechaActivacion = formattedDate1;
      saleData.formattedFechaEntrega = formattedDate2;
  
      // Render the template with the formatted dates
      res.render('editFijoNoInstalada', { SaleId: saleData, user: req.user });
    }
})
});

router.post('/editFijoNoInstalada', (req, res) => {
  const SaleId = req.body.SaleId;

  // Format the date fields as "YYYY/MM/DD"
  const Fecha = moment(req.body.column24).format('YYYY/MM/DD');
  const FechaActivacion = moment(req.body.column33).format('YYYY/MM/DD');
  const FechaInstalacion = moment(req.body.column36).format('YYYY/MM/DD');

  // Rest of the fields
  const data = {
    Nombre_Cliente: req.body.column1,
    Segundo_Nombre_Cliente: req.body.column2,
    Primer_Apellido_Cliente: req.body.column3,
    Segundo_Apellido_Cliente: req.body.column4,
    Correo: req.body.columnC,
    Genero: req.body.column39,
    Documento_Identidad: req.body.column5,
    Numero_Documento: req.body.column6,
    Nacionalidad: req.body.column7,
    Celular_Tramite: req.body.column8,
    Tipo_Tramite: req.body.column9,
    Numero_Contrato: req.body.column10,
    Numero_Abonado: req.body.column11,
    Numero_Contacto_1: req.body.column12,
    Numero_Contacto_2: req.body.column13,
    Plan_Contratar: req.body.column14,
    Financiamiento: req.body.column15,
    Valor_Plan_Diferente: req.body.column16,
    Coordenadas: req.body.column17,
    Direccion_Exacta: req.body.column18,
    Provincia: req.body.column19,
    Canton: req.body.column20,
    Distrito: req.body.column21,
    Tipo_Llamada: req.body.column22,
    Nombre_Vendedor: req.body.column23,
    Fecha: Fecha,
    Vendedor_Freelance: req.body.column25,
    Activada: req.body.column26,
    Entregada: req.body.column27,
    Rechazada: req.body.column28,
    Detalle: req.body.column29,
    Entregador: req.body.column30,
    Estados: req.body.column31,
    Llamada_Activacion: req.body.column32,
    Fecha_Activacion: FechaActivacion,
    Numero_Orden: req.body.column34,
    MES_TRABAJADA: req.body.column35,
    Fecha_Instalacion: FechaInstalacion,
    Red: req.body.column37,
    Pago_Comision: req.body.column38,
    Activadora: req.body.column40
  };

  conexion.query('UPDATE TempFijo SET ? WHERE SaleId = ?', [data, SaleId], (error, results) => {
    if (error) {
      console.error("Error updating the database:", error);
      res.status(500).send("An error occurred while updating the database."); // Handle the error properly
    } else {
      console.log("Updated SaleId:", SaleId);
      res.redirect('FijoNoInstalada');
    }
  });
});

/* Editar Ventas Instaladas*/
router.get('/editFijoInstalada/:SaleId', async (req, res) => {

  const SaleId = req.params.SaleId

  conexion.query('Select * from TempFijo where SaleId = ?', [SaleId], (error, results)=>{
    if (error) {
      throw error;
    } else {
      let saleData = results[0];
  
      // Assuming the two date fields are `Fecha_Activacion` and `Fecha_Entrega`
      let dbDate1 = saleData.Fecha_Activacion; // Replace `Fecha_Activacion` with your actual date field name
      let dbDate2 = saleData.Fecha_Instalacion; // Replace `Fecha_Entrega` with your actual date field name
  
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
  
      // Add the formatted dates back to the results object or as new fields
      saleData.formattedFechaActivacion = formattedDate1;
      saleData.formattedFechaEntrega = formattedDate2;
  
      // Render the template with the formatted dates
      res.render('editFijoInstalada', { SaleId: saleData, user: req.user });
    }
})
});

router.post('/editFijoInstalada', (req, res) => {
  const SaleId = req.body.SaleId;

  // Format the date fields as "YYYY/MM/DD"
  const Fecha = moment(req.body.column24).format('YYYY/MM/DD');
  const FechaActivacion = moment(req.body.column33).format('YYYY/MM/DD');
  const FechaInstalacion = moment(req.body.column36).format('YYYY/MM/DD');

  // Rest of the fields
  const data = {
    Nombre_Cliente: req.body.column1,
    Segundo_Nombre_Cliente: req.body.column2,
    Primer_Apellido_Cliente: req.body.column3,
    Segundo_Apellido_Cliente: req.body.column4,
    Correo: req.body.columnC,
    Genero: req.body.column39,
    Documento_Identidad: req.body.column5,
    Numero_Documento: req.body.column6,
    Nacionalidad: req.body.column7,
    Celular_Tramite: req.body.column8,
    Tipo_Tramite: req.body.column9,
    Numero_Contrato: req.body.column10,
    Numero_Abonado: req.body.column11,
    Numero_Contacto_1: req.body.column12,
    Numero_Contacto_2: req.body.column13,
    Plan_Contratar: req.body.column14,
    Financiamiento: req.body.column15,
    Valor_Plan_Diferente: req.body.column16,
    Coordenadas: req.body.column17,
    Direccion_Exacta: req.body.column18,
    Provincia: req.body.column19,
    Canton: req.body.column20,
    Distrito: req.body.column21,
    Tipo_Llamada: req.body.column22,
    Nombre_Vendedor: req.body.column23,
    Fecha: Fecha,
    Vendedor_Freelance: req.body.column25,
    Activada: req.body.column26,
    Entregada: req.body.column27,
    Rechazada: req.body.column28,
    Detalle: req.body.column29,
    Entregador: req.body.column30,
    Estados: req.body.column31,
    Llamada_Activacion: req.body.column32,
    Fecha_Activacion: FechaActivacion,
    Numero_Orden: req.body.column34,
    MES_TRABAJADA: req.body.column35,
    Fecha_Instalacion: FechaInstalacion,
    Red: req.body.column37,
    Pago_Comision: req.body.column38,
    Activadora: req.body.column40
  };

  conexion.query('UPDATE TempFijo SET ? WHERE SaleId = ?', [data, SaleId], (error, results) => {
    if (error) {
      console.error("Error updating the database:", error);
      res.status(500).send("An error occurred while updating the database."); // Handle the error properly
    } else {
      console.log("Updated SaleId:", SaleId);
      res.redirect('FijoInstalada');
    }
  });
});

/* Editar Ventas Pendiente Instalacion */
router.get('/editFijoPendiente/:SaleId', async (req, res) => {

 
  const SaleId = req.params.SaleId

  conexion.query('Select * from TempFijo where SaleId = ?', [SaleId], (error, results)=>{
    if (error) {
      throw error;
    } else {
      let saleData = results[0];
  
      // Assuming the two date fields are `Fecha_Activacion` and `Fecha_Entrega`
      let dbDate1 = saleData.Fecha_Activacion; // Replace `Fecha_Activacion` with your actual date field name
      let dbDate2 = saleData.Fecha_Instalacion; // Replace `Fecha_Entrega` with your actual date field name
  
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
  
      // Add the formatted dates back to the results object or as new fields
      saleData.formattedFechaActivacion = formattedDate1;
      saleData.formattedFechaEntrega = formattedDate2;
  
      // Render the template with the formatted dates
      res.render('editFijoPendiente', { SaleId: saleData, user: req.user });
    }
})
});

router.post('/editFijoPendiente', (req, res) => {
  const SaleId = req.body.SaleId;

  // Format the date fields as "YYYY/MM/DD"
  const Fecha = moment(req.body.column24).format('YYYY/MM/DD');
  const FechaActivacion = moment(req.body.column33).format('YYYY/MM/DD');
  const FechaInstalacion = moment(req.body.column36).format('YYYY/MM/DD');

  // Rest of the fields
  const data = {
    Nombre_Cliente: req.body.column1,
    Segundo_Nombre_Cliente: req.body.column2,
    Primer_Apellido_Cliente: req.body.column3,
    Segundo_Apellido_Cliente: req.body.column4,
    Correo: req.body.columnC,
    Genero: req.body.column39,
    Documento_Identidad: req.body.column5,
    Numero_Documento: req.body.column6,
    Nacionalidad: req.body.column7,
    Celular_Tramite: req.body.column8,
    Tipo_Tramite: req.body.column9,
    Numero_Contrato: req.body.column10,
    Numero_Abonado: req.body.column11,
    Numero_Contacto_1: req.body.column12,
    Numero_Contacto_2: req.body.column13,
    Plan_Contratar: req.body.column14,
    Financiamiento: req.body.column15,
    Valor_Plan_Diferente: req.body.column16,
    Coordenadas: req.body.column17,
    Direccion_Exacta: req.body.column18,
    Provincia: req.body.column19,
    Canton: req.body.column20,
    Distrito: req.body.column21,
    Tipo_Llamada: req.body.column22,
    Nombre_Vendedor: req.body.column23,
    Fecha: Fecha,
    Vendedor_Freelance: req.body.column25,
    Activada: req.body.column26,
    Entregada: req.body.column27,
    Rechazada: req.body.column28,
    Detalle: req.body.column29,
    Entregador: req.body.column30,
    Estados: req.body.column31,
    Llamada_Activacion: req.body.column32,
    Fecha_Activacion: FechaActivacion,
    Numero_Orden: req.body.column34,
    MES_TRABAJADA: req.body.column35,
    Fecha_Instalacion: FechaInstalacion,
    Red: req.body.column37,
    Pago_Comision: req.body.column38,
    Activadora: req.body.column40
  };

  conexion.query('UPDATE TempFijo SET ? WHERE SaleId = ?', [data, SaleId], (error, results) => {
    if (error) {
      console.error("Error updating the database:", error);
      res.status(500).send("An error occurred while updating the database."); // Handle the error properly
    } else {
      console.log("Updated SaleId:", SaleId);
      res.redirect('FijoPendiente');
    }
  });
});


  /*Lista Vendedores */
  router.get('/listarVentasGoogleFijo', authController.isAuthenticated, NoCache.nocache, authController.TicocelLVFTIC,async (req, res)=>{
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
        range: "Registro_Ventas_Fijo!A2:AJ",
    })
    var user = req.user;
    const rows = ventas.data.values;
    res.render('listarVentasGoogleFijo', {rows, user:user});
    
  })

  /* Register */
  router.get('/registrarVentaFijo', authController.isAuthenticated,NoCache.nocache, authController.TicocelRVF, (req, res)=>{
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


/* Edit POST VENTAS Fijo */
router.get('/editPostVentaFijo/:rowId', async  (req, res) => {

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
  const range = `PostVenta Fijo!A${rowId}:T${rowId}`;

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
    res.render('editarPostVentasFijo', { rowId, rowValues }); // Assumes you have an 'update.ejs' view/template
  });
});

router.post('/editPostVentaFijo/:rowId', async (req, res) => {

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
  const range = `PostVenta Fijo!A${rowId}:T${rowId}`;

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

    res.redirect('/PostVentaFijo'); // Redirect to the main page or any other desired location
  });
});

/* POSTVENTA FIJO */
router.get('/PostVentaFijo', authController.isAuthenticated, NoCache.nocache, authController.TicocelLVFTIC,async (req, res)=>{
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
      range: "PostVenta Fijo!A2:T",
  })

  var user = req.user;
  const rows = ventas.data.values;


  res.render('PostVentaFijo', {rows, user:user});
  
})

/*Colilla Fijo */

router.get('/colillaFijo',  (req, res)=>{
    res.render('colillaFijo', {user:req.user})
})


/* Favtel NIC */

  /* EDITAR BD FIJO FAVTEL NIC */

  router.get('/editBDFijoFAVNIC/:rowId', async  (req, res) => {

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
  
    const spreadsheetId = '1ZcRCzhaHT_DwVUPBVM9p8IqVAePFJjM5VkvPRmw_Cq8';
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
      res.render('UpdateViewBDFijoFAVNIC', { rowId, rowValues }); // Assumes you have an 'update.ejs' view/template
    });
  });
 router.post('/editBDFijoFAVNIC/:rowId', async (req, res) => {

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
  
    const spreadsheetId = '1ZcRCzhaHT_DwVUPBVM9p8IqVAePFJjM5VkvPRmw_Cq8';
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
  
      res.redirect('/BDFijoNICFAV'); // Redirect to the main page or any other desired location
    });
  });

  /* BASE DE DATS FIJO FAVTEL NIC */
router.get('/BDFijoNICFAV',authController.isAuthenticated, NoCache.nocache,  async  (req, res)=>{
  const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

/// client instance for auth
  const client = await auth.getClient();

  /// Instance of google sheets api 
  const googleSheets = google.sheets({ version: "v4", auth: client});


  const spreadsheetId = "1ZcRCzhaHT_DwVUPBVM9p8IqVAePFJjM5VkvPRmw_Cq8";
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


  res.render('BDFijoNICFAV', {rows, user:user});
})


  module.exports = router;