// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../database/db'); // <-- mysql2/promise pool exported from database/db.js

// Helper to render invalid login
function invalidLogin(res) {
  return res.render('login', {
    alert: true,
    alertTitle: "Error",
    alertMessage: "Información Incorrecta",
    alertIcon: 'error',
    showConfirmButton: false,
    timer: 800,
    ruta: ''
  });
}

// REGISTER USER
exports.register = async (req, res) => {
  try {
    const { user, nombre, rol, cedula, telefono, pass, codigoEmpleado, salario, pais } = req.body;
    const fecha_Ingreso = new Date();

    const passwordHash = await bcrypt.hash(pass, 10);

    // Normalize pais
    let finalPais = null;
    if (pais === 'Nicaragua') finalPais = 'Nicaragua';
    // if 'Costa Rica' or anything else, leave as null (your original behavior)

    const sql = `INSERT INTO users 
      (user, nombre, rol, cedula, telefono, fecha_Ingreso, pass, codigoEmpleado, pais, salario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await pool.execute(sql, [
      user, nombre, rol, cedula, telefono, fecha_Ingreso,
      passwordHash, codigoEmpleado, finalPais, salario
    ]);

    res.redirect('homeTest');
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).send('Error registering user');
  }
};

// LOGIN USER
exports.login = async (req, res) => {
  try {
    const { user, pass } = req.body;

    if (!user || !pass) return invalidLogin(res);

    const [rows] = await pool.execute('SELECT * FROM users WHERE user = ?', [user]);
    if (!rows.length) return invalidLogin(res);

    const dbUser = rows[0];
    const isMatch = await bcrypt.compare(pass, dbUser.pass);
    if (!isMatch) return invalidLogin(res);

    const token = jwt.sign(
      { id: dbUser.id },
      process.env.JWT_SECRETO,
      { expiresIn: process.env.JWT_TIEMPO_EXTRA || '1d' }
    );

    const cookieDays = Number(process.env.JWT_COOKIE_EXPIRES || 1);
    const cookieOptions = {
      expires: new Date(Date.now() + cookieDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      // secure: true,            // <-- uncomment in production (HTTPS)
      // sameSite: 'lax'          // or 'strict'/'none' (if cross-site + HTTPS)
    };

    res.cookie('jwt', token, cookieOptions);

    return res.render('login', {
      alert: true,
      alertTitle: "Conectado",
      alertMessage: "Conexión exitosa",
      alertIcon: 'success',
      showConfirmButton: false,
      timer: 800,
      ruta: 'homeTest'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Error logging in');
  }
};

// CHECK JWT
exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) return res.redirect('/');

    // jwt.verify throws on invalid/expired token; no promisify needed
    const decoded = jwt.verify(token, process.env.JWT_SECRETO);

    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [decoded.id]);
    if (!rows.length) return res.redirect('/');

    req.user = rows[0];
    next();
  } catch (error) {
    console.error('Auth check failed:', error.message || error);
    return res.redirect('/');
  }
};

// ROLE VALIDATION
exports.authRol = async (req, res, next) => {
  try {
    if (!req.user || req.user.rol !== 'admin') {
      return res.redirect('/MovilVendedor');
    }
    next();
  } catch (e) {
    console.error('authRol error:', e);
    return res.redirect('/');
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
};
