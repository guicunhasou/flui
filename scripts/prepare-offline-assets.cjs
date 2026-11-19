/* global __dirname */
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

// Executar sobre uma exportação concluída; não lê .env nem inclui arquivos fora dos assets públicos.
function prepareOfflineAssets(directory) {
  const root = path.resolve(directory);
  if (!fs.existsSync(path.join(root, 'index.html'))) throw Error('Informe a pasta de uma exportação web concluída.');
  const assets = [];
  for (const category of ['user', 'stations']) {
    const folder = path.join(root, 'assets/src/assets', category);
    if (!fs.existsSync(folder)) throw Error(`Exportação sem fotos locais de ${category}.`);
    for (const name of fs.readdirSync(folder).sort()) {
      const file = path.join(folder, name);
      if (/\.(webp|png|jpe?g)$/i.test(name) && fs.lstatSync(file).isFile()) assets.push(`/assets/src/assets/${category}/${name}`);
    }
  }
  if (!assets.length) throw Error('Nenhuma foto local encontrada.');
  const scripts = listFiles(root, '_expo/static/js/web', /\.js$/);
  if (!scripts.length) throw Error('Exportação sem scripts Web do Expo.');

  const manifest = { version: 2, assets, scripts };
  const manifestText = JSON.stringify(manifest, null, 2) + '\n';
  const worker = path.join(root, 'offline-worker.js');
  const source = fs.readFileSync(worker, 'utf8');
  const versionLine = /^const VERSION = "(?:BUILD_VERSION|[a-f0-9]{64})";$/m;
  if (!versionLine.test(source)) throw Error('Exportação sem marcador de versão no worker.');
  const template = source.replace(versionLine, 'const VERSION = "BUILD_VERSION";');
  const files = [
    ...assets,
    ...scripts,
    ...listFiles(root, '', /\.html$/),
    ...listFiles(root, 'vendor', /\.(?:png|js|css)$/),
    '/canvaskit.wasm',
  ].sort();
  const version = createHash('sha256').update(template).update(manifestText);
  for (const file of files) {
    const digest = createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
    version.update(`${file}\0${digest}\n`);
  }
  fs.writeFileSync(path.join(root, 'offline-assets.json'), manifestText);
  fs.writeFileSync(worker, template.replace(versionLine, `const VERSION = "${version.digest('hex')}";`));
  return manifest;
}
function listFiles(root, folder, pattern) {
  return fs.readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter(entry => entry.isFile() && pattern.test(entry.name))
    .map(entry => '/' + path.posix.join(folder, entry.name))
    .sort();
}

module.exports = { prepareOfflineAssets };
if (require.main === module) {
  try { const result = prepareOfflineAssets(process.argv[2] || 'dist'); console.log(`Manifesto offline: ${result.assets.length} fotos locais e ${result.scripts.length} scripts Web.`); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
