'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source=fs.readFileSync(path.join(__dirname,'../src/cyberquest.html'),'utf8');
const lobby=fs.readFileSync(path.join(__dirname,'../src/lobby.js'),'utf8');

function createPlayer(state,view='lobbyDashboard') {
  const app={innerHTML:''};
  const sandbox=vm.createContext({
    SERVER:false, state,
    $:()=>app,
    fmt:n=>n.toLocaleString('en-US'),
    esc:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
  });
  vm.runInContext(source.slice(source.indexOf('const S={'),source.indexOf('function hdr(){')),sandbox);
  vm.runInContext(source.slice(source.indexOf('const REW=['),source.indexOf('function nextRew(){')),sandbox);
  vm.runInContext(lobby,sandbox);
  vm.runInContext('Object.assign(S,state);'+view+'()',sandbox);
  return app.innerHTML;
}

test('new players can launch the first mission while later missions remain locked',()=>{
  const html=createPlayer({name:'New Defender'});
  assert.match(html,/aria-label="Play Firewall defender"/);
  const locked=html.match(/<button[^>]*aria-label="Locked [^"]+"[^>]*disabled/g)||[];
  assert.equal(locked.length,4);
  assert.match(html,/data-a="play" data-v="1">Continue mission/);
  assert.match(html,/0\/5 complete/);
});

test('saved completion unlocks the next mission and directs the main launch button to it',()=>{
  const html=createPlayer({name:'Returning Defender',done:[1,2],best:{1:500,2:200},score:700});
  assert.match(html,/data-a="play" data-v="3">Continue mission/);
  assert.match(html,/aria-label="Replay Data sorter"/);
  assert.match(html,/aria-label="Play Phish or legit"/);
  assert.match(html,/2\/5 complete/);
  assert.match(html,/500 best/);
});

test('reward preview keeps the all-level gate and escapes user names',()=>{
  const html=createPlayer({name:'<img src=x>',score:2000,done:[1,2]});
  assert.doesNotMatch(html,/<img src=x>/);
  assert.match(html,/Clear all 5 levels to claim/);
  assert.match(html,/Rewards unlocked<\/p><strong>0/);
  const completed=createPlayer({name:'Defender',score:2000,done:[1,2,3,4,5]});
  assert.match(completed,/Rewards unlocked<\/p><strong>2/);
  assert.match(completed,/Campaign cleared/);
});

test('PLAY Now cover has one direct Firewall launch and keeps the daily timer visible',()=>{
 const html=createPlayer({name:'New Defender'},'lobbyGames');
 assert.match(html,/data-a="quickplay" data-v="1" aria-label="Play Firewall Defender now"/);
 assert.equal((html.match(/<button\b/g)||[]).length,1);
 assert.match(html,/data-daily-time/);
 assert.doesNotMatch(html,/game-library-grid/);
 const saved=createPlayer({name:'Player',done:[1],best:{1:120}},'lobbyGames');
 assert.match(saved,/PLAY NOW/);
 assert.match(saved,/data-v="1"/);
});
