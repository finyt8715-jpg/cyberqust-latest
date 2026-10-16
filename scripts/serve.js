#!/usr/bin/env node
'use strict';
/** Tiny local preview server for public/ (no dependencies). Usage: npm run dev, then open http://localhost:3000 */
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const root = path.join(__dirname, '..', 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json', '.txt': 'text/plain', '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.webm': 'audio/webm', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
const port = Number(process.env.PORT) || 3000;
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let rel;
  try { rel = decodeURIComponent(url.pathname); } catch (e) { res.writeHead(400); res.end(); return; }
  if (rel === '/login' || rel === '/login/') rel = '/login.html';
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.normalize(path.join(root, rel));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(fs.readFileSync(path.join(root, '404.html'))); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, () => console.log('Preview on http://localhost:' + port));
