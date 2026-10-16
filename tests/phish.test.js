'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../src/cyberquest.html'), 'utf8');
const game = source.slice(source.indexOf('const ic='), source.indexOf('/* ---------- game 2: firewall defender'));
// Expected decisions for the curated training set, in inbox order.
const decisions = [0, 1, 1, 0, 1, 1, 0, 0, 1, 0];

function mount() {
  const state = { name: 'Test Player', lp: 0 };
  const awards = [];
  let completions = 0, focused = '', notice = '';
  const host = {
    innerHTML: '',
    querySelector(selector) {
      return { focus() { focused = selector; }, scrollIntoView() {} };
    }
  };
  const sandbox = vm.createContext({
    S: state, SFX: { ok() {}, bad() {} },
    esc: s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
    fmt: n => n.toLocaleString('en-US'), toast: s => { notice = s; }
  });
  vm.runInContext(game, sandbox);
  sandbox.phish(host, {
    add(points) { awards.push(points); state.lp = Math.max(0, state.lp + points); },
    done() { completions++; }
  });
  const target = (selector, dataset = {}) => ({ dataset, closest: s => s === selector ? target(selector, dataset) : null });
  const click = (selector, dataset) => host.onclick({ target: target(selector, dataset) });
  return {
    host, state, awards, click,
    open: i => click('[data-m]', { m: String(i) }),
    answer: value => click('[data-v]', { v: String(value) }),
    get completions() { return completions; },
    get focused() { return focused; },
    get notice() { return notice; },
    key(key, index) {
      let prevented = false;
      host.onkeydown({ key, target: target('[data-m]', { m: String(index) }), preventDefault() { prevented = true; } });
      return prevented;
    }
  };
}

test('mission has ten emails and finishes only after all ten decisions', () => {
  const round = mount();
  assert.equal((round.host.innerHTML.match(/data-m="\d+"/g) || []).length, 10);
  assert.doesNotMatch(round.host.innerHTML, /id="fin"/);
  round.click('#fin');
  assert.equal(round.completions, 0);
  decisions.forEach((answer, i) => { round.open(i); round.answer(answer); });
  assert.equal(round.state.lp, 1750);
  assert.match(round.host.innerHTML, /10 of 10/);
  assert.match(round.host.innerHTML, /Perfect detection/);
  assert.match(round.host.innerHTML, /id="fin"/);
  assert.equal((round.host.innerHTML.match(/<b>PHISHING<\/b>/g) || []).length, 0); // Last message is legitimate.
  round.click('#fin');
  round.click('#fin');
  assert.equal(round.completions, 1);
});

test('mistakes reset the streak, reveal teaching feedback, and cannot be rescored', () => {
  const round = mount();
  round.open(0); round.answer(0);
  round.open(1); round.answer(0);
  assert.equal(round.state.lp, 50);
  assert.match(round.host.innerHTML, /mail-feedback wrong/);
  assert.match(round.host.innerHTML, /sender ends in .co/);
  round.answer(1);
  assert.deepEqual(round.awards, [100, -50]);
  round.open(2); round.answer(1);
  assert.equal(round.awards.at(-1), 100);
  round.open(0);
  assert.match(round.host.innerHTML, /Correct\. \+100/);
  for (let i = 3; i < decisions.length; i++) { round.open(i); round.answer(decisions[i]); }
  assert.match(round.host.innerHTML, /9 of 10/);
  assert.match(round.host.innerHTML, /Review 1 missed clue/);
});

test('keyboard inspection exposes full sender and safe training link destination', () => {
  const round = mount();
  assert.equal(round.key(' ', 1), true);
  assert.equal(round.focused, '#mail-title');
  round.click('[data-d]');
  assert.match(round.host.innerHTML, /it-support@innovatiview.co/);
  assert.match(round.host.innerHTML, /aria-expanded="true"/);
  assert.match(round.host.innerHTML, /title="https:\/\/innovatiview-login.co\/reset"/);
  round.click('[data-l]');
  assert.match(round.notice, /Training link/);
  assert.equal(round.key('Enter', 8), true);
  round.click('[data-d]');
  assert.match(round.host.innerHTML, /innovatiview.com.hr-portal.net/);
  assert.match(round.host.innerHTML, /leave_policy.pdf.exe/);
  round.answer(1);
  assert.equal(round.focused, '#mail-feedback');
});
