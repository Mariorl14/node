const mysql = require('mysql');
var fs = require('fs');
/*const serverCa = [fs.readFileSync("/var/www/html/DigiCertGlobalRootCA.crt.pem", "utf8")];*/
const connection = mysql.createConnection({

/*
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : "favtel"
    */
    
    host     : 'serverfavtel.mysql.database.azure.com',
    user     : 'adminFavtel',
    password : 'FAvaRO1202',
    database : 'favtel',
    port:3306,
    ssl: true

   /*
    host     : '34.30.89.2',
    user     : 'root',
    password : 'Ganador02',
    database : 'favtel'
    */
    
});

connection.connect((error)=>{
    if(error){
        console.log('El error de conexion es: ' +error);
        return;
    }
    console.log('Conectaado Tetas');
});

module.exports = connection; 

