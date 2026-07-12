/* ══════════════════════════════════════════════════════════════════
   Favtel · Widget de Marcaje  (para incrustar en el CRM u otra web)

   Uso (una sola línea, donde se quiera el botón flotante):
     <script src="https://TU-APP.azurewebsites.net/widget/favtel-marcaje.js"
             data-api="https://TU-APP.azurewebsites.net"></script>

   - data-api  : URL base del backend Favtel (si se omite, usa el origen
                 desde donde se cargó este script).
   - data-codigo (opcional): código FV pre-cargado, ej. "FV0077". Útil si
                 el CRM ya sabe quién es el usuario; solo pedirá el PIN.

   El widget habla con /api/rh/widget/* usando código de empleado + PIN.
   No usa cookies ni sesiones del CRM: es 100% independiente.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.__favtelMarcaje) return; window.__favtelMarcaje = true;

  var script = document.currentScript || (function () { var s = document.getElementsByTagName('script'); return s[s.length - 1]; })();
  var API = (script && script.getAttribute('data-api')) || (script && script.src ? script.src.split('/widget/')[0] : '');
  var CODIGO_FIJO = (script && script.getAttribute('data-codigo')) || '';
  var LS = 'favtel_marcaje_cred';

  /* ── Estilos (aislados con prefijo fvm-) ── */
  var css = [
    '.fvm-btn{position:fixed;right:22px;bottom:22px;z-index:99990;width:58px;height:58px;border-radius:50%;border:none;cursor:pointer;',
    ' background:linear-gradient(120deg,#7568C0,#33C3C1);color:#fff;font-size:24px;box-shadow:0 10px 26px rgba(117,104,192,.45);',
    ' display:flex;align-items:center;justify-content:center;transition:transform .15s}',
    '.fvm-btn:hover{transform:scale(1.07)}',
    '.fvm-ov{position:fixed;inset:0;background:rgba(21,18,31,.5);z-index:99991;display:none;align-items:center;justify-content:center;padding:16px}',
    '.fvm-ov.open{display:flex}',
    '.fvm-md{background:#fff;border-radius:20px;width:100%;max-width:360px;padding:22px 22px 18px;box-shadow:0 30px 70px rgba(0,0,0,.4);',
    ' font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:#28243B;font-size:14px;position:relative}',
    '.fvm-x{position:absolute;top:12px;right:14px;border:none;background:none;font-size:18px;color:#9C97B3;cursor:pointer}',
    '.fvm-logo{text-align:center;font-weight:800;color:#7568C0;font-size:15px;letter-spacing:.02em;margin-bottom:2px}',
    '.fvm-sub{text-align:center;color:#726D89;font-size:11.5px;margin-bottom:14px}',
    '.fvm-clock{text-align:center;font-size:44px;font-weight:800;background:linear-gradient(120deg,#7568C0,#1CAFD3);',
    ' -webkit-background-clip:text;background-clip:text;color:transparent;line-height:1.1;margin:2px 0}',
    '.fvm-date{text-align:center;color:#726D89;font-size:12px;margin-bottom:10px}',
    '.fvm-chip{display:block;text-align:center;margin:0 auto 12px;max-width:fit-content;font-size:11.5px;font-weight:700;',
    ' border-radius:999px;padding:4px 12px;background:#EFEEF4;color:#726D89}',
    '.fvm-chip.ok{background:#E5F4EC;color:#2E9E6B}.fvm-chip.warn{background:#FDF0E0;color:#C97A1E}',
    '.fvm-chip.teal{background:#DFF1F6;color:#0F7E96}.fvm-chip.purple{background:#ECE9F8;color:#5A4FA3}',
    '.fvm-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}',
    '.fvm-a{border:1px solid #E7E3F1;background:#F4F3F9;border-radius:13px;padding:11px 6px;font-size:12.5px;font-weight:700;',
    ' cursor:pointer;color:#28243B;transition:transform .1s,border-color .1s}',
    '.fvm-a:hover:not(:disabled){transform:translateY(-1px);border-color:#7568C0}',
    '.fvm-a:disabled{opacity:.35;cursor:not-allowed}',
    '.fvm-a.main{grid-column:1/-1;background:linear-gradient(120deg,#7568C0,#5A4FA3);border:none;color:#fff}',
    '.fvm-a.out{background:#FBE7EE;border-color:#F3C9d8;color:#C8466A}',
    '.fvm-a.back{background:#DFF1F6;border-color:#9adcE8;color:#0F7E96}',
    '.fvm-tl{border-top:1px solid #EFEDF6;max-height:150px;overflow-y:auto;font-size:12.5px}',
    '.fvm-tl div{display:flex;gap:10px;padding:6px 2px;border-bottom:1px solid #F4F3F9}',
    '.fvm-tl b{width:44px;flex:none;color:#5A4FA3}',
    '.fvm-in{width:100%;border:1px solid #E7E3F1;border-radius:11px;padding:10px 12px;font-size:14px;margin-bottom:9px;box-sizing:border-box}',
    '.fvm-go{width:100%;border:none;border-radius:12px;padding:11px;font-size:14px;font-weight:700;cursor:pointer;',
    ' background:linear-gradient(120deg,#7568C0,#33C3C1);color:#fff}',
    '.fvm-err{color:#C8466A;font-size:12px;text-align:center;min-height:16px;margin:6px 0 2px}',
    '.fvm-note{color:#9C97B3;font-size:10.5px;text-align:center;margin-top:10px}',
    '.fvm-link{background:none;border:none;color:#9C97B3;font-size:11px;text-decoration:underline;cursor:pointer;display:block;margin:8px auto 0}'
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ── DOM ── */
  var btn = document.createElement('button');
  btn.className = 'fvm-btn'; btn.title = 'Marcaje Favtel'; btn.setAttribute('aria-label', 'Abrir marcaje Favtel');
  btn.innerHTML = '&#10022;';
  var ov = document.createElement('div'); ov.className = 'fvm-ov';
  ov.innerHTML = '<div class="fvm-md" role="dialog" aria-modal="true">' +
    '<button class="fvm-x" aria-label="Cerrar">&times;</button>' +
    '<div class="fvm-logo">Favtel &#10022; Marcaje</div>' +
    '<div class="fvm-sub" id="fvm-sub">Registro de asistencia</div>' +
    '<div id="fvm-body"></div>' +
    '<div class="fvm-note">Suite de Talento Favtel · las marcas usan hora de Costa Rica</div></div>';
  document.body.appendChild(btn); document.body.appendChild(ov);
  var body = ov.querySelector('#fvm-body'), sub = ov.querySelector('#fvm-sub');
  btn.addEventListener('click', function () { ov.classList.add('open'); iniciar(); });
  ov.querySelector('.fvm-x').addEventListener('click', function () { ov.classList.remove('open'); });
  ov.addEventListener('click', function (e) { if (e.target === ov) ov.classList.remove('open'); });

  function cred() { try { return JSON.parse(localStorage.getItem(LS)) || null; } catch (e) { return null; } }
  function post(path, data) {
    return fetch(API + '/api/rh/widget/' + path, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'Error'); return j; }); });
  }

  /* ── Pantalla de identificación ── */
  function pedirCred(msg) {
    sub.textContent = 'Identificate para marcar';
    body.innerHTML =
      '<input class="fvm-in" id="fvm-cod" placeholder="Código de empleado (FV0000)" autocomplete="off" ' +
      (CODIGO_FIJO ? 'value="' + CODIGO_FIJO + '" readonly' : '') + '>' +
      '<input class="fvm-in" id="fvm-pin" type="password" inputmode="numeric" placeholder="PIN" autocomplete="off">' +
      '<div class="fvm-err" id="fvm-err">' + (msg || '') + '</div>' +
      '<button class="fvm-go" id="fvm-go">Entrar</button>';
    var go = body.querySelector('#fvm-go');
    function intentar() {
      var c = body.querySelector('#fvm-cod').value.trim().toUpperCase();
      var p = body.querySelector('#fvm-pin').value;
      go.disabled = true; go.textContent = 'Verificando…';
      post('estado', { codigo: c, pin: p }).then(function (d) {
        localStorage.setItem(LS, JSON.stringify({ codigo: c, pin: p }));
        render(d);
      }).catch(function (e) {
        go.disabled = false; go.textContent = 'Entrar';
        body.querySelector('#fvm-err').textContent = e.message;
      });
    }
    go.addEventListener('click', intentar);
    body.querySelector('#fvm-pin').addEventListener('keydown', function (e) { if (e.key === 'Enter') intentar(); });
  }

  /* ── Pantalla de marcaje ── */
  var reloj = null;
  function fmtHora(d) {
    return d.toLocaleTimeString('es-CR', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Costa_Rica' });
  }
  function render(d) {
    sub.textContent = '¡Hola, ' + d.empleado.nombre.split(' ')[0] + '! (' + d.empleado.codigo + ')';
    var CH = { sin_marcar: ['','Sin marcar hoy'], dentro: ['ok','En jornada'], salida: ['purple','Jornada terminada ✦'],
               desayuno: ['teal','En desayuno'], almuerzo: ['teal','En almuerzo'], cafe: ['teal','En café'] };
    var ch = CH[d.estado] || ['', d.estado];
    var acc = '';
    if (d.estado === 'sin_marcar') {
      acc = '<button class="fvm-a main" data-t="entrada">&#8595;&nbsp; Marcar entrada</button>';
    } else if (d.estado === 'dentro') {
      var did = {}; (d.marcas || []).forEach(function (m) { did[m.tipo] = 1; });
      acc = (did.desayuno_inicio ? '' : '<button class="fvm-a" data-t="desayuno_inicio">Desayuno</button>') +
            (did.almuerzo_inicio ? '' : '<button class="fvm-a" data-t="almuerzo_inicio">Almuerzo</button>') +
            (did.cafe_inicio ? '' : '<button class="fvm-a" data-t="cafe_inicio">Café</button>') +
            '<button class="fvm-a out" data-t="salida">&#8593; Salida</button>';
    } else if (['desayuno', 'almuerzo', 'cafe'].indexOf(d.estado) >= 0) {
      acc = '<button class="fvm-a back main" data-t="' + d.estado + '_fin">&#8617;&nbsp; Regresar de ' + d.estado + '</button>';
    }
    var tl = (d.marcas || []).map(function (m) {
      var nom = m.tipo.replace('_inicio', ' ▸').replace('_fin', ' ✓').replace('cafe', 'café');
      return '<div><b>' + m.hora + '</b><span>' + nom.charAt(0).toUpperCase() + nom.slice(1) +
        (m.tipo === 'entrada' && m.tarde ? ' · <span style="color:#C97A1E">tarde</span>' : '') + '</span></div>';
    }).join('');
    body.innerHTML =
      '<div class="fvm-clock" id="fvm-clock">' + fmtHora(new Date()) + '</div>' +
      '<div class="fvm-date">' + new Date().toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Costa_Rica' }) + '</div>' +
      '<span class="fvm-chip ' + ch[0] + '">' + ch[1] + '</span>' +
      '<div class="fvm-grid">' + acc + '</div>' +
      '<div class="fvm-err" id="fvm-err"></div>' +
      '<div class="fvm-tl">' + (tl || '<div><span style="color:#9C97B3">Sin marcas todavía</span></div>') + '</div>' +
      '<button class="fvm-link" id="fvm-out">Cambiar de usuario</button>';
    clearInterval(reloj);
    reloj = setInterval(function () {
      var el = body.querySelector('#fvm-clock'); if (el) el.textContent = fmtHora(new Date());
    }, 15000);
    body.querySelector('#fvm-out').addEventListener('click', function () { localStorage.removeItem(LS); pedirCred(); });
    Array.prototype.forEach.call(body.querySelectorAll('[data-t]'), function (b) {
      b.addEventListener('click', function () {
        var c = cred(); if (!c) return pedirCred();
        b.disabled = true;
        post('marca', { codigo: c.codigo, pin: c.pin, tipo: b.getAttribute('data-t') }).then(function (r) {
          post('estado', c).then(render);
          if (r.efectos && r.efectos.length) setTimeout(function () {
            var e2 = body.querySelector('#fvm-err'); if (e2) { e2.style.color = '#C97A1E'; e2.textContent = r.efectos[0]; }
          }, 60);
        }).catch(function (e) {
          b.disabled = false;
          var el = body.querySelector('#fvm-err'); if (el) el.textContent = e.message;
        });
      });
    });
  }

  function iniciar() {
    var c = cred();
    if (!c && CODIGO_FIJO) c = null;
    if (!c) return pedirCred();
    sub.textContent = 'Cargando…'; body.innerHTML = '<div class="fvm-err"></div>';
    post('estado', c).then(render).catch(function () { localStorage.removeItem(LS); pedirCred(); });
  }
})();
