'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../src/cyberquest.html'),'utf8');
const lobby=fs.readFileSync(path.join(__dirname,'../src/lobby.js'),'utf8');
const photo='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aHVEAAAAASUVORK5CYII=';

function storageContext(server=false) {
 const stored=new Map();
 const ctx=vm.createContext({SERVER:server,SFX:{s:{sfx:true,music:false}},S:{name:'Player',photo:'',best:{1:400},done:[1],claimed:{},cases:{}},esc:s=>String(s),localStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)}});
 vm.runInContext(lobby,ctx);
 vm.runInContext(source.slice(source.indexOf("const KEY='"),source.indexOf('/* Backend adapter')),ctx);
 return {ctx,stored};
}

test('profile photo persists with progress and can be removed without losing scores',()=>{
 const {ctx,stored}=storageContext();ctx.S.photo=photo;
 assert.equal(vm.runInContext('save()',ctx),true);
 ctx.S.photo='';ctx.S.best={};ctx.S.done=[];
 vm.runInContext('load()',ctx);
 assert.equal(ctx.S.photo,photo);assert.equal(ctx.S.best[1],400);assert.equal(ctx.S.done[0],1);
 vm.runInContext("S.photo='';save();load()",ctx);
 assert.equal(ctx.S.photo,'');assert.equal(JSON.parse(stored.get('cyberquest.v1')).best[1],400);
});

test('unsafe or oversized saved photos fall back to initials',()=>{
 const {ctx,stored}=storageContext();
 for(const unsafe of ['https://example.com/photo.jpg','data:image/svg+xml;base64,PHN2Zz4=','data:image/jpeg;base64,'+'A'.repeat(180001),'x" onerror="alert(1)']){
  stored.set('cyberquest.v1',JSON.stringify({name:'Player',photo:unsafe,best:{1:400},done:[1]}));
  vm.runInContext('load()',ctx);assert.equal(ctx.S.photo,'');
  ctx.unsafe=unsafe;assert.doesNotMatch(vm.runInContext("hubAvatar('Player',unsafe)",ctx),/<img/);
 }
});

test('server mode keeps browser-local photos separate for each account',()=>{
 const {ctx,stored}=storageContext(true);ctx.S.user={id:41};ctx.S.photo=photo;
 vm.runInContext('save()',ctx);
 assert.equal(stored.get('cyberquest.profile.41'),photo);
 assert.equal(vm.runInContext('readServerPhoto(42)',ctx),'');
 assert.equal(vm.runInContext('readServerPhoto(41)',ctx),photo);
});

test('storage failure is reported so the editor can keep unsaved changes visible',()=>{
 const {ctx}=storageContext();ctx.localStorage.setItem=()=>{throw new Error('Quota exceeded')};
 assert.equal(vm.runInContext('save()',ctx),false);
});

test('legacy mission progress follows the games when Firewall defender moves first',()=>{
 const {ctx,stored}=storageContext();
 stored.set('cyberquest.v1',JSON.stringify({name:'Player',best:{1:400,3:120,5:800},done:[1,3,5]}));
 vm.runInContext('load()',ctx);
 assert.equal(ctx.S.best[2],800);assert.equal(ctx.S.best[3],400);assert.equal(ctx.S.best[4],120);
 assert.equal(JSON.stringify(ctx.S.done),'[3,4,2]');
 vm.runInContext('save();load()',ctx);
 assert.equal(ctx.S.best[2],800);assert.equal(ctx.S.best[3],400);
 assert.equal(JSON.stringify(ctx.S.done),'[3,4,2]');
});

test('Data-sorter-first saves migrate once to Firewall-first order',()=>{const {ctx,stored}=storageContext();stored.set('cyberquest.v1',JSON.stringify({missionOrder:2,best:{1:100,2:200,3:300},done:[1,3]}));vm.runInContext('load();save();load()',ctx);assert.equal(ctx.S.best[1],300);assert.equal(ctx.S.best[2],100);assert.equal(ctx.S.best[3],200);assert.equal(JSON.stringify(ctx.S.done),'[2,1]')});
