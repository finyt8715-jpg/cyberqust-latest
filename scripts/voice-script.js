#!/usr/bin/env node
'use strict';
/** Writes docs/voice-script.md: every caller line with the file name to record it under. Run: node scripts/voice-script.js */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'src', 'cyberquest.html'), 'utf8');
const a = html.indexOf('const CALLS=[');
const b = html.indexOf('function voice(');
if (a < 0 || b < 0) throw new Error('Could not find CALLS in src/cyberquest.html');
const sandbox = vm.createContext({});
vm.runInContext(html.slice(a, b).replace('const CALLS=', 'globalThis.CALLS='), sandbox);
const plain = (s) => s.replace(/\[\[(.+?)\|.+?\]\]/g, '$1');
const out = ['# Voice script for the Voice trap (Level 4)', '',
  'Record each line as one audio file named exactly like the first column (for example `c1-a.mp3`) and put it in `public/audio/voice/`.',
  'Formats: mp3, m4a, webm, ogg, wav. Lines without a file use the built-in synthetic voice. Speak as the caller, not as the player.', ''];
sandbox.CALLS.forEach((c, i) => {
  out.push(`## Call ${i + 1}: ${c.name} (${c.vish ? 'scam call' : 'genuine call'})`, '', `Caller ID: ${c.num} (${c.note})`, '', '| File | What the caller says |', '|---|---|');
  for (const [id, n] of Object.entries(c.nodes)) out.push(`| \`c${i + 1}-${id}.mp3\` | ${plain(n.s).replace(/\|/g, '/')} |`);
  out.push('');
});
fs.mkdirSync(path.join(__dirname, '..', 'docs'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'voice-script.md'), out.join('\n'));
console.log(`Wrote docs/voice-script.md (${sandbox.CALLS.reduce((n, c) => n + Object.keys(c.nodes).length, 0)} lines).`);
