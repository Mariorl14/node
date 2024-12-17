const express = require('express');
const {google} = require("googleapis");
const router = express.Router()

const conexion = require('../database/db');

const authController = require('../controllers/authController')
const UsuarioController = require('../controllers/UsuarioController')
const VentasController = require('../controllers/VentasController');
const NoCache = require('../controllers/noCache');
const moment = require('moment');


 /*Rev Setiembre */
 router.get('/RevenueSETIEMBRE', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{

    /* AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE() ; */
      
    conexion.query('select * from ventasmovil where MES_TRABAJADA = "SETIEMBRE" AND Activada = "Activada" AND Year(Fecha) = 2024;', (error, results)=>{
      if(error){
          throw error
      }else{
          res.render('RevenueSETIEMBRE', {results:results, user:req.user})
      }
  })
  
  });

  /* Editar Rev Setiembre*/
router.get('/editRevSet/:SaleId', async (req, res) => {

    const SaleId = req.params.SaleId
  
    conexion.query('select SaleId, Celular_Tramite,Numero_Abonado, Nombre_Cliente, Primer_Apellido_Cliente, Fecha_Activacion,  Factura_1,Monto_1,Fecha_Pago_1,Factura_2,Monto_2,Fecha_Pago_2,Factura_3,Monto_3,Fecha_Pago_3,Factura_4,Monto_4,Fecha_Pago_4,Factura_5,Monto_5,Fecha_Pago_5,Factura_6,Monto_6,Fecha_Pago_6  from VentasMovil where SaleId = ?', [SaleId], (error, results)=>{
      if (error) {
        throw error;
      } else {
        let saleData = results[0];
    
        // Assuming the two date fields are `Fecha_Activacion` and `Fecha_Entrega`
        let dbDate10 = saleData.Fecha_Activacion; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate1 = saleData.Fecha_Pago_1; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate2 = saleData.Fecha_Pago_2; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate3 = saleData.Fecha_Pago_3; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate4 = saleData.Fecha_Pago_4; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate5 = saleData.Fecha_Pago_5; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate6 = saleData.Fecha_Pago_6; // Replace `Fecha_Entrega` with your actual date field name
    
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
        const formattedDate10 = processDate(dbDate10);
        const formattedDate1 = processDate(dbDate1);
        const formattedDate2 = processDate(dbDate2);
        const formattedDate3 = processDate(dbDate3);
        const formattedDate4 = processDate(dbDate4);
        const formattedDate5 = processDate(dbDate5);
        const formattedDate6 = processDate(dbDate6);
    
        // Add the formatted dates back to the results object or as new fields
        saleData.formattedFecha_Activacion = formattedDate10;
        saleData.formattedFecha_Pago_1 = formattedDate1;
        saleData.formattedFecha_Pago_2 = formattedDate2;
        saleData.formattedFecha_Pago_3 = formattedDate3;
        saleData.formattedFecha_Pago_4 = formattedDate4;
        saleData.formattedFecha_Pago_5 = formattedDate5;
        saleData.formattedFecha_Pago_6 = formattedDate6;
    
        // Render the template with the formatted dates
        res.render('editarRevSet', { SaleId: saleData, user: req.user });
      }
  })
  
  });
  
  router.post('/editRevSet', (req, res) => {
    const SaleId = req.body.SaleId;
  
    // Format the date fields as "YYYY/MM/DD"
    var FechaActivacion = moment(req.body.column33).format('YYYY/MM/DD');
    var Fecha_Pago_1 = moment(req.body.columnFP1).format('YYYY/MM/DD');
    var Fecha_Pago_2 = moment(req.body.columnFP2).format('YYYY/MM/DD');
    var Fecha_Pago_3 = moment(req.body.columnFP3).format('YYYY/MM/DD');
    var Fecha_Pago_4 = moment(req.body.columnFP4).format('YYYY/MM/DD');
    var Fecha_Pago_5 = moment(req.body.columnFP5).format('YYYY/MM/DD');
    var Fecha_Pago_6 = moment(req.body.columnFP6).format('YYYY/MM/DD');
    var Monto_1 = req.body.columnM1;
    var Monto_2 = req.body.columnM2;
    var Monto_3 = req.body.columnM3;
    var Monto_4 = req.body.columnM4;
    var Monto_5 = req.body.columnM5;
    var Monto_6 = req.body.columnM6;
  
    if(FechaActivacion == "Invalid date"){
     var FechaActivacion1 = null
    }else{
      FechaActivacion1 = FechaActivacion
    }
  
    if(Fecha_Pago_1 == "Invalid date"){
      var Fecha_Pago_01 = null
     }else{
        Fecha_Pago_01 = Fecha_Pago_1
     }
     if(Fecha_Pago_2 == "Invalid date"){
        var Fecha_Pago_02 = null
       }else{
        Fecha_Pago_02 = Fecha_Pago_2
       }
       if(Fecha_Pago_3 == "Invalid date"){
        var Fecha_Pago_03 = null
       }else{
        Fecha_Pago_03 = Fecha_Pago_3
       }
       if(Fecha_Pago_4 == "Invalid date"){
        var Fecha_Pago_04 = null
       }else{
        Fecha_Pago_04 = Fecha_Pago_4
       }
       if(Fecha_Pago_5 == "Invalid date"){
        var Fecha_Pago_05 = null
       }else{
        Fecha_Pago_05 = Fecha_Pago_5
       }
       if(Fecha_Pago_6 == "Invalid date"){
        var Fecha_Pago_06 = null
       }else{
        Fecha_Pago_06 = Fecha_Pago_6
       }

       if(Monto_1 == ""){
        var Monto_01 = null
       }else{
        Monto_01 = Monto_1
       }
       if(Monto_2 == ""){
        var Monto_02 = null
       }else{
        Monto_02 = Monto_2
       }
       if(Monto_3 == ""){
        var Monto_03 = null
       }else{
        Monto_03 = Monto_3
       }
       if(Monto_4 == ""){
        var Monto_04 = null
       }else{
        Monto_04 = Monto_4
       }
       if(Monto_5 == ""){
        var Monto_05 = null
       }else{
        Monto_05 = Monto_5
       }
       if(Monto_6 == ""){
        var Monto_06 = null
       }else{
        Monto_06 = Monto_6
       }

  
    // Rest of the fields
    const data = {
      Factura_1: req.body.columnF1,
      Monto_1: Monto_01,
      Fecha_Pago_1: Fecha_Pago_01,
      Factura_2: req.body.columnF2,
      Monto_2: Monto_02,
      Fecha_Pago_2: Fecha_Pago_02,
      Factura_3: req.body.columnF3,
      Monto_3: Monto_03,
      Fecha_Pago_3: Fecha_Pago_03,
      Factura_4: req.body.columnF4,
      Monto_4: Monto_04,
      Fecha_Pago_4: Fecha_Pago_04,
      Factura_5: req.body.columnF5,
      Monto_5: Monto_05,
      Fecha_Pago_5: Fecha_Pago_05,
      Factura_6: req.body.columnF6,
      Monto_6: Monto_06,
      Fecha_Pago_6: Fecha_Pago_06
    };
  console.log(SaleId)
  console.log(data)
    conexion.query('UPDATE VentasMovil SET ? WHERE SaleId = ?', [data, SaleId], (error, results) => {
      if (error) {
        console.error("Error updating the database:", error);
        res.status(500).send("An error occurred while updating the database."); // Handle the error properly
      } else {
        console.log("Updated SaleId:", SaleId);
        res.redirect('RevenueSETIEMBRE');
      }
    });
  });

  /*Rev Marzo */
 router.get('/RevenueMARZO', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{

    /* AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE() ; */
      
    conexion.query('select * from ventasmovil where MES_TRABAJADA = "MARZO" AND Activada = "Activada" AND Year(Fecha) = 2024;', (error, results)=>{
      if(error){
          throw error
      }else{
          res.render('RevenueMARZO', {results:results, user:req.user})
      }
  })
  
  });

  /* Editar Rev Marzo*/
