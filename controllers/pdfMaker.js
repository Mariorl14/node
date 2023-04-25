/*
const PDFDocument = require('pdfkit');
const PdfkitConstruct= require('pdfkit-construct');
const path = require('path');
const fs = require('fs');

function generatePayslip(req, res) {
  const { employeeName, horas, totalVentas } = req.body;

  var SalarioBase = 300000;

  var valorHora = 2500;

  var extradeHoras = horas*valorHora;

  var SalarioNeto = SalarioBase+extradeHoras;
 
  // Create a new PDF document
  const doc = new PdfkitConstruct({
    size: 'A4',
    margins: {top: 30, left: 10, right: 10, bottom: 20},
    bufferPages: true,
  });

  // Add logo image to the header
  doc.setDocumentHeader({
    height: '16'
  }, () => {
    const imageBuffer = fs.readFileSync('public/img/Favtel_isotipo.png');
    const logoWidth = 90;
    const logoHeight = 90;
    const logoX = (doc.page.width - logoWidth) / 2;
    const logoY = doc.header.y + 10;
    doc.image(imageBuffer, logoX, logoY, {width: logoWidth, height: logoHeight});  

  });
  
  // Move down after the header image
  
  const products = [
    {
      name: employeeName,
      horasTrabajadas: horas,
      ventas: totalVentas,
      salarioNeto: SalarioNeto
    }
  ];

  doc.moveDown(20);
  doc.text("Sales Report", { align: "center", fontSize: 16, bold: true });
  doc.moveDown(10);
  doc.addTable(
    [
      {key: 'name', label: 'Vendedor', align: 'center'},
      {key: 'horasTrabajadas', label: 'Horas Trabajadas', align: 'center'},
      {key: 'ventas', label: 'Total de Ventas', align: 'center'},
      {key: 'salarioNeto', label: 'Salario Neto', align: 'center'}
    ],
    products, {
      border: null,
      width: "fill_body",
      striped: true,
      stripedColors: ["#5b68c0", "#d6c4dd"],
      cellsPadding: 10,
      marginLeft: 45,
      marginRight: 45,
      headAlign: 'center'
    });


    
    const deducciones = [
      {
        name: 'employeeName',
        price: 'salary',
        quantity: 'tax',
        amount: 'netSalary'
      }
    ];
    
    doc.moveDown(10);
    doc.addTable(
      [
        {key: 'name', label: 'Product', align: 'center'},
        {key: 'price', label: 'Price', align: 'center'},
        {key: 'quantity', label: 'Quantity', align: 'center'},
        {key: 'amount', label: 'Amount', align: 'center'}
      ],
      deducciones, {
        border: null,
        width: "fill_body",
        striped: true,
        stripedColors: ["#f6f6f6", "#d6c4dd"],
        cellsPadding: 10,
        marginLeft: 45,
        marginRight: 45,
        headAlign: 'center'
      });

  // render tables
  doc.render();

  // this should be the last
  // for this to work you need to set bufferPages to true in constructor options 
  doc.setPageNumbers((p, c) => `Page ${p} of ${c}`, "bottom right");

  // set the footer to render in every page
  doc.setDocumentFooter({}, () => {

    doc.lineJoin('miter')
        .rect(0, doc.footer.y, doc.page.width, doc.footer.options.heightNumber).fill("#c2edbe");

    doc.fill("#7416c8")
        .fontSize(8)
        .text("Favtel Costa Rica", doc.footer.x, doc.footer.y + 10);
  });

  // Send the PDF document as a response to the client
  res.setHeader('Content-Disposition', 'attachment; filename=payslip.pdf');
  res.contentType('application/pdf');
  doc.pipe(res);
  doc.end();
}

module.exports = { generatePayslip };
*/