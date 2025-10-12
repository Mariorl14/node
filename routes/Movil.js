'use strict';

const express = require('express');
const router = express.Router();
const pool = require('../database/db'); // MySQL pooled connection
const authController = require('../controllers/authController');
const NoCache = require('../controllers/noCache');
const moment = require('moment');
const VentasController = require('../controllers/VentasController');
/* =====================================================
   RENDER PAGES (EJS VIEWS)
   ===================================================== */

// ✅ Activadas
router.get(
  '/Activadas',
  authController.isAuthenticated,
  authController.authRol,
  NoCache.nocache,
  (req, res) => {
    res.render('Activadas', { user: req.user });
  }
);

// ✅ No Activadas (your "homeTest")
router.get(
  '/homeTest',
  authController.isAuthenticated,
  authController.authRol,
  NoCache.nocache,
  (req, res) => {
    res.render('homeTest', { user: req.user });
  }
);

// ✅ Pendientes de Activación
router.get(
  '/PendientesActivacion',
  authController.isAuthenticated,
  authController.authRol,
  NoCache.nocache,
  (req, res) => {
    res.render('PendientesActivacion', { user: req.user });
  }
);

// ✅ Pendientes de Entrega
router.get(
  '/PendientesEntrega',
  authController.isAuthenticated,
  authController.authRol,
  NoCache.nocache,
  (req, res) => {
    res.render('PendientesEntrega', { user: req.user });
  }
);

// GET /registrarVenta – Render page to register new sale
router.get(
  '/registrarVenta',
  authController.isAuthenticated,
  NoCache.nocache,
  async (req, res) => {
    try {
      // Query both datasets in parallel
      const [users, freelancers] = await Promise.all([
        pool.query('SELECT * FROM users'),
        pool.query('SELECT nombre FROM users WHERE rol = "freelance"')
      ]);

      // Combine into single data object
      const results = {
        users,
        freelancers
      };

      // Render the EJS view
      res.render('registrarVenta', { data: results, user: req.user });
    } catch (error) {
      console.error('GET /registrarVenta error:', error);
      res.status(500).send('Error loading registrarVenta view');
    }
  }
);

/* =====================================================
   API ENDPOINTS (FOR DATATABLES AJAX)
   ===================================================== */

