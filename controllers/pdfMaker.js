

async function generatePayslip(req, res) {
  try {
    const { employeeName, horas, totalVentas, consecutivo, horasExtra, bono, fechaPago, employeeNumber, employeeEmail } = req.body;

    var SalarioBase = horas * 9533.33333;

    if (totalVentas >= 30) {
      var comision = totalVentas * 1000;
    } else {
      var comision = 0;
    }

    var totalIngresos = SalarioBase + comision;

    var ccss = totalIngresos * 0.0967;
    var aporteTrabajadorBanco = totalIngresos * 0.01;
    var totalDeducciones = ccss + aporteTrabajadorBanco;
    var pagoNeto = totalIngresos - totalDeducciones;

    var SalarioBase1 = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(SalarioBase);
    var comision1 = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(comision);
    var totalIngresos1 = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(totalIngresos);
    var ccss1 = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(ccss);
    var aporteTrabajadorBanco1 = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(aporteTrabajadorBanco);
    var totalDeducciones1 = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(totalDeducciones);
    var pagoNeto1 = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(pagoNeto);

      res.render('colilla', {
        employeeName,
        consecutivo,
        fechaPago,
        horas,
        totalVentas,
        employeeNumber,
        employeeEmail,
        ccss1,
        aporteTrabajadorBanco1,
        totalDeducciones1,
        pagoNeto1,
        SalarioBase1,
        comision1,
        totalIngresos1,
      });
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

module.exports = { generatePayslip };
