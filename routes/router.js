const express = require('express');
const {google} = require("googleapis");
const apiKey = 'AIzaSyDelxqh4i74UrJ1Rpdbxv91a8ksOgUGOEI';
const {promisify} = require('util');
const puppeteer = require('puppeteer');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });
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
router.get('/prueba', (req, res)=>{
  res.render('prueba' )
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
        range: "Respuestas_Formulario!A2:AL",
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

    

})
router.get('/revenue', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{
    
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
      range: "Revenue Mayo 2023!A2:U",
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
              res.render('revenue', {rows:rows, data: results, user: req.user });
      }
  });

  

})
router.get('/revenueJunio', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{
    
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
      range: "Revenue Junio 2023!A2:Y",
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
              res.render('revenueJunio', {rows:rows, data: results, user: req.user });
      }
  });

  

})
router.get('/register', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{
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
router.get('/bdClaro',authController.isAuthenticated, NoCache.nocache, async  (req, res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

/// client instance for auth
    const client = await auth.getClient();

    /// Instance of google sheets api 
    const googleSheets = google.sheets({ version: "v4", auth: client});


    const spreadsheetId = "1JsoU_l8-T_KUuNs-7xyMxFE41mipBPo6OReUJ-VTFt8";
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


    res.render('bdClaro', {rows, user:user});
})
router.get('/bdFijo',authController.isAuthenticated, NoCache.nocache,  async  (req, res)=>{
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
router.get('/bdKolbi',authController.isAuthenticated, NoCache.nocache, async  (req, res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

/// client instance for auth
    const client = await auth.getClient();

    /// Instance of google sheets api 
    const googleSheets = google.sheets({ version: "v4", auth: client});


    const spreadsheetId = "1UabxXfeqYaGg9vV4vTDaVj8ZwNyjdFw9wIJ-BZVpqgg";
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


    res.render('bdKolbi', {rows, user:user});
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
        range: "Respuestas_Formulario!A2:AJ",
    })

    var user = req.user;
    const rows = ventas.data.values;


    res.render('listarVentasGoogle', {rows, user:user});
    
})
router.get('/listarVentasGoogleFijo', authController.isAuthenticated, NoCache.nocache,async (req, res)=>{
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

   

    const ventasResponse  = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Gerencial!A2:AP",
    })

    var user = req.user;
    const userName = req.user.nombre; // Name of the user to filter by


    const ventas = ventasResponse.data.values || [];
const filteredData = ventas.filter((row) => row[0] === userName);

const rows = filteredData;


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

/* editar base CLARO */
router.get('/edit/:rowId', async  (req, res) => {

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
  
    const spreadsheetId = '1JsoU_l8-T_KUuNs-7xyMxFE41mipBPo6OReUJ-VTFt8';
    const range = `Base Madre!A${rowId}:L${rowId}`;
  
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
      res.render('updateViewBD', { rowId, rowValues }); // Assumes you have an 'update.ejs' view/template
    });
  });
 router.post('/edit/:rowId', async (req, res) => {

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
    ];
  
    // Set up authentication as mentioned in the previous response
  
    const spreadsheetId = '1JsoU_l8-T_KUuNs-7xyMxFE41mipBPo6OReUJ-VTFt8';
    const range = `Base Madre!A${rowId}:L${rowId}`;
  
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
  
      res.redirect('/bdClaro'); // Redirect to the main page or any other desired location
    });
  });
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
    ];
  
    // Set up authentication as mentioned in the previous response
  
    const spreadsheetId = '1TknOQx2VYSYUPBoCIOiK-wFCh9vHXPnlbLUv2FH1RdI';
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
  
      res.redirect('/bdFijo'); // Redirect to the main page or any other desired location
    });
  });
/*eDITAR BASE KOLBIII */
  router.get('/editKolbi/:rowId', async  (req, res) => {

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
  
    const spreadsheetId = '1UabxXfeqYaGg9vV4vTDaVj8ZwNyjdFw9wIJ-BZVpqgg';
    const range = `Base Madre!A${rowId}:L${rowId}`;
  
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
      res.render('updateViewBDKolbi', { rowId, rowValues }); // Assumes you have an 'update.ejs' view/template
    });
  });

  router.post('/editKolbi/:rowId', async (req, res) => {

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
    ];
  
    // Set up authentication as mentioned in the previous response
  
    const spreadsheetId = '1UabxXfeqYaGg9vV4vTDaVj8ZwNyjdFw9wIJ-BZVpqgg';
    const range = `Base Madre!A${rowId}:L${rowId}`;
  
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
  
      res.redirect('/bdKolbi'); // Redirect to the main page or any other desired location
    });
  });
  /*eDITAR BASE FIJO */
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
    const range = `Registro_Ventas_Fijo!A${rowId}:AH${rowId}`;
  
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
    ];
  
    // Set up authentication as mentioned in the previous response
  
    const spreadsheetId = '1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY';
    const range = `Registro_Ventas_Fijo!A${rowId}:AH${rowId}`;
  
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