router.get('/editRevMar/:SaleId', async (req, res) => {

    const SaleId = req.params.SaleId
  
    conexion.query('select SaleId, Celular_Tramite,Numero_Abonado, Nombre_Cliente, Primer_Apellido_Cliente, Fecha_Activacion,  Factura_1,Monto_1,Fecha_Pago_1,Factura_2,Monto_2,Fecha_Pago_2,Factura_3,Monto_3,Fecha_Pago_3,Factura_4,Monto_4,Fecha_Pago_4,Factura_5,Monto_5,Fecha_Pago_5,Factura_6,Monto_6,Fecha_Pago_6  from VentasMovil where SaleId = ?', [SaleId], (error, results)=>{
      if (error) {
        throw error;
      } else {
        let saleData = results[0];
    
        // Assuming the two date fields are `Fecha_Activacion` and `Fecha_Entrega`
        let dbDate10 = saleData.Fecha_Activacion; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate1 = saleData.Fecha_Pago_1; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate2 = saleData.Fecha_Pago_2; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate3 = saleData.Fecha_Pago_3; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate4 = saleData.Fecha_Pago_4; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate5 = saleData.Fecha_Pago_5; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate6 = saleData.Fecha_Pago_6; // Replace `Fecha_Entrega` with your actual date field name
    
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
        const formattedDate10 = processDate(dbDate10);
        const formattedDate1 = processDate(dbDate1);
        const formattedDate2 = processDate(dbDate2);
        const formattedDate3 = processDate(dbDate3);
        const formattedDate4 = processDate(dbDate4);
        const formattedDate5 = processDate(dbDate5);
        const formattedDate6 = processDate(dbDate6);
    
        // Add the formatted dates back to the results object or as new fields
        saleData.formattedFecha_Activacion = formattedDate10;
        saleData.formattedFecha_Pago_1 = formattedDate1;
        saleData.formattedFecha_Pago_2 = formattedDate2;
        saleData.formattedFecha_Pago_3 = formattedDate3;
        saleData.formattedFecha_Pago_4 = formattedDate4;
        saleData.formattedFecha_Pago_5 = formattedDate5;
        saleData.formattedFecha_Pago_6 = formattedDate6;
    
        // Render the template with the formatted dates
        res.render('editarRevMar', { SaleId: saleData, user: req.user });
      }
  })
  
  });
  
  router.post('/editRevMar', (req, res) => {
    const SaleId = req.body.SaleId;
  
    // Format the date fields as "YYYY/MM/DD"
    var FechaActivacion = moment(req.body.column33).format('YYYY/MM/DD');
    var Fecha_Pago_1 = moment(req.body.columnFP1).format('YYYY/MM/DD');
    var Fecha_Pago_2 = moment(req.body.columnFP2).format('YYYY/MM/DD');
    var Fecha_Pago_3 = moment(req.body.columnFP3).format('YYYY/MM/DD');
    var Fecha_Pago_4 = moment(req.body.columnFP4).format('YYYY/MM/DD');
    var Fecha_Pago_5 = moment(req.body.columnFP5).format('YYYY/MM/DD');
    var Fecha_Pago_6 = moment(req.body.columnFP6).format('YYYY/MM/DD');
    var Monto_1 = req.body.columnM1;
    var Monto_2 = req.body.columnM2;
    var Monto_3 = req.body.columnM3;
    var Monto_4 = req.body.columnM4;
    var Monto_5 = req.body.columnM5;
    var Monto_6 = req.body.columnM6;
  
    if(FechaActivacion == "Invalid date"){
     var FechaActivacion1 = null
    }else{
      FechaActivacion1 = FechaActivacion
    }
  
    if(Fecha_Pago_1 == "Invalid date"){
      var Fecha_Pago_01 = null
     }else{
        Fecha_Pago_01 = Fecha_Pago_1
     }
     if(Fecha_Pago_2 == "Invalid date"){
        var Fecha_Pago_02 = null
       }else{
        Fecha_Pago_02 = Fecha_Pago_2
       }
       if(Fecha_Pago_3 == "Invalid date"){
        var Fecha_Pago_03 = null
       }else{
        Fecha_Pago_03 = Fecha_Pago_3
       }
       if(Fecha_Pago_4 == "Invalid date"){
        var Fecha_Pago_04 = null
       }else{
        Fecha_Pago_04 = Fecha_Pago_4
       }
       if(Fecha_Pago_5 == "Invalid date"){
        var Fecha_Pago_05 = null
       }else{
        Fecha_Pago_05 = Fecha_Pago_5
       }
       if(Fecha_Pago_6 == "Invalid date"){
        var Fecha_Pago_06 = null
       }else{
        Fecha_Pago_06 = Fecha_Pago_6
       }

       if(Monto_1 == ""){
        var Monto_01 = null
       }else{
        Monto_01 = Monto_1
       }
       if(Monto_2 == ""){
        var Monto_02 = null
       }else{
        Monto_02 = Monto_2
       }
       if(Monto_3 == ""){
        var Monto_03 = null
       }else{
        Monto_03 = Monto_3
       }
       if(Monto_4 == ""){
        var Monto_04 = null
       }else{
        Monto_04 = Monto_4
       }
       if(Monto_5 == ""){
        var Monto_05 = null
       }else{
        Monto_05 = Monto_5
       }
       if(Monto_6 == ""){
        var Monto_06 = null
       }else{
        Monto_06 = Monto_6
       }

  
    // Rest of the fields
    const data = {
      Factura_1: req.body.columnF1,
      Monto_1: Monto_01,
      Fecha_Pago_1: Fecha_Pago_01,
      Factura_2: req.body.columnF2,
      Monto_2: Monto_02,
      Fecha_Pago_2: Fecha_Pago_02,
      Factura_3: req.body.columnF3,
      Monto_3: Monto_03,
      Fecha_Pago_3: Fecha_Pago_03,
      Factura_4: req.body.columnF4,
      Monto_4: Monto_04,
      Fecha_Pago_4: Fecha_Pago_04,
      Factura_5: req.body.columnF5,
      Monto_5: Monto_05,
      Fecha_Pago_5: Fecha_Pago_05,
      Factura_6: req.body.columnF6,
      Monto_6: Monto_06,
      Fecha_Pago_6: Fecha_Pago_06
    };
  console.log(SaleId)
  console.log(data)
    conexion.query('UPDATE VentasMovil SET ? WHERE SaleId = ?', [data, SaleId], (error, results) => {
      if (error) {
        console.error("Error updating the database:", error);
        res.status(500).send("An error occurred while updating the database."); // Handle the error properly
      } else {
        console.log("Updated SaleId:", SaleId);
        res.redirect('RevenueMARZO');
      }
    });
  });

  /*Rev Abril */
 router.get('/RevenueABRIL', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{

    /* AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE() ; */
      
    conexion.query('select * from ventasmovil where MES_TRABAJADA = "ABRIL" AND Activada = "Activada" AND Year(Fecha) = 2024;', (error, results)=>{
      if(error){
          throw error
      }else{
          res.render('RevenueABRIL', {results:results, user:req.user})
      }
  })
  
  });

  /* Editar Rev Abril*/
