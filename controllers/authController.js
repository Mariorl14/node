const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');
const {promisify} = require('util');
const { time } = require('console');


exports.register = async (req, res)=>{
    try {
    const user = req.body.user;
    const nombre = req.body.nombre;
    const rol = req.body.rol;
    const cedula = req.body.cedula;
    const telefono = req.body.telefono;
    const pass = req.body.pass;
    const codigoEmpleado = req.body.codigoEmpleado;
    const salario = req.body.salario;
    var fecha_Ingreso = time();
    let passwordHaash = await bcryptjs.hash(pass, 8);

    conexion.query('INSERT INTO users SET ?', {user:user,
        nombre:nombre,
        rol:rol,
        cedula:cedula,
        telefono:telefono,
        fecha_Ingreso:fecha_Ingreso,
        pass:passwordHaash,
        codigoEmpleado:codigoEmpleado,
        salario:salario,}, async(error, results)=>{
            if(error){
                console.log(error);
            }
            console.log("eteas")
            res.redirect('home')
            /*
            res.render('register',{
                alert: true,
                alertTitle: "Registro",
                alertMessage: "!Registro exitoso¡",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: 'home'
            })*/
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
                    ruta: 'home',
                })
                
               /*Swal.fire({
                    icon: 'success',
                    title: 'Conectado',
                    text: 'Conexion exitosa'
                    kljvnbf
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


/*
const token = req.cookies.jwt;

if(token){
    
    jwt.verify(token, process.env.JWT_SECRETO, (err, decodedToken) => {
        if(err){
            console.log(err.message);
            res.redirect('/');
        }else{
            console.log(decodedToken);
            next();
        }
    })
}else{
    res.redirect('/');
}
*/

}

exports.authRol = async (req, res, next)=>{

    if(req.user.rol !== 'admin'){
        try {
            res.status(401)
            return res.redirect('/listarVentasGoogle')
        } catch (error) {
            console.log(error)
             return next()
        }
    }else{
        next()
    }

}
exports.authRolTicocel = async (req, res, next)=>{

    if(req.user.rol !== 'admin' && req.user.empresa == 'Ticocel'){
        try {
            res.status(401)
            return res.redirect('/listarVentasGoogleFijoTicocel')
        } catch (error) {
            console.log(error)
             return next()
        }
    }else{
        next()
    }

}
exports.authRolFavtelNIC = async (req, res, next)=>{

    if(req.user.rol !== 'admin' && req.user.empresa == 'Favtel'){
        try {
            res.status(401)
            return res.redirect('/BDFijoNICFAV')
        } catch (error) {
            console.log(error)
             return next()
        }
    }else{
        next()
    }

}
exports.authRolNICFAVFijo = async (req, res, next)=>{

    if(req.user.rol !== 'admin' && req.user.empresa == 'Favtel'){
        try {
            res.status(401)
            return res.redirect('/listarVentasGoogleFijo')
        } catch (error) {
            console.log(error)
             return next()
        }
    }else{
        next()
    }

}

/** }
exports.TicocelRVM = async (req, res, next)=>{

    if(req.user.empresa !== 'Favtel'){
        try {
            res.status(401)
            return res.redirect('/registrarVentaTicocel')
        } catch (error) {
            console.log(error)
             return next()
        }
    }else{
        next()
    }

}
exports.TicocelRVF = async (req, res, next)=>{

    if(req.user.empresa !== 'Favtel'){
        try {
            res.status(401)
            return res.redirect('/registrarVentaTicocelFijo')
        } catch (error) {
            console.log(error)
             return next()
        }
    }else{
        next()
    }

}
exports.TicocelBDK = async (req, res, next)=>{

    if(req.user.empresa !== 'Favtel'){
        try {
            res.status(401)
            return res.redirect('/BDKolbiTicocel')
        } catch (error) {
            console.log(error)
             return next()
        }
    }else{
        next()
    }

}
exports.TicocelBDC = async (req, res, next)=>{

    if(req.user.empresa !== 'Favtel'){
        try {
            res.status(401)
            return res.redirect('/BDClaroTicocel')
        } catch (error) {
            console.log(error)
             return next()
        }
    }else{
        next()
    }

}
exports.TicocelBDF = async (req, res, next)=>{

    if(req.user.empresa !== 'Favtel'){
        try {
            res.status(401)
            return res.redirect('/BDFijoTicocel')
        } catch (error) {
            console.log(error)
             return next()
        }
    }else{
        next()
    }

}
*/

exports.TicocelBDF = async (req, res, next)=>{

    if(req.user.empresa == 'Ticocel'){
        try {
            res.status(401)
            return res.redirect('/BDFijoTicocel')
        } catch (error) {
            console.log(error)
             return next()
        }
    }else{
        next()
    }

}
exports.TicocelRVF = async (req, res, next)=>{

    if(req.user.empresa == 'Ticocel'){
        try {
            res.status(401)
            return res.redirect('/registrarVentaTicocelFijo')
        } catch (error) {
            console.log(error)
             return next()
        }
    }else{
        next()
    }

}
exports.TicocelLVFTIC = async (req, res, next)=>{

    if(req.user.empresa == 'Ticocel'){
        try {
            res.status(401)
            return res.redirect('/listarVentasGoogleFijoTicocel')
        } catch (error) {
            console.log(error)
             return next()
        }
    }else{
        next()
    }

}

exports.logout = async (req, res)=>{
    res.clearCookie('jwt');
    /*
    return res.redirect('/')
    */
   res.redirect('/');
}
exports.authColillas = async (req, res, next)=>{

    if(req.user.nombre !== 'Mario Enrique Rodriguez Loria' && 
    'Monserrat Rodríguez Fernández' &&
     'Javier Andrés Vargas Vega'){
        try {
            res.status(401)
            return res.redirect('/listarVentasGoogle')
        } catch (error) {
            console.log(error)
             return next()
        }
    }else{
        next()
    }

}
/*
exports.bdFijo = async (req, res, next)=>{

    if(req.user.rol !== 'admin' || req.user.rol !== 'ventasFijo'){
        try {
            res.status(401)
            return res.redirect('/bdClaro')
        } catch (error) {
            console.log(error)
             return next()
        }
    }else{
        next()
    }

}
*/