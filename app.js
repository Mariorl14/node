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

/* Users */
const UsersRoute = require("./routes/Users");
app.use('/',UsersRoute);

/* Movil */
const MovilRoute = require("./routes/Movil");
app.use('/',MovilRoute);
/* Movil */

const Revenues = require("./routes/Revenues");
app.use('/',Revenues);

/* Fijo */
const FijoRoute = require("./routes/Fijo");
app.use('/',FijoRoute);

/* BD Claro */
const ClaroRoute = require("./routes/BDClaro");
app.use('/',ClaroRoute);

/* BD Kolbi */
const KolbiRoute = require("./routes/BDKolbi");
app.use('/',KolbiRoute);

/* Dashboard */
const Dashboard = require("./routes/Dashboard");
app.use('/',Dashboard);

/* BD Fijo */
const BDFijoRoute = require("./routes/BDFijo");
app.use('/',BDFijoRoute);

/* UploadExcel */
const UploadExcel = require("./routes/UploadExcel");
app.use('/',UploadExcel);

/* BD ITX */
const BDITXRoute = require("./routes/BDITX");
app.use('/',BDITXRoute);

/* BD Migraciones */
const BDMigracionesRoute = require("./routes/BDMigraciones");
app.use('/',BDMigracionesRoute);

/* BD Telefonos */
const BDTelefonosRoute = require("./routes/BDTelefonos");
app.use('/',BDTelefonosRoute);

/* Revenues 2024 Edit */
const EditRev2024Route = require("./routes/EditRevenues2024");
app.use('/',EditRev2024Route);

/* Revenues 2024 VIS */
const VisRev2024Route = require("./routes/VISRevenues2024");
app.use('/',VisRev2024Route);

/* Ticocel */
const TicocelRoute = require("./routes/Ticocel");
app.use('/',TicocelRoute);

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

  const port = process.env.PORT || 8080;
app.listen(port, () => {
console.log(`Server running on port ${port}`);
});