router.get('/editRevAbr/:SaleId', async (req, res) => {

    const SaleId = req.params.SaleId
  
    conexion.query('select SaleId, Celular_Tramite,Numero_Abonado, Nombre_Cliente, Primer_Apellido_Cliente, Fecha_Activacion,  Factura_1,Monto_1,Fecha_Pago_1,Factura_2,Monto_2,Fecha_Pago_2,Factura_3,Monto_3,Fecha_Pago_3,Factura_4,Monto_4,Fecha_Pago_4,Factura_5,Monto_5,Fecha_Pago_5,Factura_6,Monto_6,Fecha_Pago_6  from VentasMovil where SaleId = ?', [SaleId], (error, results)=>{
      if (error) {
        throw error;
      } else {
        let saleData = results[0];
    
        // Assuming the two date fields are `Fecha_Activacion` and `Fecha_Entrega`
        let dbDate10 = saleData.Fecha_Activacion; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate1 = saleData.Fecha_Pago_1; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate2 = saleData.Fecha_Pago_2; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate3 = saleData.Fecha_Pago_3; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate4 = saleData.Fecha_Pago_4; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate5 = saleData.Fecha_Pago_5; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate6 = saleData.Fecha_Pago_6; // Replace `Fecha_Entrega` with your actual date field name
    
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
        const formattedDate10 = processDate(dbDate10);
        const formattedDate1 = processDate(dbDate1);
        const formattedDate2 = processDate(dbDate2);
        const formattedDate3 = processDate(dbDate3);
        const formattedDate4 = processDate(dbDate4);
        const formattedDate5 = processDate(dbDate5);
        const formattedDate6 = processDate(dbDate6);
    
        // Add the formatted dates back to the results object or as new fields
        saleData.formattedFecha_Activacion = formattedDate10;
        saleData.formattedFecha_Pago_1 = formattedDate1;
        saleData.formattedFecha_Pago_2 = formattedDate2;
        saleData.formattedFecha_Pago_3 = formattedDate3;
        saleData.formattedFecha_Pago_4 = formattedDate4;
        saleData.formattedFecha_Pago_5 = formattedDate5;
        saleData.formattedFecha_Pago_6 = formattedDate6;
    
        // Render the template with the formatted dates
        res.render('editarRevAbr', { SaleId: saleData, user: req.user });
      }
  })
  
  });
  
  router.post('/editRevAbr', (req, res) => {
    const SaleId = req.body.SaleId;
  
    // Format the date fields as "YYYY/MM/DD"
    var FechaActivacion = moment(req.body.column33).format('YYYY/MM/DD');
    var Fecha_Pago_1 = moment(req.body.columnFP1).format('YYYY/MM/DD');
    var Fecha_Pago_2 = moment(req.body.columnFP2).format('YYYY/MM/DD');
    var Fecha_Pago_3 = moment(req.body.columnFP3).format('YYYY/MM/DD');
    var Fecha_Pago_4 = moment(req.body.columnFP4).format('YYYY/MM/DD');
    var Fecha_Pago_5 = moment(req.body.columnFP5).format('YYYY/MM/DD');
    var Fecha_Pago_6 = moment(req.body.columnFP6).format('YYYY/MM/DD');
    var Monto_1 = req.body.columnM1;
    var Monto_2 = req.body.columnM2;
    var Monto_3 = req.body.columnM3;
    var Monto_4 = req.body.columnM4;
    var Monto_5 = req.body.columnM5;
    var Monto_6 = req.body.columnM6;
  
    if(FechaActivacion == "Invalid date"){
     var FechaActivacion1 = null
    }else{
      FechaActivacion1 = FechaActivacion
    }
  
    if(Fecha_Pago_1 == "Invalid date"){
      var Fecha_Pago_01 = null
     }else{
        Fecha_Pago_01 = Fecha_Pago_1
     }
     if(Fecha_Pago_2 == "Invalid date"){
        var Fecha_Pago_02 = null
       }else{
        Fecha_Pago_02 = Fecha_Pago_2
       }
       if(Fecha_Pago_3 == "Invalid date"){
        var Fecha_Pago_03 = null
       }else{
        Fecha_Pago_03 = Fecha_Pago_3
       }
       if(Fecha_Pago_4 == "Invalid date"){
        var Fecha_Pago_04 = null
       }else{
        Fecha_Pago_04 = Fecha_Pago_4
       }
       if(Fecha_Pago_5 == "Invalid date"){
        var Fecha_Pago_05 = null
       }else{
        Fecha_Pago_05 = Fecha_Pago_5
       }
       if(Fecha_Pago_6 == "Invalid date"){
        var Fecha_Pago_06 = null
       }else{
        Fecha_Pago_06 = Fecha_Pago_6
       }

       if(Monto_1 == ""){
        var Monto_01 = null
       }else{
        Monto_01 = Monto_1
       }
       if(Monto_2 == ""){
        var Monto_02 = null
       }else{
        Monto_02 = Monto_2
       }
       if(Monto_3 == ""){
        var Monto_03 = null
       }else{
        Monto_03 = Monto_3
       }
       if(Monto_4 == ""){
        var Monto_04 = null
       }else{
        Monto_04 = Monto_4
       }
       if(Monto_5 == ""){
        var Monto_05 = null
       }else{
        Monto_05 = Monto_5
       }
       if(Monto_6 == ""){
        var Monto_06 = null
       }else{
        Monto_06 = Monto_6
       }

  
    // Rest of the fields
    const data = {
      Factura_1: req.body.columnF1,
      Monto_1: Monto_01,
      Fecha_Pago_1: Fecha_Pago_01,
      Factura_2: req.body.columnF2,
      Monto_2: Monto_02,
      Fecha_Pago_2: Fecha_Pago_02,
      Factura_3: req.body.columnF3,
      Monto_3: Monto_03,
      Fecha_Pago_3: Fecha_Pago_03,
      Factura_4: req.body.columnF4,
      Monto_4: Monto_04,
      Fecha_Pago_4: Fecha_Pago_04,
      Factura_5: req.body.columnF5,
      Monto_5: Monto_05,
      Fecha_Pago_5: Fecha_Pago_05,
      Factura_6: req.body.columnF6,
      Monto_6: Monto_06,
      Fecha_Pago_6: Fecha_Pago_06
    };
  console.log(SaleId)
  console.log(data)
    conexion.query('UPDATE VentasMovil SET ? WHERE SaleId = ?', [data, SaleId], (error, results) => {
      if (error) {
        console.error("Error updating the database:", error);
        res.status(500).send("An error occurred while updating the database."); // Handle the error properly
      } else {
        console.log("Updated SaleId:", SaleId);
        res.redirect('RevenueABRIL');
      }
    });
  });

  /*Rev Mayo */
 router.get('/RevenueMAYO', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{

    /* AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE() ; */
      
    conexion.query('select * from ventasmovil where MES_TRABAJADA = "MAYO" AND Activada = "Activada" AND Year(Fecha) = 2024;', (error, results)=>{
      if(error){
          throw error
      }else{
          res.render('RevenueMAYO', {results:results, user:req.user})
      }
  })
  
  });

  /* Editar Rev Mayo*/
