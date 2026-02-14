const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3000);
const dbFile = path.join(process.cwd(), 'ims-db.json');

const candidates = ['public', 'dist', '.'];
const rootDir = candidates
  .map((dir) => path.join(process.cwd(), dir))
  .find((dir) => fs.existsSync(path.join(dir, 'index.html')));

if (!rootDir) {
  console.error('No index.html found in public/, dist/, or project root.');
  process.exit(1);
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const defaultDb = {
  seq: { workcode: 10000, cbr: 1 },
  workcodes: [],
  cbrs: []
};

function readDb() {
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify(defaultDb, null, 2));
  }
  return JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
}

function writeDb(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

function sendJson(res, code, payload) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function safePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(cleanPath).replace(/^\/+/, '');
  const resolved = path.join(rootDir, normalized);
  if (!resolved.startsWith(rootDir)) return null;
  return resolved;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/api/health' && req.method === 'GET') {
      return sendJson(res, 200, { ok: true, database: dbFile, staticRoot: rootDir });
    }

    if (req.url === '/api/workcodes' && req.method === 'GET') {
      const db = readDb();
      return sendJson(res, 200, db.workcodes);
    }

    if (req.url === '/api/workcodes' && req.method === 'POST') {
      const payload = await parseBody(req);
      if (!payload.workcode_no || !payload.name_of_work) {
        return sendJson(res, 400, { error: 'workcode_no and name_of_work are required' });
      }

      const db = readDb();
      if (db.workcodes.find((w) => w.workcode_no === payload.workcode_no)) {
        return sendJson(res, 409, { error: 'workcode_no already exists' });
      }

      const row = {
        id: ++db.seq.workcode,
        workcode_no: payload.workcode_no,
        financial_year: payload.financial_year || '',
        name_of_work: payload.name_of_work,
        contractor: payload.contractor || '',
        project: payload.project || '',
        created_at: new Date().toISOString()
      };
      db.workcodes.unshift(row);
      writeDb(db);
      return sendJson(res, 201, row);
    }

    if (req.url === '/api/cbrs' && req.method === 'GET') {
      const db = readDb();
      return sendJson(res, 200, db.cbrs);
    }

    if (req.url === '/api/cbrs' && req.method === 'POST') {
      const payload = await parseBody(req);
      if (!payload.cbr_no) {
        return sendJson(res, 400, { error: 'cbr_no is required' });
      }
      const db = readDb();
      if (db.cbrs.find((c) => c.cbr_no === payload.cbr_no)) {
        return sendJson(res, 409, { error: 'cbr_no already exists' });
      }
      const row = {
        id: ++db.seq.cbr,
        cbr_no: payload.cbr_no,
        workcode_no: payload.workcode_no || '',
        ra_bill_no: payload.ra_bill_no || '',
        ra_bill_amount: Number(payload.ra_bill_amount || 0),
        total_stat: Number(payload.total_stat || 0),
        total_nigam: Number(payload.total_nigam || 0),
        cheque_amount: Number(payload.cheque_amount || 0),
        status: 'Pending AO',
        created_at: new Date().toISOString()
      };
      db.cbrs.unshift(row);
      writeDb(db);
      return sendJson(res, 201, row);
    }

    const reqPath = req.url === '/' ? '/index.html' : req.url;
    const filePath = safePath(reqPath);
    if (!filePath) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Bad request');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      const finalPath = !err && stats.isFile() ? filePath : path.join(rootDir, 'index.html');
      fs.readFile(finalPath, (readErr, data) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Not Found');
          return;
        }
        const ext = path.extname(finalPath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
});

server.listen(PORT, () => {
  readDb();
  console.log(`Preview server running on http://0.0.0.0:${PORT}`);
  console.log(`Serving static files from: ${rootDir}`);
  console.log(`Connected to file database: ${dbFile}`);
});
