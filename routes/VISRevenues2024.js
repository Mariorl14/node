const express = require('express');
const {google} = require("googleapis");
const router = express.Router()

const conexion = require('../database/db');

const authController = require('../controllers/authController')
const UsuarioController = require('../controllers/UsuarioController')
const VentasController = require('../controllers/VentasController');
const NoCache = require('../controllers/noCache');

router.get('/revenueEnero2024', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{
    
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
        range: "Revenue Enero 2024!A2:AB",
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
                res.render('revenueEnero2024', {rows:rows, data: results, user: req.user });
        }
    });
    
  
  })
  router.get('/revenueFebrero2024', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{
      
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
        range: "Revenue Febrero 2024!A2:AB",
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
                res.render('revenueFebrero2024', {rows:rows, data: results, user: req.user });
        }
    });
    
  
  })
  router.get('/revenueMarzo2024', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{
      
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
        range: "Revenue Marzo 2024!A2:AB",
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
                res.render('revenueMarzo2024', {rows:rows, data: results, user: req.user });
        }
    });
    
  
  })
  router.get('/revenueAbril2024', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{
      
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
        range: "Revenue Abril 2024!A2:AB",
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
                res.render('revenueAbril2024', {rows:rows, data: results, user: req.user });
        }
    });
    
  
  })
  router.get('/revenueMayo2024', authController.isAuthenticated,authController.authRol, NoCache.nocache,  async (req, res)=>{
      
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
        range: "Revenue Mayo 2024!A2:AB",
    })
  
    var user = req.user;
    var rows = ventas.data.values;
  
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
                res.render('revenueMayo2024', {rows:rows, data: results, user: req.user });
        }
    });
    
  
  })

module.exports = router;