// ─── A.S.D. OP-COM MINI-SERVER ───────────────────────────────
// Start:  node server.js
// Port:   Umgebungsvariable PORT, Standard 8080
//
// Liefert die Seite aus und speichert die Daten direkt hier:
//   data.json  — Inhalte + Team (öffentlich lesbar)
//   evals.json — Bewertungsakten (nur mit Login lesbar)
// Diese beiden Dateien sind die "Datenbank" — beim Updaten der
// Seite nicht löschen/überschreiben.
//
// Keine Abhängigkeiten nötig (kein npm install).

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data.json');
const EVALS_FILE = path.join(ROOT, 'evals.json');

// SHA-256-Hashes der erlaubten Passwörter (identisch mit app.js).
// Neuen Hash erzeugen: F12-Konsole auf der Seite -> await asdHash('passwort')
const ALLOWED_HASHES = [
  '1629feb4b5a5f5620601d0e0646699e503b523b67cbd61878fe28858d76e751f'
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.mp4': 'video/mp4', '.woff': 'font/woff', '.woff2': 'font/woff2'
};

function sendJSON(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

function isAuthed(req) {
  return ALLOWED_HASHES.includes(req.headers['x-asd-auth']);
}

function readBody(req, limit = 5 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > limit) { req.destroy(); reject(new Error('too large')); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400); res.end(); return;
  }

  // ── API: Inhalte + Team ──
  if (pathname === '/api/data' && req.method === 'GET') {
    try { sendJSON(res, 200, JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))); }
    catch { sendJSON(res, 200, { updated: null, content: null, team: null }); }
    return;
  }

  if (pathname === '/api/data' && req.method === 'POST') {
    if (!isAuthed(req)) return sendJSON(res, 401, { error: 'unauthorized' });
    try {
      const body = JSON.parse(await readBody(req));
      if (!body || typeof body !== 'object' || !body.content) throw new Error('invalid');
      const data = {
        updated: new Date().toISOString(),
        content: body.content,
        team: Array.isArray(body.team) ? body.team : []
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      sendJSON(res, 200, { ok: true, updated: data.updated });
    } catch {
      sendJSON(res, 400, { error: 'invalid' });
    }
    return;
  }

  // ── API: Bewertungsakten (nur mit Login) ──
  if (pathname === '/api/evals' && req.method === 'GET') {
    if (!isAuthed(req)) return sendJSON(res, 401, { error: 'unauthorized' });
    try { sendJSON(res, 200, JSON.parse(fs.readFileSync(EVALS_FILE, 'utf8'))); }
    catch { sendJSON(res, 200, []); }
    return;
  }

  if (pathname === '/api/evals' && req.method === 'POST') {
    if (!isAuthed(req)) return sendJSON(res, 401, { error: 'unauthorized' });
    try {
      const evals = JSON.parse(await readBody(req));
      if (!Array.isArray(evals)) throw new Error('invalid');
      fs.writeFileSync(EVALS_FILE, JSON.stringify(evals, null, 2));
      sendJSON(res, 200, { ok: true });
    } catch {
      sendJSON(res, 400, { error: 'invalid' });
    }
    return;
  }

  // ── Statische Dateien ──
  const filePath = path.normalize(path.join(ROOT, pathname === '/' ? 'index.html' : pathname));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  fs.readFile(filePath, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 // NOT FOUND');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    res.end(buf);
  });
});

server.listen(PORT, () => {
  console.log('A.S.D. OP-COM läuft auf http://localhost:' + PORT);
});
