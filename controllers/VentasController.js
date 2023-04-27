const conexion = require('../database/db');
const {google} = require("googleapis");
const { userInfo } = require('os');
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
    const idVendedor = req.body.nombreVendedor;

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

exports.registrarVentaGoogle = async (req, res) => {

    const {nombreDelCliente, 
        segundoNombreDelCliente,
        primerApellidoDelCliente,
        segundoApellidoDelCliente, 
        tipoDeDocumentoDeIdentidad, 
        numeroDeDocumento, 
        nacionalidad, 
        numeroCelularDeTramite, 
        tipoDeTramite,
        numeroDeContacto1, 
        numeroDeContacto2, 
        enCasoDePortabilidad, 
        tipoDePlanAContratar, 
        direccionExacta, 
        provincia, 
        canton, 
        distritp,
        nombreVendedor, 
        fecha = new Date()} = req.body;

        var date = new Date();
        //const {fecha} = req.date;

       /// const {idVendedor} = req.idVendedor;
       
       if(tipoDePlanAContratar=="@1Plus"){

        var ValorDelPlan = "10300";

       }else if(tipoDePlanAContratar=="@1"){

        var ValorDelPlan = "10700";

       }
       else if(tipoDePlanAContratar=="@2"){

        var ValorDelPlan = "16000";

       }
       else if(tipoDePlanAContratar=="@3"){

        var ValorDelPlan = "22000";

       }
       else if(tipoDePlanAContratar=="@4"){

        var ValorDelPlan = "27200";

       }
       else if(tipoDePlanAContratar=="@5"){

        var ValorDelPlan = "33200";

       }else{
        var ValorDelPlan = "42200";
       }

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

/// client instance for auth
    const client = await auth.getClient();

    /// Instance of google sheets api 
    const googleSheets = google.sheets({ version: "v4", auth: client});


    const spreadsheetId = "1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY";
    // Get DATA 



    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });

    /// rows from spreadsheet

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Respuestas_Formulario",
    })

    var numeroContrato = "";
    var numeroAbonado = "";
    /// Write rows 
    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Respuestas_Formulario",
        valueInputOption: "USER_ENTERED",
        resource: {
         values: [[nombreDelCliente, 
            segundoNombreDelCliente,
            primerApellidoDelCliente,
            segundoApellidoDelCliente, 
            tipoDeDocumentoDeIdentidad, 
            numeroDeDocumento, 
            nacionalidad, 
            numeroCelularDeTramite, 
            tipoDeTramite,
            numeroContrato,
            numeroAbonado,
            numeroDeContacto1, 
            numeroDeContacto2, 
            enCasoDePortabilidad, 
            tipoDePlanAContratar, 
            ValorDelPlan, 
            direccionExacta, 
            provincia, 
            canton, 
            distritp,
            nombreVendedor,
              fecha]]
        }, 
    })

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
     const idVendedor = req.body.nombreVendedor;
 
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
             //res.redirect('home')
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

    res.redirect("misEstadisticas");
}

exports.listarVentaGoogle = async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

/// client instance for auth
    const client = await auth.getClient();

    /// Instance of google sheets api 
    const googleSheets = google.sheets({ version: "v4", auth: client});


    const spreadsheetId = "1vhWdDiGNYWnQp9WbHzZflejPzMM-5g08UGmvNu8B5SY";
    // Get DATA 



    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });

    /// rows from spreadsheet

    const ventas = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Respuestas_Formulario",
    })

    res.render('listarVentasGoogle', {ventas});

}