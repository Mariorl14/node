// app.js
'use strict';

const cluster = require('node:cluster');
const os = require('node:os');

if (process.env.CLUSTER === '1' && cluster.isPrimary) {
  const num = Number(process.env.WEB_CONCURRENCY) || os.cpus().length;
  for (let i = 0; i < num; i++) cluster.fork();
  cluster.on('exit', (worker, code, signal) => {
    console.error('[cluster] worker died', { pid: worker.process.pid, code, signal });
    // Optional: respawn
    cluster.fork();
  });
  return; // master process exits here; workers run the app below
}

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');

// Load env early
dotenv.config({ path: './env/.env' });

/* ---- Global crash guards ---- */
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION', err?.stack || err);
  // Give Azure a chance to drain; do not hard-exit immediately in App Service
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION', reason?.stack || reason);
});

const app = express();

/* ---- View engine ---- */
app.set('view engine', 'ejs');
app.use(expressLayouts);
// Correct usage: set default layout or disable explicitly per-render
// app.set('layout', 'layouts/main'); // <- if you have a main layout
// To disable layout for a single render: res.render(view, { layout: false })
app.set('view cache', process.env.NODE_ENV === 'production');

/* ---- Trust proxy (Azure) ---- */
app.set('trust proxy', 1);

/* ---- Static files ---- */
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  etag: true,
}));

/* ---- Body parsing with SAFE LIMITS ---- */
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

/* ---- Cookies ---- */
app.use(cookieParser());

/* ---- (Optional) Low-overhead request log for debugging ---- */
// Toggle with REQ_LOG=1 env var to avoid production overhead
if (process.env.REQ_LOG === '1') {
  app.use((req, res, next) => {
    const t0 = process.hrtime.bigint();
    res.on('finish', () => {
      const dt = Number(process.hrtime.bigint() - t0) / 1e6;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${dt.toFixed(1)}ms`);
    });
    next();
  });
}

/* ---- Routes ---- */
app.use('/', require('./routes/router'));
app.use('/', require('./routes/Users'));
app.use('/', require('./routes/Movil'));
app.use('/', require('./routes/Revenues'));
app.use('/', require('./routes/Fijo'));
app.use('/', require('./routes/BDClaro'));
app.use('/', require('./routes/BDKolbi'));
app.use('/', require('./routes/BDFijo'));
app.use('/', require('./routes/UploadExcel'));
app.use('/', require('./routes/BDITX'));
app.use('/', require('./routes/BDMigraciones'));
app.use('/', require('./routes/BDTelefonos'));
app.use('/', require('./routes/EditRevenues2024'));
app.use('/', require('./routes/VISRevenues2024'));
app.use('/', require('./routes/Ticocel'));

/* ---- Centralized error handler (prevents crashes) ---- */
app.use((err, req, res, next) => {
  // Don’t leak internals to clients
  console.error('ROUTE ERROR:', err?.stack || err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

/* ---- Start server ---- */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running pid=${process.pid} on port ${port}`);
});

process.on('uncaughtException', e => console.error('UNCAUGHT', e));
process.on('unhandledRejection', r => console.error('UNHANDLED', r));

app.use((err, req, res, next) => {
  console.error('ROUTE ERROR:', err);
  if (!res.headersSent) res.status(500).send('Internal Server Error');
});
