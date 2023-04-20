const mysql = require('mysql');
const connection = mysql.createConnection({


    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : "favtel"
    
    /*
    host     : 'database-2.cmr2yxsgwbk6.us-east-1.rds.amazonaws.com',
    user     : 'admin',
    password : '123456789',
    database : 'favtel'
    */
    

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