router.get('/editRevMay/:SaleId', async (req, res) => {

    const SaleId = req.params.SaleId
  
    conexion.query('select SaleId, Celular_Tramite,Numero_Abonado, Nombre_Cliente, Primer_Apellido_Cliente, Fecha_Activacion,  Factura_1,Monto_1,Fecha_Pago_1,Factura_2,Monto_2,Fecha_Pago_2,Factura_3,Monto_3,Fecha_Pago_3,Factura_4,Monto_4,Fecha_Pago_4,Factura_5,Monto_5,Fecha_Pago_5,Factura_6,Monto_6,Fecha_Pago_6  from VentasMovil where SaleId = ?', [SaleId], (error, results)=>{
      if (error) {
        throw error;
      } else {
        let saleData = results[0];
    
        // Assuming the two date fields are `Fecha_Activacion` and `Fecha_Entrega`
        let dbDate10 = saleData.Fecha_Activacion; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate1 = saleData.Fecha_Pago_1; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate2 = saleData.Fecha_Pago_2; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate3 = saleData.Fecha_Pago_3; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate4 = saleData.Fecha_Pago_4; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate5 = saleData.Fecha_Pago_5; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate6 = saleData.Fecha_Pago_6; // Replace `Fecha_Entrega` with your actual date field name
    
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
        const formattedDate10 = processDate(dbDate10);
        const formattedDate1 = processDate(dbDate1);
        const formattedDate2 = processDate(dbDate2);
        const formattedDate3 = processDate(dbDate3);
        const formattedDate4 = processDate(dbDate4);
        const formattedDate5 = processDate(dbDate5);
        const formattedDate6 = processDate(dbDate6);
    
        // Add the formatted dates back to the results object or as new fields
        saleData.formattedFecha_Activacion = formattedDate10;
        saleData.formattedFecha_Pago_1 = formattedDate1;
        saleData.formattedFecha_Pago_2 = formattedDate2;
        saleData.formattedFecha_Pago_3 = formattedDate3;
        saleData.formattedFecha_Pago_4 = formattedDate4;
        saleData.formattedFecha_Pago_5 = formattedDate5;
        saleData.formattedFecha_Pago_6 = formattedDate6;
    
        // Render the template with the formatted dates
        res.render('editarRevMay', { SaleId: saleData, user: req.user });
      }
  })
  
  });
  
  router.post('/editRevMay', (req, res) => {
    const SaleId = req.body.SaleId;
  
    // Format the date fields as "YYYY/MM/DD"
    var FechaActivacion = moment(req.body.column33).format('YYYY/MM/DD');
    var Fecha_Pago_1 = moment(req.body.columnFP1).format('YYYY/MM/DD');
    var Fecha_Pago_2 = moment(req.body.columnFP2).format('YYYY/MM/DD');
    var Fecha_Pago_3 = moment(req.body.columnFP3).format('YYYY/MM/DD');
    var Fecha_Pago_4 = moment(req.body.columnFP4).format('YYYY/MM/DD');
    var Fecha_Pago_5 = moment(req.body.columnFP5).format('YYYY/MM/DD');
    var Fecha_Pago_6 = moment(req.body.columnFP6).format('YYYY/MM/DD');
    var Monto_1 = req.body.columnM1;
    var Monto_2 = req.body.columnM2;
    var Monto_3 = req.body.columnM3;
    var Monto_4 = req.body.columnM4;
    var Monto_5 = req.body.columnM5;
    var Monto_6 = req.body.columnM6;
  
    if(FechaActivacion == "Invalid date"){
     var FechaActivacion1 = null
    }else{
      FechaActivacion1 = FechaActivacion
    }
  
    if(Fecha_Pago_1 == "Invalid date"){
      var Fecha_Pago_01 = null
     }else{
        Fecha_Pago_01 = Fecha_Pago_1
     }
     if(Fecha_Pago_2 == "Invalid date"){
        var Fecha_Pago_02 = null
       }else{
        Fecha_Pago_02 = Fecha_Pago_2
       }
       if(Fecha_Pago_3 == "Invalid date"){
        var Fecha_Pago_03 = null
       }else{
        Fecha_Pago_03 = Fecha_Pago_3
       }
       if(Fecha_Pago_4 == "Invalid date"){
        var Fecha_Pago_04 = null
       }else{
        Fecha_Pago_04 = Fecha_Pago_4
       }
       if(Fecha_Pago_5 == "Invalid date"){
        var Fecha_Pago_05 = null
       }else{
        Fecha_Pago_05 = Fecha_Pago_5
       }
       if(Fecha_Pago_6 == "Invalid date"){
        var Fecha_Pago_06 = null
       }else{
        Fecha_Pago_06 = Fecha_Pago_6
       }

       if(Monto_1 == ""){
        var Monto_01 = null
       }else{
        Monto_01 = Monto_1
       }
       if(Monto_2 == ""){
        var Monto_02 = null
       }else{
        Monto_02 = Monto_2
       }
       if(Monto_3 == ""){
        var Monto_03 = null
       }else{
        Monto_03 = Monto_3
       }
       if(Monto_4 == ""){
        var Monto_04 = null
       }else{
        Monto_04 = Monto_4
       }
       if(Monto_5 == ""){
        var Monto_05 = null
       }else{
        Monto_05 = Monto_5
       }
       if(Monto_6 == ""){
        var Monto_06 = null
       }else{
        Monto_06 = Monto_6
       }

  
    // Rest of the fields
    const data = {
      Factura_1: req.body.columnF1,
      Monto_1: Monto_01,
      Fecha_Pago_1: Fecha_Pago_01,
      Factura_2: req.body.columnF2,
      Monto_2: Monto_02,
      Fecha_Pago_2: Fecha_Pago_02,
      Factura_3: req.body.columnF3,
      Monto_3: Monto_03,
      Fecha_Pago_3: Fecha_Pago_03,
      Factura_4: req.body.columnF4,
      Monto_4: Monto_04,
      Fecha_Pago_4: Fecha_Pago_04,
      Factura_5: req.body.columnF5,
      Monto_5: Monto_05,
      Fecha_Pago_5: Fecha_Pago_05,
      Factura_6: req.body.columnF6,
      Monto_6: Monto_06,
      Fecha_Pago_6: Fecha_Pago_06
    };
  console.log(SaleId)
  console.log(data)
    conexion.query('UPDATE VentasMovil SET ? WHERE SaleId = ?', [data, SaleId], (error, results) => {
      if (error) {
        console.error("Error updating the database:", error);
        res.status(500).send("An error occurred while updating the database."); // Handle the error properly
      } else {
        console.log("Updated SaleId:", SaleId);
        res.redirect('RevenueMAYO');
      }
    });
  });

  /*Rev Junio */
 router.get('/RevenueJUNIO', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{

    /* AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE() ; */
      
    conexion.query('select * from ventasmovil where MES_TRABAJADA = "JUNIO" AND Activada = "Activada" AND Year(Fecha) = 2024;', (error, results)=>{
      if(error){
          throw error
      }else{
          res.render('RevenueJUNIO', {results:results, user:req.user})
      }
  })
  
  });

  /* Editar Rev Junio*/
