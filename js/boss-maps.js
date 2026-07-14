/* Mapas vetoriais animados dos chefões — storytelling conectado */
var BOSS_MAP_ROUTES={
  carajas:[[95,248],[222,205],[306,206],[404,186],[504,214],[600,250],[760,232],[978,246]],
  office:[[70,235],[210,198],[360,215],[520,175],[680,205],[890,228]],
  ceo:[[55,238],[148,198],[242,218],[336,188],[430,208],[524,178],[618,198],[712,188],[806,208],[920,228]],
  otintr:[[60,240],[155,195],[250,215],[345,180],[440,205],[535,175],[630,200],[725,185],[820,210],[915,230]],
  omphish:[[65,235],[160,195],[255,215],[350,180],[445,205],[540,175],[635,200],[730,185],[825,210],[910,228]],
  leakchain:[[58,238],[152,198],[246,218],[340,188],[434,208],[528,178],[622,198],[716,188],[810,208],[904,228]],
  portintr:[[62,240],[156,200],[250,220],[344,185],[438,205],[532,175],[626,200],[720,188],[814,210],[908,232]]
};
var BOSS_MAP_META={
  carajas:{theme:"iron",labelPt:"Minério → China 🇨🇳",labelEn:"Ore → China 🇨🇳"},
  office:{theme:"office",labelPt:"E-mail → Estação → Reunião → Nuvem → Remoto → SOC",labelEn:"Email → Workstation → Meeting → Cloud → Remote → SOC"},
  ceo:{theme:"finance",labelPt:"E-mail → Validação → SAP → Banco → Política",labelEn:"Email → Validation → SAP → Bank → Policy"},
  otintr:{theme:"ot",labelPt:"TI → Firewall → OT → Britagem → SIS",labelEn:"IT → Firewall → OT → Crushing → SIS"},
  omphish:{theme:"hub",labelPt:"Portal → Credencial → Embarque → Cadeia",labelEn:"Portal → Credential → Loading → Chain"},
  leakchain:{theme:"data",labelPt:"Envio → Rastreio → DLP → Cliente → LGPD",labelEn:"Send → Tracking → DLP → Client → Privacy"},
  portintr:{theme:"port",labelPt:"Acesso → SCADA → Navio → Auditoria → Resiliência",labelEn:"Access → SCADA → Vessel → Audit → Resilience"}
};
function bossMapSceneId(b){
  if(!b) return "ceo";
  if(b.chainId==="carajas") return "carajas";
  if(b.chainId==="office") return "office";
  return b.mapSceneId||b.id||"ceo";
}
function bossMapRoute(id,n){
  var pts=BOSS_MAP_ROUTES[id]||BOSS_MAP_ROUTES.ceo;
  if(n<=pts.length) return pts.slice(0,n);
  var out=pts.slice(),i;
  for(i=pts.length;i<n;i++) out.push([pts[pts.length-1][0]+(i-pts.length+1)*18, pts[pts.length-1][1]]);
  return out;
}
function bossRoutePoint(route,f){
  var pts=route,segs=[],total=0,i;
  if(!pts.length) return {x:500,y:200};
  if(pts.length===1) return {x:pts[0][0],y:pts[0][1]};
  for(i=0;i<pts.length-1;i++){ var dx=pts[i+1][0]-pts[i][0],dy=pts[i+1][1]-pts[i][1],len=Math.sqrt(dx*dx+dy*dy); segs.push(len); total+=len; }
  var target=f*total,acc=0;
  for(i=0;i<segs.length;i++){ if(acc+segs[i]>=target){ var t=segs[i]?(target-acc)/segs[i]:0; return {x:pts[i][0]+(pts[i+1][0]-pts[i][0])*t,y:pts[i][1]+(pts[i+1][1]-pts[i][1])*t}; } acc+=segs[i]; }
  var last=pts[pts.length-1]; return {x:last[0],y:last[1]};
}
function bossMapLabel(id,lang){
  var m=BOSS_MAP_META[id]||BOSS_MAP_META.ceo;
  return lang==="en"?m.labelEn:m.labelPt;
}
function bossMapTheme(id){
  var m=BOSS_MAP_META[id]||BOSS_MAP_META.ceo;
  return m.theme||"finance";
}
function bossMapDefs(sfx,theme){
  var d='<linearGradient id="bmSky'+sfx+'" x1="0" y1="0" x2="0" y2="1">';
  if(theme==="iron") d+='<stop offset="0" stop-color="#8fd3e8"/><stop offset="1" stop-color="#dff1f5"/>';
  else if(theme==="office") d+='<stop offset="0" stop-color="#1a3a4a"/><stop offset="1" stop-color="#2d5a6e"/>';
  else if(theme==="finance") d+='<stop offset="0" stop-color="#1e3a5f"/><stop offset="1" stop-color="#2a4a72"/>';
  else if(theme==="ot") d+='<stop offset="0" stop-color="#4a3520"/><stop offset="1" stop-color="#6b5030"/>';
  else if(theme==="hub") d+='<stop offset="0" stop-color="#c47d30"/><stop offset="1" stop-color="#8b5a20"/>';
  else if(theme==="data") d+='<stop offset="0" stop-color="#2a3a5a"/><stop offset="1" stop-color="#1a2840"/>';
  else if(theme==="port") d+='<stop offset="0" stop-color="#1a4a5a"/><stop offset="1" stop-color="#0d3040"/>';
  else d+='<stop offset="0" stop-color="#1a3a4a"/><stop offset="1" stop-color="#2d5a6e"/>';
  d+='</linearGradient><linearGradient id="bmGround'+sfx+'" x1="0" y1="0" x2="0" y2="1">';
  if(theme==="iron") d+='<stop offset="0" stop-color="#3f7a4a"/><stop offset="1" stop-color="#2c5836"/>';
  else if(theme==="finance") d+='<stop offset="0" stop-color="#2d4060"/><stop offset="1" stop-color="#1a2840"/>';
  else if(theme==="ot") d+='<stop offset="0" stop-color="#5c4030"/><stop offset="1" stop-color="#3d2a1e"/>';
  else if(theme==="hub") d+='<stop offset="0" stop-color="#8b6914"/><stop offset="1" stop-color="#5c4510"/>';
  else if(theme==="data") d+='<stop offset="0" stop-color="#3a4a60"/><stop offset="1" stop-color="#253040"/>';
  else if(theme==="port") d+='<stop offset="0" stop-color="#3a5a6a"/><stop offset="1" stop-color="#254550"/>';
  else d+='<stop offset="0" stop-color="#3d5260"/><stop offset="1" stop-color="#2a3840"/>';
  d+='</linearGradient>';
  if(theme==="iron") d+='<linearGradient id="bmSea'+sfx+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b8fb0"/><stop offset="1" stop-color="#16607a"/></linearGradient>';
  d+='<linearGradient id="bmGold'+sfx+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EDB111"/><stop offset="1" stop-color="#007E7A"/></linearGradient>';
  return d;
}
function bossMapSceneContent(id,sfx){
  if(id==="carajas"&&typeof cmapScene==="function") return cmapScene().replace(/id="cmSky"/g,'id="bmSky'+sfx+'"').replace(/url\(#cmSky\)/g,"url(#bmSky"+sfx+")")
    .replace(/id="cmGround"/g,'id="bmGround'+sfx+'"').replace(/url\(#cmGround\)/g,"url(#bmGround"+sfx+")")
    .replace(/id="cmSea"/g,'id="bmSea'+sfx+'"').replace(/url\(#cmSea\)/g,"url(#bmSea"+sfx+")");
  if(id==="office"&&typeof offmapScene==="function") return offmapScene(sfx).replace(/id="omSky/g,'id="bmSky').replace(/url\(#omSky/g,"url(#bmSky").replace(/id="omFloor/g,'id="bmGround').replace(/url\(#omFloor/g,"url(#bmGround").replace(/id="omShield/g,'id="bmGold').replace(/url\(#omShield/g,"url(#bmGold");
  var s='',pt=L()==="pt";
  s+='<rect x="0" y="0" width="1000" height="300" fill="url(#bmSky'+sfx+')"/>';
  s+='<rect x="0" y="70" width="1000" height="230" fill="url(#bmGround'+sfx+')"/>';
  if(id==="ceo"){
    s+='<rect x="40" y="90" width="120" height="80" rx="6" fill="#2d4060" stroke="#EDB111" stroke-width="1.5"/>';
    s+='<rect x="52" y="102" width="96" height="50" rx="3" fill="#cbe8f2"/><g class="om-email-ping" transform="translate(120,95)"><text font-size="14" text-anchor="middle">📧</text></g>';
    s+='<rect x="200" y="100" width="90" height="60" rx="4" fill="#1a2840"/><text x="245" y="135" font-size="11" fill="#EDB111" text-anchor="middle" font-weight="700">SAP</text>';
    s+='<rect x="360" y="95" width="100" height="70" rx="4" fill="#0a2a32" stroke="#007E7A"/><text x="410" y="135" font-size="20" text-anchor="middle">🏦</text>';
    s+='<path class="om-data-flow" d="M160,130 L200,130 L290,130 L360,130" fill="none" stroke="#EDB111" stroke-width="2.5"/>';
    s+='<text x="500" y="88" font-size="11" text-anchor="middle" fill="rgba(255,255,255,.8)" font-weight="700">'+(pt?"GOLPE DO CEO — FLUXO DE PAGAMENTO":"CEO SCAM — PAYMENT FLOW")+'</text>';
  }else if(id==="otintr"){
    s+='<polygon points="30,300 50,160 180,160 200,300" fill="#5c4030"/><polygon points="50,160 70,120 160,120 180,160" fill="#6b5030"/>';
    s+='<rect x="280" y="130" width="80" height="55" rx="4" fill="#2d3740"/><text x="320" y="162" font-size="10" fill="#cbe8f2" text-anchor="middle">CLP</text>';
    s+='<rect x="420" y="120" width="50" height="70" rx="3" fill="#ff4d4f" opacity=".7"/><text x="445" y="158" font-size="9" fill="#fff" text-anchor="middle" font-weight="700">TI↔OT</text>';
    s+='<rect x="520" y="125" width="100" height="60" rx="4" fill="#0a2a32" stroke="#007E7A"/><text x="570" y="160" font-size="10" fill="#eaf2f6" text-anchor="middle">SCADA</text>';
    s+='<g class="cm-smoke" fill="rgba(255,255,255,.4)"><circle cx="100" cy="115" r="6"/><circle cx="108" cy="105" r="5"/></g>';
    s+='<text x="500" y="88" font-size="11" text-anchor="middle" fill="rgba(255,255,255,.85)" font-weight="700">'+(pt?"S11D — BRITAGEM OT/ICS":"S11D — CRUSHING OT/ICS")+'</text>';
  }else if(id==="omphish"){
    s+='<rect x="30" y="110" width="140" height="70" rx="4" fill="#5c4510"/><text x="100" y="150" font-size="11" fill="#EDB111" text-anchor="middle" font-weight="700">MEGA HUB</text>';
    s+='<rect x="220" y="120" width="90" height="55" rx="4" fill="#1a2840"/><text x="265" y="152" font-size="10" fill="#cbe8f2" text-anchor="middle">PORTAL</text>';
    s+='<g class="om-email-ping" transform="translate(350,130)"><text font-size="16">🎣</text></g>';
    s+='<path class="cm-ship" transform="translate(520,145)" d="M0,0 L80,0 L70,22 L10,22 Z" fill="#8b2942"/><rect x="20" y="-14" width="50" height="14" fill="#6b5030"/>';
    s+='<line class="cmap-belt" x1="400" y1="150" x2="520" y2="150" stroke="#e0aa43" stroke-width="3"/>';
    s+='<text x="500" y="88" font-size="11" text-anchor="middle" fill="rgba(255,255,255,.85)" font-weight="700">'+(pt?"SOHAR — HUB & EMBARQUE":"SOHAR — HUB & LOADING")+'</text>';
  }else if(id==="leakchain"){
    s+='<rect x="40" y="115" width="70" height="50" rx="3" fill="#2d4060"/><text x="75" y="145" font-size="18" text-anchor="middle">📊</text>';
    s+='<path class="om-data-flow" d="M110,140 Q200,100 290,140" fill="none" stroke="#ff4d4f" stroke-width="2.5" stroke-dasharray="6 4"/>';
    s+='<rect x="300" y="120" width="80" height="45" rx="3" fill="#1a2840" stroke="#ff4d4f"/><text x="340" y="148" font-size="9" fill="#ff6b6b" text-anchor="middle">'+(pt?"DESTINO ERRADO":"WRONG RECIPIENT")+'</text>';
    s+='<rect x="450" y="110" width="90" height="60" rx="4" fill="#0a2a32"/><text x="495" y="145" font-size="10" fill="#2fbf71" text-anchor="middle">DLP</text>';
    s+='<text x="500" y="88" font-size="11" text-anchor="middle" fill="rgba(255,255,255,.85)" font-weight="700">'+(pt?"VAZAMENTO — CADEIA DE DADOS":"LEAK — DATA CHAIN")+'</text>';
  }else if(id==="portintr"){
    s+='<rect x="30" y="200" width="200" height="12" fill="#455055"/>';
    s+='<line x1="80" y1="200" x2="80" y2="140" stroke="#5b6b73" stroke-width="5"/>';
    s+='<path class="cm-ship" transform="translate(250,175)" d="M0,0 L90,0 L78,24 L12,24 Z" fill="#8b2942"/><rect x="25" y="-16" width="55" height="16" fill="#6b5030"/>';
    s+='<rect x="400" y="125" width="100" height="65" rx="4" fill="#0a2a32" stroke="#007E7A"/><text x="450" y="162" font-size="10" fill="#eaf2f6" text-anchor="middle">SCADA</text>';
    s+='<rect x="560" y="140" width="60" height="45" rx="3" fill="#3d4f58"/><text x="590" y="168" font-size="16" text-anchor="middle">🚪</text>';
    s+='<line class="cmap-belt" x1="130" y1="195" x2="250" y2="185" stroke="#e0aa43" stroke-width="3"/>';
    s+='<text x="500" y="88" font-size="11" text-anchor="middle" fill="rgba(255,255,255,.85)" font-weight="700">'+(pt?"PONTA DA MADEIRA — PORTO":"PONTA DA MADEIRA — PORT")+'</text>';
  }
  return s;
}
function renderBossMapSvg(boss,active,phaseStates,lang){
  var sceneId=bossMapSceneId(boss);
  var theme=bossMapTheme(sceneId);
  var sfx="M"+(boss.id||"x");
  var n=boss.phases.length;
  var route=bossMapRoute(sceneId,n);
  var label=bossMapLabel(sceneId,lang);
  var pinFn=function(i){ return route[i]?{x:route[i][0],y:route[i][1]}:bossRoutePoint(route,i/(n>1?n-1:1)); };
  var svg='<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid meet" width="100%" role="img" aria-label="'+(boss.name&&boss.name[lang]?boss.name[lang]:"")+'">';
  svg+='<defs>'+bossMapDefs(sfx,theme)+'</defs>';
  svg+=bossMapSceneContent(sceneId,sfx);
  var d="M"+route.map(function(p){return p[0]+","+p[1];}).join(" L");
  svg+='<path d="'+d+'" fill="none" stroke="#EDB111" stroke-width="3" stroke-dasharray="7 6" opacity=".9"/>';
  svg+='<g transform="translate(20,268)"><rect x="0" y="0" width="'+Math.min(520,Math.max(200,label.length*7))+'" height="22" rx="11" fill="rgba(6,24,32,.82)"/><text x="12" y="15" font-size="11" fill="#EDB111" font-weight="700">'+label+'</text></g>';
  var firstBad=-1,i;
  for(i=0;i<n;i++){ var pst=phaseStates&&phaseStates[i]; if(pst&&pst.ok===false){ firstBad=i; break; } }
  if(firstBad>=0){
    var bpts=[]; for(i=firstBad;i<n;i++){ var bp=pinFn(i); bpts.push(bp.x+","+bp.y); }
    svg+='<polyline class="cmap-breach" points="'+bpts.join(" ")+'" fill="none" stroke="#ff4d4f" stroke-width="5" stroke-dasharray="11 8" opacity=".95"/>';
  }
  var ch=typeof chainById==="function"&&boss.chainId?chainById(boss.chainId):null;
  for(i=0;i<n;i++){
    var pt=pinFn(i), pst=phaseStates&&phaseStates[i], ph=boss.phases[i];
    var done=!!pst, bad=done&&!pst.ok, on=i===active;
    var fill=bad?"#ff4d4f":done?"#2fbf71":(on?"#EDB111":"#8aa4ad");
    var pinTxt=(ch&&ch.stages[i]?ch.stages[i].ico:(bad?"!":(done?"✔":(i+1))));
    var pinLbl="";
    if(ch&&ch.stages[i]&&typeof shortName==="function"&&typeof tt==="function") pinLbl=shortName(tt(ch.stages[i].name));
    else if(ph&&ph.scene&&typeof tt==="function") pinLbl=shortName(String(tt(ph.scene)).replace(/^(Cena|Scene)\s+\d+\s*[—–-]\s*/i,""));
    else pinLbl=(lang==="en"?"Scene ":"Cena ")+(i+1);
    svg+='<g class="cmap-pin'+(bad?" compromised":(done?" done":""))+(on?" active":"")+'" transform="translate('+pt.x.toFixed(1)+','+pt.y.toFixed(1)+')">';
    if(on) svg+='<circle class="cmap-pin-halo boss-visual-pulse" r="22" fill="'+fill+'" opacity=".35"/>';
    else svg+='<circle class="cmap-pin-halo" r="17" fill="'+fill+'" opacity=".22"/>';
    svg+='<circle class="cmap-pin-dot" r="13" fill="'+fill+'" stroke="#04141b" stroke-width="1.5"/>';
    svg+='<text y="5" font-size="'+(String(pinTxt).length>2?"10":"13")+'" text-anchor="middle" font-weight="800" fill="#04141b">'+pinTxt+'</text>';
    svg+='<g class="cmap-pin-label"><rect x="-54" y="-40" width="108" height="18" rx="9" fill="rgba(6,24,32,.9)"/><text y="-27" font-size="10" text-anchor="middle" fill="#eaf2f6">'+pinLbl+'</text></g></g>';
  }
  var curLbl="";
  if(ch&&ch.stages[active]&&typeof tt==="function") curLbl=tt(ch.stages[active].name);
  else if(boss.phases[active]&&boss.phases[active].scene&&typeof tt==="function") curLbl=tt(boss.phases[active].scene);
  if(curLbl) svg+='<g transform="translate(20,12)"><rect width="460" height="24" rx="8" fill="rgba(6,24,32,.88)"/><text x="12" y="16" font-size="12" fill="#eaf2f6" font-weight="700">'+(lang==="en"?"Current situation: ":"Situação atual: ")+curLbl+'</text></g>';
  svg+='</svg>';
  return {svg:svg,theme:theme};
}
