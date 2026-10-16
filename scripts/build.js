#!/usr/bin/env node
'use strict';
/**
 * Builds the deployable site into public/ from the single game source in src/cyberquest.html.
 *   public/index.html   page shell, no inline script (works with the strict Content-Security-Policy in vercel.json)
 *   public/app.js       the game, referenced with a content hash so browsers always load the current version
 *   public/audio/voice/manifest.json   lists the recorded caller voices found in public/audio/voice/
 * Vercel runs this automatically (see vercel.json). Locally: npm run build
 * Plain Node.js build; Three.js is copied locally for the 3D cubicle.
 */
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'src', 'cyberquest.html'), 'utf8');
const open = html.indexOf('<script>');
const close = html.lastIndexOf('</script>');
if (open < 0 || close < 0) throw new Error('src/cyberquest.html has no inline script');
const deskSource = fs.readFileSync(path.join(root, 'src', 'desk3d.mjs'), 'utf8');
const lobbySource = fs.readFileSync(path.join(root, 'src', 'lobby.js'), 'utf8');
const lobbyStyle = fs.readFileSync(path.join(root, 'src', 'lobby.css'), 'utf8');
const lobbyHash = crypto.createHash('sha256').update(lobbySource).update(lobbyStyle).digest('hex').slice(0, 10);
const deskHash = crypto.createHash('sha256').update(deskSource).digest('hex').slice(0, 10);
const script = html.slice(open + '<script>'.length, close).replaceAll('__DESK3D_VERSION__', deskHash);

const pub = path.join(root, 'public');
fs.mkdirSync(path.join(pub, 'audio', 'voice'), { recursive: true });
fs.mkdirSync(path.join(pub, 'vendor'), { recursive: true });
fs.copyFileSync(path.join(root, 'node_modules', 'three', 'build', 'three.module.js'), path.join(pub, 'vendor', 'three.module.js'));
fs.copyFileSync(path.join(root, 'node_modules', 'three', 'LICENSE'), path.join(pub, 'vendor', 'THREE-LICENSE.txt'));
fs.writeFileSync(path.join(pub, 'desk3d.mjs'), deskSource);
fs.writeFileSync(path.join(pub, 'lobby.js'), lobbySource);
fs.writeFileSync(path.join(pub, 'lobby.css'), lobbyStyle);

const hash = crypto.createHash('sha256').update(script).digest('hex').slice(0, 10);
fs.writeFileSync(path.join(pub, 'app.js'), script);

let head = html.slice(0, open);
head = head.replace('</head>', `<link rel="stylesheet" href="/lobby.css?v=${lobbyHash}"><meta name="robots" content="noindex,nofollow"><link rel="icon" href="/favicon.svg" type="image/svg+xml"></head>`);
const footer = '<footer style="max-width:1180px;margin:0 auto;padding:0 16px 32px;color:#94a3b8;font:11px/16px \'JetBrains Mono\',monospace">CyberQuest. Your progress is saved in this browser on this device.</footer>';
const tail = html.slice(close + '</script>'.length);
const shell = `${head.replace(/(<main id="app"[^>]*><\/main>)/, `$1${footer}`)}<script src="/config.js"></script>\n<script src="/lobby.js?v=${lobbyHash}" defer></script>\n<script src="/app.js?v=${hash}" defer></script>${tail}`;
if (/<script>/.test(shell) || /\son(click|change|error|load|submit)=/i.test(shell)) throw new Error('Inline script or event handler left in index.html');
if (!shell.includes('<footer')) throw new Error('Footer was not inserted');
fs.writeFileSync(path.join(pub, 'index.html'), shell);
fs.writeFileSync(path.join(pub, 'login.html'), shell
  .replace('<title>CyberQuest | Cyber awareness game</title>', '<title>Player Login | CyberQuest</title>')
  .replace('<body>', '<body data-entry="login">'));

// Manifest of recorded voices: files named c<call>-<line>.<mp3|m4a|webm|ogg|wav>, for example c1-a.mp3
const voice = {};
for (const f of fs.readdirSync(path.join(pub, 'audio', 'voice'))) {
  const m = /^(c\d{1,2}-[a-z])\.(mp3|m4a|webm|ogg|wav)$/.exec(f);
  if (m) voice[m[1]] = m[2];
}
fs.writeFileSync(path.join(pub, 'audio', 'voice', 'manifest.json'), JSON.stringify(voice));
console.log(`Built public/index.html and public/app.js (v=${hash}); ${Object.keys(voice).length} recorded voice line(s).`);
