const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3000);

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
  '.ico': 'image/x-icon',
};

function safePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(cleanPath).replace(/^\/+/, '');
  const resolved = path.join(rootDir, normalized);
  if (!resolved.startsWith(rootDir)) return null;
  return resolved;
}

const server = http.createServer((req, res) => {
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
});

server.listen(PORT, () => {
  console.log(`Preview server running on http://0.0.0.0:${PORT}`);
  console.log(`Serving static files from: ${rootDir}`);
});
