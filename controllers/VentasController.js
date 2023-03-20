const conexion = require('../database/db');
const {promisify} = require('util');

exports.registrarVenta = async (req, res)=>{
    try {
        var date = new Date();
    const NombreDelCliente = req.body.nombreDelCliente;
    const SegundoNombreDelCliente = req.body.segundoNombreDelCliente;
    const PrimerApellidoDelCliente = req.body.primerApellidoDelCliente;
    const SegundoApellidoDelCliente = req.body.segundoApellidoDelCliente;
    const TipoDeDocumentoDeIdentidad = req.body.tipoDeDocumentoDeIdentidad;
    const NumeroDeDocumento = req.body.numeroDeDocumento;
    const Nacionalidad = req.body.nacionalidad;
    const NumeroCelularDeTramite = req.body.numeroCelularDeTramite;
    const TipoDeTramite = req.body.tipoDeTramite;
    const NumeroDeContacto1 = req.body.numeroDeContacto1;
    const NumeroDeContacto2 = req.body.numeroDeContacto2;
    const EnCasoDePortabilidad = req.body.enCasoDePortabilidad;
    const TipoDePlanAContratar = req.body.tipoDePlanAContratar;
    const ValorDelPlan = req.body.ValorDelPlan;
    const DireccionExacta = req.body.direccionExacta;
    const Provincia = req.body.provincia;
    const Canton = req.body.canton;
    const Distrito = req.body.distritp;
    const Fecha = date;
    const idVendedor = 1;

    conexion.query('INSERT INTO Ventas SET ?',
     {NombreDelCliente:NombreDelCliente,
        SegundoNombreDelCliente:SegundoNombreDelCliente,
        PrimerApellidoDelCliente:PrimerApellidoDelCliente,
        SegundoApellidoDelCliente:SegundoApellidoDelCliente,
        TipoDeDocumentoDeIdentidad:TipoDeDocumentoDeIdentidad,
        NumeroDeDocumento:NumeroDeDocumento,
        Nacionalidad:Nacionalidad,
        NumeroCelularDeTramite:NumeroCelularDeTramite,
        TipoDeTramite:TipoDeTramite,
        NumeroDeContacto1:NumeroDeContacto1,
        NumeroDeContacto2:NumeroDeContacto2,
        EnCasoDePortabilidad:EnCasoDePortabilidad,
        TipoDePlanAContratar:TipoDePlanAContratar,
        ValorDelPlan:ValorDelPlan,
        DireccionExacta:DireccionExacta,
        Provincia:Provincia,
        Canton:Canton,
        Distrito:Distrito,
        Fecha:Fecha,
        idVendedor:idVendedor}, async(error, results)=>{

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