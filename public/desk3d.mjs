import * as THREE from './vendor/three.module.js';

// Each case has its own architecture, furniture plan and inspectable evidence.
function buildRoom(id, {scene, box, cylinder, label, textured, material, object, names, observed}) {
  const home=id==='home', reception=id==='recep';
  const palette=home?{wall:'#56795d',side:'#efe1c7',floor:'#b8814d',wood:'#925329',trim:'#e3c99e',sky:'#ddd1ba'}:reception?{wall:'#ae5840',side:'#f0d6ad',floor:'#ebd7b6',wood:'#462f28',trim:'#bf9553',sky:'#e5cbb1'}:{wall:'#18344d',side:'#294d68',floor:'#34465a',wood:'#513426',trim:'#91a9bb',sky:'#879baa'};
  scene.background=new THREE.Color(palette.sky);scene.fog=new THREE.Fog(palette.sky,18,35);
  const wood=textured(palette.wood,'wood');
  const floor=box(scene,0,-.1,0,9,.2,7,palette.floor);floor.material=textured(palette.floor,home?'wood':'fabric');
  for(let x=-4.5;x<4.5;x+=home?.45:1.2)box(scene,x,.005,0,.012,.006,7,home?'#806144':'#a4aaa6');
  box(scene,0,1.65,-2.5,9,3.3,.15,palette.wall);
  box(scene,-4.45,1.65,-.7,.15,3.3,3.6,palette.side);
  box(scene,0,.09,-2.39,9,.18,.07,palette.trim);
  box(scene,-4.34,.09,-.7,.07,.18,3.6,palette.trim);
  if(reception){
    // Public lobby: stone tile grid, brass trim, entry mat and a garden wall.
    for(let z=-2.5;z<3.5;z+=1.2)box(scene,0,.009,z,9,.008,.018,'#bda582');
    box(scene,2.8,.025,2.25,2.2,.035,1.1,'#6a3e31');
    label(scene,['WELCOME'],2.8,.047,2.25,1.5,.45,'#6a3e31','#f5d2a0',true);
    for(let x=-4.1;x<-2.8;x+=.13)box(scene,x,1.65,-2.37,.045,3.15,.045,'#b99557',.4,.5);
    box(scene,-4.22,.38,.3,.36,.76,2.5,'#6c4534');
    for(let z=-.7;z<1.5;z+=.35){cylinder(scene,-4.2,.9,z,.17,.6,'#37664c',.26);cylinder(scene,-4.2,1.23,z,.14,.32,'#688747',.03)}
    cylinder(scene,-1.15,.35,2.1,.43,.05,'#563b30');cylinder(scene,-1.15,.17,2.1,.055,.34,'#ba955b');
    for(const x of [-1.2,1.2]){cylinder(scene,x,3.15,-.3,.025,.6,'#86683e');cylinder(scene,x,2.85,-.3,.27,.16,'#c9a45c',.16)}
  }else if(home){
    // Domestic details: wainscoting, curtains, radiator, side lamp and wall art.
    box(scene,0,.48,-2.38,8.8,.78,.06,'#d3b88b');
    for(let x=-4.2;x<4.5;x+=.52)box(scene,x,.49,-2.32,.025,.76,.025,'#a98c62');
    box(scene,0,.9,-2.31,8.8,.045,.08,'#f0d7ae');
    for(const x of [-1.65,.45])for(let k=0;k<5;k++)cylinder(scene,x+k*.065,2.27,-2.1,.055,1.48,'#bb744c');
    box(scene,-.6,3.08,-2.1,2.55,.04,.06,'#563f2b');
    for(let x=-1.2;x<.1;x+=.12)box(scene,x,.46,-2.16,.075,.57,.15,'#ede0c5');
    cylinder(scene,-3.55,.04,1.15,.25,.06,'#554636');cylinder(scene,-3.55,.9,1.15,.025,1.8,'#b49a61');cylinder(scene,-3.55,1.85,1.15,.34,.38,'#f0c37e',.20);
    label(scene,['TAKE A BREATH','MAKE SPACE'],1.65,2.3,-2.39,.65,.85,'#e5b465','#5a5032');
  }else{
    // Executive boardroom: acoustic panels, city glazing and a credenza.
    for(let x=-4.25;x<4.5;x+=.34)box(scene,x,1.6,-2.38,.12,3.05,.05,'#25465e');
    box(scene,-4.34,1.95,-.6,.035,1.95,2.7,'#8db5cd',.2,.35);
    for(let z=-1.8;z<.9;z+=.22)box(scene,-4.30,.95+(Math.sin(z*8)+1)*.22,z,.02,.7+(Math.sin(z*8)+1)*.44,.14,'#537994');
    for(const z of [-1.95,-.6,.75])box(scene,-4.25,1.95,z,.09,2,.055,'#bccbd3',.3,.6);
    box(scene,-4.25,1.1,-.6,.08,.045,2.7,'#d9e2e7');
    box(scene,3.8,.45,1.6,.7,.9,1.8,'#273d50');box(scene,3.8,.94,1.6,.8,.08,1.9,'#ad916b');
    box(scene,0,.022,.25,6.6,.025,3.7,'#24394b');
    for(const z of [-2.3])box(scene,0,3.28,z,8.5,.025,.06,'#b8e4f5');
  }
  function table(x,z,w,d,y=1.1){const top=box(scene,x,y,z,w,.13,d,'#ab8965');top.material=wood;for(const dx of [-w/2+.18,w/2-.18])for(const dz of [-d/2+.15,d/2-.15])box(scene,x+dx,y/2,z+dz,.09,y,.09,'#454e51',.3,.65)}
  function chair(x,z,rot=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;scene.add(g);box(g,0,.55,0,.58,.15,.56,home?'#b67541':reception?'#763b31':'#253044');box(g,0,.98,-.24,.58,.75,.12,home?'#b67541':reception?'#763b31':'#253044');cylinder(g,0,.27,0,.045,.5,'#7f888b');for(const a of [0,Math.PI/2]){const b=box(g,0,.06,0,.7,.04,.07,'#626d72');b.rotation.y=a}}
  function item(key,title,detail,type,x,y,z,lines=[]){names[key]=title;observed[key]=detail;const g=object(key);g.position.set(x,y,z);
    if(type==='screen'||type==='laptop'){box(g,0,.36,0,type==='screen'?1.05:.82,.64,.07,'#202c32',.35);label(g,lines,0,.36,.041,type==='screen'?.95:.73,.53,'#eaf1f3','#294454');box(g,0,.02,.18,.88,.04,.5,'#434d52');if(type==='screen')box(g,0,.13,0,.07,.25,.08,'#404e54')}
    else if(type==='board'){box(g,0,0,0,1.5,.88,.07,'#637577');label(g,lines,0,0,.045,1.42,.80,'#f4f3e9','#314b58')}
    else if(type==='paper'||type==='note'||type==='badge'){const w=type==='note'?.28:type==='badge'?.22:.57,d=type==='note'?.25:type==='badge'?.34:.43;box(g,0,0,0,w,.025,d,type==='note'?'#ffe098':'#f5f0dd');label(g,lines,0,.015,0,w*.94,d*.94,type==='note'?'#ffe098':type==='badge'?'#c4e2d1':'#fffbee','#34464c',true)}
    else if(type==='printer'){box(g,0,.15,0,.78,.3,.6,'#d0d5d1');box(g,0,.32,0,.72,.04,.54,'#34434b');box(g,0,.1,.32,.5,.05,.07,'#30414a');label(g,lines,0,.35,.1,.48,.46,'#fffcec','#534c49',true)}
    else if(type==='phone'||type==='router'||type==='pc'){box(g,0,.045,0,type==='phone'?.46:.65,.09,.30,'#28383e');label(g,lines,0,.095,0,.42,.24,'#c8d9d3','#23423c',true);if(type==='router')for(const x of [-.26,.26])box(g,x,.2,-.12,.025,.4,.025,'#29363b');cylinder(g,.18,.10,0,.018,.01,'#7adb9f')}
    else if(type==='bin'){cylinder(g,0,.29,0,.25,.58,'#556870');for(let i=0;i<3;i++)label(g,lines,i*.09-.09,.58+i*.015,0,.22,.30,'#fffaf0','#625750',true)}
    else if(type==='person'){cylinder(g,0,.85,0,.20,.58,home?'#c58c3d':'#718998');const head=new THREE.Mesh(new THREE.SphereGeometry(.15,20,16),material('#c29376'));head.position.y=1.29;g.add(head);for(const x of [-.12,.12])box(g,x,.31,0,.15,.62,.19,'#374950');for(const x of [-.27,.27])box(g,x,.84,.06,.1,.5,.12,'#c29376');if(!home)label(g,['VISITOR'],0,.97,.21,.23,.16,'#f4cc6d','#3c4549')}
    else if(type==='plant'){cylinder(g,0,.21,0,.24,.42,'#af8a6d',.3);for(let i=0;i<7;i++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),material('#52785d'));leaf.scale.set(.13,.40,.08);leaf.position.set(Math.sin(i)*.19,.62+(i%2)*.15,Math.cos(i)*.19);leaf.rotation.z=Math.sin(i)*.55;g.add(leaf)}}
    else if(type==='mug'){cylinder(g,0,.12,0,.10,.24,'#eee9df');const handle=new THREE.Mesh(new THREE.TorusGeometry(.075,.018,8,20),material('#eee9df'));handle.position.set(.11,.13,0);g.add(handle);cylinder(g,0,.243,0,.078,.005,'#654c39')}
    else if(type==='parcel'){box(g,0,.22,0,.62,.44,.48,'#ae8c60');box(g,0,.445,0,.1,.012,.48,'#d9bd86');label(g,lines,0,.25,.245,.4,.2,'#efead8','#4c5355')}
    else if(type==='speaker'){cylinder(g,0,.18,0,.13,.36,'#46565c');cylinder(g,0,.365,0,.12,.012,'#69b5b9')}
    else if(type==='sofa'){box(g,0,.32,0,1.8,.45,.7,'#a95736');box(g,0,.7,-.32,1.8,.65,.17,'#a95736');for(const x of [-.85,.85])box(g,x,.57,0,.17,.45,.75,'#80402d');for(const x of [-.45,.45])box(g,x,.57,.04,.8,.11,.6,'#c2764b')}
    else if(type==='cabinet'){box(g,0,0,0,.85,.9,.18,'#53656b');box(g,-.54,0,.25,.4,.9,.05,'#7b8c8c');for(let k=0;k<4;k++){cylinder(g,-.27+k*.18,0,.14,.022,.23,'#c4ab66');}label(g,lines,0,-.3,.11,.75,.18,'#f5ead0','#39444b')}
    else if(type==='dispenser'){box(g,0,.47,0,.45,.94,.4,'#e2e5df');cylinder(g,0,1.1,0,.19,.4,'#91b5c4');box(g,0,.66,.21,.2,.18,.02,'#485d68')}
    else if(type==='headset'){box(g,0,.02,0,.3,.04,.24,'#38464c');box(g,0,.24,0,.035,.45,.04,'#657477');const band=new THREE.Mesh(new THREE.TorusGeometry(.15,.025,10,30,Math.PI),material('#39494e'));band.position.y=.34;g.add(band);for(const x of [-.15,.15])box(g,x,.31,0,.07,.15,.10,'#25373d')}
    else if(type==='markers'){box(g,0,.02,0,.45,.04,.25,'#617174');for(let k=0;k<3;k++){const pen=cylinder(g,-.13+k*.13,.06,0,.018,.19,['#a55950','#4b6f97','#559078'][k]);pen.rotation.x=Math.PI/2}}
    else if(type==='shelf'){box(g,0,0,-.07,.85,.9,.08,'#846649');for(const x of [-.43,.43])box(g,x,0,.08,.05,.95,.35,'#a1805a');for(let y=-.45;y<=.46;y+=.30)box(g,0,y,.08,.85,.04,.35,'#a1805a')}
    else if(type==='cat'){const body=new THREE.Mesh(new THREE.SphereGeometry(.25,20,12),material('#b99161'));body.scale.set(1.6,.7,.8);body.position.y=.2;g.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.15,20,12),material('#b99161'));head.position.set(.3,.35,0);g.add(head);for(const x of [.22,.36])box(g,x,.49,0,.07,.13,.06,'#b99161')}
    else {box(g,0,.05,0,.4,.1,.27,'#697d80');label(g,lines.length?lines:[title],0,.11,0,.38,.25,'#e9e5d7','#37474b',true)}
    return g;
  }
  if(reception){
    table(-.7,-.3,4.8,1.1,1.25);box(scene,-.7,.58,.1,4.8,1.15,.35,'#8c3f30');for(let x=-3;x<1.7;x+=.15)box(scene,x,.6,.29,.04,1.04,.035,'#7f6b51');chair(-1.4,-1.4,Math.PI);
    label(scene,['INNOVATIVIEW','TECHNOLOGIES'],0,2.7,-2.39,2.8,.65,'#e0e4e1','#416566');
    box(scene,3.5,1.4,-2.37,1.15,2.8,.05,'#7e999e',.25,.3);label(scene,['STAFF ONLY'],3.5,2.92,-2.31,1.1,.22,'#405c63','#ffffff');
    item('logo','Company logo','The wall carries the company name.','board',0,2.65,-2.34,['INNOVATIVIEW','TECHNOLOGIES']);
    item('keys','Key cabinet','The cabinet door is open. A key is tagged SERVER ROOM.','cabinet',-3.4,1.95,-2.3,['SERVER ROOM']);
    item('wifi','Wi-Fi sign','The sign displays both the guest network and staff credentials.','board',1.9,2,-2.35,['GUEST: Welcome-1','STAFF: Innov@2026']);
    item('vip','Visitor schedule','Names, appointments and executive locations are visible to visitors.','board',-1.9,1.9,-2.35,['10:00 CEO · Acme Corp','12:30 Audit · Mr Rao','15:00 Board · Room A']);
    item('pc','Reception computer','The staff directory is open with names, phone numbers and emails.','screen',-1.9,1.34,-.5,['STAFF DIRECTORY','Names / phones / emails','SESSION OPEN']);
    item('note','Door-code note','A sticky note reads Door: 4821.','note',-1,1.33,-.15,['DOOR','4821']);
    item('vlog','Visitor log','Previous visitors’ names and phone numbers are visible in the open log.','paper',-.35,1.33,-.3,['VISITOR LOG','Names / phone numbers']);
    item('spare','Badge tray','Employee access cards have been left on the public counter.','badge',.3,1.33,-.2,['EMPLOYEE','ACCESS']);
    item('san','Hand sanitizer','A pump bottle of hand sanitizer.','dispenser',1.2,1.33,-.3).scale.setScalar(.22);
    item('esc','Visitor at staff door','A visitor wearing a visitor badge is entering the staff area alone.','person',3.45,0,-1.7);
    item('parcel','Unattended parcel','An unexpected parcel with no sender label is beside the entrance.','parcel',3.1,0,1.1,['NO LABEL']);
    item('sofa','Visitor sofa','Seating for visitors waiting for their hosts.','sofa',-2.7,0,2);
    item('disp','Water dispenser','A drinking water dispenser.','dispenser',1.9,0,1.5);
    item('plant','Lobby plant','A potted plant beside the entrance.','plant',4,0,.4);
    item('clock','Wall clock','An ordinary wall clock shows the time.','board',-3.5,2.8,-2.35,['12:30']);
  }else if(id==='meet'){
    table(0,.15,5.5,1.65);for(const x of [-2,-.65,.7,2.1])chair(x,-1.15,Math.PI);for(const x of [-1.8,0,1.8])chair(x,1.45);
    for(const x of [-2,2]){box(scene,x,3.1,-.1,1.4,.08,.36,'#454f53');box(scene,x,3.05,-.1,1.3,.02,.29,'#fff5d8')}
    item('proj','Projection screen','The acquisition presentation remains visible after the meeting.','board',-.8,2.15,-2.35,['Q4 ACQUISITION PLAN','CONFIDENTIAL · Acme Corp','Offer: 86 Cr · Approval pending']).scale.set(1.8,1.45,1);
    item('board','Meeting whiteboard','Server details and a root password have not been erased.','board',2.55,2,-2.35,['Falcon environment','10.0.4.17','root / Falcon#2026']);
    item('sign','Booking sign','The sign identifies Meeting Room B as booked.','board',-3.6,1.6,-2.35,['ROOM B','BOOKED']).scale.setScalar(.55);
    item('clock','Wall clock','An ordinary clock on the meeting-room wall.','board',-3.6,2.6,-2.35,['12:45']).scale.setScalar(.5);
    item('papers','Board pack','A confidential board pack has been left on the shared table.','paper',-2,1.18,.3,['CONFIDENTIAL','BOARD PACK']);
    item('pass','Meeting passcode','A note on the table reads Meeting pass: Falcon1.','note',-1.2,1.18,.5,['MEETING PASS','Falcon1']);
    item('badge2','Employee badge','An employee access badge is lying on the table.','badge',-.65,1.18,.2,['EMPLOYEE','ACCESS']);
    item('spk','Conference phone','The conference phone still displays LIVE CALL; its microphone is active.','phone',0,1.18,.35,['LIVE CALL','MIC ON']);
    item('jug','Water jug','A jug of drinking water on the table.','mug',.6,1.18,-.3).scale.setScalar(1.5);
    item('pcusb','Presentation PC','A USB drive is still connected to the shared presentation computer.','pc',1.2,1.18,.3,['PRESENTATION PC']);box(scene,1.57,1.23,.3,.16,.06,.10,'#c6ae65');
    item('laptop','Unclaimed laptop','The laptop is unattended and its screen is unlocked.','laptop',2.1,1.18,-.1,['Welcome back','SESSION OPEN']);
    item('markers','Marker tray','A tray of dry-erase markers.','markers',2.2,1.18,.65,['MARKERS']);
    item('bin','Paper bin','Client meeting notes are visible in an ordinary open bin.','bin',-3.2,0,.2,['CLIENT NOTES']);
    item('plant','Room plant','A potted plant in the corner.','plant',3.9,0,-1.6);
  }else{
    table(-.8,-.5,4.6,1.35);chair(-1, .8);box(scene,-.8,.02,1,4.4,.025,2.7,'#ad6450');
    const win=item('window','Window','Daylight enters through a closed window.','board',-.6,2.35,-2.35,['']);win.children[1].material=material('#b5d5dd',.2);box(scene,-.6,2.35,-2.28,.055,.9,.05,'#f5f1e5');box(scene,-.6,2.35,-2.28,1.5,.05,.05,'#f5f1e5');
    const shelves=item('books','Bookshelf','Shelves contain ordinary books.','shelf',3.2,1.4,-2.2,[]);shelves.scale.set(1.6,2.8,2);for(let row=0;row<3;row++)for(let k=0;k<6;k++)box(shelves,-.32+k*.12,-.28+row*.28,.15,.08,.22,.12,['#88795b','#6c8785','#9d7568'][k%3]);
    item('photo','Family photo','A framed family photograph.','board',-3.35,2,-2.34,['FAMILY','Summer memories']).scale.setScalar(.45);
    item('kid','Child at work desk','A child is using the company laptop to play.','person',-2.6,0,.2).scale.setScalar(.8);
    item('notebook','Open notebook','The notebook contains a written VPN password: Home#12.','paper',-2.3,1.18,-.55,['VPN PASSWORD','Home#12']);
    item('lap','Work laptop','A personal Gmail draft attaches Client_DB.xlsx to dev.home@gmail.com.','laptop',-1.2,1.18,-.65,['Gmail · dev.home@gmail.com','Attach: Client_DB.xlsx','Send']);
    item('note','VPN sticky note','A sticky note reads VPN: Home@26.','note',-.45,1.18,-.55,['VPN','Home@26']);
    item('phoneusb','Personal phone','A personal phone is connected by USB to the work laptop.','phone',-.4,1.18,0,['USB CONNECTED']);box(scene,-.7,1.20,-.01,.4,.02,.025,'#36444b');
    item('mug','Coffee mug','An ordinary coffee mug.','mug',.15,1.18,-.4);
    item('headset','Company headset','A company headset rests on its stand.','headset',.55,1.18,0,['HEADSET']);
    item('printer','Home printer','A client contract is sitting in the printer output tray.','printer',1.1,1.18,-.6,['CLIENT CONTRACT']);
    item('spk','Smart speaker','A smart speaker with its microphone enabled sits beside the work area.','speaker',1.25,1.18,.05);
    table(3,.3,1.4,.7,.65);item('router','Home router','The router label shows the default admin / admin login still in use.','router',3,.73,.3,['admin / admin']);
    item('plant','House plant','A house plant in a ceramic pot.','plant',-3.7,0,-1.3);
    item('cat','Sleeping cat','A cat is resting on the rug.','cat',2.3,0,1.6);
  }
}

