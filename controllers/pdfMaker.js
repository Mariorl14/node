var fs = require('fs');
var pdf = require('dynamic-html-pdf');
var html = fs.readFileSync('Colilla.html', 'utf8');
const path = require('path');



function generatePayslip(req, res) {
  const { employeeName, horas, totalVentas } = req.body;

  pdf.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
})

var options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm"
};

var users = "Favtel11";

var document = {
    type: 'file',     // 'file' or 'buffer'
    template: html,
    context: {
        users: users
    },
    path: "./$users.pdf"    // it is not required if type is buffer
};

pdf.create(document, options)
    .then(res => {
        console.log(res)
    })
    .catch(error => {
        console.error(error)
    });


  // Send the PDF document as a response to the client
  console.log(employeeName);


  res.redirect('/home');
  
}

// Custom handlebar helper
module.exports = {generatePayslip};