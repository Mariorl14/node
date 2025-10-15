// ===========================================
// Fijo.js (Updated for mysql2/promise)
// ===========================================
const express = require('express');
const router = express.Router();
const conexion = require('../database/db'); // mysql2/promise pool
const authController = require('../controllers/authController');
const rolemiddlware = require('../controllers/roleMiddlware');
const moment = require('moment');
const NoCache = require('../controllers/noCache');

// ==============================
// 📊 Fijo BD - NO INSTALADAS
// ==============================
router.get('/FijoNoInstalada', authController.isAuthenticated, authController.authRol, async (req, res) => {
  try {
    const [results] = await conexion.query(`
      SELECT * FROM VentasFijo
      WHERE Instalada = "No Instalada"
      AND Fecha BETWEEN DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND CURDATE();
    `);
    res.render('FijoTable', { 
  results, 
  user: req.user, 
  title: 'Ventas No Instaladas',
  editPath: 'editFijoNoInstalada'
});
  } catch (error) {
    console.error('Error fetching FijoNoInstalada:', error);
    res.status(500).send('Database query failed.');
  }
});

// ==============================
// 📊 Fijo BD - INSTALADAS
// ==============================
router.get('/FijoInstalada', authController.isAuthenticated, authController.authRol, async (req, res) => {
  try {
    const [results] = await conexion.query(`
      SELECT * FROM VentasFijo
      WHERE Instalada = "Instalada"
      AND Fecha BETWEEN DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND CURDATE();
    `);
    res.render('FijoTable', { 
  results, 
  user: req.user, 
  title: 'Ventas Instaladas',
  editPath: 'editFijoInstalada'
});
  } catch (error) {
    console.error('Error fetching FijoInstalada:', error);
    res.status(500).send('Database query failed.');
  }
});

// ==============================
// 📊 Fijo BD - PENDIENTES
// ==============================
router.get('/FijoPendiente', authController.isAuthenticated, authController.authRol, async (req, res) => {
  try {
    const [results] = await conexion.query(`
      SELECT * FROM VentasFijo
      WHERE Instalada = "Pendiente"
      AND Fecha BETWEEN DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND CURDATE();
    `);
    res.render('FijoTable', { 
  results, 
  user: req.user, 
  title: 'Ventas Pendientes',
  editPath: 'editFijoPendiente'
});
  } catch (error) {
    console.error('Error fetching FijoPendiente:', error);
    res.status(500).send('Database query failed.');
  }
});

// ==============================
// 👤 Fijo BD - Ventas por Vendedor
// ==============================
router.get('/FijoVendedor', authController.isAuthenticated, rolemiddlware.TicocelLVFTIC, async (req, res) => {
  try {
    const user = req.user;
    const [results] = await conexion.query(`
      SELECT * 
      FROM VentasFijo temp 
      JOIN users us ON temp.Nombre_Vendedor = us.nombre 
      WHERE temp.Nombre_Vendedor = ?
      AND temp.Fecha BETWEEN DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND CURDATE();
    `, [user.nombre]);
    res.render('FijoVendedor', { results, user: req.user });
  } catch (error) {
    console.error('Error fetching FijoVendedor:', error);
    res.status(500).send('Database query failed.');
  }
});

// ===========================================
// 🧾 Helper functions for date formatting
// ===========================================
function processDate(date) {
  if (date && date.endsWith('/00')) date = date.replace('/00', '/01');
  return formatDateToYYYYMMDD(date);
}

function formatDateToYYYYMMDD(dateString) {
  const momentDate = moment(dateString, 'YYYY/MM/DD');
  return momentDate.isValid() ? momentDate.format('YYYY-MM-DD') : '';
}

// ===========================================
// ✏️ Edit routes (NoInstalada, Instalada, Pendiente)
// ===========================================
const editRoutes = [
  { path: 'NoInstalada', view: 'editFijoNoInstalada', redirect: 'FijoNoInstalada' },
  { path: 'Instalada', view: 'editFijoInstalada', redirect: 'FijoInstalada' },
  { path: 'Pendiente', view: 'editFijoPendiente', redirect: 'FijoPendiente' }
];

