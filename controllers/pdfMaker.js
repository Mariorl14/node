const PDFDocument = require('pdfkit');
const PdfkitConstruct= require('pdfkit-construct');
const path = require('path');
const fs = require('fs');

function generatePayslip(req, res) {
  const { employeeName, salary, tax, netSalary } = req.body;

  // Create a new PDF document
  // Create a document
  const doc = new PdfkitConstruct({
    size: 'A4',
    margins: {top: 20, left: 10, right: 10, bottom: 20},
    bufferPages: true,
});


// set the header to render in every page
doc.setDocumentHeader({}, () => {


  doc.lineJoin('miter')
      .rect(0, 0, doc.page.width, doc.header.options.heightNumber).fill("#ededed");

  doc.fill("#115dc8")
      .fontSize(20)
      .text("Reporte de Pagos", doc.header.x, doc.header.y);
});


// set the footer to render in every page
doc.setDocumentFooter({}, () => {

  doc.lineJoin('miter')
      .rect(0, doc.footer.y, doc.page.width, doc.footer.options.heightNumber).fill("#c2edbe");

  doc.fill("#7416c8")
      .fontSize(8)
      .text("Favtel Costa Rica", doc.footer.x, doc.footer.y + 10);
});

const products = [
  {
    name: 'Mario',
    price: 100,
    quantity: 5,
    amount: 12
  }
];

  // add a table (you can add multiple tables with different columns)
            // make sure every column has a key. keys should be unique
            doc.addTable(
              [
                  {key: 'name', label: 'Product', align: 'left'},
                  {key: 'price', label: 'Price', align: 'right'},
                  {key: 'quantity', label: 'Quantity'},
                  {key: 'amount', label: 'Amount', align: 'right'}
              ],
              products, {
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

           // Send the PDF document as a response to the client
  res.setHeader('Content-Disposition', 'attachment; filename=payslip.pdf');
  res.contentType('application/pdf');
          doc.pipe(res);
          doc.end();
 
}

module.exports = { generatePayslip };