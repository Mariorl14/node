const express = require('express');
const router = express.Router()
const moment = require('moment');
const conexion = require('../database/db');

const authController = require('../controllers/authController')
const UsuarioController = require('../controllers/UsuarioController')
const VentasController = require('../controllers/VentasController');
const NoCache = require('../controllers/noCache');
const rolemiddlware = require('../controllers/roleMiddlware')


// =======================================================
//  📄 GET - Base Fijo main view
// =======================================================
router.get('/baseFijo', authController.isAuthenticated, NoCache.nocache, async (req, res) => {
  try {
    const userName = req.user.nombre;
    const userRole = req.user.rol;

    let sql;
    let params = [];

    // Only admin sees all
    if (userRole !== 'admin') {
      sql = 'SELECT * FROM baseFijo WHERE asesor = ?';
      params = [userName];
    } else {
      sql = 'SELECT * FROM baseFijo';
    }

    const [results] = await conexion.query(sql, params);
    res.render('baseFijo', { results, user: req.user });
  } catch (error) {
    console.error('❌ Error loading baseFijo:', error);
    res.status(500).send('Error loading baseFijo');
  }
});

// =======================================================
//  ✏️ GET - Edit single Base Fijo record
// =======================================================
router.get('/editBaseFijo/:consecutivo', authController.isAuthenticated, async (req, res) => {
  try {
    const { consecutivo } = req.params;
    const [results] = await conexion.query('SELECT * FROM baseFijo WHERE consecutivo = ?', [consecutivo]);

    if (results.length === 0) {
      return res.status(404).send("Registro no encontrado");
    }

    const saleData = results[0];
    saleData.formattedDia = saleData.dia ? moment(saleData.dia).format('YYYY-MM-DD') : '';
    saleData.formattedHora = saleData.hora ? moment(saleData.hora, 'HH:mm:ss').format('HH:mm') : '';

    res.render('editBaseFijo', {
      SaleId: saleData,
      user: req.user,
      title: 'Editar Registro Base Fijo',
      postPath: '/editBaseFijo',
      backPath: '/baseFijo'
    });

  } catch (error) {
    console.error('❌ Error loading record:', error);
    res.status(500).send('Error loading record');
  }
});

// =======================================================
//  💾 POST - Update Base Fijo record
// =======================================================
router.post('/editBaseFijo', authController.isAuthenticated, async (req, res) => {
  try {
    const { consecutivo } = req.body;

    const now = moment();
    const dia = now.format('YYYY-MM-DD');
    const hora = now.format('HH:mm:ss');

    const data = {
      numero: req.body.numero,
      cedula: req.body.cedula,
      nombre: req.body.nombre,
      asesor: req.body.asesor,
      detalle: req.body.detalle,
      dia,
      hora,
      comentario: req.body.comentario,
      pre_post_pago: req.body.pre_post_pago,
      fijo: req.body.fijo,
      operador_fijo: req.body.operador_fijo,
      operador_movil: req.body.operador_movil,
      genero: req.body.genero,
      whatsapp: req.body.whatsapp,
      cobertura_fijo: req.body.cobertura_fijo,
      coordenadas: req.body.coordenadas
    };

    await conexion.query('UPDATE baseFijo SET ? WHERE consecutivo = ?', [data, consecutivo]);
    console.log(`✅ Registro actualizado: consecutivo ${consecutivo}`);

    res.redirect('/baseFijo');

  } catch (error) {
    console.error('❌ Error updating Base Fijo:', error);
    res.status(500).send('Error updating Base Fijo');
  }
});

  router.post('/delete-databaseFijo', (req, res) => {
    const databaseName = 'baseFijo'; // set your DB name
    const sql = `DROP table ??`;
  
    conexion.query(sql, [databaseName], (err, result) => {
      if (err) {
        console.error('Error deleting database:', err);
        return res.status(500).send('Database deletion failed');
      }
      console.log('Database deleted');
      res.send('Database deleted successfully');
    });
  });
  
  router.post('/create-tableFijo', (req, res) => {
    const createTableSQL = `
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
    `;
  
    conexion.query(createTableSQL, (err, result) => {
      if (err) {
        console.error('Error creating table:', err);
        return res.status(500).send('Failed to create table');
      }
      res.send('Table baseFijo created successfully');
    });
  });

  /*test */

  module.exports = router;