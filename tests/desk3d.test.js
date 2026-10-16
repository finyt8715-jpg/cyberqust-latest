const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const THREE=require('three');
const app=fs.readFileSync('src/cyberquest.html','utf8');
const moduleSource=fs.readFileSync('src/desk3d.mjs','utf8');
const context=vm.createContext({THREE});
vm.runInContext(app.slice(app.indexOf('const R=(x,y'),app.indexOf('function desk(el,ctx)')),context);
vm.runInContext(moduleSource.slice(moduleSource.indexOf('function buildRoom'),moduleSource.indexOf('// A local,')),context);
for(const [id,fn] of [['recep','sceneRecep'],['meet','sceneMeet'],['home','sceneHome']])test(id+' has a selectable 3D object and observation for every case clue',()=>{
  const sc=vm.runInContext(fn+'()',context),groups=new Map(),names={},observed={},scene=new THREE.Scene();
  const mesh=(parent,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial());m.position.set(x,y,z);parent.add(m);return m};
  context.buildRoom(id,{scene,box:mesh,cylinder:mesh,label:(p,l,x,y,z)=>mesh(p,x,y,z),material:()=>new THREE.MeshStandardMaterial(),textured:()=>new THREE.MeshStandardMaterial(),object:key=>{assert.ok(!groups.has(key),'unique object ID');const g=new THREE.Group();scene.add(g);groups.set(key,g);return g},names,observed});
  assert.deepEqual([...groups.keys()].sort(),Array.from(sc.I,i=>i[0]).sort());
  for(const i of sc.I){assert.ok(names[i[0]]);assert.ok(observed[i[0]]);assert.ok(groups.get(i[0]).children.length);}
  assert.equal(sc.T0,180);
  scene.updateMatrixWorld();scene.traverse(o=>assert.ok(o.matrixWorld.elements.every(Number.isFinite)));
});
