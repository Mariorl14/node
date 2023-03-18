const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');
const {promisify} = require('util');


exports.register = async (req, res)=>{
    try {
    const user = req.body.user;
    const nombre = req.body.nombre;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);

    conexion.query('INSERT INTO users SET ?', {user:user,
        nombre:nombre,
        rol:rol,
        pass:passwordHaash}, async(error, results)=>{
            if(error){
                console.log(error);
            }
            console.log("eteas")
            res.render('register',{
                alert: true,
                alertTitle: "Registro",
                alertMessage: "!Registro exitoso¡",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: 'home'
            })
        })

    } catch (error) {
        console.log(error)
    }
}


exports.login = async (req, res)=>{
    try {
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);

    if(!user || !pass){
        res.render('login', {
            alert: true,
                    alertTitle: "Error",
                    alertMessage: "Informacion Incorrecta",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: ''
        })
    }else{
        conexion.query('SELECT * FROM users WHERE user = ?', [user], async (error, results)=>{
            if(results.length == 0 || ! (await bcryptjs.compare(pass, results[0].pass)) ){
                res.render('login', {
                    alert: true,
                            alertTitle: "Error",
                            alertMessage: "Informacion Incorrecta",
                            alertIcon: 'error',
                            showConfirmButton: false,
                            timer: 800,
                            ruta: ''
                })
            }else{
                console.log('Entramos al else')
                const id = results[0].id
                const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                    expiresIn: process.env.JWT_TIEMPO_EXTRA 
                })

                const cookiesOptions = {
                    expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000 ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookiesOptions)
                
                res.render('login', {
                    alert: true,
                    alertTitle: "Conectado",
                    alertMessage: "Coneccion exitosa",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 800,
                    ruta: 'home'
                })
                
               /*Swal.fire({
                    icon: 'success',
                    title: 'Conectado',
                    text: 'Conexion exitosa'
                  }) */
               ///res.redirect('/home', );
            }
        })
    }

    } catch (error) {
        console.log(error)
    }
}

exports.isAuthenticated = async (req, res, next)=>{
if(req.cookies.jwt){
try {
    const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
    conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results)=>{
        if(!results){return next()}
        req.user = results[0]
        return next()
    })
} catch (error) {
    console.log(error)
    return next()
}
}else{
    res.redirect('/')
}
}

exports.logout = async (req, res)=>{
    res.clearCookie('jwt')
    return res.redirect('/')
}