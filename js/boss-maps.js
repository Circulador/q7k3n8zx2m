/* Mapas vetoriais animados dos chefões — storytelling conectado */
var BOSS_MAP_ROUTES={
  carajas:[[95,248],[222,205],[306,206],[404,186],[504,214],[600,250],[760,232],[978,246]],
  office:[[70,235],[210,198],[360,215],[520,175],[680,205],[890,228]],
  ceo:[[78,238],[172,215],[268,228],[362,202],[458,218],[552,198],[646,212],[740,202],[834,218],[928,232]],
  otintr:[[62,246],[156,218],[250,232],[344,206],[438,218],[532,198],[626,212],[720,204],[814,218],[908,230]],
  omphish:[[68,240],[162,212],[256,226],[350,200],[444,214],[538,194],[632,208],[726,198],[820,212],[914,226]],
  leakchain:[[70,242],[164,214],[258,228],[352,204],[446,216],[540,196],[634,210],[728,200],[822,214],[916,228]],
  portintr:[[64,244],[158,216],[252,230],[346,206],[440,218],[534,198],[628,212],[722,204],[816,218],[910,230]]
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
  if(theme==="iron"||theme==="port"||theme==="hub") d+='<linearGradient id="bmSea'+sfx+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b8fb0"/><stop offset="1" stop-color="#16607a"/></linearGradient>';
  if(theme==="office") d+='<linearGradient id="omFloor'+sfx+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d5260"/><stop offset="1" stop-color="#2a3840"/></linearGradient>';
  d+='<linearGradient id="bmGold'+sfx+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EDB111"/><stop offset="1" stop-color="#007E7A"/></linearGradient>';
  return d;
}
function bossMapBanner(sfx,lang,pt,en){
  var t=lang==="en"?en:pt;
  return '<rect x="0" y="0" width="1000" height="300" fill="url(#bmSky'+sfx+')"/>'
    +'<rect x="18" y="8" width="964" height="48" rx="10" fill="rgba(6,24,32,.22)" stroke="rgba(237,177,17,.4)" stroke-width="1.5"/>'
    +'<text x="500" y="28" font-size="11" text-anchor="middle" fill="rgba(255,255,255,.92)" font-weight="700" letter-spacing=".4">'+t+'</text>';
}
function bossMapGround(sfx,y){ return '<rect x="0" y="'+(y||72)+'" width="1000" height="'+(300-(y||72))+'" fill="url(#bmGround'+sfx+')"/>'; }
function bossMapCeoScene(sfx,lang){
  var pt=lang!=="en";
  var s=bossMapBanner(sfx,lang,"GOLPE DO CEO — FINANCEIRO ORBITA","CEO SCAM — ORBITA FINANCE");
  s+='<path d="M90,42 Q500,32 910,42" fill="none" stroke="rgba(0,126,122,.4)" stroke-width="2"/>';
  s+='<circle cx="90" cy="42" r="7" fill="#007E7A"/><text x="90" y="58" font-size="8" text-anchor="middle" fill="#eaf2f6">📧</text>';
  s+='<circle cx="500" cy="42" r="7" fill="#007E7A"/><text x="500" y="58" font-size="8" text-anchor="middle" fill="#eaf2f6">🏦</text>';
  s+='<circle cx="910" cy="42" r="7" fill="#007E7A"/><text x="910" y="58" font-size="8" text-anchor="middle" fill="#eaf2f6">⚖️</text>';
  s+=bossMapGround(sfx,68);
  s+='<line x1="0" y1="108" x2="1000" y2="108" stroke="rgba(255,255,255,.08)" stroke-width="1"/>';
  /* skyline */
  for(var bx=0;bx<12;bx++){ var bh=24+(bx%4)*14; s+='<rect x="'+(24+bx*78)+'" y="'+(108+70-bh)+'" width="52" height="'+bh+'" rx="2" fill="#1a2840" opacity=".55"/>'; }
  /* 1 e-mail falso */
  s+='<rect x="34" y="148" width="88" height="58" rx="5" fill="#2d4060" stroke="#ff6b6b" stroke-width="1.5"/>';
  s+='<rect x="44" y="158" width="68" height="36" rx="3" fill="#cbe8f2"/>';
  s+='<g class="om-email-ping" transform="translate(108,144)"><rect x="-16" y="-14" width="32" height="20" rx="4" fill="#ff4d4f"/><text x="0" y="2" font-size="12" text-anchor="middle">📧</text></g>';
  s+='<text x="78" y="218" font-size="8" text-anchor="middle" fill="#ff8a8a" font-weight="700">'+(pt?"URGENTE":"URGENT")+'</text>';
  /* 2 telefone / validação */
  s+='<rect x="148" y="162" width="64" height="48" rx="4" fill="#0a2a32" stroke="#007E7A"/>';
  s+='<circle cx="180" cy="180" r="12" fill="#2fbf71" opacity=".85"/><text x="180" y="184" font-size="11" text-anchor="middle">📞</text>';
  s+='<text x="180" y="206" font-size="7" text-anchor="middle" fill="#eaf2f6">'+(pt?"Confirmar":"Confirm")+'</text>';
  /* 3 SAP */
  s+='<rect x="248" y="152" width="78" height="62" rx="4" fill="#1a2840" stroke="#EDB111" stroke-width="1.5"/>';
  s+='<text x="287" y="178" font-size="13" text-anchor="middle" fill="#EDB111" font-weight="800">SAP</text>';
  s+='<rect x="258" y="186" width="58" height="8" rx="2" fill="#2d4060"/><rect x="258" y="198" width="42" height="8" rx="2" fill="#ff4d4f" opacity=".7"/>';
  /* 4 banco */
  s+='<rect x="352" y="145" width="92" height="72" rx="5" fill="#0a2a32" stroke="#007E7A" stroke-width="2"/>';
  s+='<path d="M398,158 L378,178 L418,178 Z" fill="#EDB111"/><rect x="372" y="178" width="52" height="28" rx="2" fill="#1a3a45"/>';
  s+='<text x="398" y="198" font-size="9" text-anchor="middle" fill="#eaf2f6">US$ 2.3M</text>';
  /* 5 WhatsApp */
  s+='<rect x="468" y="158" width="72" height="54" rx="8" fill="#1a3a28" stroke="#25d366" stroke-width="1.5"/>';
  s+='<text x="504" y="182" font-size="18" text-anchor="middle">💬</text>';
  s+='<circle class="boss-visual-pulse" cx="532" cy="162" r="8" fill="#ff4d4f" opacity=".75"/>';
  /* 6 dupla aprovação */
  s+='<rect x="568" y="150" width="84" height="64" rx="4" fill="#2d4060"/>';
  s+='<circle cx="594" cy="178" r="10" fill="#5a8a9a"/><circle cx="626" cy="178" r="10" fill="#5a8a9a"/>';
  s+='<rect x="582" y="196" width="56" height="10" rx="2" fill="#2fbf71" opacity=".8"/>';
  /* 7 fornecedor */
  s+='<rect x="672" y="155" width="80" height="58" rx="4" fill="#3d4f58" stroke="#EDB111"/>';
  s+='<text x="712" y="182" font-size="16" text-anchor="middle">🤝</text>';
  s+='<text x="712" y="202" font-size="7" text-anchor="middle" fill="#eaf2f6">'+(pt?"Conta nova":"New acct")+'</text>';
  /* 8 jurídico */
  s+='<rect x="776" y="148" width="88" height="66" rx="4" fill="#0a2a32" stroke="#007E7A"/>';
  s+='<text x="820" y="186" font-size="20" text-anchor="middle">⚖️</text>';
  /* 9 workshop */
  s+='<rect x="878" y="152" width="96" height="60" rx="4" fill="rgba(237,177,17,.12)" stroke="rgba(237,177,17,.45)"/>';
  s+='<text x="926" y="178" font-size="11" text-anchor="middle" fill="#EDB111" font-weight="700">'+(pt?"TREINAMENTO":"TRAINING")+'</text>';
  s+='<text x="926" y="196" font-size="16" text-anchor="middle">🎭</text>';
  s+='<path class="om-data-flow" d="M78,178 L172,178 L268,182 L362,172 L458,180 L552,174 L646,182 L740,174 L834,180 L928,186" fill="none" stroke="#EDB111" stroke-width="2.5" opacity=".7"/>';
  return s;
}
function bossMapOtScene(sfx,lang){
  var pt=lang!=="en";
  var s=bossMapBanner(sfx,lang,"S11D CARAJÁS — INVASÃO TI → OT","S11D CARAJÁS — IT → OT INTRUSION");
  s+=bossMapGround(sfx,68);
  s+='<polygon points="0,300 8,200 120,200 140,300" fill="#6f5137"/><polygon points="0,200 12,168 108,168 120,200" fill="#7d5c3e"/><polygon points="14,168 24,142 96,142 108,168" fill="#8a6746"/>';
  s+='<g class="cm-smoke" fill="rgba(255,255,255,.45)"><circle cx="52" cy="138" r="6"/><circle cx="58" cy="128" r="5"/></g>';
  /* TI cloud */
  s+='<ellipse cx="108" cy="168" rx="34" ry="16" fill="#3d5260"/><ellipse cx="92" cy="162" rx="22" ry="12" fill="#4a6070"/><ellipse cx="124" cy="162" rx="20" ry="11" fill="#4a6070"/>';
  s+='<text x="108" y="168" font-size="9" text-anchor="middle" fill="#eaf2f6" font-weight="700">TI</text>';
  /* firewall */
  s+='<rect x="198" y="148" width="56" height="72" rx="4" fill="#2d3740" stroke="#ff4d4f" stroke-width="2"/>';
  s+='<rect x="208" y="158" width="36" height="52" rx="2" fill="#1a2330"/>';
  s+='<text x="226" y="188" font-size="9" text-anchor="middle" fill="#ff6b6b" font-weight="800">TI↔OT</text>';
  s+='<g class="boss-visual-pulse"><line x1="226" y1="168" x2="226" y2="200" stroke="#ff4d4f" stroke-width="3"/></g>';
  /* CLP */
  s+='<rect x="292" y="162" width="72" height="52" rx="4" fill="#2d3740" stroke="#007E7A"/>';
  s+='<rect x="302" y="172" width="18" height="14" rx="1" fill="#2fbf71"/><rect x="324" y="172" width="18" height="14" rx="1" fill="#EDB111"/><rect x="346" y="172" width="18" height="14" rx="1" fill="#ff4d4f"/>';
  s+='<text x="328" y="206" font-size="8" text-anchor="middle" fill="#eaf2f6">CLP</text>';
  /* britagem */
  s+='<rect x="396" y="178" width="64" height="48" rx="3" fill="#5b6b73"/>';
  s+='<polygon points="398,178 458,178 448,158 408,158" fill="#48565d"/>';
  s+='<g class="cm-exc-arm" transform="translate(420,210)"><line x1="0" y1="0" x2="28" y2="-18" stroke="#e0aa43" stroke-width="5" stroke-linecap="round"/></g>';
  /* SCADA */
  s+='<rect x="492" y="148" width="100" height="72" rx="4" fill="#0a2a32" stroke="#007E7A" stroke-width="2"/>';
  s+='<rect x="502" y="158" width="28" height="20" rx="2" fill="#1a3a45"/><rect x="534" y="158" width="28" height="20" rx="2" fill="#1a3a45"/><rect x="566" y="158" width="22" height="20" rx="2" fill="#ff4d4f" opacity=".6"/>';
  s+='<text x="542" y="206" font-size="9" text-anchor="middle" fill="#eaf2f6">SCADA</text>';
  /* SIS */
  s+='<rect x="616" y="155" width="76" height="62" rx="4" fill="#1a3a28" stroke="#2fbf71" stroke-width="2"/>';
  s+='<text x="654" y="192" font-size="18" text-anchor="middle">🛡️</text>';
  s+='<text x="654" y="208" font-size="8" text-anchor="middle" fill="#2fbf71" font-weight="700">SIS</text>';
  /* backup */
  s+='<rect x="716" y="160" width="68" height="54" rx="4" fill="#3d4f58"/>';
  s+='<rect x="726" y="170" width="48" height="10" rx="2" fill="#2fbf71"/><rect x="726" y="184" width="48" height="10" rx="2" fill="#EDB111"/>';
  s+='<text x="750" y="204" font-size="8" text-anchor="middle" fill="#eaf2f6">'+(pt?"Backup":"Backup")+'</text>';
  /* segmentação */
  s+='<rect x="808" y="152" width="88" height="64" rx="4" fill="#2d4060" stroke="#007E7A"/>';
  s+='<line x1="828" y1="168" x2="876" y2="168" stroke="#EDB111" stroke-width="2"/><line x1="828" y1="188" x2="876" y2="188" stroke="#2fbf71" stroke-width="2"/>';
  /* treinamento OT */
  s+='<rect x="908" y="156" width="72" height="58" rx="4" fill="rgba(237,177,17,.1)" stroke="rgba(237,177,17,.4)"/>';
  s+='<text x="944" y="190" font-size="16" text-anchor="middle">🏭</text>';
  s+='<line class="cmap-belt" x1="142" y1="188" x2="198" y2="182" stroke="#e0aa43" stroke-width="3"/>';
  return s;
}
function bossMapOmphishScene(sfx,lang){
  var pt=lang!=="en";
  var s=bossMapBanner(sfx,lang,"SOHAR, OMÃ — MEGA HUB & PHISHING","SOHAR, OMAN — MEGA HUB & PHISHING");
  s+='<circle cx="860" cy="46" r="22" fill="#ffe08a" opacity=".75"/>';
  s+=bossMapGround(sfx,68);
  s+='<rect x="780" y="196" width="220" height="104" fill="url(#bmSea'+sfx+')"/>';
  s+='<path class="cmap-wave" d="M780,214 Q830,206 880,214 T980,214" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="2"/>';
  /* complexo Sohar */
  s+='<rect x="28" y="168" width="120" height="56" rx="4" fill="#5c4510" stroke="#EDB111"/>';
  s+='<rect x="38" y="148" width="24" height="36" rx="3" fill="#7a878f"/><rect x="66" y="138" width="20" height="46" rx="3" fill="#7a878f"/>';
  s+='<text x="88" y="198" font-size="10" text-anchor="middle" fill="#EDB111" font-weight="700">SOHAR</text>';
  /* portal falso */
  s+='<rect x="178" y="155" width="96" height="68" rx="5" fill="#1a2840" stroke="#ff4d4f" stroke-width="2"/>';
  s+='<rect x="188" y="165" width="76" height="40" rx="3" fill="#cbe8f2"/>';
  s+='<g class="om-email-ping" transform="translate(252,150)"><text font-size="16" text-anchor="middle">🎣</text></g>';
  s+='<text x="226" y="214" font-size="7" text-anchor="middle" fill="#ff8a8a">'+(pt?"Portal falso":"Fake portal")+'</text>';
  /* credenciais */
  s+='<rect x="302" y="162" width="72" height="56" rx="4" fill="#2d4060"/>';
  s+='<rect x="312" y="172" width="52" height="8" rx="2" fill="#ff4d4f"/><rect x="312" y="184" width="52" height="8" rx="2" fill="#8aa4ad"/>';
  s+='<text x="338" y="206" font-size="8" text-anchor="middle" fill="#eaf2f6">🔑</text>';
  /* pelotização */
  s+='<rect x="402" y="170" width="80" height="50" rx="3" fill="#55636c"/>';
  s+='<circle cx="442" cy="188" r="14" fill="#8a6746"/><g class="cm-smoke" fill="rgba(255,255,255,.4)"><circle cx="448" cy="162" r="5"/></g>';
  /* correia */
  s+='<line x1="482" y1="198" x2="578" y2="188" stroke="#2b3438" stroke-width="8"/>';
  s+='<line class="cmap-belt" x1="482" y1="198" x2="578" y2="188" stroke="#e0aa43" stroke-width="3.5"/>';
  /* píer */
  s+='<rect x="598" y="228" width="80" height="10" fill="#455055"/>';
  s+='<line x1="618" y1="228" x2="618" y2="188" stroke="#5b6b73" stroke-width="5"/>';
  s+='<line class="cmap-belt" x1="622" y1="220" x2="668" y2="204" stroke="#e0aa43" stroke-width="3"/>';
  /* navio */
  s+='<g class="cm-ship" transform="translate(700,218)"><path d="M0,0 L80,0 L72,20 L8,20 Z" fill="#b23b32"/><rect x="12" y="-10" width="48" height="10" fill="#7a4f28"/><rect x="54" y="-20" width="14" height="12" fill="#eef3f5"/></g>';
  /* parceiros alertados */
  s+='<rect x="818" y="158" width="88" height="62" rx="4" fill="#0a2a32" stroke="#007E7A"/>';
  s+='<text x="862" y="188" font-size="9" text-anchor="middle" fill="#eaf2f6">'+(pt?"Parceiros":"Partners")+'</text>';
  s+='<text x="862" y="206" font-size="14" text-anchor="middle">📡</text>';
  s+='<rect x="918" y="162" width="68" height="56" rx="4" fill="rgba(47,191,113,.15)" stroke="#2fbf71"/>';
  s+='<text x="952" y="196" font-size="14" text-anchor="middle">✅</text>';
  return s;
}
function bossMapLeakScene(sfx,lang){
  var pt=lang!=="en";
  var s=bossMapBanner(sfx,lang,"VAZAMENTO — CADEIA CARAJÁS → CHINA","DATA LEAK — CARAJÁS → CHINA CHAIN");
  s+=bossMapGround(sfx,68);
  s+='<polygon points="0,300 40,180 130,190 200,300" fill="#6f5137" opacity=".85"/>';
  s+='<text x="90" y="168" font-size="9" text-anchor="middle" fill="rgba(255,255,255,.8)" font-weight="700">⛏️ CARAJÁS</text>';
  s+='<rect x="792" y="196" width="208" height="104" fill="url(#bmSea'+sfx+')"/>';
  s+='<text x="900" y="230" font-size="11" text-anchor="middle" fill="#fff" font-weight="700">🇨🇳 CLIENTE</text>';
  /* planilha */
  s+='<rect x="48" y="168" width="64" height="48" rx="4" fill="#2d4060" stroke="#EDB111"/>';
  s+='<rect x="56" y="176" width="12" height="10" fill="#2fbf71"/><rect x="72" y="176" width="12" height="10" fill="#ff4d4f"/><rect x="88" y="176" width="12" height="10" fill="#EDB111"/>';
  s+='<text x="80" y="206" font-size="14" text-anchor="middle">📊</text>';
  /* e-mail errado */
  s+='<g class="om-email-ping" transform="translate(168,158)"><rect x="-18" y="-14" width="36" height="22" rx="4" fill="#ff4d4f"/><text x="0" y="2" font-size="12" text-anchor="middle">📧</text></g>';
  s+='<path class="om-data-flow" d="M112,192 Q200,140 288,192" fill="none" stroke="#ff4d4f" stroke-width="3" stroke-dasharray="8 5"/>';
  s+='<rect x="268" y="168" width="88" height="52" rx="4" fill="#1a2840" stroke="#ff4d4f" stroke-width="2"/>';
  s+='<text x="312" y="192" font-size="8" text-anchor="middle" fill="#ff6b6b" font-weight="700">'+(pt?"DESTINO ERRADO":"WRONG RECIPIENT")+'</text>';
  s+='<text x="312" y="208" font-size="14" text-anchor="middle">⚠️</text>';
  /* DLP */
  s+='<rect x="388" y="152" width="96" height="72" rx="5" fill="#0a2a32" stroke="#2fbf71" stroke-width="2"/>';
  s+='<text x="436" y="182" font-size="11" text-anchor="middle" fill="#2fbf71" font-weight="800">DLP</text>';
  s+='<rect x="400" y="192" width="72" height="22" rx="3" fill="#1a3a45"/><circle class="om-cloud-pulse" cx="460" cy="203" r="4" fill="#2fbf71"/>';
  /* classificação */
  s+='<rect x="508" y="160" width="80" height="60" rx="4" fill="#2d4060" stroke="#EDB111"/>';
  s+='<text x="548" y="188" font-size="10" text-anchor="middle" fill="#EDB111">'+(pt?"CONFIDENCIAL":"CONFIDENTIAL")+'</text>';
  s+='<text x="548" y="208" font-size="14" text-anchor="middle">🔒</text>';
  /* trem / logística */
  s+='<line x1="600" y1="262" x2="720" y2="252" stroke="#3a464c" stroke-width="4"/>';
  s+='<g class="cm-train" transform="translate(608,248)"><rect x="0" y="-12" width="24" height="14" rx="2" fill="#0f6e6a"/><circle cx="8" cy="2" r="3" fill="#15181a"/><circle cx="18" cy="2" r="3" fill="#15181a"/></g>';
  /* porto */
  s+='<rect x="728" y="232" width="56" height="8" fill="#455055"/><line x1="748" y1="232" x2="748" y2="196" stroke="#5b6b73" stroke-width="4"/>';
  s+='<g class="cm-ship" transform="translate(792,224)"><path d="M0,0 L56,0 L50,16 L6,16 Z" fill="#8b2942"/></g>';
  /* LGPD */
  s+='<rect x="848" y="156" width="88" height="64" rx="4" fill="#1a2840" stroke="#007E7A"/>';
  s+='<text x="892" y="186" font-size="9" text-anchor="middle" fill="#eaf2f6">'+(pt?"Privacidade":"Privacy")+'</text>';
  s+='<text x="892" y="206" font-size="14" text-anchor="middle">📜</text>';
  s+='<path class="om-data-flow" d="M112,198 L268,190 L388,186 L508,182 L628,188 L748,194 L892,188" fill="none" stroke="rgba(237,177,17,.35)" stroke-width="2" stroke-dasharray="6 4"/>';
  return s;
}
function bossMapPortScene(sfx,lang){
  var pt=lang!=="en";
  var s=bossMapBanner(sfx,lang,"PONTA DA MADEIRA — PORTO & SCADA","PONTA DA MADEIRA — PORT & SCADA");
  s+='<circle cx="820" cy="44" r="20" fill="#ffe08a" opacity=".7"/>';
  s+='<g fill="#fff" opacity=".55"><ellipse cx="400" cy="42" rx="28" ry="11"/></g>';
  s+=bossMapGround(sfx,68);
  s+='<rect x="620" y="200" width="380" height="100" fill="url(#bmSea'+sfx+')"/>';
  s+='<path class="cmap-wave" d="M620,218 Q700,210 780,218 T940,218" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="2"/>';
  s+='<text x="820" y="248" font-size="10" text-anchor="middle" fill="rgba(255,255,255,.85)" font-weight="700">ATLÂNTICO</text>';
  /* píer principal */
  s+='<rect x="24" y="228" width="200" height="12" fill="#455055"/>';
  s+='<line x1="68" y1="228" x2="68" y2="148" stroke="#5b6b73" stroke-width="6"/>';
  s+='<line x1="148" y1="228" x2="148" y2="158" stroke="#5b6b73" stroke-width="5"/>';
  s+='<line class="cmap-belt" x1="72" y1="218" x2="148" y2="198" stroke="#e0aa43" stroke-width="3.5"/>';
  /* estoque minério */
  s+='<polygon points="200,244 240,204 280,244" fill="#7a5a3a"/><polygon points="268,244 304,212 340,244" fill="#8a6844"/>';
  /* navio atracado */
  s+='<g transform="translate(360,222)"><path d="M0,0 L90,0 L82,22 L8,22 Z" fill="#b23b32" stroke="#7d271f"/><rect x="14" y="-12" width="52" height="12" fill="#7a4f28"/><rect x="62" y="-22" width="16" height="14" fill="#eef3f5"/></g>';
  /* técnico sem crachá */
  s+='<g transform="translate(248,188)"><circle cx="0" cy="0" r="14" fill="#4a5568"/><text x="0" y="5" font-size="12" text-anchor="middle">👷</text><circle class="boss-visual-pulse" cx="14" cy="-10" r="7" fill="#ff4d4f" opacity=".8"/><text x="14" y="-6" font-size="8" text-anchor="middle" fill="#fff">!</text></g>';
  /* catraca */
  s+='<rect x="468" y="168" width="64" height="58" rx="4" fill="#3d4f58" stroke="#ff4d4f"/>';
  s+='<rect x="488" y="182" width="24" height="32" rx="2" fill="#2d3740"/><text x="500" y="214" font-size="10" text-anchor="middle">🚪</text>';
  /* SCADA sala */
  s+='<rect x="556" y="142" width="108" height="80" rx="5" fill="#0a2a32" stroke="#007E7A" stroke-width="2"/>';
  s+='<rect x="568" y="152" width="32" height="24" rx="2" fill="#1a3a45"/><rect x="604" y="152" width="32" height="24" rx="2" fill="#1a3a45"/><rect x="640" y="152" width="18" height="24" rx="2" fill="#ff4d4f" opacity=".55"/>';
  s+='<text x="610" y="206" font-size="9" text-anchor="middle" fill="#eaf2f6" font-weight="700">SCADA</text>';
  /* shiploader */
  s+='<line x1="680" y1="228" x2="680" y2="172" stroke="#5b6b73" stroke-width="5"/>';
  s+='<line x1="680" y1="176" x2="748" y2="176" stroke="#5b6b73" stroke-width="4"/>';
  s+='<line class="cmap-belt" x1="684" y1="220" x2="740" y2="200" stroke="#e0aa43" stroke-width="3"/>';
  /* auditoria */
  s+='<rect x="768" y="158" width="88" height="62" rx="4" fill="#2d4060" stroke="#EDB111"/>';
  s+='<text x="812" y="188" font-size="10" text-anchor="middle" fill="#EDB111">'+(pt?"AUDITORIA":"AUDIT")+'</text>';
  s+='<text x="812" y="206" font-size="14" text-anchor="middle">📋</text>';
  /* resiliência */
  s+='<rect x="872" y="152" width="100" height="68" rx="5" fill="rgba(47,191,113,.12)" stroke="#2fbf71" stroke-width="2"/>';
  s+='<text x="922" y="182" font-size="10" text-anchor="middle" fill="#2fbf71" font-weight="700">'+(pt?"RESILIÊNCIA":"RESILIENCE")+'</text>';
  s+='<text x="922" y="204" font-size="16" text-anchor="middle">🛡️</text>';
  return s;
}
function bossMapSceneContent(id,sfx,lang){
  if(id==="carajas"&&typeof window.__gdvCmapScene==="function") return window.__gdvCmapScene().replace(/id="cmSky"/g,'id="bmSky'+sfx+'"').replace(/url\(#cmSky\)/g,"url(#bmSky"+sfx+")")
    .replace(/id="cmGround"/g,'id="bmGround'+sfx+'"').replace(/url\(#cmGround\)/g,"url(#bmGround"+sfx+")")
    .replace(/id="cmSea"/g,'id="bmSea'+sfx+'"').replace(/url\(#cmSea\)/g,"url(#bmSea"+sfx+")");
  if(id==="office"&&typeof window.__gdvOffmapScene==="function") return window.__gdvOffmapScene(sfx).replace(/id="omSky/g,'id="bmSky').replace(/url\(#omSky/g,"url(#bmSky").replace(/id="omFloor/g,'id="bmGround').replace(/url\(#omFloor/g,"url(#bmGround").replace(/id="omShield/g,'id="bmGold').replace(/url\(#omShield/g,"url(#bmGold");
  if(id==="ceo") return bossMapCeoScene(sfx,lang);
  if(id==="otintr") return bossMapOtScene(sfx,lang);
  if(id==="omphish") return bossMapOmphishScene(sfx,lang);
  if(id==="leakchain") return bossMapLeakScene(sfx,lang);
  if(id==="portintr") return bossMapPortScene(sfx,lang);
  return bossMapCeoScene(sfx,lang);
}
function bossMapPinLabel(ch,st,ph,i,lang){
  if(ch&&ch.stages&&ch.stages[i]&&ch.stages[i].name){
    var nm=ch.stages[i].name[lang]||ch.stages[i].name.pt||"";
    return nm.length>18?nm.slice(0,17)+"…":nm;
  }
  if(ph&&ph.scene){
    var sc=(ph.scene[lang]||ph.scene.pt||"").replace(/^(Cena|Scene)\s+\d+\s*[—–-]\s*/i,"");
    return sc.length>18?sc.slice(0,17)+"…":sc;
  }
  return (lang==="en"?"Scene ":"Cena ")+(i+1);
}
function renderBossMapSvg(boss,active,phaseStates,lang){
  if(!boss||!boss.phases||!boss.phases.length) return {svg:"",theme:"finance"};
  var sceneId=bossMapSceneId(boss);
  var theme=bossMapTheme(sceneId);
  var sfx="M"+(boss.id||"x");
  var n=boss.phases.length;
  var route=bossMapRoute(sceneId,n);
  var label=bossMapLabel(sceneId,lang);
  var pinFn=function(i){ return route[i]?{x:route[i][0],y:route[i][1]}:bossRoutePoint(route,i/(n>1?n-1:1)); };
  var svg='<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid meet" width="100%" role="img" aria-label="'+(boss.name&&boss.name[lang]?boss.name[lang]:"")+'">';
  svg+='<defs>'+bossMapDefs(sfx,theme)+'</defs>';
  svg+=bossMapSceneContent(sceneId,sfx,lang);
  var d="M"+route.map(function(p){return p[0]+","+p[1];}).join(" L");
  svg+='<path d="'+d+'" fill="none" stroke="#EDB111" stroke-width="3" stroke-dasharray="7 6" opacity=".9"/>';
  svg+='<g transform="translate(20,268)"><rect x="0" y="0" width="'+Math.min(520,Math.max(200,label.length*7))+'" height="22" rx="11" fill="rgba(6,24,32,.82)"/><text x="12" y="15" font-size="11" fill="#EDB111" font-weight="700">'+label+'</text></g>';
  var firstBad=-1,i;
  for(i=0;i<n;i++){ var pst=phaseStates&&phaseStates[i]; if(pst&&pst.ok===false){ firstBad=i; break; } }
  if(firstBad>=0){
    var bpts=[]; for(i=firstBad;i<n;i++){ var bp=pinFn(i); bpts.push(bp.x+","+bp.y); }
    svg+='<polyline class="cmap-breach" points="'+bpts.join(" ")+'" fill="none" stroke="#ff4d4f" stroke-width="5" stroke-dasharray="11 8" opacity=".95"/>';
  }
  var ch=typeof window.__gdvChainById==="function"&&boss.chainId?window.__gdvChainById(boss.chainId):null;
  for(i=0;i<n;i++){
    var pt=pinFn(i), pst=phaseStates&&phaseStates[i], ph=boss.phases[i];
    var done=!!pst, bad=done&&!pst.ok, on=i===active;
    var fill=bad?"#ff4d4f":done?"#2fbf71":(on?"#EDB111":"#8aa4ad");
    var pinTxt=(ch&&ch.stages&&ch.stages[i]?ch.stages[i].ico:(bad?"!":(done?"✔":(i+1))));
    var pinLbl=bossMapPinLabel(ch,ch&&ch.stages?ch.stages[i]:null,ph,i,lang);
    svg+='<g class="cmap-pin'+(bad?" compromised":(done?" done":""))+(on?" active":"")+'" transform="translate('+pt.x.toFixed(1)+','+pt.y.toFixed(1)+')">';
    if(on) svg+='<circle class="cmap-pin-halo boss-visual-pulse" r="22" fill="'+fill+'" opacity=".35"/>';
    else svg+='<circle class="cmap-pin-halo" r="17" fill="'+fill+'" opacity=".22"/>';
    svg+='<circle class="cmap-pin-dot" r="13" fill="'+fill+'" stroke="#04141b" stroke-width="1.5"/>';
    svg+='<text y="5" font-size="'+(String(pinTxt).length>2?"10":"13")+'" text-anchor="middle" font-weight="800" fill="#04141b">'+pinTxt+'</text>';
    svg+='<g class="cmap-pin-label"><rect x="-54" y="-40" width="108" height="18" rx="9" fill="rgba(6,24,32,.9)"/><text y="-27" font-size="10" text-anchor="middle" fill="#eaf2f6">'+pinLbl+'</text></g></g>';
  }
  var curLbl="";
  if(ch&&ch.stages&&ch.stages[active]&&ch.stages[active].name) curLbl=ch.stages[active].name[lang]||ch.stages[active].name.pt||"";
  else if(boss.phases[active]&&boss.phases[active].scene) curLbl=boss.phases[active].scene[lang]||boss.phases[active].scene.pt||"";
  if(curLbl) svg+='<g transform="translate(20,12)"><rect width="460" height="24" rx="8" fill="rgba(6,24,32,.88)"/><text x="12" y="16" font-size="12" fill="#eaf2f6" font-weight="700">'+(lang==="en"?"Current situation: ":"Situação atual: ")+curLbl+'</text></g>';
  svg+='</svg>';
  return {svg:svg,theme:theme};
}
