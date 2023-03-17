const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.DB_Host,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((error)=>{
    if(error){
        console.log('El error de conexion es: ' +error);
        return;
    }
    console.log('Conectaado Tetas');
});

module.exports = connection; 