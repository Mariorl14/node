const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const authController = require('../controllers/authController');
const NoCache = require('../controllers/noCache');
const moment = require('moment');

// ===============================
// REVENUE FIJO — month picker (same window as móvil)
// ===============================
router.get(
  '/revenueMenuFijo',
  authController.isAuthenticated,
  NoCache.nocache,
  (req, res) => {
    const meses = [
      'ENERO',
      'FEBRERO',
      'MARZO',
      'ABRIL',
      'MAYO',
      'JUNIO',
      'JULIO',
      'AGOSTO',
      'SETIEMBRE',
      'OCTUBRE',
      'NOVIEMBRE',
      'DICIEMBRE'
    ];

    const revenueMonths = [];
    const today = new Date();

    for (let i = 0; i < 9; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);

      revenueMonths.push({
        mes: meses[d.getMonth()],
        anio: d.getFullYear(),
        label: `${meses[d.getMonth()]} ${d.getFullYear()}`
      });
    }

    res.render('revenueMenuFijo', { revenueMonths, user: req.user });
  }
);

// ===============================
// Monthly list — installed fixed lines for that MES_TRABAJADA
// ===============================
router.get(
  '/RevenueFijo/:mes/:anio',
  authController.isAuthenticated,
  authController.authRol,
  NoCache.nocache,
  async (req, res) => {
    try {
      const { mes, anio } = req.params;
      const mesDb = `${mes.toUpperCase()} ${anio}`;

      const [results] = await pool.query(
        `SELECT * FROM VentasFijo 
          WHERE MES_TRABAJADA = ? 
          AND Instalada = 'Instalada'`,
        [mesDb]
      );

      res.render('RevenueGeneralFijo', { results, mes, anio, user: req.user });
    } catch (error) {
      console.error(`Error loading RevenueFijo ${req.params.mes} ${req.params.anio}:`, error);
      res.status(500).send('Error loading Revenue Fijo data');
    }
  }
);

// ===============================
// Edit one sale (invoice / payment fields)
// ===============================
router.get(
  '/editRevFijo/:mes/:anio/:SaleId',
  authController.isAuthenticated,
  authController.authRol,
  async (req, res) => {
    const { mes, anio, SaleId } = req.params;

    try {
      const [results] = await pool.query(
        `SELECT SaleId, Celular_Tramite, Numero_Abonado, Nombre_Cliente, Primer_Apellido_Cliente,
                Fecha_Activacion, Factura_1, Monto_1, Fecha_Pago_1, Factura_2, Monto_2, Fecha_Pago_2,
                Factura_3, Monto_3, Fecha_Pago_3, Factura_4, Monto_4, Fecha_Pago_4,
                Factura_5, Monto_5, Fecha_Pago_5, Factura_6, Monto_6, Fecha_Pago_6
         FROM VentasFijo 
         WHERE SaleId = ?`,
        [SaleId]
      );

      if (!results.length) {
        return res.status(404).send('Registro no encontrado');
      }

      const saleData = results[0];

      const formatDate = (d) => {
        if (!d) return '';
        return moment(d).isValid() ? moment(d).format('YYYY-MM-DD') : '';
      };

      [
        'Fecha_Activacion',
        'Fecha_Pago_1',
        'Fecha_Pago_2',
        'Fecha_Pago_3',
        'Fecha_Pago_4',
        'Fecha_Pago_5',
        'Fecha_Pago_6'
      ].forEach((field) => {
        saleData[`formatted_${field}`] = formatDate(saleData[field]);
      });

      res.render('editarRevGeneralFijo', { SaleId: saleData, mes, anio, user: req.user });
    } catch (error) {
      console.error(`Error loading editRevFijo for ${mes} ${anio}:`, error);
      res.status(500).send('Error loading edit page');
    }
  }
);

// ===============================
// Save
// ===============================
router.post(
  '/editRevFijo/:mes/:anio',
  authController.isAuthenticated,
  authController.authRol,
  async (req, res) => {
    try {
      const { mes, anio } = req.params;
      const { SaleId } = req.body;

      const parseDate = (input) => {
        if (!input) return null;

        const d = moment(input, ['YYYY-MM-DD', 'YYYY/MM/DD'], true);
        return d.isValid() ? d.format('YYYY/MM/DD') : null;
      };

      const data = {};

      for (let i = 1; i <= 6; i++) {
        data[`Factura_${i}`] = req.body[`columnF${i}`] || null;
        data[`Monto_${i}`] = req.body[`columnM${i}`] || null;
        data[`Fecha_Pago_${i}`] = parseDate(req.body[`columnFP${i}`]);
      }

      data.Fecha_Activacion = parseDate(req.body.column33);

      await pool.query('UPDATE VentasFijo SET ? WHERE SaleId = ?', [data, SaleId]);
      console.log(`Updated VentasFijo SaleId: ${SaleId}`);

      res.redirect(`/RevenueFijo/${mes}/${anio}`);
    } catch (error) {
      console.error('Error updating Revenue Fijo record:', error);
      res.status(500).send('Error updating the database.');
    }
  }
);

module.exports = router;
