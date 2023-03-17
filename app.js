const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();


app.use(express.urlencoded({extended:false}));
app.use(express.json());


const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});


//app.use('/resources', express.static('public'));
//app.use('/resources', express.static(__dirname + '/public'));


app.set('view engine', 'ejs');
app.use(expressLayouts);
//app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'public')));

const router = require('./routes/router')
app.use(router.routes)


const bcryptjs = require('bcryptjs');

const session = require('express-session');
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true
}));


const connection = require('./database/db');


/*
app.get('/', (req, res) => {
    res.render('index', {msg:'ricas'});
})
app.get('/login', (req, res) => {
    res.render('login');
})
app.get('/register', (req, res) => {
    res.render('register');
})
*/


///Registro de usuarios
app.post('/register', async (req, res) => {
    const user = req.body.user;
    const nombre = req.body.nombre;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', {user:user,
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
                ruta: ''
            })
        })
})

///Autentificfacion 
app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if(user&&pass){
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render('login',{
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Informacion Incorrecta",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
                }else{
                    req.session.loggedin = true;
                    req.session.name = results[0].name
                    res.render('login',{
                        alert: true,
                        alertTitle: "Coneccion lista",
                        alertMessage: "!Registro exitoso¡",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: ''
                    });
                }
        })
    }else{
        res.send('Ingrese un usuario y o constraeña');
    }
})

///auth pages
app.get('/', (req, res) => {
    if(req.session.loggedin){
        res.render('home',{
            login: true,
            name: req.session.name
        });
    }else{
        res.render('home',{
            login: false,
            name: 'Debe iniciar sesion'
        })
    }
})

///logout
app.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/login')
    })
})


const port = process.env.port || 3000; 
app.listen(port, (req, res)=>{
    console.log('Running in http://localhost:3000');
})