const mysql = require('mysql');
const connection = mysql.createConnection({
    /*
    host     : 'database-2.cmlp3fj6leck.us-east-1.rds.amazonaws.com',
    user     : 'admin',
    password : 'Ganador02',
    database : 'favtel'
    */

    host     : '34.30.89.2',
    user     : 'root',
    password : 'Ganador02',
    database : 'favtel'

});

connection.connect((error)=>{
    if(error){
        console.log('El error de conexion es: ' +error);
        return;
    }
    console.log('Conectaado Tetas');
});

module.exports = connection; 

