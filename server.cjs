// Servidor sin dependencias. Railway proporciona PORT automáticamente.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'romantica', 'dist');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.wav':'audio/wav', '.mp3':'audio/mpeg', '.m4a':'audio/mp4', '.ogg':'audio/ogg' };
http.createServer((req,res) => {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); return res.end(); }
  let name;
  try { name = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400); return res.end(); }
  const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  fs.stat(file,(err,stat) => {
    if(err || !stat.isFile()) { res.writeHead(404); return res.end('No encontrado'); }
    // Safari/iPhone solicita partes del audio; servir rangos permite reproducirlo.
    let start = 0, end = stat.size - 1, status = 200;
    if (req.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!match || (!match[1] && !match[2])) { res.writeHead(416, {'Content-Range': `bytes */${stat.size}`}); return res.end(); }
      start = match[1] ? Number(match[1]) : Math.max(0, stat.size - Number(match[2]));
      end = match[1] && match[2] ? Math.min(Number(match[2]), end) : end;
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= stat.size) { res.writeHead(416, {'Content-Range': `bytes */${stat.size}`}); return res.end(); }
      status = 206;
    }
    const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Content-Length':end-start+1,'Accept-Ranges':'bytes','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'};
    if (status === 206) headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
    res.writeHead(status, headers);
    if(req.method === 'HEAD') return res.end();
    const stream=fs.createReadStream(file,{start,end});stream.on('error',()=>res.destroy());stream.pipe(res);
  });
}).listen(process.env.PORT || 3000, '0.0.0.0', () => console.log(`Web disponible en http://localhost:${process.env.PORT || 3000}`));