// ✅ No Activadas (main endpoint)
router.get(
  '/api/no-activadas',
  authController.isAuthenticated,
  async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          SaleId, MOVICHECK, Celular_Tramite, Numero_Documento, Numero_Provisional,
          Entregada, Detalle, MES_TRABAJADA, Fecha, Fecha_Activacion, Fecha_Ultima_Actualizacion,
          Nombre_Cliente, Segundo_Nombre_Cliente, Primer_Apellido_Cliente, Segundo_Apellido_Cliente,
          Tipo_Tramite, Numero_Contrato, Numero_Abonado, Cobro_Envío, Terminal, Nombre_Vendedor,
          Activada, Rechazada, Entregador, Estados
        FROM VentasMovil
        WHERE Activada = 'No Activada'
        AND Fecha BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 MONTH) AND CURDATE()
        ORDER BY Fecha DESC;
      `);

      res.json({
        success: true,
        count: rows.length,
        data: rows
      });
    } catch (err) {
      console.error('🔥 DATABASE ERROR:', err.sqlMessage || err.message);
      res.status(500).json({ error: err.sqlMessage || 'Internal Server Error' });
    }
  }
);


// ✅ Activadas
router.get(
  '/api/activadas',
  authController.isAuthenticated,
  async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          SaleId, MOVICHECK, Celular_Tramite, Numero_Documento, Numero_Provisional,
          Entregada, Detalle, MES_TRABAJADA, Fecha, Fecha_Activacion, Fecha_Ultima_Actualizacion,
          Nombre_Cliente, Segundo_Nombre_Cliente, Primer_Apellido_Cliente, Segundo_Apellido_Cliente,
          Tipo_Tramite, Numero_Contrato, Numero_Abonado, Cobro_Envío, Terminal, Nombre_Vendedor,
          Activada, Rechazada, Entregador, Estados
        FROM VentasMovil
        WHERE Activada = 'Activada'
        AND Fecha BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 MONTH) AND CURDATE()
        ORDER BY Fecha DESC;
      `);

      res.json({
        success: true,
        count: rows.length,
        data: rows
      });
    } catch (err) {
      console.error('Error fetching Activadas:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
);

// ✅ Pendientes de Activación
router.get(
  '/api/pendientes-activacion',
  authController.isAuthenticated,
  async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          SaleId, MOVICHECK, Celular_Tramite, Numero_Documento, Numero_Provisional,
          Entregada, Detalle, MES_TRABAJADA, Fecha, Fecha_Activacion, Fecha_Ultima_Actualizacion,
          Nombre_Cliente, Segundo_Nombre_Cliente, Primer_Apellido_Cliente, Segundo_Apellido_Cliente,
          Tipo_Tramite, Numero_Contrato, Numero_Abonado, Cobro_Envío, Terminal, Nombre_Vendedor,
          Activada, Rechazada, Entregador, Estados
        FROM VentasMovil
        WHERE Activada = 'Pendiente'
        AND Fecha BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 MONTH) AND CURDATE()
        ORDER BY Fecha DESC;
      `);

      res.json({
        success: true,
        count: rows.length,
        data: rows
      });
    } catch (err) {
      console.error('Error fetching Pendientes de Activación:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
);

// ✅ Pendientes de Entrega
router.get(
  '/api/pendientes-entrega',
  authController.isAuthenticated,
  async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          SaleId, MOVICHECK, Celular_Tramite, Numero_Documento, Numero_Provisional,
          Entregada, Detalle, MES_TRABAJADA, Fecha, Fecha_Activacion, Fecha_Ultima_Actualizacion,
          Nombre_Cliente, Segundo_Nombre_Cliente, Primer_Apellido_Cliente, Segundo_Apellido_Cliente,
          Tipo_Tramite, Numero_Contrato, Numero_Abonado, Cobro_Envío, Terminal, Nombre_Vendedor,
          Activada, Rechazada, Entregador, Estados
        FROM VentasMovil
        WHERE Entregada = 'Pendiente'
        AND Fecha BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 MONTH) AND CURDATE()
        ORDER BY Fecha DESC;
      `);

      res.json({
        success: true,
        count: rows.length,
        data: rows
      });
    } catch (err) {
      console.error('Error fetching Pendientes de Entrega:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
);


// === EDIT: ACTIVADAS ===
// GET /editActivadas/:SaleId
router.get('/editActivadas/:SaleId', async (req, res) => {
  try {
    const { SaleId } = req.params;

    const [rows] = await pool.execute(
      'SELECT * FROM VentasMovil WHERE SaleId = ?',
      [SaleId]
    );
    if (!rows.length) return res.status(404).send('Registro no encontrado');

    const saleData = rows[0];

    // helper: fix '/00' and format to YYYY-MM-DD for inputs
    const formatDateToYYYYMMDD = (dateString) => {
      const m = moment(dateString, 'YYYY/MM/DD', true); // strict
      if (!m.isValid()) return '';
      return m.format('YYYY-MM-DD');
    };
    const processDate = (date) => {
      if (!date) return '';
      if (typeof date === 'string' && date.endsWith('/00')) {
        date = date.replace('/00', '/01');
      }
      return formatDateToYYYYMMDD(date);
    };

    // prepare formatted dates for the form
    saleData.formattedFechaActivacion       = processDate(saleData.Fecha_Activacion);
    saleData.formattedFechaEntrega          = processDate(saleData.Fecha_Entrega);
    saleData.formattedFechaUltimaActualizacion = processDate(saleData.Fecha_Ultima_Actualizacion);

    return res.render('editarActivadas', { SaleId: saleData, user: req.user });
  } catch (err) {
    console.error('GET /editActivadas error:', err);
    return res.status(500).send('Error interno');
  }
});
// POST /editActivadas
router.post('/editActivadas', async (req, res) => {
  try {
    const SaleId = req.body.SaleId;
    if (!SaleId) return res.status(400).send('SaleId requerido');

    // normalize dates from form -> store as YYYY/MM/DD (matches your DB style)
    const normDate = (v) => {
      const m = moment(v, ['YYYY-MM-DD', 'YYYY/MM/DD'], true);
      if (!v || !m.isValid()) return null;
      return m.format('YYYY/MM/DD');
    };

    const Fecha                   = normDate(req.body.column23);
    const FechaActivacion1        = normDate(req.body.column33);
    const FechaEntrega1           = normDate(req.body.column34);
    const FechaUltimaActualizacion1 = normDate(req.body.FechaUA);

    // map only allowed/expected fields
    const update = {
      Nombre_Cliente: req.body.column1,
      Segundo_Nombre_Cliente: req.body.column2,
      Primer_Apellido_Cliente: req.body.column3,
      Segundo_Apellido_Cliente: req.body.column4,
      Documento_Identidad: req.body.column5,
      Numero_Documento: req.body.column6,
      Nacionalidad: req.body.column7,
      Celular_Tramite: req.body.column8,
      Tipo_Tramite: req.body.column9,
      Numero_Contrato: req.body.column10,
      Numero_Abonado: req.body.column11,
      Numero_Contacto_1: req.body.column12,
      Numero_Contacto_2: req.body.column13,
      Portabilidad: req.body.column14,
      Plan_Contratar: req.body.column15,
      Valor_Plan: req.body.column16,
      Direccion_Exacta: req.body.column17,
      Provincia: req.body.column18,
      Canton: req.body.column19,
      Distrito: req.body.column20,
      Tipo_Llamada: req.body.column21,
      Nombre_Vendedor: req.body.column22,
      Fecha: Fecha, // normalized above
      Vendedor_Freelance: req.body.column24,
      Cobro_Envío: req.body.column25,
      Activada: req.body.column26,
      Entregada: req.body.column27,
      Rechazada: req.body.column28,
      Detalle: req.body.column29,
      Entregador: req.body.column30,
      Estados: req.body.column31,
      Llamada_Activacion: req.body.column32,
      Fecha_Activacion: FechaActivacion1, // normalized
      // column34 is raw in your old code, but we normalize → FechaEntrega1
      Fecha_Entrega: FechaEntrega1,       // normalized
      Primera_Revision: req.body.column35,
      Segunda_Revision: req.body.column36,
      NIP: req.body.column37,
      Detalle_Activacion: req.body.column38,
      MOVICHECK: req.body.column39,
      Bloqueo_Desbloqueo: req.body.column40,
      Activadora: req.body.column41,
      MES_TRABAJADA: req.body.column42,
      Terminal: req.body.column43,
      Pago_Comision: req.body.column44,
      Numero_Provisional: req.body.column45,
      Genero: req.body.Genero, // keep only this (you had duplicates before)
      Correo_Cliente: req.body.Correo,
      Fecha_Ultima_Actualizacion: FechaUltimaActualizacion1, // normalized
      Modelo_Terminal: req.body.Modelo_Terminal,
      Tipo_Cliente: req.body.tipoCliente,
      Metodo_Pago: req.body.metodo_pago,
      Intentos_Entrega: req.body.intentos_entrega
    };

    // build SET list safely (mysql2/promise doesn’t support SET ? with object)
    const keys = Object.keys(update).filter(k => update[k] !== undefined);
    if (!keys.length) return res.status(400).send('Sin cambios');

    const setSql = keys.map(k => `\`${k}\` = ?`).join(', ');
    const values = keys.map(k => update[k]);

    // WHERE
    values.push(SaleId);

    await pool.execute(
      `UPDATE VentasMovil SET ${setSql} WHERE SaleId = ?`,
      values
    );

    console.log('Updated SaleId:', SaleId);
    return res.redirect('/Activadas');
  } catch (err) {
    console.error('POST /editActivadas error:', err);
    return res.status(500).send('Error interno al actualizar');
  }
});

// === EDIT: NO ACTIVADAS ===
// GET /editNoActivadas/:SaleId
router.get('/editNoActivadas/:SaleId', async (req, res) => {
  try {
    const { SaleId } = req.params;
    const [rows] = await pool.execute('SELECT * FROM VentasMovil WHERE SaleId = ?', [SaleId]);
    if (!rows.length) return res.status(404).send('Registro no encontrado');

    const saleData = rows[0];
    const format = v => (v && v.endsWith('/00') ? v.replace('/00', '/01') : v);
    const fix = v => (moment(format(v), 'YYYY/MM/DD', true).isValid() ? moment(v, 'YYYY/MM/DD').format('YYYY-MM-DD') : '');
    saleData.formattedFechaActivacion = fix(saleData.Fecha_Activacion);
    saleData.formattedFechaEntrega = fix(saleData.Fecha_Entrega);
    saleData.formattedFechaUltimaActualizacion = fix(saleData.Fecha_Ultima_Actualizacion);

    res.render('editarNoActivadas', { SaleId: saleData, user: req.user });
  } catch (err) {
    console.error('GET /editNoActivadas error:', err);
    res.status(500).send('Error interno');
  }
});
// POST /editNoActivadas
router.post('/editNoActivadas', async (req, res) => {
  const SaleId = req.body.SaleId;
  const moment = require('moment');

  try {
    // Format dates safely
    const Fecha = moment(req.body.column23).format('YYYY/MM/DD');
    const FechaActivacion = moment(req.body.column33).isValid()
      ? moment(req.body.column33).format('YYYY/MM/DD')
      : null;
    const FechaEntrega = moment(req.body.column34).isValid()
      ? moment(req.body.column34).format('YYYY/MM/DD')
      : null;
    const FechaUltimaActualizacion = moment(req.body.FechaUA).isValid()
      ? moment(req.body.FechaUA).format('YYYY/MM/DD')
      : null;

    // ✅ Map placeholders to real column names
    const data = {
      Nombre_Cliente: req.body.column1,
      Segundo_Nombre_Cliente: req.body.column2,
      Primer_Apellido_Cliente: req.body.column3,
      Segundo_Apellido_Cliente: req.body.column4,
      Correo_Cliente: req.body.Correo,
      Genero: req.body.Genero,
      Documento_Identidad: req.body.column5,
      Numero_Documento: req.body.column6,
      Nacionalidad: req.body.column7,
      Celular_Tramite: req.body.column8,
      Tipo_Tramite: req.body.column9,
      Numero_Contrato: req.body.column10,
      Numero_Abonado: req.body.column11,
      Numero_Contacto_1: req.body.column12,
      Numero_Contacto_2: req.body.column13,
      Portabilidad: req.body.column14,
      Tipo_Cliente: req.body.tipoCliente,
      Plan_Contratar: req.body.column15,
      Valor_Plan: req.body.column16,
      Direccion_Exacta: req.body.column17,
      Provincia: req.body.column18,
      Canton: req.body.column19,
      Distrito: req.body.column20,
      Tipo_Llamada: req.body.column21,
      Nombre_Vendedor: req.body.column22,
      Fecha: Fecha,
      Vendedor_Freelance: req.body.column24,
      Cobro_Envío: req.body.column25,
      Metodo_Pago: req.body.metodo_pago,
      Intentos_Entrega: req.body.intentos_entrega,
      Activada: req.body.column26,
      Entregada: req.body.column27,
      Rechazada: req.body.column28,
      Detalle: req.body.column29,
      Entregador: req.body.column30,
      Estados: req.body.column31,
      Llamada_Activacion: req.body.column32,
      Fecha_Activacion: FechaActivacion,
      Fecha_Entrega: FechaEntrega,
      Fecha_Ultima_Actualizacion: FechaUltimaActualizacion,
      Primera_Revision: req.body.column35,
      Segunda_Revision: req.body.column36,
      NIP: req.body.column37,
      Detalle_Activacion: req.body.column38,
      MOVICHECK: req.body.column39,
      Bloqueo_Desbloqueo: req.body.column40,
      Activadora: req.body.column41,
      MES_TRABAJADA: req.body.column42,
      Terminal: req.body.column43,
      Modelo_Terminal: req.body.Modelo_Terminal,
      Pago_Comision: req.body.column44,
      Numero_Provisional: req.body.column45
    };

    await pool.query('UPDATE VentasMovil SET ? WHERE SaleId = ?', [data, SaleId]);
    console.log(`✅ Updated SaleId ${SaleId}`);
    res.redirect('/homeTest');
  } catch (err) {
    console.error('POST /editNoActivadas error:', err);
    res.status(500).send('Error updating record.');
  }
});


// === EDIT: PENDIENTES ACTIVACION ===
// GET /editPendientesActivacion/:SaleId
router.get('/editPendientesActivacion/:SaleId', async (req, res) => {
  try {
    const { SaleId } = req.params;
    const [rows] = await pool.execute('SELECT * FROM VentasMovil WHERE SaleId = ?', [SaleId]);
    if (!rows.length) return res.status(404).send('Registro no encontrado');

    const saleData = rows[0];
    const fix = v => (moment(v, 'YYYY/MM/DD', true).isValid() ? moment(v, 'YYYY/MM/DD').format('YYYY-MM-DD') : '');
    saleData.formattedFechaActivacion = fix(saleData.Fecha_Activacion);
    saleData.formattedFechaEntrega = fix(saleData.Fecha_Entrega);
    saleData.formattedFechaUltimaActualizacion = fix(saleData.Fecha_Ultima_Actualizacion);

    res.render('editarPendientesActivacion', { SaleId: saleData, user: req.user });
  } catch (err) {
    console.error('GET /editPendientesActivacion error:', err);
    res.status(500).send('Error interno');
  }
});
// POST /editPendientesActivacion
router.post('/editPendientesActivacion', async (req, res) => {
  const SaleId = req.body.SaleId;
  const moment = require('moment');

  try {
    // Format dates safely
    const Fecha = moment(req.body.column23).format('YYYY/MM/DD');
    const FechaActivacion = moment(req.body.column33).isValid()
      ? moment(req.body.column33).format('YYYY/MM/DD')
      : null;
    const FechaEntrega = moment(req.body.column34).isValid()
      ? moment(req.body.column34).format('YYYY/MM/DD')
      : null;
    const FechaUltimaActualizacion = moment(req.body.FechaUA).isValid()
      ? moment(req.body.FechaUA).format('YYYY/MM/DD')
      : null;

    // ✅ Map placeholders to real column names
    const data = {
      Nombre_Cliente: req.body.column1,
      Segundo_Nombre_Cliente: req.body.column2,
      Primer_Apellido_Cliente: req.body.column3,
      Segundo_Apellido_Cliente: req.body.column4,
      Correo_Cliente: req.body.Correo,
      Genero: req.body.Genero,
      Documento_Identidad: req.body.column5,
      Numero_Documento: req.body.column6,
      Nacionalidad: req.body.column7,
      Celular_Tramite: req.body.column8,
      Tipo_Tramite: req.body.column9,
      Numero_Contrato: req.body.column10,
      Numero_Abonado: req.body.column11,
      Numero_Contacto_1: req.body.column12,
      Numero_Contacto_2: req.body.column13,
      Portabilidad: req.body.column14,
      Tipo_Cliente: req.body.tipoCliente,
      Plan_Contratar: req.body.column15,
      Valor_Plan: req.body.column16,
      Direccion_Exacta: req.body.column17,
      Provincia: req.body.column18,
      Canton: req.body.column19,
      Distrito: req.body.column20,
      Tipo_Llamada: req.body.column21,
      Nombre_Vendedor: req.body.column22,
      Fecha: Fecha,
      Vendedor_Freelance: req.body.column24,
      Cobro_Envío: req.body.column25,
      Metodo_Pago: req.body.metodo_pago,
      Intentos_Entrega: req.body.intentos_entrega,
      Activada: req.body.column26,
      Entregada: req.body.column27,
      Rechazada: req.body.column28,
      Detalle: req.body.column29,
      Entregador: req.body.column30,
      Estados: req.body.column31,
      Llamada_Activacion: req.body.column32,
      Fecha_Activacion: FechaActivacion,
      Fecha_Entrega: FechaEntrega,
      Fecha_Ultima_Actualizacion: FechaUltimaActualizacion,
      Primera_Revision: req.body.column35,
      Segunda_Revision: req.body.column36,
      NIP: req.body.column37,
      Detalle_Activacion: req.body.column38,
      MOVICHECK: req.body.column39,
      Bloqueo_Desbloqueo: req.body.column40,
      Activadora: req.body.column41,
      MES_TRABAJADA: req.body.column42,
      Terminal: req.body.column43,
      Modelo_Terminal: req.body.Modelo_Terminal,
      Pago_Comision: req.body.column44,
      Numero_Provisional: req.body.column45
    };

    await pool.query('UPDATE VentasMovil SET ? WHERE SaleId = ?', [data, SaleId]);
    console.log(`✅ Updated SaleId ${SaleId}`);
    res.redirect('/PendientesActivacion');
  } catch (err) {
    console.error('POST /editPendientesActivacion error:', err);
    res.status(500).send('Error updating record.');
  }
});

// === EDIT: PENDIENTES ENTREGA ===
// GET /editPendientesEntrega/:SaleId
router.get('/editPendientesEntrega/:SaleId', async (req, res) => {
  try {
    const { SaleId } = req.params;
    const [rows] = await pool.execute('SELECT * FROM VentasMovil WHERE SaleId = ?', [SaleId]);
    if (!rows.length) return res.status(404).send('Registro no encontrado');

    const saleData = rows[0];
    const fix = v => (moment(v, 'YYYY/MM/DD', true).isValid() ? moment(v, 'YYYY/MM/DD').format('YYYY-MM-DD') : '');
    saleData.formattedFechaActivacion = fix(saleData.Fecha_Activacion);
    saleData.formattedFechaEntrega = fix(saleData.Fecha_Entrega);
    saleData.formattedFechaUltimaActualizacion = fix(saleData.Fecha_Ultima_Actualizacion);

    res.render('editarPendientesEntrega', { SaleId: saleData, user: req.user });
  } catch (err) {
    console.error('GET /editPendientesEntrega error:', err);
    res.status(500).send('Error interno');
  }
});

router.post('/editPendientesEntrega', async (req, res) => {
  const SaleId = req.body.SaleId;
  const moment = require('moment');

  try {
    // Format dates safely
    const Fecha = moment(req.body.column23).format('YYYY/MM/DD');
    const FechaActivacion = moment(req.body.column33).isValid()
      ? moment(req.body.column33).format('YYYY/MM/DD')
      : null;
    const FechaEntrega = moment(req.body.column34).isValid()
      ? moment(req.body.column34).format('YYYY/MM/DD')
      : null;
    const FechaUltimaActualizacion = moment(req.body.FechaUA).isValid()
      ? moment(req.body.FechaUA).format('YYYY/MM/DD')
      : null;

    // ✅ Map placeholders to real column names
    const data = {
      Nombre_Cliente: req.body.column1,
      Segundo_Nombre_Cliente: req.body.column2,
      Primer_Apellido_Cliente: req.body.column3,
      Segundo_Apellido_Cliente: req.body.column4,
      Correo_Cliente: req.body.Correo,
      Genero: req.body.Genero,
      Documento_Identidad: req.body.column5,
      Numero_Documento: req.body.column6,
      Nacionalidad: req.body.column7,
      Celular_Tramite: req.body.column8,
      Tipo_Tramite: req.body.column9,
      Numero_Contrato: req.body.column10,
      Numero_Abonado: req.body.column11,
      Numero_Contacto_1: req.body.column12,
      Numero_Contacto_2: req.body.column13,
      Portabilidad: req.body.column14,
      Tipo_Cliente: req.body.tipoCliente,
      Plan_Contratar: req.body.column15,
      Valor_Plan: req.body.column16,
      Direccion_Exacta: req.body.column17,
      Provincia: req.body.column18,
      Canton: req.body.column19,
      Distrito: req.body.column20,
      Tipo_Llamada: req.body.column21,
      Nombre_Vendedor: req.body.column22,
      Fecha: Fecha,
      Vendedor_Freelance: req.body.column24,
      Cobro_Envío: req.body.column25,
      Metodo_Pago: req.body.metodo_pago,
      Intentos_Entrega: req.body.intentos_entrega,
      Activada: req.body.column26,
      Entregada: req.body.column27,
      Rechazada: req.body.column28,
      Detalle: req.body.column29,
      Entregador: req.body.column30,
      Estados: req.body.column31,
      Llamada_Activacion: req.body.column32,
      Fecha_Activacion: FechaActivacion,
      Fecha_Entrega: FechaEntrega,
      Fecha_Ultima_Actualizacion: FechaUltimaActualizacion,
      Primera_Revision: req.body.column35,
      Segunda_Revision: req.body.column36,
      NIP: req.body.column37,
      Detalle_Activacion: req.body.column38,
      MOVICHECK: req.body.column39,
      Bloqueo_Desbloqueo: req.body.column40,
      Activadora: req.body.column41,
      MES_TRABAJADA: req.body.column42,
      Terminal: req.body.column43,
      Modelo_Terminal: req.body.Modelo_Terminal,
      Pago_Comision: req.body.column44,
      Numero_Provisional: req.body.column45
    };

    await pool.query('UPDATE VentasMovil SET ? WHERE SaleId = ?', [data, SaleId]);
    console.log(`✅ Updated SaleId ${SaleId}`);
    res.redirect('/PendientesEntrega');
  } catch (err) {
    console.error('POST /editPendientesEntrega error:', err);
    res.status(500).send('Error updating record.');
  }
});

//Ventas vendedor
router.get(
  '/MovilVendedor',
  authController.isAuthenticated,
  NoCache.nocache,
  async (req, res) => {
    try {
      const vendedor = req.user.nombre;

      const [ventas] = await pool.query(
        `SELECT *
           FROM VentasMovil
          WHERE Nombre_Vendedor = ?
          ORDER BY Fecha DESC`,
        [vendedor]
      );

      res.render('MovilVendedor', { ventas, user: req.user });
    } catch (error) {
      console.error('❌ Error loading misVentas:', error);
      res.status(500).send('Error loading misVentas');
    }
  }
);

module.exports = router;