router.get('/editRevJun/:SaleId', async (req, res) => {

    const SaleId = req.params.SaleId
  
    conexion.query('select SaleId, Celular_Tramite,Numero_Abonado, Nombre_Cliente, Primer_Apellido_Cliente, Fecha_Activacion,  Factura_1,Monto_1,Fecha_Pago_1,Factura_2,Monto_2,Fecha_Pago_2,Factura_3,Monto_3,Fecha_Pago_3,Factura_4,Monto_4,Fecha_Pago_4,Factura_5,Monto_5,Fecha_Pago_5,Factura_6,Monto_6,Fecha_Pago_6  from VentasMovil where SaleId = ?', [SaleId], (error, results)=>{
      if (error) {
        throw error;
      } else {
        let saleData = results[0];
    
        // Assuming the two date fields are `Fecha_Activacion` and `Fecha_Entrega`
        let dbDate10 = saleData.Fecha_Activacion; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate1 = saleData.Fecha_Pago_1; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate2 = saleData.Fecha_Pago_2; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate3 = saleData.Fecha_Pago_3; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate4 = saleData.Fecha_Pago_4; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate5 = saleData.Fecha_Pago_5; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate6 = saleData.Fecha_Pago_6; // Replace `Fecha_Entrega` with your actual date field name
    
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
        const formattedDate10 = processDate(dbDate10);
        const formattedDate1 = processDate(dbDate1);
        const formattedDate2 = processDate(dbDate2);
        const formattedDate3 = processDate(dbDate3);
        const formattedDate4 = processDate(dbDate4);
        const formattedDate5 = processDate(dbDate5);
        const formattedDate6 = processDate(dbDate6);
    
        // Add the formatted dates back to the results object or as new fields
        saleData.formattedFecha_Activacion = formattedDate10;
        saleData.formattedFecha_Pago_1 = formattedDate1;
        saleData.formattedFecha_Pago_2 = formattedDate2;
        saleData.formattedFecha_Pago_3 = formattedDate3;
        saleData.formattedFecha_Pago_4 = formattedDate4;
        saleData.formattedFecha_Pago_5 = formattedDate5;
        saleData.formattedFecha_Pago_6 = formattedDate6;
    
        // Render the template with the formatted dates
        res.render('editarRevJun', { SaleId: saleData, user: req.user });
      }
  })
  
  });
  
  router.post('/editRevJun', (req, res) => {
    const SaleId = req.body.SaleId;
  
    // Format the date fields as "YYYY/MM/DD"
    var FechaActivacion = moment(req.body.column33).format('YYYY/MM/DD');
    var Fecha_Pago_1 = moment(req.body.columnFP1).format('YYYY/MM/DD');
    var Fecha_Pago_2 = moment(req.body.columnFP2).format('YYYY/MM/DD');
    var Fecha_Pago_3 = moment(req.body.columnFP3).format('YYYY/MM/DD');
    var Fecha_Pago_4 = moment(req.body.columnFP4).format('YYYY/MM/DD');
    var Fecha_Pago_5 = moment(req.body.columnFP5).format('YYYY/MM/DD');
    var Fecha_Pago_6 = moment(req.body.columnFP6).format('YYYY/MM/DD');
    var Monto_1 = req.body.columnM1;
    var Monto_2 = req.body.columnM2;
    var Monto_3 = req.body.columnM3;
    var Monto_4 = req.body.columnM4;
    var Monto_5 = req.body.columnM5;
    var Monto_6 = req.body.columnM6;
  
    if(FechaActivacion == "Invalid date"){
     var FechaActivacion1 = null
    }else{
      FechaActivacion1 = FechaActivacion
    }
  
    if(Fecha_Pago_1 == "Invalid date"){
      var Fecha_Pago_01 = null
     }else{
        Fecha_Pago_01 = Fecha_Pago_1
     }
     if(Fecha_Pago_2 == "Invalid date"){
        var Fecha_Pago_02 = null
       }else{
        Fecha_Pago_02 = Fecha_Pago_2
       }
       if(Fecha_Pago_3 == "Invalid date"){
        var Fecha_Pago_03 = null
       }else{
        Fecha_Pago_03 = Fecha_Pago_3
       }
       if(Fecha_Pago_4 == "Invalid date"){
        var Fecha_Pago_04 = null
       }else{
        Fecha_Pago_04 = Fecha_Pago_4
       }
       if(Fecha_Pago_5 == "Invalid date"){
        var Fecha_Pago_05 = null
       }else{
        Fecha_Pago_05 = Fecha_Pago_5
       }
       if(Fecha_Pago_6 == "Invalid date"){
        var Fecha_Pago_06 = null
       }else{
        Fecha_Pago_06 = Fecha_Pago_6
       }

       if(Monto_1 == ""){
        var Monto_01 = null
       }else{
        Monto_01 = Monto_1
       }
       if(Monto_2 == ""){
        var Monto_02 = null
       }else{
        Monto_02 = Monto_2
       }
       if(Monto_3 == ""){
        var Monto_03 = null
       }else{
        Monto_03 = Monto_3
       }
       if(Monto_4 == ""){
        var Monto_04 = null
       }else{
        Monto_04 = Monto_4
       }
       if(Monto_5 == ""){
        var Monto_05 = null
       }else{
        Monto_05 = Monto_5
       }
       if(Monto_6 == ""){
        var Monto_06 = null
       }else{
        Monto_06 = Monto_6
       }

  
    // Rest of the fields
    const data = {
      Factura_1: req.body.columnF1,
      Monto_1: Monto_01,
      Fecha_Pago_1: Fecha_Pago_01,
      Factura_2: req.body.columnF2,
      Monto_2: Monto_02,
      Fecha_Pago_2: Fecha_Pago_02,
      Factura_3: req.body.columnF3,
      Monto_3: Monto_03,
      Fecha_Pago_3: Fecha_Pago_03,
      Factura_4: req.body.columnF4,
      Monto_4: Monto_04,
      Fecha_Pago_4: Fecha_Pago_04,
      Factura_5: req.body.columnF5,
      Monto_5: Monto_05,
      Fecha_Pago_5: Fecha_Pago_05,
      Factura_6: req.body.columnF6,
      Monto_6: Monto_06,
      Fecha_Pago_6: Fecha_Pago_06
    };
  console.log(SaleId)
  console.log(data)
    conexion.query('UPDATE VentasMovil SET ? WHERE SaleId = ?', [data, SaleId], (error, results) => {
      if (error) {
        console.error("Error updating the database:", error);
        res.status(500).send("An error occurred while updating the database."); // Handle the error properly
      } else {
        console.log("Updated SaleId:", SaleId);
        res.redirect('RevenueJUNIO');
      }
    });
  });

  /*Rev Julio */
 router.get('/RevenueJULIO', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{

    /* AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE() ; */
      
    conexion.query('select * from ventasmovil where MES_TRABAJADA = "JULIO" AND Activada = "Activada" AND Year(Fecha) = 2024;', (error, results)=>{
      if(error){
          throw error
      }else{
          res.render('RevenueJULIO', {results:results, user:req.user})
      }
  })
  
  });

  /* Editar Rev Julio*/
router.get('/editRevJul/:SaleId', async (req, res) => {

    const SaleId = req.params.SaleId
  
    conexion.query('select SaleId, Celular_Tramite,Numero_Abonado, Nombre_Cliente, Primer_Apellido_Cliente, Fecha_Activacion,  Factura_1,Monto_1,Fecha_Pago_1,Factura_2,Monto_2,Fecha_Pago_2,Factura_3,Monto_3,Fecha_Pago_3,Factura_4,Monto_4,Fecha_Pago_4,Factura_5,Monto_5,Fecha_Pago_5,Factura_6,Monto_6,Fecha_Pago_6  from VentasMovil where SaleId = ?', [SaleId], (error, results)=>{
      if (error) {
        throw error;
      } else {
        let saleData = results[0];
    
        // Assuming the two date fields are `Fecha_Activacion` and `Fecha_Entrega`
        let dbDate10 = saleData.Fecha_Activacion; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate1 = saleData.Fecha_Pago_1; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate2 = saleData.Fecha_Pago_2; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate3 = saleData.Fecha_Pago_3; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate4 = saleData.Fecha_Pago_4; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate5 = saleData.Fecha_Pago_5; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate6 = saleData.Fecha_Pago_6; // Replace `Fecha_Entrega` with your actual date field name
    
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
        const formattedDate10 = processDate(dbDate10);
        const formattedDate1 = processDate(dbDate1);
        const formattedDate2 = processDate(dbDate2);
        const formattedDate3 = processDate(dbDate3);
        const formattedDate4 = processDate(dbDate4);
        const formattedDate5 = processDate(dbDate5);
        const formattedDate6 = processDate(dbDate6);
    
        // Add the formatted dates back to the results object or as new fields
        saleData.formattedFecha_Activacion = formattedDate10;
        saleData.formattedFecha_Pago_1 = formattedDate1;
        saleData.formattedFecha_Pago_2 = formattedDate2;
        saleData.formattedFecha_Pago_3 = formattedDate3;
        saleData.formattedFecha_Pago_4 = formattedDate4;
        saleData.formattedFecha_Pago_5 = formattedDate5;
        saleData.formattedFecha_Pago_6 = formattedDate6;
    
        // Render the template with the formatted dates
        res.render('editarRevJul', { SaleId: saleData, user: req.user });
      }
  })
  
  });
  
  router.post('/editRevJul', (req, res) => {
    const SaleId = req.body.SaleId;
  
    // Format the date fields as "YYYY/MM/DD"
    var FechaActivacion = moment(req.body.column33).format('YYYY/MM/DD');
    var Fecha_Pago_1 = moment(req.body.columnFP1).format('YYYY/MM/DD');
    var Fecha_Pago_2 = moment(req.body.columnFP2).format('YYYY/MM/DD');
    var Fecha_Pago_3 = moment(req.body.columnFP3).format('YYYY/MM/DD');
    var Fecha_Pago_4 = moment(req.body.columnFP4).format('YYYY/MM/DD');
    var Fecha_Pago_5 = moment(req.body.columnFP5).format('YYYY/MM/DD');
    var Fecha_Pago_6 = moment(req.body.columnFP6).format('YYYY/MM/DD');
    var Monto_1 = req.body.columnM1;
    var Monto_2 = req.body.columnM2;
    var Monto_3 = req.body.columnM3;
    var Monto_4 = req.body.columnM4;
    var Monto_5 = req.body.columnM5;
    var Monto_6 = req.body.columnM6;
  
    if(FechaActivacion == "Invalid date"){
     var FechaActivacion1 = null
    }else{
      FechaActivacion1 = FechaActivacion
    }
  
    if(Fecha_Pago_1 == "Invalid date"){
      var Fecha_Pago_01 = null
     }else{
        Fecha_Pago_01 = Fecha_Pago_1
     }
     if(Fecha_Pago_2 == "Invalid date"){
        var Fecha_Pago_02 = null
       }else{
        Fecha_Pago_02 = Fecha_Pago_2
       }
       if(Fecha_Pago_3 == "Invalid date"){
        var Fecha_Pago_03 = null
       }else{
        Fecha_Pago_03 = Fecha_Pago_3
       }
       if(Fecha_Pago_4 == "Invalid date"){
        var Fecha_Pago_04 = null
       }else{
        Fecha_Pago_04 = Fecha_Pago_4
       }
       if(Fecha_Pago_5 == "Invalid date"){
        var Fecha_Pago_05 = null
       }else{
        Fecha_Pago_05 = Fecha_Pago_5
       }
       if(Fecha_Pago_6 == "Invalid date"){
        var Fecha_Pago_06 = null
       }else{
        Fecha_Pago_06 = Fecha_Pago_6
       }

       if(Monto_1 == ""){
        var Monto_01 = null
       }else{
        Monto_01 = Monto_1
       }
       if(Monto_2 == ""){
        var Monto_02 = null
       }else{
        Monto_02 = Monto_2
       }
       if(Monto_3 == ""){
        var Monto_03 = null
       }else{
        Monto_03 = Monto_3
       }
       if(Monto_4 == ""){
        var Monto_04 = null
       }else{
        Monto_04 = Monto_4
       }
       if(Monto_5 == ""){
        var Monto_05 = null
       }else{
        Monto_05 = Monto_5
       }
       if(Monto_6 == ""){
        var Monto_06 = null
       }else{
        Monto_06 = Monto_6
       }

  
    // Rest of the fields
    const data = {
      Factura_1: req.body.columnF1,
      Monto_1: Monto_01,
      Fecha_Pago_1: Fecha_Pago_01,
      Factura_2: req.body.columnF2,
      Monto_2: Monto_02,
      Fecha_Pago_2: Fecha_Pago_02,
      Factura_3: req.body.columnF3,
      Monto_3: Monto_03,
      Fecha_Pago_3: Fecha_Pago_03,
      Factura_4: req.body.columnF4,
      Monto_4: Monto_04,
      Fecha_Pago_4: Fecha_Pago_04,
      Factura_5: req.body.columnF5,
      Monto_5: Monto_05,
      Fecha_Pago_5: Fecha_Pago_05,
      Factura_6: req.body.columnF6,
      Monto_6: Monto_06,
      Fecha_Pago_6: Fecha_Pago_06
    };
  console.log(SaleId)
  console.log(data)
    conexion.query('UPDATE VentasMovil SET ? WHERE SaleId = ?', [data, SaleId], (error, results) => {
      if (error) {
        console.error("Error updating the database:", error);
        res.status(500).send("An error occurred while updating the database."); // Handle the error properly
      } else {
        console.log("Updated SaleId:", SaleId);
        res.redirect('RevenueJULIO');
      }
    });
  });
  
  /*Rev Julio */
 router.get('/RevenueAGOSTO', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{

    /* AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE() ; */
      
    conexion.query('select * from ventasmovil where MES_TRABAJADA = "AGOSTO" AND Activada = "Activada" AND Year(Fecha) = 2024;', (error, results)=>{
      if(error){
          throw error
      }else{
          res.render('RevenueAGOSTO', {results:results, user:req.user})
      }
  })
  
  });

  /* Editar Rev Julio*/