// A local, procedurally modelled room. No remote models, textures, or tracking.
export function mountCubicle(host, { items, onScore, onDone, caseFile }) {
  const roomId = caseFile?.id || 'cube';
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  host.innerHTML = `<style>
  .office-layout{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:16px}.office-view{position:relative;min-width:0;background:#c8d1d7;border:1px solid #657583;overflow:hidden}.office-view canvas{display:block;width:100%;height:590px;touch-action:none;cursor:grab}.office-view canvas:active{cursor:grabbing}.office-caption{position:absolute;top:14px;left:14px;padding:8px 12px;background:#14212be8;color:#eaf2f7;font:12px/1.5 monospace;pointer-events:none;border-left:3px solid #83bbac}.office-controls{display:flex;gap:6px;flex-wrap:wrap;margin:12px 0}.office-controls .btn{font-size:18px;padding:7px 10px}.office-status{min-height:86px;line-height:1.7;background:#111a22;padding:14px;border-left:3px solid #83bbac}.office-sidebar{background:#17212b;padding:16px;border:1px solid #384956}.office-sidebar p{line-height:1.65}.office-sidebar select{width:100%;background:#0e171f;color:#eff7ff;border:1px solid #6d8192;padding:10px;font:13px/1.5 sans-serif}.office-sidebar .btn{box-sizing:border-box;width:100%;margin-top:9px}.office-evidence{max-height:260px;overflow:auto;padding-left:20px;font:12px/1.7 sans-serif}.office-evidence li{margin:8px 0;color:#9ee6c8}.office-detail{background:#e5eced;color:#223442;padding:12px;margin-top:12px;font:13px/1.6 sans-serif;min-height:65px}.office-detail b{display:block;margin-bottom:4px}.office-report{margin-top:16px}.office-report li{margin-bottom:12px;line-height:1.6}.office-hint{color:#b9c8d4;font:12px/1.7 sans-serif}@media(max-width:900px){.office-layout{grid-template-columns:1fr}.office-view canvas{height:480px}.office-evidence{max-height:180px}}@media(max-width:480px){.office-view canvas{height:390px}.office-caption{font-size:10px;max-width:80%}}
  </style><div class="panel"><div class="cart-h"><span class="lbl">Case #0417 / 3D inspection</span><span class="chip">Cubicle 12</span></div><h2>The lunch-break inspection</h2><p class="office-hint">Dev has stepped away. Explore the cubicle and inspect anything that could expose company information. Drag to look around; scroll or use + / − to zoom. Select an object to examine it, then decide whether to report it.</p></div>
  <div class="office-layout"><div><div class="office-view"><div class="office-caption">CUBICLE 12 · OPERATIONS FLOOR<br>Drag to orbit · Click an object to inspect</div></div><div class="office-controls"><button class="btn sub" data-cam="left" aria-label="Rotate view left">↶ Left</button><button class="btn sub" data-cam="right" aria-label="Rotate view right">Right ↷</button><button class="btn sub" data-cam="in" aria-label="Zoom in">+ Zoom</button><button class="btn sub" data-cam="out" aria-label="Zoom out">− Zoom</button><button class="btn sub" data-cam="reset">Reset view</button></div><div class="office-status" role="status" aria-live="polite">Explore first, then start your inspection when you are ready.</div></div>
  <aside class="office-sidebar"><div class="lbl">Inspection progress</div><div class="big" data-clock>180s</div><div data-progress>0 risks found</div><button class="btn" data-start>Start inspection</button><p class="office-hint">You have 3 minutes. Correct +40, streak bonus up to +30, false alarm −20. Hints cost 10 points.</p><label class="lbl" for="office-object">Inspect an object</label><select id="office-object"><option value="">Choose an object…</option></select><div class="office-detail" aria-live="polite"><b>No object selected</b>Click an object in the room or choose one above.</div><button class="btn red" data-report disabled>Report security risk</button><button class="btn sub" data-hint disabled>Hint −10</button><div class="lbl" style="margin-top:22px">Evidence collected</div><ul class="office-evidence"><li data-empty>No evidence yet</li></ul></aside></div><div class="office-report"></div>`;
  const q = s => host.querySelector(s), view = q('.office-view');
  view.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label', 'Interactive 3D office cubicle. Use the object selector and view buttons for keyboard access.');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#c8d1d7');
  scene.fog = new THREE.Fog('#c8d1d7', 13, 26);
  const camera = new THREE.PerspectiveCamera(43, 1, .1, 60);
  scene.add(new THREE.HemisphereLight('#e6f3ff', '#887968', 2.1));
  const sun = new THREE.DirectionalLight('#fff0d8', 3.5);
  sun.position.set(-3, 8, 5); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: .5, far: 20 });
  sun.shadow.normalBias = .035; scene.add(sun);
  const fill = new THREE.DirectionalLight('#d8eaff', 1.3); fill.position.set(5, 4, -1); scene.add(fill);
  const mats = new Map(), textures = [];
  function material(color, roughness = .7, metalness = 0) {
    const key = [color, roughness, metalness].join();
    if (!mats.has(key)) mats.set(key, new THREE.MeshStandardMaterial({ color, roughness, metalness }));
    return mats.get(key);
  }
  function box(parent, x, y, z, w, h, d, color, roughness, metalness) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material(color, roughness, metalness));
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  function cylinder(parent, x, y, z, radius, height, color, top = radius) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, radius, height, 32), material(color));
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  function label(parent, lines, x, y, z, w, h, bg = '#ffffff', ink = '#233044', floor = false) {
    const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = Math.max(128, Math.round(768*h/w));
    const c = canvas.getContext('2d'); c.fillStyle = bg; c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = ink; c.textAlign = 'center'; c.textBaseline = 'middle';
    const size = Math.min(56, canvas.height/(lines.length+1)*.65); c.font = `600 ${size}px Arial`;
    lines.forEach((line, i) => c.fillText(line, 384, (i+1)*canvas.height/(lines.length+1), 720));
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture);
    const mat = new THREE.MeshStandardMaterial({ map: texture, roughness: .8, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat); mesh.position.set(x,y,z); if(floor)mesh.rotation.x=-Math.PI/2; parent.add(mesh); return mesh;
  }
  function textured(color, kind) {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
    const c = canvas.getContext('2d'); c.fillStyle = color; c.fillRect(0,0,256,256);
    for(let i=0;i<256;i++){c.strokeStyle=i%3?'#ffffff12':'#00000016';c.beginPath();c.moveTo(0,i);c.lineTo(256,i+(kind==='wood'?Math.sin(i)*3:0));c.stroke();if(kind!=='wood'){c.beginPath();c.moveTo(i,0);c.lineTo(i,256);c.stroke()}}
    const t = new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;textures.push(t);return new THREE.MeshStandardMaterial({map:t,roughness:.9});
  }
  const groups = new Map(), info = new Map(items.map(i => [i[0], i]));
  const names = {board:'Whiteboard',clock:'Wall clock',poster:'Office poster',cal:'Calendar',laptop:'Closed laptop',screen:'Desktop monitor',note:'Monitor sticky note',phone:'Mobile phone',mug:'Coffee mug',pens:'Pen holder',badge:'Access badge',print:'Paper folder',usb:'USB drive',keys:'Drawer lock',bin:'Paper bin',shred:'Shredder',plant:'Floor plant',tail:'Person at the entrance',underkb:'Note by keyboard',printer:'Printer',bag:'Laptop bag',wedge:'Door stop',frame:'Photo frame',cork:'Team noticeboard',ext:'Fire extinguisher',chair:'Office chair',cactus:'Desk plant'};
  function object(id) { const group = new THREE.Group();group.userData.id=id;scene.add(group);groups.set(id,group);return group }
  if(roomId === 'cube') {
  // Architectural shell: carpet tiles, fabric cubicle panels, glazing and metal trims.
  const floor=box(scene,0,-.10,0,10,.2,9,'#80888a');floor.material=textured('#7e8583','fabric');
  for(let x=-5;x<5;x+=.6)for(let z=-4.5;z<4.5;z+=.6)box(scene,x,0,z,.594,.006,.594,((Math.round(x*10)+Math.round(z*10))%12)?'#858b88':'#7b8484');
  const fabric=textured('#8a9c9e','fabric');
  const backWall=box(scene,-.8,1.45,-1.65,4.8,2.9,.13,'#8a9c9e');backWall.material=fabric;
  const leftWall=box(scene,-3.18,1.45,-.15,.13,2.9,3.1,'#8a9c9e');leftWall.material=fabric;
  for(const x of [-3.2,-1.6,0,1.6])box(scene,x,1.45,-1.54,.035,2.9,.06,'#d5dadd',.35,.5);
  box(scene,-.8,2.93,-1.65,4.9,.07,.18,'#d4dadb',.4,.5);box(scene,-3.18,2.93,-.15,.18,.07,3.2,'#d4dadb',.4,.5);
  box(scene,-.8,.09,-1.53,4.8,.18,.09,'#53616a');
  // The neighboring corridor and glazed secure doorway provide context beyond the desk.
  box(scene,1.93,1.7,-1.67,.25,3.4,.16,'#e1e0d8');
  box(scene,3.98,1.7,-1.67,1.46,3.4,.16,'#e1e0d8');
  box(scene,2.65,3.15,-1.67,1.2,.5,.16,'#e1e0d8');
  box(scene,2.65,1.43,-1.95,1.2,2.86,.04,'#647781');
  const door=new THREE.Group();door.position.set(2.05,0,-1.54);door.rotation.y=-.72;scene.add(door);
  box(door,.6,1.43,0,1.2,2.86,.10,'#667a85');
  box(door,.6,1.6,.065,.99,2.2,.035,'#a9c4ce',.18,.25);
  box(door,1.03,1.16,.09,.05,.22,.06,'#c4cbd0',.25,.8);
  label(scene,['STAFF ONLY'],2.65,3.04,-1.56,1.2,.22,'#344b5a','#ffffff');
  box(scene,1.88,1.3,-1.53,.16,.26,.10,'#293841');box(scene,1.88,1.35,-1.47,.035,.035,.02,'#74d8a0');
  box(scene,-.7,3.6,-1.3,3,.045,.3,'#f9fbf2');
  // Wood workstation with visible thickness, return, drawers and cable grommet.
  const wood=textured('#bc9870','wood');
  const desk=box(scene,-.75,1.10,-.35,4.45,.12,1.9,'#bc9870');desk.material=wood;
  const ret=box(scene,-2.55,1.10,.95,.85,.12,1.4,'#bc9870');ret.material=wood;
  for(const x of [-2.75,1.15])for(const z of [-1.08,.36])box(scene,x,.52,z,.075,1.04,.075,'#b8bec0',.3,.7);
  box(scene,.72,.53,-.15,.83,1.02,1.15,'#d8dbd9');
  for(let y=.22;y<1;y+=.29){box(scene,.72,y,.438,.76,.27,.04,'#e2e4e0');box(scene,.72,y+.04,.48,.24,.028,.035,'#6b7478',.3,.6)}
  cylinder(scene,-1.95,1.165,-1.05,.075,.015,'#323c42');
  // Monitor: a legible inbox rendered as a texture, with a real stand and bezel.
  let g=object('screen');box(g,-1.0,1.77,-.91,1.36,.82,.095,'#242a2e',.4);box(g,-1,1.29,-.91,.075,.23,.09,'#525d62',.3,.6);box(g,-1,1.18,-.77,.55,.025,.35,'#4e575c',.4,.6);
  label(g,['Company inbox','Q3 payroll.xlsx','Client account details','SESSION OPEN — Dev'], -1,1.78,-.855,1.24,.70,'#e8f0f4','#26465b');
  g=object('note');label(g,['PASSWORD','Spring26!'],-.23,1.91,-.844,.25,.25,'#ffdc79','#44351c');
  // Keyboard with individual keys and an exposed note, mouse and desk mat.
  box(scene,-1.02,1.174,.08,1.58,.012,.67,'#444b4c');box(scene,-1.23,1.20,.05,.9,.045,.32,'#343b40');
  for(let x=0;x<13;x++)for(let z=0;z<4;z++)box(scene,-1.635+x*.067,1.229,-.075+z*.069,.053,.012,.052,'#bcc2c2');
  cylinder(scene,-.36,1.216,.08,.088,.055,'#333b40').scale.z=1.5;
  g=object('underkb');label(g,['VPN: Home@26'],-1.33,1.187,.34,.48,.15,'#ffe79b','#463c27',true);
  g=object('phone');box(g,-2.0,1.20,.12,.25,.05,.48,'#20262b',.3);label(g,['SMS CODE','482913'],-2,1.228,.12,.215,.40,'#e1edf4','#274b6b',true);
  g=object('badge');box(g,.1,1.18,.30,.27,.012,.40,'#edf1eb');label(g,['INNOVATIVIEW','DEV / STAFF','ACCESS CARD'],.1,1.188,.30,.26,.38,'#eef5ef','#25665c',true);
  box(g,.1,1.183,.02,.035,.014,.23,'#1c7766');
  g=object('print');box(g,.53,1.18,-.45,.55,.027,.65,'#ead5aa');label(g,['CONFIDENTIAL','Q3 PAYROLL','Employee salaries'],.53,1.198,-.45,.50,.59,'#fffdf3','#973d36',true);
  g=object('usb');box(g,.77,1.195,.4,.21,.05,.085,'#344d67');box(g,.915,1.195,.4,.09,.035,.065,'#bdc2c4',.2,.8);
  g=object('keys');cylinder(g,.71,.89,.50,.045,.014,'#545e65').rotation.x=Math.PI/2;box(g,.71,.89,.56,.018,.022,.13,'#b4a16c',.3,.7);const ring=new THREE.Mesh(new THREE.TorusGeometry(.065,.012,8,24),material('#b4a16c',.25,.7));ring.position.set(.71,.84,.63);g.add(ring);
  g=object('laptop');box(g,-2.48,1.195,-.45,.67,.055,.47,'#9da8ad',.3,.5);label(g,['LOCKED'],-2.48,1.224,-.45,.30,.10,'#9da8ad','#354653',true);box(g,-2.84,1.18,-.45,.06,.025,.45,'#333d44');
  g=object('mug');cylinder(g,-.18,1.33,-.45,.11,.31,'#e6e8e0');cylinder(g,-.18,1.49,-.45,.087,.005,'#594536');const handle=new THREE.Mesh(new THREE.TorusGeometry(.085,.025,12,24),material('#e6e8e0'));handle.position.set(-.04,1.34,-.45);g.add(handle);
  g=object('pens');cylinder(g,1.06,1.29,-.90,.095,.25,'#606a70');for(let k=0;k<4;k++)cylinder(g,1.025+k*.024,1.45,-.90,.008,.30,['#334a61','#804039','#5d6650','#333333'][k]);
  function plant(id,x,y,z,scale=1){const p=object(id);cylinder(p,x,y+.17*scale,z,.19*scale,.34*scale,'#c4ae94',.23*scale);for(let k=0;k<7;k++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(1,12,12),material(k%2?'#4b6a46':'#698653'));leaf.scale.set(.10*scale,.43*scale,.045*scale);leaf.position.set(x+Math.sin(k*2)*.17*scale,y+.61*scale,z+Math.cos(k*2)*.13*scale);leaf.rotation.z=Math.sin(k*2)*.5;leaf.castShadow=true;p.add(leaf)}return p}
  plant('plant',-2.83,.02,1.65,1);plant('cactus',1.18,1.17,-.27,.35);
  g=object('board');box(g,-1.88,2.37,-1.51,1.5,.72,.04,'#b8c2c4',.25,.6);label(g,['Team Wi-Fi','Innov@2026','admin / admin'],-1.88,2.37,-1.482,1.43,.65,'#f2f2e9','#3d6777');
  g=object('poster');label(g,['CLEAN DESK','CLEAR MIND','Lock it. Protect it.'],.48,2.3,-1.55,.48,.68,'#efede2','#456358');
  g=object('cal');label(g,['OCTOBER','05'],1.17,2.32,-1.55,.35,.43,'#f2f0e8','#865147');
  g=object('clock');const clock=cylinder(g,-.6,2.57,-1.5,.22,.055,'#e8e7de');clock.rotation.x=Math.PI/2;label(g,['12','9     3','6'],-.6,2.57,-1.461,.31,.31,'#e8e7de','#343d42');box(g,-.60,2.62,-1.452,.014,.12,.01,'#343d42');box(g,-.55,2.565,-1.45,.1,.014,.01,'#343d42');
  g=object('frame');box(g,1.15,1.47,-1.04,.3,.36,.06,'#836d56');label(g,['FAMILY','♡'],1.15,1.47,-1.002,.25,.30,'#b3c9cd','#fff7e8');
  g=object('cork');box(g,-2.64,1.98,-1.51,.47,.42,.05,'#ad8e60');label(g,['TEAM LUNCH','FRIDAY 1 PM'],-2.64,1.98,-1.477,.35,.28,'#eee4bc','#484432');
  // Adjustable chair with padded seat, mesh back, arms and a five-spoke base.
  g=object('chair');g.position.set(-.9,0,1.48);g.rotation.y=-.22;
  box(g,0,.77,0,.72,.14,.66,'#414b52');box(g,0,1.24,.26,.67,.77,.09,'#43525b');
  for(let y=.95;y<1.6;y+=.055)box(g,0,y,.315,.60,.014,.01,'#718088');
  for(const x of [-.42,.42]){box(g,x,.90,0,.035,.40,.035,'#7b8589',.35,.5);box(g,x,1.10,0,.10,.06,.45,'#303d46')}
  cylinder(g,0,.42,0,.055,.65,'#a8afb1');for(let k=0;k<5;k++){const spoke=box(g,0,.15,0,.06,.04,.86,'#59656c');spoke.rotation.y=k*Math.PI/2.5;cylinder(g,Math.sin(k*Math.PI/2.5)*.42,.08,Math.cos(k*Math.PI/2.5)*.42,.055,.06,'#252d31')}
  g=object('bin');cylinder(g,-2.14,.28,.9,.23,.54,'#535f65',.28);cylinder(g,-2.14,.554,.9,.245,.01,'#283238');label(g,['SALARY','PAYROLL'],-2.14,.59,.9,.35,.38,'#fffdf3','#8e4640',true);
  g=object('shred');box(g,1.68,.39,.47,.46,.76,.46,'#46515a');box(g,1.68,.78,.47,.38,.015,.045,'#182126');label(g,['SHREDDER'],1.68,.51,.706,.36,.15,'#46515a','#dce3e6');
  g=object('printer');box(g,2.45,.65,.15,1,.08,.8,'#d2d4ce');for(const x of [2.05,2.85])box(g,x,.3,.15,.055,.6,.6,'#909b9f');box(g,2.45,.88,.15,.73,.37,.60,'#e3e5df');box(g,2.45,1.08,.15,.69,.03,.56,'#424e55');label(g,['HR LIST','Names / salaries'],2.45,1.107,.05,.36,.48,'#fffcf1','#874b47',true);box(g,2.45,.84,.47,.50,.06,.045,'#485661');
  g=object('bag');box(g,-.03,.25,1.66,.65,.49,.34,'#574f48');box(g,-.03,.54,1.66,.47,.15,.12,'#263643');label(g,['WORK LAPTOP'],-.03,.35,1.837,.5,.12,'#574f48','#d2c9b9');
  g=object('wedge');const wedge=box(g,2.91,.06,-.73,.22,.10,.32,'#a28755');wedge.rotation.x=.12;
  g=object('ext');cylinder(g,3.63,.50,-1.29,.115,.60,'#a8453c');box(g,3.63,.87,-1.29,.12,.13,.08,'#303b40');label(g,['FIRE'],3.63,.51,-1.171,.16,.21,'#eee8d6','#ac453c');
  g=object('tail');g.position.set(2.43,0,-.77);cylinder(g,0,1.34,0,.20,.63,'#637a86',.24);const head=new THREE.Mesh(new THREE.SphereGeometry(.15,24,16),material('#bf977d'));head.position.set(0,1.83,0);head.castShadow=true;g.add(head);for(const x of [-.11,.11]){box(g,x,.52,0,.15,1,.18,'#445361');box(g,x,.055,.07,.18,.11,.32,'#343c42')}for(const x of [-.29,.29])cylinder(g,x,1.25,0,.067,.60,'#637a86');
  }
  // Selection is neutral: the player must decide whether the inspected object is risky.
  const observed={board:'The whiteboard lists “Wi-Fi: Innov@2026” and “admin / admin”.',screen:'The inbox is open. Payroll and client files are visible; nobody is at the desk.',note:'The note on the monitor reads “PASSWORD: Spring26!”.',phone:'An SMS preview displays the one-time code 482913.',badge:'Dev’s employee access card is lying on the desk.',print:'The folder is marked CONFIDENTIAL — Q3 PAYROLL.',usb:'An unlabeled USB drive is lying on the desk.',keys:'A key is still inserted in the drawer lock.',bin:'Payroll sheets are sitting in the ordinary paper bin.',tail:'A person without a visible staff badge is entering through the staff-only door.',underkb:'A note beside the keyboard reads “VPN: Home@26”.',printer:'The printer tray contains a document titled “HR LIST”.',bag:'An open, unattended laptop bag contains a work device.',wedge:'The secure door is being held open by a door stop.',laptop:'The laptop is locked and secured with a cable.',mug:'A ceramic coffee mug sits on the desk.',chair:'An adjustable office chair is beside the workstation.',poster:'A clean-desk reminder is pinned to the cubicle wall.',cal:'A wall calendar shows October.',clock:'The clock shows lunchtime.',pens:'A holder contains ordinary pens.',plant:'A potted plant is beside the partition.',cactus:'A small desk plant sits in a pot.',frame:'A family photo is in a frame.',cork:'The noticeboard announces a team lunch.',shred:'A document shredder is available beside the desk.',ext:'A fire extinguisher is mounted by the corridor.'};
  if(roomId !== 'cube') {
    for(const key of Object.keys(names))delete names[key];
    buildRoom(roomId, {scene, box, cylinder, label, textured, material, object, names, observed});
    q('.cart-h .lbl').textContent=caseFile.cn+' / 3D inspection';
    q('.cart-h .chip').textContent=caseFile.name;
    q('h2').textContent={recep:'The unattended reception',meet:'After the board meeting',home:'The remote-work inspection'}[roomId];
    q('.panel .office-hint').textContent=caseFile.intro+' Drag to look around, zoom in and inspect objects before deciding what to report.';
    q('.office-caption').textContent=caseFile.name.toUpperCase()+' · Drag to orbit · Click to inspect';
    renderer.domElement.setAttribute('aria-label','Interactive 3D '+caseFile.name+'. Use the object selector and view buttons for keyboard access.');
  }
  for(const [id,name] of Object.entries(names)){const option=document.createElement('option');option.value=id;option.textContent=name;q('select').appendChild(option)}
  let theta=.45,phi=1.03,distance=8.5,selected=null,active=false,over=false,disposed=false,remaining=180,streak=0,falseAlarms=0,frameId,interval,lastTick;
  const target=new THREE.Vector3(-.3,1.05,0),ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),found=new Set(),riskItems=items.filter(i=>i[1]);
  const selection=new THREE.BoxHelper(groups.values().next().value,0xffc763);selection.visible=false;scene.add(selection);
  function setCamera(){const d=distance*Math.max(1,1.45/camera.aspect);camera.position.set(target.x+d*Math.sin(phi)*Math.sin(theta),target.y+d*Math.cos(phi),target.z+d*Math.sin(phi)*Math.cos(theta));camera.lookAt(target)}
  function select(id){if(!groups.has(id))return;selected=id;q('select').value=id;selection.setFromObject(groups.get(id));selection.material.color.set(found.has(id)?'#57d3a1':'#ffc763');selection.visible=true;q('.office-detail').replaceChildren();const title=document.createElement('b');title.textContent=names[id];q('.office-detail').append(title,document.createTextNode(observed[id]));q('[data-report]').disabled=!active||over||found.has(id)}
  function status(text){q('.office-status').textContent=text}
  function update(){q('[data-clock]').textContent=Math.ceil(remaining)+'s';q('[data-progress]').textContent=`${found.size} / ${riskItems.length} risks found${streak>1?' · Streak '+streak:''}`}
  function finish(){if(over)return;over=true;active=false;clearInterval(interval);q('[data-report]').disabled=q('[data-hint]').disabled=true;const all=found.size===riskItems.length;if(all&&remaining>0)onScore(Math.ceil(remaining),'time bonus');const grade=all&&!falseAlarms?'S':all?'A':found.size>=riskItems.length*.7?'B':found.size>=riskItems.length*.5?'C':'D';status(all?'Inspection complete. Every security risk has been logged.':'Time is up. Review the missed risks below and inspect their objects to learn more.');const report=q('.office-report');report.innerHTML=`<div class="panel"><h2>Inspection report · Grade ${grade}</h2><p>${found.size}/${riskItems.length} risks found · ${falseAlarms} false alarms</p><ul></ul><button class="btn" data-finish>Back to case files</button></div>`;riskItems.forEach(i=>{const li=document.createElement('li');li.textContent=`${found.has(i[0])?'✓':'Missed:'} ${i[2]}. ${i[5]}`;report.querySelector('ul').appendChild(li)});q('[data-finish]').onclick=()=>{dispose();onDone({g:grade,n:found.size,all})};update()}
  q('[data-start]').onclick=()=>{if(active||over)return;active=true;lastTick=performance.now();q('[data-start]').disabled=true;q('[data-start]').textContent='Inspection running';q('[data-hint]').disabled=false;if(selected)select(selected);status('Inspection started. Click an object to examine it, then report it if it is a security risk.');interval=setInterval(()=>{if(!renderer.domElement.isConnected){dispose();return}const now=performance.now();remaining=Math.max(0,remaining-(now-lastTick)/1000);lastTick=now;update();if(remaining<=0)finish()},200)};
  q('select').onchange=e=>select(e.target.value);
  q('[data-report]').onclick=()=>{if(!active||over||!selected||found.has(selected))return;const i=info.get(selected);if(i[1]){found.add(selected);streak++;onScore(40+Math.min(streak-1,3)*10,'risk found');q('[data-empty]')?.remove();const li=document.createElement('li');li.textContent=i[2];q('.office-evidence').appendChild(li);status('Risk logged. '+i[5]);q('[data-report]').disabled=true;selection.material.color.set('#57d3a1');if(found.size===riskItems.length)finish()}else{streak=0;falseAlarms++;onScore(-20,'false alarm');status('False alarm. '+i[5]);selection.material.color.set('#ef7777')}update()};
  q('[data-hint]').onclick=()=>{if(!active||over)return;const missing=riskItems.filter(i=>!found.has(i[0]));if(!missing.length)return;onScore(-10,'hint');select(missing[0][0]);status('Hint: take a closer look at '+names[missing[0][0]].toLowerCase()+'. '+observed[missing[0][0]])};
  host.querySelectorAll('[data-cam]').forEach(b=>b.onclick=()=>{const dir=b.dataset.cam;if(dir==='left')theta-=.18;if(dir==='right')theta+=.18;if(dir==='in')distance-=.6;if(dir==='out')distance+=.6;if(dir==='reset'){theta=.45;phi=1.03;distance=8.5}theta=THREE.MathUtils.clamp(theta,-.48,1.1);distance=THREE.MathUtils.clamp(distance,3.6,11);setCamera()});
  let drag=null;
  renderer.domElement.onpointerdown=e=>{drag={x:e.clientX,y:e.clientY,moved:false};renderer.domElement.setPointerCapture(e.pointerId)};
  renderer.domElement.onpointermove=e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>3)drag.moved=true;if(drag.moved){theta=THREE.MathUtils.clamp(theta-dx*.007,-.48,1.1);phi=THREE.MathUtils.clamp(phi+dy*.006,.48,1.4);drag.x=e.clientX;drag.y=e.clientY;setCamera()}};
  renderer.domElement.onpointerup=e=>{if(!drag)return;const moved=drag.moved;drag=null;if(moved)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(scene.children,true).find(h=>h.object.isMesh);if(hit){let obj=hit.object;while(obj&&!obj.userData.id)obj=obj.parent;if(obj?.userData.id)select(obj.userData.id)}};
  renderer.domElement.onpointercancel=()=>drag=null;
  renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();distance=THREE.MathUtils.clamp(distance+e.deltaY*.008,3.6,11);setCamera()},{passive:false});
  function resize(){const w=view.clientWidth,h=renderer.domElement.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();setCamera()}
  const observer=new ResizeObserver(resize);observer.observe(view);
  function dispose(){if(disposed)return;disposed=true;clearInterval(interval);cancelAnimationFrame(frameId);observer.disconnect();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const mat of Array.isArray(o.material)?o.material:[o.material])mat.dispose()}});textures.forEach(t=>t.dispose());renderer.dispose();renderer.forceContextLoss()}
  function render(){if(disposed)return;if(!renderer.domElement.isConnected){dispose();return}renderer.render(scene,camera);frameId=requestAnimationFrame(render)}
  setCamera();resize();update();render();
  return dispose;
}
