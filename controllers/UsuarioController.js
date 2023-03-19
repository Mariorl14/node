const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');
const {promisify} = require('util');

exports.editarUser = async (req, res)=>{
    try {
        const id = req.body.id;
    const user = req.body.user;
    const nombre = req.body.nombre;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);

    conexion.query('UPDATE users SET ? WHERE id = ?', [{user:user,
        nombre:nombre,
        rol:rol,
        pass:passwordHaash}, id ], (error, results)=>{
            if(error){
                console.log(error);
            }else{
            console.log("eteas")
            res.redirect('home');
            }
        })

    } catch (error) {
        console.log(error)
    }
}