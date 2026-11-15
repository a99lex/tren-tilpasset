import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const files = {
  '/': ['index.html', 'text/html'],
  '/working-out-with-a-new-tattoo/': ['tattoo.html', 'text/html'],
  '/training-with-jumpers-knee/': ['knee.html', 'text/html'],
  '/behandlere/': ['behandlere.html', 'text/html'],
  '/figurer.js': ['figurer.js', 'text/javascript'],
  '/style.css': ['style.css', 'text/css'],
  '/app.js': ['app.js', 'text/javascript'],
  '/robots.txt': ['robots.txt', 'text/plain'],
  '/sitemap.xml': ['sitemap.xml', 'application/xml']
};
const assets = Object.fromEntries(Object.entries(files).map(([path, [file, type]]) =>
  [path, {type, body:readFileSync('web/' + file, 'utf8')}]));
mkdirSync('dist/server', {recursive:true});
writeFileSync('dist/server/index.js', 'const assets = ' + JSON.stringify(assets) + ';\n' +
  readFileSync('worker/index.js', 'utf8'));
