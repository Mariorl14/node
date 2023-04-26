const puppeteer = require('puppeteer');



function generatePayslip(req, res) {

  const { employeeName, horas, totalVentas } = req.body;

  res.render('colilla', {employeeName:employeeName, horas:horas, totalVentas:totalVentas})
  
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