router.get('/editRevAgo/:SaleId', async (req, res) => {

    const SaleId = req.params.SaleId
  
    conexion.query('select SaleId, Celular_Tramite,Numero_Abonado, Nombre_Cliente, Primer_Apellido_Cliente, Fecha_Activacion,  Factura_1,Monto_1,Fecha_Pago_1,Factura_2,Monto_2,Fecha_Pago_2,Factura_3,Monto_3,Fecha_Pago_3,Factura_4,Monto_4,Fecha_Pago_4,Factura_5,Monto_5,Fecha_Pago_5,Factura_6,Monto_6,Fecha_Pago_6  from VentasMovil where SaleId = ?', [SaleId], (error, results)=>{
      if (error) {
        throw error;
      } else {
        let saleData = results[0];
    
        // Assuming the two date fields are `Fecha_Activacion` and `Fecha_Entrega`
        let dbDate10 = saleData.Fecha_Activacion; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate1 = saleData.Fecha_Pago_1; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate2 = saleData.Fecha_Pago_2; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate3 = saleData.Fecha_Pago_3; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate4 = saleData.Fecha_Pago_4; // Replace `Fecha_Activacion` with your actual date field name
        let dbDate5 = saleData.Fecha_Pago_5; // Replace `Fecha_Entrega` with your actual date field name
        let dbDate6 = saleData.Fecha_Pago_6; // Replace `Fecha_Entrega` with your actual date field name
    
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
        const formattedDate10 = processDate(dbDate10);
        const formattedDate1 = processDate(dbDate1);
        const formattedDate2 = processDate(dbDate2);
        const formattedDate3 = processDate(dbDate3);
        const formattedDate4 = processDate(dbDate4);
        const formattedDate5 = processDate(dbDate5);
        const formattedDate6 = processDate(dbDate6);
    
        // Add the formatted dates back to the results object or as new fields
        saleData.formattedFecha_Activacion = formattedDate10;
        saleData.formattedFecha_Pago_1 = formattedDate1;
        saleData.formattedFecha_Pago_2 = formattedDate2;
        saleData.formattedFecha_Pago_3 = formattedDate3;
        saleData.formattedFecha_Pago_4 = formattedDate4;
        saleData.formattedFecha_Pago_5 = formattedDate5;
        saleData.formattedFecha_Pago_6 = formattedDate6;
    
        // Render the template with the formatted dates
        res.render('editarRevAgo', { SaleId: saleData, user: req.user });
      }
  })
  
  });
  
  router.post('/editRevAgo', (req, res) => {
    const SaleId = req.body.SaleId;
  
    // Format the date fields as "YYYY/MM/DD"
    var FechaActivacion = moment(req.body.column33).format('YYYY/MM/DD');
    var Fecha_Pago_1 = moment(req.body.columnFP1).format('YYYY/MM/DD');
    var Fecha_Pago_2 = moment(req.body.columnFP2).format('YYYY/MM/DD');
    var Fecha_Pago_3 = moment(req.body.columnFP3).format('YYYY/MM/DD');
    var Fecha_Pago_4 = moment(req.body.columnFP4).format('YYYY/MM/DD');
    var Fecha_Pago_5 = moment(req.body.columnFP5).format('YYYY/MM/DD');
    var Fecha_Pago_6 = moment(req.body.columnFP6).format('YYYY/MM/DD');
    var Monto_1 = req.body.columnM1;
    var Monto_2 = req.body.columnM2;
    var Monto_3 = req.body.columnM3;
    var Monto_4 = req.body.columnM4;
    var Monto_5 = req.body.columnM5;
    var Monto_6 = req.body.columnM6;
  
    if(FechaActivacion == "Invalid date"){
     var FechaActivacion1 = null
    }else{
      FechaActivacion1 = FechaActivacion
    }
  
    if(Fecha_Pago_1 == "Invalid date"){
      var Fecha_Pago_01 = null
     }else{
        Fecha_Pago_01 = Fecha_Pago_1
     }
     if(Fecha_Pago_2 == "Invalid date"){
        var Fecha_Pago_02 = null
       }else{
        Fecha_Pago_02 = Fecha_Pago_2
       }
       if(Fecha_Pago_3 == "Invalid date"){
        var Fecha_Pago_03 = null
       }else{
        Fecha_Pago_03 = Fecha_Pago_3
       }
       if(Fecha_Pago_4 == "Invalid date"){
        var Fecha_Pago_04 = null
       }else{
        Fecha_Pago_04 = Fecha_Pago_4
       }
       if(Fecha_Pago_5 == "Invalid date"){
        var Fecha_Pago_05 = null
       }else{
        Fecha_Pago_05 = Fecha_Pago_5
       }
       if(Fecha_Pago_6 == "Invalid date"){
        var Fecha_Pago_06 = null
       }else{
        Fecha_Pago_06 = Fecha_Pago_6
       }

       if(Monto_1 == ""){
        var Monto_01 = null
       }else{
        Monto_01 = Monto_1
       }
       if(Monto_2 == ""){
        var Monto_02 = null
       }else{
        Monto_02 = Monto_2
       }
       if(Monto_3 == ""){
        var Monto_03 = null
       }else{
        Monto_03 = Monto_3
       }
       if(Monto_4 == ""){
        var Monto_04 = null
       }else{
        Monto_04 = Monto_4
       }
       if(Monto_5 == ""){
        var Monto_05 = null
       }else{
        Monto_05 = Monto_5
       }
       if(Monto_6 == ""){
        var Monto_06 = null
       }else{
        Monto_06 = Monto_6
       }

  
    // Rest of the fields
    const data = {
      Factura_1: req.body.columnF1,
      Monto_1: Monto_01,
      Fecha_Pago_1: Fecha_Pago_01,
      Factura_2: req.body.columnF2,
      Monto_2: Monto_02,
      Fecha_Pago_2: Fecha_Pago_02,
      Factura_3: req.body.columnF3,
      Monto_3: Monto_03,
      Fecha_Pago_3: Fecha_Pago_03,
      Factura_4: req.body.columnF4,
      Monto_4: Monto_04,
      Fecha_Pago_4: Fecha_Pago_04,
      Factura_5: req.body.columnF5,
      Monto_5: Monto_05,
      Fecha_Pago_5: Fecha_Pago_05,
      Factura_6: req.body.columnF6,
      Monto_6: Monto_06,
      Fecha_Pago_6: Fecha_Pago_06
    };
  console.log(SaleId)
  console.log(data)
    conexion.query('UPDATE VentasMovil SET ? WHERE SaleId = ?', [data, SaleId], (error, results) => {
      if (error) {
        console.error("Error updating the database:", error);
        res.status(500).send("An error occurred while updating the database."); // Handle the error properly
      } else {
        console.log("Updated SaleId:", SaleId);
        res.redirect('RevenueAGOSTO');
      }
    });
  });

   /*Rev Julio */
 router.get('/RevenueOCTUBRE', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{

  /* AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE() ; */
    
  conexion.query('select * from ventasmovil where MES_TRABAJADA = "OCTUBRE" AND Activada = "Activada" AND Year(Fecha) = 2024;', (error, results)=>{
    if(error){
        throw error
    }else{
        res.render('RevenueOCTUBRE', {results:results, user:req.user})
    }
})

});
  /* Editar Rev Octubre*/
