const express = require('express');
const router = express.Router()
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const util = require('util');
/*const connection = require('./db'); // Reuse your db.js*/
const connection = require('../database/db');

const upload = multer({ dest: 'uploads/' }); // temp storage
const query = util.promisify(connection.query).bind(connection);

// Convert Excel serial date to YYYY-MM-DD
function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info.toISOString().split('T')[0];
}

// Convert Excel decimal time to HH:MM
function excelTimeToString(fraction) {
  const totalSeconds = Math.floor(fraction * 24 * 60 * 60);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`; // full HH:MM:SS
}

router.post('/upload', upload.single('excelFile'), async (req, res) => {
  try {
    const filePath = req.file.path;

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (let row of data) {
      // Fix 'dia' if it's an Excel date serial number
      if (row.dia && typeof row.dia === 'number') {
        row.dia = excelDateToJSDate(row.dia);
      }

      // Fix 'hora' if it's an Excel decimal time
      if (row.hora && typeof row.hora === 'number') {
        row.hora = excelTimeToString(row.hora);
      }

      // Optional: check values before inserting
      // console.log(row);

      // Insert into the database
      await query('INSERT INTO baseITX SET ?', row);
    }

    fs.unlinkSync(filePath);
    res.send('Excel file uploaded and data inserted successfully.');
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).send('Failed to upload Excel file.');
  }
});

router.get('/download-excel', async (req, res) => {
    try {
      // Query your MySQL table
      const rows = await query('SELECT * FROM baseITX');
  
      // Convert to worksheet
      const worksheet = xlsx.utils.json_to_sheet(rows);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Datos');
  
      // Write to buffer (no need to save file)
      const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  
      // Set headers and send as download
      res.setHeader('Content-Disposition', 'attachment; filename=baseITX.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
    } catch (err) {
      console.error('Error generating Excel:', err);
      res.status(500).send('Error generating Excel file');
    }
  });


module.exports = router;
// Serve HTML form
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Upload.ejs'));
});
