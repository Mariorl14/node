const express = require('express');
const {google} = require("googleapis");
const path = require('path');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');


const app = express();

/*Seteamos el motor de plantillas*/


app.set('view engine', 'ejs');


/*archivos estaticos */
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set("layout login", false);



/*Datos de envios desde forms */
app.use(express.urlencoded({extended:false}));
app.use(express.json());

/*Variables de entorno*/
///const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});


/*Cookie parser */
app.use(cookieParser());

/*Lamar al router*/
app.use('/', require('./routes/router')); 

/* PARA ELIMINAR CACHE Y NO HACER BACK DESPUES DE LOGOUT  */

/*
app.use(function(req, res, next) {
    if(!req.user)
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    /*
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Vary', 'Cookie');
    res.setHeader('Surrogate-Control', 'no-store');
    
    next();
});
*/


/*
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Vary', 'Cookie');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });
 */

const port = process.env.port || 3000; 
app.listen(port, (req, res)=>{
    console.log('Running in http://localhost:3000');
})