router.get('/editRevOct/:SaleId', async (req, res) => {

  const SaleId = req.params.SaleId

  conexion.query('select SaleId, Celular_Tramite,Numero_Abonado, Nombre_Cliente, Primer_Apellido_Cliente, Fecha_Activacion,  Factura_1,Monto_1,Fecha_Pago_1,Factura_2,Monto_2,Fecha_Pago_2,Factura_3,Monto_3,Fecha_Pago_3,Factura_4,Monto_4,Fecha_Pago_4,Factura_5,Monto_5,Fecha_Pago_5,Factura_6,Monto_6,Fecha_Pago_6  from VentasMovil where SaleId = ?', [SaleId], (error, results)=>{
    if (error) {
      throw error;
    } else {
      let saleData = results[0];
  
      // Assuming the two date fields are `Fecha_Activacion` and `Fecha_Entrega`
      let dbDate10 = saleData.Fecha_Activacion; // Replace `Fecha_Activacion` with your actual date field name
      let dbDate1 = saleData.Fecha_Pago_1; // Replace `Fecha_Activacion` with your actual date field name
      let dbDate2 = saleData.Fecha_Pago_2; // Replace `Fecha_Entrega` with your actual date field name
      let dbDate3 = saleData.Fecha_Pago_3; // Replace `Fecha_Entrega` with your actual date field name
      let dbDate4 = saleData.Fecha_Pago_4; // Replace `Fecha_Activacion` with your actual date field name
      let dbDate5 = saleData.Fecha_Pago_5; // Replace `Fecha_Entrega` with your actual date field name
      let dbDate6 = saleData.Fecha_Pago_6; // Replace `Fecha_Entrega` with your actual date field name
  
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
      const formattedDate10 = processDate(dbDate10);
      const formattedDate1 = processDate(dbDate1);
      const formattedDate2 = processDate(dbDate2);
      const formattedDate3 = processDate(dbDate3);
      const formattedDate4 = processDate(dbDate4);
      const formattedDate5 = processDate(dbDate5);
      const formattedDate6 = processDate(dbDate6);
  
      // Add the formatted dates back to the results object or as new fields
      saleData.formattedFecha_Activacion = formattedDate10;
      saleData.formattedFecha_Pago_1 = formattedDate1;
      saleData.formattedFecha_Pago_2 = formattedDate2;
      saleData.formattedFecha_Pago_3 = formattedDate3;
      saleData.formattedFecha_Pago_4 = formattedDate4;
      saleData.formattedFecha_Pago_5 = formattedDate5;
      saleData.formattedFecha_Pago_6 = formattedDate6;
  
      // Render the template with the formatted dates
      res.render('editarRevOct', { SaleId: saleData, user: req.user });
    }
})

});

router.post('/editRevOct', (req, res) => {
  const SaleId = req.body.SaleId;

  // Format the date fields as "YYYY/MM/DD"
  var FechaActivacion = moment(req.body.column33).format('YYYY/MM/DD');
  var Fecha_Pago_1 = moment(req.body.columnFP1).format('YYYY/MM/DD');
  var Fecha_Pago_2 = moment(req.body.columnFP2).format('YYYY/MM/DD');
  var Fecha_Pago_3 = moment(req.body.columnFP3).format('YYYY/MM/DD');
  var Fecha_Pago_4 = moment(req.body.columnFP4).format('YYYY/MM/DD');
  var Fecha_Pago_5 = moment(req.body.columnFP5).format('YYYY/MM/DD');
  var Fecha_Pago_6 = moment(req.body.columnFP6).format('YYYY/MM/DD');
  var Monto_1 = req.body.columnM1;
  var Monto_2 = req.body.columnM2;
  var Monto_3 = req.body.columnM3;
  var Monto_4 = req.body.columnM4;
  var Monto_5 = req.body.columnM5;
  var Monto_6 = req.body.columnM6;

  if(FechaActivacion == "Invalid date"){
   var FechaActivacion1 = null
  }else{
    FechaActivacion1 = FechaActivacion
  }

  if(Fecha_Pago_1 == "Invalid date"){
    var Fecha_Pago_01 = null
   }else{
      Fecha_Pago_01 = Fecha_Pago_1
   }
   if(Fecha_Pago_2 == "Invalid date"){
      var Fecha_Pago_02 = null
     }else{
      Fecha_Pago_02 = Fecha_Pago_2
     }
     if(Fecha_Pago_3 == "Invalid date"){
      var Fecha_Pago_03 = null
     }else{
      Fecha_Pago_03 = Fecha_Pago_3
     }
     if(Fecha_Pago_4 == "Invalid date"){
      var Fecha_Pago_04 = null
     }else{
      Fecha_Pago_04 = Fecha_Pago_4
     }
     if(Fecha_Pago_5 == "Invalid date"){
      var Fecha_Pago_05 = null
     }else{
      Fecha_Pago_05 = Fecha_Pago_5
     }
     if(Fecha_Pago_6 == "Invalid date"){
      var Fecha_Pago_06 = null
     }else{
      Fecha_Pago_06 = Fecha_Pago_6
     }

     if(Monto_1 == ""){
      var Monto_01 = null
     }else{
      Monto_01 = Monto_1
     }
     if(Monto_2 == ""){
      var Monto_02 = null
     }else{
      Monto_02 = Monto_2
     }
     if(Monto_3 == ""){
      var Monto_03 = null
     }else{
      Monto_03 = Monto_3
     }
     if(Monto_4 == ""){
      var Monto_04 = null
     }else{
      Monto_04 = Monto_4
     }
     if(Monto_5 == ""){
      var Monto_05 = null
     }else{
      Monto_05 = Monto_5
     }
     if(Monto_6 == ""){
      var Monto_06 = null
     }else{
      Monto_06 = Monto_6
     }


  // Rest of the fields
  const data = {
    Factura_1: req.body.columnF1,
    Monto_1: Monto_01,
    Fecha_Pago_1: Fecha_Pago_01,
    Factura_2: req.body.columnF2,
    Monto_2: Monto_02,
    Fecha_Pago_2: Fecha_Pago_02,
    Factura_3: req.body.columnF3,
    Monto_3: Monto_03,
    Fecha_Pago_3: Fecha_Pago_03,
    Factura_4: req.body.columnF4,
    Monto_4: Monto_04,
    Fecha_Pago_4: Fecha_Pago_04,
    Factura_5: req.body.columnF5,
    Monto_5: Monto_05,
    Fecha_Pago_5: Fecha_Pago_05,
    Factura_6: req.body.columnF6,
    Monto_6: Monto_06,
    Fecha_Pago_6: Fecha_Pago_06
  };
console.log(SaleId)
console.log(data)
  conexion.query('UPDATE VentasMovil SET ? WHERE SaleId = ?', [data, SaleId], (error, results) => {
    if (error) {
      console.error("Error updating the database:", error);
      res.status(500).send("An error occurred while updating the database."); // Handle the error properly
    } else {
      console.log("Updated SaleId:", SaleId);
      res.redirect('RevenueOCTUBRE');
    }
  });
});