/*EDITAR HOMEE */
  router.get('/editHOME/:rowId', async  (req, res) => {

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
    const range = `Respuestas_Formulario!A${rowId}:AK${rowId}`;
  
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
      res.render('editarHOME', { rowId, rowValues }); // Assumes you have an 'update.ejs' view/template
    });
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
    ];
  
    // Set up authentication as mentioned in the previous response
  
    const spreadsheetId = '1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY';
    const range = `Respuestas_Formulario!A${rowId}:AK${rowId}`;
  
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
 /*EDITAR revenue */
 router.get('/editFacturas/:rowId', async  (req, res) => {

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
  const range = `Revenue Mayo 2023!A${rowId}:U${rowId}`;

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
    res.render('editarRevenue', { rowId, rowValues }); // Assumes you have an 'update.ejs' view/template
  });
});
router.post('/editFacturas/:rowId', async (req, res) => {

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
    req.body.column21
  ];

  // Set up authentication as mentioned in the previous response

  const spreadsheetId = '1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY';
  const range = `Revenue Mayo 2023!A${rowId}:U${rowId}`;

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

    res.redirect('/revenue'); // Redirect to the main page or any other desired location
  });
}); 
/*EDITAR revenue JUNIO 2023*/
router.get('/editFacturasJunio/:rowId', async  (req, res) => {

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
  const range = `Revenue Junio 2023!A${rowId}:Y${rowId}`;

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
    res.render('editarRevenueJunio', { rowId, rowValues }); // Assumes you have an 'update.ejs' view/template
  });
});
router.post('/editFacturasJunio/:rowId', async (req, res) => {

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
    req.body.column25
  ];

  // Set up authentication as mentioned in the previous response

  const spreadsheetId = '1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY';
  const range = `Revenue Junio 2023!A${rowId}:Y${rowId}`;

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

    res.redirect('/revenueJunio'); // Redirect to the main page or any other desired location
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

  /* VALIDACION DE CEDULAS */
  
router.post('/trigger-puppeteer', async (req, res) => {
  var cedula = req.body.number;
  try {
    // Launch Puppeteer and open a new page
    const browser = await puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io/' });
    const page = await browser.newPage();

    // Set navigation timeout to 60 seconds (or adjust as needed)
    page.setDefaultNavigationTimeout(60000);

    // Navigate to the web page
    await page.goto('https://libertycr.com/web/validacion');

    // Enter the phone number and submit the form
    await page.type('#id-number', cedula);
    await page.click('#validate-btn');

    // Wait for the result to be loaded on the page
    await page.waitForSelector('.result-false');

    // Retrieve the result text
    const result = await page.$eval('.result-false', (element) => element.textContent);

    // Close the browser
    await browser.close();

    // Return the result as the response
    res.json({ result });
    


  } catch (error) {
    // Handle any errors
    console.error('Puppeteer error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
/* Excel loop */

// Endpoint for file upload
/*
router.post('/upload-excel', upload.single('file'), async (req, res) => {
  try {
    // Read the uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Extract the list of numbers from the Excel file
    const numbers = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0];

    // Perform web scraping for each number
    for (const number of numbers) {
      try {
        // Launch Puppeteer and open a new page
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set navigation timeout to 60 seconds (or adjust as needed)
        page.setDefaultNavigationTimeout(60000);

        // Navigate to the web page
        await page.goto('https://libertycr.com/web/validacion');

        // Insert the number into the relevant field
        console.log('Number:', number);
        await page.type('#id-number', number);

        // Click the validation button
        await page.click('#validate-btn');

        // Wait for the result to be loaded on the page
        await page.waitForSelector('.result-false');

        // Retrieve the result text
const resultElement = await page.$('.result-false');
const result = await resultElement.evaluate(element => element.textContent.trim());
console.log('Result:', result);



        // Close the browser
        await browser.close();
      } catch (error) {
        console.error('Puppeteer error:', error);
      }
    }

    // Send the response
    res.json({ message: 'Web scraping completed.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



*/


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