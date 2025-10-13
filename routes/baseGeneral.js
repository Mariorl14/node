const express = require('express');
const router = express.Router();
const moment = require('moment');
const pool = require('../database/db');
const authController = require('../controllers/authController');
const NoCache = require('../controllers/noCache');



router.get('/menu', authController.isAuthenticated, (req, res) => {
  res.render('baseMenu', { user: req.user });
});

/* ==============================
   📋 VIEW DYNAMIC BASE
============================== */
router.get('/:table', authController.isAuthenticated, NoCache.nocache, async (req, res) => {
  try {
    const table = req.params.table; // e.g. baseITX, baseMovil, baseFijo
    const userName = req.user.nombre;
    const userRole = req.user.rol;

    // Simple validation to avoid SQL injection
    const allowedTables = ['baseITX', 'baseMigraciones','baseTelefonos', 'baseKolbi', 'baseClaro'];
    if (!allowedTables.includes(table)) {
      return res.status(400).send('Invalid table');
    }

    const sql = userRole === 'admin'
      ? `SELECT * FROM ${table}`
      : `SELECT * FROM ${table} WHERE asesor = ?`;

    const [results] = await pool.query(sql, userRole === 'admin' ? [] : [userName]);

    res.render('baseGeneral', { results, table, user: req.user });
  } catch (error) {
    console.error('❌ Error loading base:', error);
    res.status(500).send('Error loading base');
  }
});

/* ==============================
   ✏️ EDIT RECORD
============================== */
router.get('/edit/:table/:id', authController.isAuthenticated, async (req, res) => {
  const { table, id } = req.params;
  const allowedTables = ['baseITX', 'baseMigraciones','baseTelefonos', 'baseKolbi', 'baseClaro']; // ✅ include baseTelefonos here
  if (!allowedTables.includes(table)) return res.status(400).send('Invalid table');

  const [results] = await pool.query(`SELECT * FROM ${table} WHERE consecutivo = ?`, [id]);
  if (!results.length) return res.status(404).send('Registro no encontrado');

  const record = results[0];
  record.formattedDia = record.dia ? moment(record.dia).format('YYYY-MM-DD') : '';
  record.formattedHora = record.hora ? moment(record.hora, 'HH:mm:ss').format('HH:mm') : '';

  res.render('editarGeneral', { record, table, user: req.user });
});

/* ==============================
   💾 UPDATE RECORD
============================== */
router.post('/edit/:table', authController.isAuthenticated, async (req, res) => {
  try {
    const { table } = req.params;
    const allowedTables = ['baseITX', 'baseMigraciones','baseTelefonos', 'baseKolbi', 'baseClaro'];
    if (!allowedTables.includes(table)) return res.status(400).send('Invalid table');

    const consecutivo = req.body.consecutivo;
    const now = moment();

    // 🧹 Remove display-only fields
    const { formattedDia, formattedHora, ...cleanBody } = req.body;

    // 🧾 Add real date/time fields
    const data = { 
      ...cleanBody, 
      dia: now.format('YYYY-MM-DD'), 
      hora: now.format('HH:mm:ss') 
    };

    await pool.query(`UPDATE ${table} SET ? WHERE consecutivo = ?`, [data, consecutivo]);
    console.log(`✅ Updated ${table} record: ${consecutivo}`);
    res.redirect(`/${table}`);
  } catch (error) {
    console.error('❌ Error updating:', error);
    res.status(500).send('Error updating data.');
  }
});



module.exports = router;