/*Rev Julio */
router.get('/RevenueNOVIEMBRE', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{

  /* AND Fecha >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND Fecha <= CURDATE() ; */
    
  conexion.query('select * from ventasmovil where MES_TRABAJADA = "NOVIEMBRE" AND Activada = "Activada" AND Year(Fecha) = 2024;', (error, results)=>{
    if(error){
        throw error
    }else{
        res.render('RevenueNOVIEMBRE', {results:results, user:req.user})
    }
})

});
 /* Editar Rev Octubre*/
 router.get('/editReNov/:SaleId', async (req, res) => {

  const SaleId = req.params.SaleId

  conexion.query('select SaleId, Celular_Tramite,Numero_Abonado, Nombre_Cliente, Primer_Apellido_Cliente, Fecha_Activacion,  Factura_1,Monto_1,Fecha_Pago_1,Factura_2,Monto_2,Fecha_Pago_2,Factura_3,Monto_3,Fecha_Pago_3,Factura_4,Monto_4,Fecha_Pago_4,Factura_5,Monto_5,Fecha_Pago_5,Factura_6,Monto_6,Fecha_Pago_6  from VentasMovil where SaleId = ?', [SaleId], (error, results)=>{
    if (error) {
      throw error;
    } else {
      let saleData = results[0];
  
      // Assuming the two date fields are `Fecha_Activacion` and `Fecha_Entrega`
      let dbDate10 = saleData.Fecha_Activacion; // Replace `Fecha_Activacion` with your actual date field name
      let dbDate1 = saleData.Fecha_Pago_1; // Replace `Fecha_Activacion` with your actual date field name
      let dbDate2 = saleData.Fecha_Pago_2; // Replace `Fecha_Entrega` with your actual date field name
      let dbDate3 = saleData.Fecha_Pago_3; // Replace `Fecha_Entrega` with your actual date field name
      let dbDate4 = saleData.Fecha_Pago_4; // Replace `Fecha_Activacion` with your actual date field name
      let dbDate5 = saleData.Fecha_Pago_5; // Replace `Fecha_Entrega` with your actual date field name
      let dbDate6 = saleData.Fecha_Pago_6; // Replace `Fecha_Entrega` with your actual date field name
  
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
      const formattedDate10 = processDate(dbDate10);
      const formattedDate1 = processDate(dbDate1);
      const formattedDate2 = processDate(dbDate2);
      const formattedDate3 = processDate(dbDate3);
      const formattedDate4 = processDate(dbDate4);
      const formattedDate5 = processDate(dbDate5);
      const formattedDate6 = processDate(dbDate6);
  
      // Add the formatted dates back to the results object or as new fields
      saleData.formattedFecha_Activacion = formattedDate10;
      saleData.formattedFecha_Pago_1 = formattedDate1;
      saleData.formattedFecha_Pago_2 = formattedDate2;
      saleData.formattedFecha_Pago_3 = formattedDate3;
      saleData.formattedFecha_Pago_4 = formattedDate4;
      saleData.formattedFecha_Pago_5 = formattedDate5;
      saleData.formattedFecha_Pago_6 = formattedDate6;
  
      // Render the template with the formatted dates
      res.render('editarRevNov', { SaleId: saleData, user: req.user });
    }
})

});

router.post('/editRevNov', (req, res) => {
  const SaleId = req.body.SaleId;

  // Format the date fields as "YYYY/MM/DD"
  var FechaActivacion = moment(req.body.column33).format('YYYY/MM/DD');
  var Fecha_Pago_1 = moment(req.body.columnFP1).format('YYYY/MM/DD');
  var Fecha_Pago_2 = moment(req.body.columnFP2).format('YYYY/MM/DD');
  var Fecha_Pago_3 = moment(req.body.columnFP3).format('YYYY/MM/DD');
  var Fecha_Pago_4 = moment(req.body.columnFP4).format('YYYY/MM/DD');
  var Fecha_Pago_5 = moment(req.body.columnFP5).format('YYYY/MM/DD');
  var Fecha_Pago_6 = moment(req.body.columnFP6).format('YYYY/MM/DD');
  var Monto_1 = req.body.columnM1;
  var Monto_2 = req.body.columnM2;
  var Monto_3 = req.body.columnM3;
  var Monto_4 = req.body.columnM4;
  var Monto_5 = req.body.columnM5;
  var Monto_6 = req.body.columnM6;

  if(FechaActivacion == "Invalid date"){
   var FechaActivacion1 = null
  }else{
    FechaActivacion1 = FechaActivacion
  }

  if(Fecha_Pago_1 == "Invalid date"){
    var Fecha_Pago_01 = null
   }else{
      Fecha_Pago_01 = Fecha_Pago_1
   }
   if(Fecha_Pago_2 == "Invalid date"){
      var Fecha_Pago_02 = null
     }else{
      Fecha_Pago_02 = Fecha_Pago_2
     }
     if(Fecha_Pago_3 == "Invalid date"){
      var Fecha_Pago_03 = null
     }else{
      Fecha_Pago_03 = Fecha_Pago_3
     }
     if(Fecha_Pago_4 == "Invalid date"){
      var Fecha_Pago_04 = null
     }else{
      Fecha_Pago_04 = Fecha_Pago_4
     }
     if(Fecha_Pago_5 == "Invalid date"){
      var Fecha_Pago_05 = null
     }else{
      Fecha_Pago_05 = Fecha_Pago_5
     }
     if(Fecha_Pago_6 == "Invalid date"){
      var Fecha_Pago_06 = null
     }else{
      Fecha_Pago_06 = Fecha_Pago_6
     }

     if(Monto_1 == ""){
      var Monto_01 = null
     }else{
      Monto_01 = Monto_1
     }
     if(Monto_2 == ""){
      var Monto_02 = null
     }else{
      Monto_02 = Monto_2
     }
     if(Monto_3 == ""){
      var Monto_03 = null
     }else{
      Monto_03 = Monto_3
     }
     if(Monto_4 == ""){
      var Monto_04 = null
     }else{
      Monto_04 = Monto_4
     }
     if(Monto_5 == ""){
      var Monto_05 = null
     }else{
      Monto_05 = Monto_5
     }
     if(Monto_6 == ""){
      var Monto_06 = null
     }else{
      Monto_06 = Monto_6
     }


  // Rest of the fields
  const data = {
    Factura_1: req.body.columnF1,
    Monto_1: Monto_01,
    Fecha_Pago_1: Fecha_Pago_01,
    Factura_2: req.body.columnF2,
    Monto_2: Monto_02,
    Fecha_Pago_2: Fecha_Pago_02,
    Factura_3: req.body.columnF3,
    Monto_3: Monto_03,
    Fecha_Pago_3: Fecha_Pago_03,
    Factura_4: req.body.columnF4,
    Monto_4: Monto_04,
    Fecha_Pago_4: Fecha_Pago_04,
    Factura_5: req.body.columnF5,
    Monto_5: Monto_05,
    Fecha_Pago_5: Fecha_Pago_05,
    Factura_6: req.body.columnF6,
    Monto_6: Monto_06,
    Fecha_Pago_6: Fecha_Pago_06
  };
console.log(SaleId)
console.log(data)
  conexion.query('UPDATE VentasMovil SET ? WHERE SaleId = ?', [data, SaleId], (error, results) => {
    if (error) {
      console.error("Error updating the database:", error);
      res.status(500).send("An error occurred while updating the database."); // Handle the error properly
    } else {
      console.log("Updated SaleId:", SaleId);
      res.redirect('RevenueNOVIEMBRE');
    }
  });
});

  module.exports = router;