const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs').promises;
const pool = require('../database/db'); // your new pooled DB connection

// Temp folder for uploads
const upload = multer({ dest: 'uploads/' });

// Converts Excel date & time
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

// === Upload handler (same for all three tables) ===
async function handleUpload(req, res, table) {
  const filePath = req.file.path;
  try {
    // Read Excel file
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (!data.length) return res.status(400).send('Empty file');

    // Fix columns and format
    const rows = data.map(row => {
      delete row.consecutivo;
      if (row.dia && typeof row.dia === 'number') row.dia = excelDateToJSDate(row.dia);
      if (row.hora && typeof row.hora === 'number') row.hora = excelTimeToString(row.hora);
      return row;
    });

    // Batch insert 500 at a time
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

    res.send(`Uploaded ${rows.length} rows to ${table}`);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).send('Upload failed.');
  } finally {
    try { await fs.unlink(filePath); } catch {}
  }
}

// === Upload routes ===
router.post('/upload', upload.single('excelFile'), (req, res) => handleUpload(req, res, 'baseITX'));
router.post('/uploadFijo', upload.single('excelFile'), (req, res) => handleUpload(req, res, 'baseFijo'));
router.post('/uploadTelefonos', upload.single('excelFile'), (req, res) => handleUpload(req, res, 'baseTelefonos'));

// === Download routes ===
router.get('/download-excel', async (req, res) => downloadExcel(res, 'baseITX', 'baseITX.xlsx'));
router.get('/download-excelFijo', async (req, res) => downloadExcel(res, 'baseFijo', 'baseFijo.xlsx'));
router.get('/download-excelTelefonos', async (req, res) => downloadExcel(res, 'baseTelefonos', 'baseTelefonos.xlsx'));

// Helper for downloads
async function downloadExcel(res, table, filename) {
  try {
    const rows = await pool.query(`SELECT * FROM ${table} LIMIT 100000`);
    const worksheet = xlsx.utils.json_to_sheet(rows);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, worksheet, 'Datos');
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).send('Error generating Excel file.');
  }
}

module.exports = router;
