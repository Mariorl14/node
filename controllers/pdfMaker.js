/*const puppeteer = require('puppeteer');*/

const conexion = require('../database/db');

function generatePayslip(req, res) {

  const { employeeName, horas, totalVentas, consecutivo, horasExtra, bono, fechaPago  } = req.body;

  var SalarioBase = horas*9533.33;


  
  if(totalVentas>=30){

    var comision = totalVentas*1000;

  }else{
    var comision = 0;
  };

  var totalIngresos = SalarioBase+comision;


  var ccss = totalIngresos*0.0967;

  var aporteTrabajadorBanco = totalIngresos*0.01;

  var totalDeducciones = ccss+aporteTrabajadorBanco;

  var pagoNeto = totalIngresos-totalDeducciones;

  var SalarioBase1 = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(SalarioBase);
  var comision1 = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(comision);
  var totalIngresos1 = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(totalIngresos);
  var ccss1 = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(ccss);
  var aporteTrabajadorBanco1 = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(aporteTrabajadorBanco);
  var totalDeducciones1 = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(totalDeducciones);
  var pagoNeto1 = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(pagoNeto);



  res.render('colilla', {employeeName:employeeName, 
    consecutivo:consecutivo,
    fechaPago:fechaPago,
    horas:horas, 
    totalVentas:totalVentas,
     ccss1, 
     aporteTrabajadorBanco1, 
     totalDeducciones1, 
     pagoNeto1,
     SalarioBase1,
    comision1,
    totalIngresos1})
  
}

/*
async function crearPDF(url) {


    let navegador = await puppeteer.launch();

    let pagina = await navegador.newPage();

    await pagina.goto(url);

    let pdf = await pagina.pdf();

    navegador.close();

    return pdf; 
  }
  */


async function descargarPDF(req, res) {

    /*

    let pdf = await crearPDF("http://localhost:3000/generatePayslip");

    res.contentType('application/pdf');
    res.contentDisposition('attachment; filename=payslip.pdf');
    res.send(pdf);
    */

    /*
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto(
        'http://localhost:3000/generatePayslip', 
        { waitUntil: 'networkidle2' }
    );
    await page.click('._2vsJm ')
    */
    
  }




// Custom handlebar helper
module.exports = {generatePayslip,descargarPDF};