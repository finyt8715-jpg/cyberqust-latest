'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../src/cyberquest.html'), 'utf8');
const game = source.slice(source.indexOf('function shoot(el,ctx){'), source.indexOf('/* ---------- game 3: desk inspector'));
const pools = game.slice(game.indexOf(' const TH='), game.indexOf(' el.innerHTML='));
const picker = game.slice(game.indexOf(' function nextSignal('), game.indexOf(' const fire='));
const signals = vm.runInNewContext(`(() => {${pools} const recent=[]; ${picker} return {TH,OK,recent,nextSignal};})()`);

test('firewall signals cover many cyber scenarios without repeating early', () => {
  const { TH, OK, recent, nextSignal } = signals;
  assert.ok(TH.length >= 30);
  assert.ok(OK.length >= 20);
  assert.equal(new Set([...TH, ...OK].map(item => item[0])).size, TH.length + OK.length);
  assert.ok(TH.some(item => item[2] === 'virus'));
  assert.ok(TH.some(item => item[2] === 'phish'));
  assert.ok(TH.some(item => item[2] === 'credential'));

  const threatDeck = [], safeDeck = [];
  const firstThreats = Array.from({ length: TH.length }, () => nextSignal(TH, threatDeck)[0]);
  const firstSafe = Array.from({ length: OK.length }, () => nextSignal(OK, safeDeck)[0]);
  assert.equal(new Set(firstThreats).size, TH.length);
  assert.equal(new Set(firstSafe).size, OK.length);

  for (let i = 0; i < 10; i++) {
    const previous = [...recent];
    const next = nextSignal(i % 2 ? OK : TH, i % 2 ? safeDeck : threatDeck)[0];
    assert.ok(!previous.includes(next), `Repeated ${next} too soon`);
  }
});