for (const { path, view, redirect } of editRoutes) {

  // GET - Load edit page
 // Dynamic edit route generator (loop or manual call)
router.get(`/editFijo${path}/:SaleId`, async (req, res) => {
  try {
    const { SaleId } = req.params;
    const [results] = await conexion.query('SELECT * FROM VentasFijo WHERE SaleId = ?', [SaleId]);
    if (results.length === 0) return res.status(404).send('Sale not found');

    const saleData = results[0];
    saleData.formattedFechaActivacion = processDate(saleData.Fecha_Activacion);
    saleData.formattedFechaInstalacion = processDate(saleData.Fecha_Instalacion);
    saleData.formattedFechaUltimaActualizacion = processDate(saleData.Fecha_Ultima_Actualizacion);

    // 💡 Dynamic labels & back path based on `path`
    const tipo = path.replace('/', ''); // e.g., "Instalada"
    const title = `Editar Venta Fija ${tipo}`;
    const postPath = `/editFijo${tipo}`;
    const backPath = `/Fijo${tipo}`;

    res.render('editFijo', { 
      SaleId: saleData,
      user: req.user,
      title,
      postPath,
      backPath
    });

  } catch (error) {
    console.error(`Error fetching ${path} sale for editing:`, error);
    res.status(500).send('Database query failed.');
  }
});

// ================================
// POST - Save updates
// ================================
router.post(`/editFijo${path}`, async (req, res) => {
  try {
    const SaleId = req.body.SaleId;

    const Fecha = moment(req.body.column24).format('YYYY/MM/DD');
    const FechaActivacion1 = moment(req.body.column33).isValid() ? moment(req.body.column33).format('YYYY/MM/DD') : null;
    const FechaInstalacion1 = moment(req.body.column36).isValid() ? moment(req.body.column36).format('YYYY/MM/DD') : null;
    const FechaUltimaActualizacion1 = moment(req.body.FechaUA).isValid() ? moment(req.body.FechaUA).format('YYYY/MM/DD') : null;

    const data = {
      Nombre_Cliente: req.body.column1,
      Segundo_Nombre_Cliente: req.body.column2,
      Primer_Apellido_Cliente: req.body.column3,
      Segundo_Apellido_Cliente: req.body.column4,
      Documento_Identidad: req.body.column5,
      Numero_Documento: req.body.column6,
      Nacionalidad: req.body.column7,
      Celular_Tramite: req.body.column8,
      Tipo_Tramite: req.body.column9,
      Numero_Contrato: req.body.numero_contrato,
      Numero_Abonado: req.body.numero_abonado,
      Numero_Contacto_1: req.body.column12,
      Numero_Contacto_2: req.body.column13,
      Plan_Contratar: req.body.column14,
      Financiamiento: req.body.column15,
      Valor_Plan: req.body.column16,
      Coordenadas: req.body.column17,
      Direccion_Exacta: req.body.column18,
      Provincia: req.body.column19,
      Canton: req.body.column20,
      Distrito: req.body.column21,
      Tipo_Llamada: req.body.column22,
      Nombre_Vendedor: req.body.column23,
      Fecha: Fecha,
      Vendedor_Freelance: req.body.column25,
      Activada: req.body.column26,
      Instalada: req.body.column27,
      Rechazada: req.body.column28,
      Detalle: req.body.column29,
      Entregador: req.body.column30,
      Estados: req.body.column31,
      Llamada_Activacion: req.body.column32,
      Fecha_Activacion: FechaActivacion1,
      Numero_Orden: req.body.column34,
      MES_TRABAJADA: req.body.column35,
      Fecha_Instalacion: FechaInstalacion1,
      Red: req.body.column37,
      Pago_Comision: req.body.column38,
      Genero: req.body.column39,
      Activadora: req.body.column40,
      Correo_Cliente: req.body.columnC,
      Fecha_Ultima_Actualizacion: FechaUltimaActualizacion1
    };

    await conexion.query('UPDATE VentasFijo SET ? WHERE SaleId = ?', [data, SaleId]);
    console.log(`✅ Updated SaleId ${SaleId}`);

    // ✅ Fix: redirect dynamically using same path reference
    const redirectTo = `/Fijo${path}`;
    res.redirect(redirectTo);

  } catch (error) {
    console.error(`Error updating ${path}:`, error);
    res.status(500).send('An error occurred while updating the database.');
  }
});

}
router.get(
  '/registrarVentaFijo',
  authController.isAuthenticated,
  NoCache.nocache,
  rolemiddlware.TicocelRVF,
  async (req, res) => {
    try {
      const query1 = 'SELECT * FROM users';
      const query2 = 'SELECT nombre FROM users WHERE rol = "freelance"';

      const [users, freelancers] = await Promise.all([
        conexion.query(query1).then(([rows]) => rows),
        conexion.query(query2).then(([rows]) => rows),
      ]);

      res.render('registrarVentaFijo', {
        data: { users, freelancers },
        user: req.user,
      });
    } catch (error) {
      console.error('❌ Error loading registrarVentaFijo:', error);
      res.status(500).send('Error loading data.');
    }
  }
);


/*Colilla Fijo */

router.get('/colillaFijo',  (req, res)=>{
    res.render('colillaFijo', {user:req.user})
})

module.exports = router;