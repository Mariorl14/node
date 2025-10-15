const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs').promises;
const pool = require('../database/db');
const authController = require('../controllers/authController');
const NoCache = require('../controllers/noCache');



router.get('/manageBases', authController.isAuthenticated, (req, res) => {
  res.render('manageBases', { user: req.user });
});

// 📁 Temporary folder for uploads
const upload = multer({ dest: 'uploads/' });

// ✅ Allowed base tables
const ALLOWED_TABLES = ['baseFijo', 'baseITX', 'baseTelefonos'];

// ===============================
//  🔹 Excel → Date/Time Helpers
// ===============================
function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info.toISOString().split('T')[0];
}

function excelTimeToString(fraction) {
  const totalSeconds = Math.floor(fraction * 24 * 60 * 60);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// ===============================
//  📤 Upload Excel → MySQL
// ===============================
async function handleUpload(req, res, table) {
  const filePath = req.file.path;
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).send('Invalid table');

  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    if (!jsonData.length) return res.status(400).send('Archivo vacío.');

    // Clean and format
    const rows = jsonData.map(row => {
      delete row.consecutivo; // Skip auto-increment column
      if (row.dia && typeof row.dia === 'number') row.dia = excelDateToJSDate(row.dia);
      if (row.hora && typeof row.hora === 'number') row.hora = excelTimeToString(row.hora);
      return row;
    });

    // Insert in batches
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    const cols = Object.keys(rows[0]);
    const placeholders = cols.map(() => '?').join(',');

    for (let i = 0; i < rows.length; i += 500) {
      const chunk = rows.slice(i, i + 500);
      const values = chunk.flatMap(r => cols.map(c => r[c] ?? null));
      const sql = `INSERT INTO ${table} (${cols.join(',')}) VALUES ${chunk.map(() => `(${placeholders})`).join(',')}`;
      await conn.query(sql, values);
    }

    await conn.commit();
    conn.release();

    res.send(`✅ ${rows.length} registros subidos a ${table}`);

  } catch (err) {
    console.error('❌ Error subiendo Excel:', err);
    res.status(500).send('Error al subir el archivo.');
  } finally {
    try { await fs.unlink(filePath); } catch {}
  }
}

// ===============================
//  📥 Download Excel from MySQL
// ===============================
async function downloadExcel(res, table, filename) {
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).send('Invalid table');
  try {
    const [rows] = await pool.query(`SELECT * FROM ${table} LIMIT 100000`);
    const worksheet = xlsx.utils.json_to_sheet(rows);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, worksheet, 'Datos');
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    console.error('❌ Error descargando Excel:', err);
    res.status(500).send('Error generando Excel.');
  }
}

// ===============================
//  🧱 Create Base (if missing)
// ===============================
async function createBase(table) {
  const schemas = {
    baseFijo: `
      CREATE TABLE IF NOT EXISTS baseFijo (
        consecutivo INT AUTO_INCREMENT PRIMARY KEY,
        numero INT,
        cedula VARCHAR(512),
        nombre VARCHAR(512),
        asesor VARCHAR(512),
        detalle VARCHAR(512),
        dia DATE,
        hora TIME,
        comentario VARCHAR(512),
        pre_post_pago VARCHAR(512),
        fijo VARCHAR(512),
        operador_fijo VARCHAR(512),
        operador_movil VARCHAR(512),
        genero VARCHAR(512),
        whatsapp VARCHAR(512),
        cobertura_fijo VARCHAR(512),
        coordenadas VARCHAR(512)
      );
    `,
    baseITX: `
      CREATE TABLE IF NOT EXISTS baseITX (
        consecutivo INT AUTO_INCREMENT PRIMARY KEY,
        numero INT,
        cedula VARCHAR(512),
        nombre VARCHAR(512),
        asesor VARCHAR(512),
        detalle VARCHAR(512),
        dia DATE,
        hora TIME,
        comentario VARCHAR(512),
        pre_post_pago VARCHAR(512),
        fijo VARCHAR(512),
        operador_fijo VARCHAR(512),
        operador_movil VARCHAR(512),
        genero VARCHAR(512),
        whatsapp VARCHAR(512),
        cobertura_fijo VARCHAR(512),
        coordenadas VARCHAR(512)
      );
    `,
    baseTelefonos: `
      CREATE TABLE IF NOT EXISTS baseTelefonos (
        consecutivo INT AUTO_INCREMENT PRIMARY KEY,
        numero INT,
        nombre VARCHAR(512),
        operador VARCHAR(512),
        asesor VARCHAR(512),
        detalle VARCHAR(512),
        dia DATE,
        hora TIME,
        comentario VARCHAR(512),
        whatsapp VARCHAR(512)
      );
    `
  };

  await pool.query(schemas[table]);
  console.log(`✅ Base verificada o creada: ${table}`);
}

// ===============================
//  🗑️ Truncate (Reset) Base
// ===============================
async function truncateBase(table) {
  if (!ALLOWED_TABLES.includes(table)) throw new Error('Invalid table');
  await pool.query(`TRUNCATE TABLE ${table}`);
  console.log(`🧱 Base truncada: ${table}`);
}

// ===============================
//  🌐 Routes
// ===============================

// 🧱 Create base if missing
router.post('/create/:table', async (req, res) => {
  const { table } = req.params;
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).send('Invalid table');
  try {
    await createBase(table);
    res.send(`✅ Base ${table} creada o verificada.`);
  } catch (err) {
    console.error('Error creando base:', err);
    res.status(500).send('Error creando base.');
  }
});

// 📤 Upload Excel
router.post('/upload/:table', upload.single('excelFile'), async (req, res) => {
  const { table } = req.params;
  await handleUpload(req, res, table);
});

// 📥 Download Excel
router.get('/download/:table', async (req, res) => {
  const { table } = req.params;
  await downloadExcel(res, table, `${table}.xlsx`);
});

// 🗑️ Truncate (Delete All Rows)
router.post('/truncate/:table', async (req, res) => {
  const { table } = req.params;
  if (!ALLOWED_TABLES.includes(table)) return res.status(400).send('Invalid table');
  try {
    await truncateBase(table);
    res.send(`🗑️ Base ${table} vaciada correctamente.`);
  } catch (err) {
    console.error('Error truncando base:', err);
    res.status(500).send('Error truncando base.');
  }
});

module.exports = router;
