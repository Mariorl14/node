const conexion = require('../database/db');
const {google} = require("googleapis");
const { userInfo } = require('os');
const {promisify} = require('util');
const nodemailer = require('nodemailer');

    
exports.registrarVenta = async (req, res)=>{
    try {
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
    const Vendedor_Freelance1 = req.body.nombreVendedorFreelance;
    const comentario = req.body.comentario;
    const tipoCliente = req.body.tipoCliente;

    if(TipoDePlanAContratar=="@1Plus"){
        var tipoDePlanAContratar1 = "(CQS) Plan CTRL @1Plus 2 LTE ST";
        var Valor_Plan = "13200";

       }else if(TipoDePlanAContratar=="@1"){
        var tipoDePlanAContratar1 = "(CGS) Plan Con Dep @1 LTE PRO ST";
        var Valor_Plan = "10700";

       }
       else if(TipoDePlanAContratar=="@2"){
        var tipoDePlanAContratar1 = "(CHS) Plan Con Dep @2 LTE PRO ST";
        var Valor_Plan = "16000";

       }
       else if(TipoDePlanAContratar=="@3"){

        var Valor_Plan = "22000";

       }
       else if(TipoDePlanAContratar=="@4"){

        var Valor_Plan = "27200";

       }
       else if(TipoDePlanAContratar=="@5"){

        var Valor_Plan = "33200";

       }else if(TipoDePlanAContratar=="5CA	 Plan LY5G @1 Portate Control ST"){

        var Valor_Plan = "11000";

       }else if(TipoDePlanAContratar=="5CB	 Plan LY5G @2 Portate Control ST"){

        var Valor_Plan = "15000";

       }else if(TipoDePlanAContratar=="5CC Plan LY5G @3 Portate Control ST"){

        var Valor_Plan = "20000";

       }else if(TipoDePlanAContratar=="AB3 Plan 5G @1 Full GB CTRL CT"){

        var Valor_Plan = "11900";

       }else if(TipoDePlanAContratar=="AB4 Plan 5G @2 Full GB CTRL CT"){

        var Valor_Plan = "15900";

       }else{
        var Valor_Plan = "";
       }
       const today = new Date();
       var Numero_Contrato = 0;
       var Numero_Abonado = 0;
       var Activada = "Pendiente";
       var Entregada = "Pendiente";
       var Rechazada = "";
       var codigoLiberty = req.body.codigoLiberty;
       const Cobro_Envío = req.body.cobro_de_envio;
       /*
        var year = today.getFullYear();
        var mes = today.getMonth()+1;
        var dia = today.getDate();
        var fecha =year+"-"+mes+"-"+dia;
        */

    const DireccionExacta = req.body.direccionExacta;
    const Provincia = req.body.provincia;
    const Canton = req.body.canton;
    const Distrito = req.body.distritp;
    const Tipo_Llamada = req.body.tipoLlamada;
    const idVendedor = req.body.nombreVendedor;

    var Entregador = "";
    var Detalle = "";
    var Estados = "";
    var Llamada_Activacion = "";
    var Fecha_Activacion = "";
    var NIP = "";
    var Detalle_Activacion = "";
    var Primera_Revision = "";
    var Segunda_Revision = "";
    var MOVICHECK = "";
    var Fecha_Entrega = "";
    var Fecha_Ultima_Actualizacion = "";
    var Bloqueo_Desbloqueo = "Bloqueada";
    var Activadora = "";
    var MES_TRABAJADA = "SETIEMBRE 2025";
    const Terminal = req.body.terminal;
    const correo = req.body.correo;
    const Genero = req.body.genero;
    var Pago_Comision = "No Actualizado";
    var Numero_Provisional = "";
    var Modelo_Terminal = "";
    var Metodo_Pago = "";
    var Intentos_Entrega = "";
    /*Actualizacion*/

    if(idVendedor !=="Ventas Freelance"){
         var Vendedor_Freelance = "";
    }else{
        Vendedor_Freelance = Vendedor_Freelance1;
    }

    conexion.query('INSERT INTO VentasMovil SET ?',
     {Nombre_Cliente:NombreDelCliente,
        Segundo_Nombre_Cliente:SegundoNombreDelCliente,
        Primer_Apellido_Cliente:PrimerApellidoDelCliente,
        Segundo_Apellido_Cliente:SegundoApellidoDelCliente,
        Documento_Identidad:TipoDeDocumentoDeIdentidad,
        Numero_Documento:NumeroDeDocumento,
        Nacionalidad:Nacionalidad,
        Celular_Tramite:NumeroCelularDeTramite,
        Tipo_Tramite:TipoDeTramite,
        Numero_Contrato,
        Numero_Abonado,
        Numero_Contacto_1:NumeroDeContacto1,
        Numero_Contacto_2:NumeroDeContacto2,
        Portabilidad:EnCasoDePortabilidad,
        Plan_Contratar:TipoDePlanAContratar,
        Valor_Plan,
        Direccion_Exacta:DireccionExacta,
        Provincia:Provincia,
        Canton:Canton,
        Distrito:Distrito,
        Tipo_Llamada:Tipo_Llamada,
        Nombre_Vendedor:idVendedor,
        Fecha:today.toISOString().slice(0, 10).replace(/-/g, '/'),
        Vendedor_Freelance,
        Cobro_Envío:Cobro_Envío,
        Activada,
        Entregada,
        Rechazada,
        Detalle:Detalle, 
        Entregador,
        Estados, 
        Llamada_Activacion, 
        Fecha_Activacion,NIP,Detalle_Activacion,Primera_Revision,Segunda_Revision,MOVICHECK,Fecha_Entrega,Bloqueo_Desbloqueo,Activadora,MES_TRABAJADA,Terminal:Terminal,Pago_Comision,Numero_Provisional,Genero:Genero,Correo_Cliente:correo,Fecha_Ultima_Actualizacion,Modelo_Terminal,Tipo_Cliente:tipoCliente,Metodo_Pago:Metodo_Pago,Intentos_Entrega:Intentos_Entrega}, async(error, results)=>{

            if(error){
                console.log(error);
            }
            console.log("Venta Movil registrada")
            res.render('plantilla', {
                Nombre_Vendedor:idVendedor,
                Nombre_Cliente:NombreDelCliente,
                Segundo_Nombre_Cliente:SegundoNombreDelCliente,
                Primer_Apellido_Cliente:PrimerApellidoDelCliente,
                Segundo_Apellido_Cliente:SegundoApellidoDelCliente,
                Numero_Documento:NumeroDeDocumento,
                Celular_Tramite:NumeroCelularDeTramite,
                Portabilidad:EnCasoDePortabilidad,
                Numero_Contacto_1:NumeroDeContacto1,
                Numero_Contacto_2:NumeroDeContacto2,
                Tipo_Tramite:TipoDeTramite,
                Provincia:Provincia,
                Canton:Canton,
                Distrito:Distrito,
                Direccion_Exacta:DireccionExacta,
                Plan_Contratar:TipoDePlanAContratar,
                codigoLiberty,
                Cobro_Envío:Cobro_Envío,
                    correo:correo,
                    comentario:comentario,
                    tipoDePlanAContratar1,
                    Tipo_Cliente:tipoCliente
              });
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
        genero,
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
        tipoLlamada,
        correo,
        comentario,
        cobro_de_envio,
        nombreVendedor,
        codigoLiberty,
        nombreVendedorFreelance,
        terminal} = req.body;

        //const {fecha} = req.date;

        var today = new Date();
        var year = today.getFullYear();
        var mes = today.getMonth()+1;
        var dia = today.getDate();
        var fecha =dia+"-"+mes+"-"+year;

       /// const {idVendedor} = req.idVendedor;
       
       if(tipoDePlanAContratar=="@1Plus"){
        var tipoDePlanAContratar1 = "(CQS) Plan CTRL @1Plus 2 LTE ST";
        var ValorDelPlan = "13200";

       }else if(tipoDePlanAContratar=="@1"){
        var tipoDePlanAContratar1 = "(CGS) Plan Con Dep @1 LTE PRO ST";
        var ValorDelPlan = "10700";

       }
       else if(tipoDePlanAContratar=="@2"){
        var tipoDePlanAContratar1 = "(CHS) Plan Con Dep @2 LTE PRO ST";
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
    var activada = "Pendiente";
    var entregada = "Pendiente";
    var Rech = "";
    var Detalle = "";
    var Entregador = "";
    var Estados = "";
    var LActivacion = "";
    var FActivacion = "";
    var NIP = "";
    var DetalleA = "";
    var PR = "";
    var SR = "";
    var NumeroActivacion = "";
    var FechaE = "";
    var Bloqueo = "Bloqueada";
    var MesTrabajada = "SETIEMBRE 2025";
    var Activadora = "";
    var Comision = "";
    var NumeroProvisional = "";
    var FechaUltimaActulizacion = "";

    if(nombreVendedor!=="Ventas Freelance"){
        var nombreVendedorFreelance1 = "";
    }else{
        var nombreVendedorFreelance1 = nombreVendedorFreelance;
    }
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
            tipoLlamada,
            nombreVendedor,
            fecha,
            nombreVendedorFreelance1,
            cobro_de_envio,
            activada,
            entregada,
            Rech,
            Detalle,
            Entregador,
            Estados,
            LActivacion,
            FActivacion,
            NIP,
            DetalleA,
            PR,
            SR,
            NumeroActivacion,
            FechaE,
            Bloqueo,
            Activadora,
            MesTrabajada,
            terminal,
            Comision,
            NumeroProvisional,
            genero,
            correo,
            FechaUltimaActulizacion]]
        }, 
    })
    /*

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
             /*
         })
 
     } catch (error) {
         console.log(error)
     }
     */

     /*
    res.redirect("misEstadisticas");
    */
    res.render('plantilla', {
        nombreVendedor,
        nombreDelCliente, 
            segundoNombreDelCliente,
            primerApellidoDelCliente,
            segundoApellidoDelCliente,
            numeroDeDocumento,
            numeroCelularDeTramite,
            enCasoDePortabilidad,
            numeroDeContacto1,
            numeroDeContacto2,
            tipoDeTramite,
            provincia, 
            canton, 
            distritp,
            direccionExacta,
            tipoDePlanAContratar,
            codigoLiberty,
            cobro_de_envio,
            correo,
            comentario,
            tipoDePlanAContratar1
      });

      /*
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mariorl040301@gmail.com',
          pass: 'zhpixgqlgyoussrx'
        }
      });

      const mailOptions = {
        from: 'mariorl040301@gmail.com',
        to: 'mariorl040301@gmail.com',
        subject: 'Venta Generada',
        text: 'Venta generada por: ' + nombreVendedor + tipoDePlanAContratar
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      */
}
exports.registrarVentaFijo = async (req, res) => {
    
          
 /* BD CODE */
   
    try {
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
    const TipoDePlanAContratar = req.body.tipoDePlanAContratar;
    const ValorPlan = req.body.valorPlanDiferente;
    const Financiamiento = req.body.Financiamiento;
    const Direccion = req.body.direccionExacta;
    const Provincia = req.body.provincia;
    const Canton = req.body.canton;
    const Distrito = req.body.distritp;
    const TipoLlamada = req.body.tipoLlamada;
    const Coordenadas = req.body.coordenadas;
    const Correo = req.body.correo;
    const Red = req.body.red;
    const NombreVendedor = req.body.nombreVendedor;
    const VendedorFreelance1 = req.body.nombreVendedorFreelance;
    const Genero = req.body.genero;
        var today = new Date();
        var year = today.getFullYear();
        var mes = today.getMonth()+1;
        var dia = today.getDate();
        var fecha =year+"/"+mes+"/"+dia;
    
        var Numero_Contrato = "";
        var Numero_Abonado = "";
        var Activada = "Pendiente";
        var Instalada = "Pendiente";

        if(NombreVendedor!=="Ventas Freelance"){
            var Vendedor_Freelance = "";
        }else{
            var Vendedor_Freelance = VendedorFreelance1;
        }

        var Rechazada = "";
    var Detalle = "";
    var Entregador = "";
    var Estados = "";
    var Llamada_Activacion = "";
    var Fecha_Activacion = "";
    var Numero_Orden = "";
    var MES_TRABAJADA = "SETIEMBRE 2025";
    var Fecha_Instalacion = "";
    var Fecha_Ultima_Actualizacion = "";
    var Pago_Comision = "";
    var Activadora = "";
    var nombrePromocion = req.body.nombrePromocion
    var barrio = req.body.barrio
    var codigoLiberty = req.body.codigoLiberty
    const comentario = req.body.comentario
    var UsuarioLiberty = req.body.UsuarioLiberty

    
    conexion.query('INSERT INTO VentasFijo SET ?',
        {Nombre_Cliente:NombreDelCliente,
           Segundo_Nombre_Cliente:SegundoNombreDelCliente,
           Primer_Apellido_Cliente:PrimerApellidoDelCliente,
           Segundo_Apellido_Cliente:SegundoApellidoDelCliente,
           Documento_Identidad:TipoDeDocumentoDeIdentidad,
           Numero_Documento:NumeroDeDocumento,
           Nacionalidad:Nacionalidad,
           Celular_Tramite:NumeroCelularDeTramite,
           Tipo_Tramite:TipoDeTramite,
           Numero_Contrato,
           Numero_Abonado,
           Numero_Contacto_1:NumeroDeContacto1,
           Numero_Contacto_2:NumeroDeContacto2,
           Plan_Contratar:TipoDePlanAContratar,
           Financiamiento:Financiamiento,
           Valor_Plan:ValorPlan,
           Coordenadas:Coordenadas,
           Direccion_Exacta:Direccion,
           Provincia:Provincia,
           Canton:Canton,
           Distrito:Distrito,
           Tipo_Llamada:TipoLlamada,
           Nombre_Vendedor:NombreVendedor,
           Fecha:today.toISOString().slice(0, 10).replace(/-/g, '/'),
           Vendedor_Freelance,
           Activada,
           Instalada,
           Rechazada,
           Detalle, 
           Entregador,
           Estados, 
           Llamada_Activacion, 
           Fecha_Activacion,Numero_Orden,MES_TRABAJADA,Fecha_Instalacion,Red:Red,Pago_Comision,Genero:Genero,Activadora,Correo_Cliente:Correo,Fecha_Ultima_Actualizacion}, async(error, results)=>{
   
               if(error){
                   console.log(error);
               }
               console.log("Venta Fijo registrada")
               res.render('colillaFijo', {
                Nombre_Vendedor:NombreVendedor,
                Nombre_Cliente:NombreDelCliente, 
                Segundo_Nombre_Cliente:SegundoNombreDelCliente,
                Primer_Apellido_Cliente:PrimerApellidoDelCliente,
                Segundo_Apellido_Cliente:SegundoApellidoDelCliente,
                Numero_Documento:NumeroDeDocumento,
                Tipo_Tramite:TipoDeTramite,
                    nombrePromocion,
                Valor_Plan:ValorPlan,
                Numero_Contacto_1:NumeroDeContacto1,
                Numero_Contacto_2:NumeroDeContacto2,
                Financiamiento:Financiamiento,
                Provincia:Provincia,
                Canton:Canton,
                Distrito:Distrito,
                    barrio,
                Direccion_Exacta:Direccion,
                Plan_Contratar:TipoDePlanAContratar,
                    codigoLiberty,
                Correo_Cliente:Correo,
                    comentario:comentario,
                Coordenadas:Coordenadas,
                Red:Red,
                    UsuarioLiberty
              });
           })
   
       } catch (error) {
           console.log(error)
       }

}
/*REGISTRO DE VENTAS TICOCEL */
exports.registrarVentaFijoTicocel = async (req, res) => {
    const {nombreDelCliente, 
        segundoNombreDelCliente,
        primerApellidoDelCliente,
        segundoApellidoDelCliente, 
        tipoDeDocumentoDeIdentidad, 
        numeroDeDocumento, 
        nombrePromocion,
        nacionalidad, 
        numeroCelularDeTramite,
        numeroDeContacto1, 
        numeroDeContacto2,
        tipoDeTramite, 
        tipoDePlanAContratar, 
        valorPlanDiferente,
        Financiamiento,
        codigoLiberty,
        coordenadas,
        correo,
        comentario,
        direccionExacta, 
        provincia, 
        canton, 
        distritp,
        barrio,
        tipoLlamada,
        nombreVendedor,
        nombreVendedorFreelance} = req.body;

        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
    
    /// client instance for auth
        const client = await auth.getClient();
    
        /// Instance of google sheets api 
        const googleSheets = google.sheets({ version: "v4", auth: client});
    
    
        const spreadsheetId = "14_KcaSpPh6wl13u8WvXnihr1czzu52TD9_JP9YVitRc";
        // Get DATA 
    
    
    
        const metaData = await googleSheets.spreadsheets.get({
            auth,
            spreadsheetId
        });
    
        /// rows from spreadsheet
    
        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "Registro_Ventas_Fijo_NIC",
        })
        if(tipoDePlanAContratar=="Mega 30"){

            var ValorDelPlan = "21900";
    
           }else if(tipoDePlanAContratar=="Mega 50"){
    
            var ValorDelPlan = "22900";
    
           }else if(tipoDePlanAContratar=="Mega 100"){
    
            var ValorDelPlan = "24500";
    
           }
           else if(tipoDePlanAContratar=="Mega 325"){
    
            var ValorDelPlan = "40000";
    
           }
           else if(tipoDePlanAContratar=="Mega 450 HBO Max"){
    
            var ValorDelPlan = "42500";
    
           }
           else if(tipoDePlanAContratar=="Mega 300 HBO Max"){
    
            var ValorDelPlan = "30000";
    
           }
           else if(tipoDePlanAContratar=="Mega 150 HBO Max"){
    
            var ValorDelPlan = "27000";
    
           }else if(tipoDePlanAContratar=="Triple Play Mega 30"){
            var ValorDelPlan = "31500";
           }else if(tipoDePlanAContratar=="Triple Play Mega 50"){
            var ValorDelPlan = "32000";
           }
           else if(tipoDePlanAContratar=="Triple Play Mega 100"){
            var ValorDelPlan = "33500";
           }else if(tipoDePlanAContratar=="Triple Play Mega 325"){
            var ValorDelPlan = "51500";
           }else if(tipoDePlanAContratar=="Doble Play Mega 30"){
            var ValorDelPlan = "30000";
           }else if(tipoDePlanAContratar=="Doble Play Mega 50"){
            var ValorDelPlan = "33500";
           }
           else if(tipoDePlanAContratar=="Doble Play Mega 100"){
            var ValorDelPlan = "32000";
           }
           else if(tipoDePlanAContratar=="Doble Play Mega 325"){
            var ValorDelPlan = "50000";
           }else if(tipoDePlanAContratar=="75 Mbps + 45 GB SIN TV"){
            var ValorDelPlan = "46000";
           }
           else if(tipoDePlanAContratar=="75 Mbps + 30 GB SIN TV"){
            var ValorDelPlan = "39000";
           }
           else if(tipoDePlanAContratar=="75 Mbps + 18 GB SIN TV"){
            var ValorDelPlan = "32000";
           }
           else if(tipoDePlanAContratar=="150 Mbps + ILIMITADO SIN TV"){
            var ValorDelPlan = "49000";
           }
           else if(tipoDePlanAContratar=="150 Mbps + 35 GB SIN TV"){
            var ValorDelPlan = "41000";
           }
           else if(tipoDePlanAContratar=="150 Mbps + 25 GB SIN TV"){
            var ValorDelPlan = "34000";
           }
           else if(tipoDePlanAContratar=="350 Mbps + ILIMITADO SIN TV"){
            var ValorDelPlan = "53000";
           }
           else if(tipoDePlanAContratar=="350 Mbps + 35 GB SIN TV"){
            var ValorDelPlan = "45000";
           }
           else if(tipoDePlanAContratar=="350 Mbps + 25 GB SIN TV"){
            var ValorDelPlan = "38000";
           }
           else if(tipoDePlanAContratar=="75 Mbps + 45 GB CON TV"){
            var ValorDelPlan = "52000";
           }
           else if(tipoDePlanAContratar=="75 Mbps + 30 GB CON TV"){
            var ValorDelPlan = "45000";
           }
           else if(tipoDePlanAContratar=="75 Mbps + 18 GB CON TV"){
            var ValorDelPlan = "38000";
           }
           else if(tipoDePlanAContratar=="150 Mbps + ILIMITADO CON TV"){
            var ValorDelPlan = "58000";
           }
           else if(tipoDePlanAContratar=="150 Mbps + 35 GB CON TV"){
            var ValorDelPlan = "50000";
           }
           else if(tipoDePlanAContratar=="150 Mbps + 25 GB CON TV"){
            var ValorDelPlan = "43000";
           }
           else if(tipoDePlanAContratar=="350 Mbps + ILIMITADO CON TV"){
            var ValorDelPlan = "63000";
           }
           else if(tipoDePlanAContratar=="350 Mbps + 35 GB CON TV"){
            var ValorDelPlan = "55000";
           }
           else{
            var ValorDelPlan = "48000";
           }

        var today = new Date();
        var year = today.getFullYear();
        var mes = today.getMonth()+1;
        var dia = today.getDate();
        var fecha =dia+"/"+mes+"/"+year;
    
        var numeroContrato = "";
        var numeroAbonado = "";
        var activada = "Pendiente";
        var entregada = "Pendiente";

        if(nombreVendedor!=="Ventas Freelance"){
            var nombreVendedorFreelance1 = "";
        }else{
            var nombreVendedorFreelance1 = nombreVendedorFreelance;
        }
        /// Write rows 
        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Registro_Ventas_Fijo_NIC",
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
                tipoDePlanAContratar, 
                Financiamiento, 
                valorPlanDiferente,
                coordenadas,
                direccionExacta, 
                provincia, 
                canton, 
                distritp,
                tipoLlamada,
                nombreVendedor,
                fecha,
                nombreVendedorFreelance1,
                activada,
                entregada]]
            }, 
        })

        res.render('colillaFijo', {
            nombreVendedor,
            nombreDelCliente, 
                segundoNombreDelCliente,
                primerApellidoDelCliente,
                segundoApellidoDelCliente,
                numeroDeDocumento,
                nombrePromocion,
                valorPlanDiferente,
                numeroDeContacto1,
                provincia, 
                canton, 
                distritp,
                barrio,
                direccionExacta,
                tipoDePlanAContratar,
                codigoLiberty,
                correo,
                comentario,
                coordenadas
          });

        /*
        res.redirect("misEstadisticas");
        console.log(tipoDePlanAContratar);
        console.log(nombreVendedor);
        */

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'mariorl040301@gmail.com',
              pass: 'zhpixgqlgyoussrx'
            }
          });
    
          const mailOptions = {
            from: 'mariorl040301@gmail.com',
            to: 'mariorl040301@gmail.com',
            subject: 'Venta Generada Fijo',
            text: 'Venta generada por: ' + nombreVendedor + tipoDePlanAContratar
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
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
