const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

function generatePayslip(req, res) {
  const { employeeName, salary, tax, netSalary } = req.body;

  // Create a new PDF document
  const doc = new PDFDocument();

  // Define the document properties
  doc.info['Title'] = 'Payslip';

  // Add content to the document
  doc.fontSize(18)
    .text(employeeName, 75, 275, { width: 275, align: 'left', continued: true })
    .text(`Payslip`, 225, 275, { width: 100, align: 'center' })
    .text(`Net Salary: ${netSalary}`, 400, 275, { width: 137, align: 'right' })
    .fontSize(12)
    .text(`Salary: ${salary}`, 75, 325, { width: 200, align: 'left' })
    .text(`Tax: ${tax}`, 325, 325, { width: 200, align: 'left' })
    .moveDown()
    .fontSize(10)
    .text('Date', 75, 390, { width: 125, align: 'left', continued: true })
    .text('Description', 200, 390, { width: 250, align: 'left', continued: true })
    .text('Amount', 450, 390, { width: 125, align: 'right' })
    .moveDown()
    .text('01/01/2023', 75, 405, { width: 125, align: 'left', continued: true })
    .text('Salary', 200, 405, { width: 250, align: 'left', continued: true })
    .text(`${salary}`, 450, 405, { width: 125, align: 'right' })
    .moveDown()
    .text('01/02/2023', 75, 420, { width: 125, align: 'left', continued: true })
    .text('Tax', 200, 420, { width: 250, align: 'left', continued: true })
    .text(`${tax}`, 450, 420, { width: 125, align: 'right' })
    .moveDown()
    .text('Total', 75, 470, { width: 375, align: 'right', continued: true })
    .text(`${netSalary}`, 450, 470, { width: 125, align: 'right' });

  // Save the PDF document to a file
  const filePath = path.join(__dirname, 'payslip.pdf');
  doc.pipe(fs.createWriteStream(filePath));

  // Register the data in your database
  // ...

  doc.end();
  // Send the PDF document as a response to the client
  res.setHeader('Content-Disposition', 'attachment; filename=payslip.pdf');
  res.contentType('application/pdf');
  doc.pipe(res);
}

module.exports = { generatePayslip };
