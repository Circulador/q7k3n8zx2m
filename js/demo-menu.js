/* Menu demo temporário — testar jornada integrada 0→100% */
(function(){
"use strict";

var api=null;

function $(id){ return document.getElementById(id); }
function pt(en, pt){ return (api&&api.lang&&api.lang()==="en")?en:pt; }

function closeDemoMenu(){
  var sheet=$("demoMenuSheet"), btn=$("demoMenuBtn");
  if(sheet) sheet.hidden=true;
  if(btn) btn.setAttribute("aria-expanded","false");
  document.body.classList.remove("demo-menu-open");
}

function openDemoMenu(){
  if(!api){ toast(pt("Game not ready","Jogo ainda carregando")); return; }
  api.closeOverlays&&api.closeOverlays();
  var sheet=$("demoMenuSheet"), btn=$("demoMenuBtn");
  if(sheet) sheet.hidden=false;
  if(btn) btn.setAttribute("aria-expanded","true");
  document.body.classList.add("demo-menu-open");
  renderDemoStatus();
}

function toast(msg){
  if(api&&api.toast) api.toast(msg);
  else try{ console.log(msg); }catch(e){}
}

function renderDemoStatus(){
  var host=$("demoStatus");
  if(!host||!api) return;
  var S=api.getState();
  var ns=api.computeNextStep();
  var countries=api.countryIds().length;
  var done=Object.keys(S.done||{}).length;
  var bosses=api.bossCompletedCount();
  var bossTot=api.bossesCount();
  var wp=(S.weekly&&S.weekly.prog)||{};
  var daily=!!(S.daily&&S.daily.done&&S.daily.done.mission);
  var setup=!!(S.team&&S.role);
  var pct=api.progressPct();
  host.innerHTML=
    '<div class="demo-status-pct">'+pct+'% '+pt("complete","concluído")+'</div>'+
    '<p class="demo-status-note">'+pt("Onboarding + profile ≈ 2% — real progress comes from map, missions and crises.","Onboarding + perfil ≈ 2% — progresso real vem do mapa, missões e crises.")+'</p>'+
    '<ul class="demo-status-list">'+
    '<li>'+(S.onboardingDone?"✅":"⬜")+' '+pt("Onboarding","Onboarding")+'</li>'+
    '<li>'+(setup?"✅":"⬜")+' '+pt("Team & role","Equipe e papel")+'</li>'+
    '<li>'+(daily?"✅":"⬜")+' '+pt("Daily mission","Missão diária")+'</li>'+
    '<li>📅 '+pt("Weekly","Semanal")+': '+(wp.correct||0)+'/20 · '+(wp.campaign||0)+'/3 · '+(wp.boss||0)+'/1</li>'+
    '<li>🗺️ '+done+'/'+countries+' '+pt("countries","países")+'</li>'+
    '<li>🎯 '+bosses+'/'+bossTot+' '+pt("crises","crises")+'</li>'+
    '<li>🔥 '+(S.streak&&S.streak.count||0)+' · ⭐ '+(S.xp||0)+' XP · 🪙 '+(S.coins||0)+' · 🏅 '+(api.medalsEarned?api.medalsEarned():0)+'/16</li>'+
    '<li>▶️ '+pt("Next step","Próximo passo")+': <strong>'+(ns.title||"—")+'</strong></li>'+
    '</ul>';
}

function setCountries(n, score){
  var S=api.getState();
  var ids=api.countryIds(), i;
  S.done={};
  for(i=0;i<Math.min(n,ids.length);i++) S.done[ids[i]]=score;
}

function setBosses(n, index, opts){
  var S=api.getState();
  var ids=api.bossIds(), i, m;
  opts=opts||{};
  var uniform=!!opts.uniform;
  S.bossStats={};
  S.bossDone={};
  for(i=0;i<Math.min(n,ids.length);i++){
    var idx=uniform?index:Math.min(100,index+(i*3));
    m=api.bossMetrics(idx);
    api.bossSaveRun(ids[i],m);
  }
}

function applyPreset(pct){
  if(!api) return;
  var S=api.getState();
  var lang=S.lang;
  var base=api.getDef();
  var ids=api.countryIds();
  var nCountries=ids.length;
  var nBosses=api.bossesCount();

  Object.keys(base).forEach(function(k){ S[k]=JSON.parse(JSON.stringify(base[k])); });
  S.lang=lang;
  S.onboardingDone=true;
  S.team="mina";
  S.role="admin";
  S.name=pt("Demo Tester","Testador Demo");
  S.tipsSeen={map:true,daily:true,boss:true};
  S.heroExpanded=false;
  api.ensureDaily();
  api.ensureWeekly();

  if(pct===0){
    S.onboardingDone=false;
    S.team="";
    S.role="";
    S.name="";
    S.xp=0;
    S.coins=0;
    S.done={};
    S.bossStats={};
    S.bossDone={};
    S.streak={count:0,lastDate:"",best:0};
    S.daily.done={};
    S.weekly.prog={};
  } else if(pct===25){
    S.xp=api.xpForLevel?api.xpForLevel(3):200; S.coins=20;
    setCountries(Math.max(2,Math.round(nCountries*0.15)),100);
    S.streak={count:1,lastDate:"",best:1};
    S.daily.done={};
    S.weekly.prog={correct:5,campaign:0,boss:0,theme:2};
    api.fillThemeStats&&api.fillThemeStats(40);
  } else if(pct===50){
    S.xp=api.xpForLevel?api.xpForLevel(5):560; S.coins=90;
    setCountries(Math.round(nCountries*0.5),100);
    setBosses(1,62);
    S.streak={count:5,lastDate:api.todayKey(),best:5};
    S.daily.done.mission=true;
    S.dailyTotal=2;
    S.weekly.prog={correct:12,campaign:1,boss:0,theme:4};
    api.fillThemeStats&&api.fillThemeStats(60);
  } else if(pct===75){
    S.xp=api.xpForLevel?api.xpForLevel(8):1400; S.coins=220;
    setCountries(Math.round(nCountries*0.78),100);
    setBosses(Math.min(4,nBosses),78);
    S.streak={count:14,lastDate:api.todayKey(),best:14};
    S.daily.done.mission=true;
    S.dailyTotal=8;
    S.weekly.prog={correct:18,campaign:3,boss:0,theme:6};
    S.managerMode=true;
    api.fillThemeStats&&api.fillThemeStats(80);
    api.seedGlossary&&api.seedGlossary(["2fa","accessctrl","antivirus","apt","backup"],2);
    var ch=api.chainById&&api.chainById("carajas");
    if(ch&&ch.stages){
      var si;
      for(si=0;si<Math.min(4,ch.stages.length);si++)
        S.chainDone["carajas__"+ch.stages[si].id]=100;
    }
  } else if(pct===100){
    S.xp=api.xpForMaxLevel?api.xpForMaxLevel():2600; S.coins=500; S.score=1200;
    setCountries(nCountries,100);
    setBosses(nBosses,100,{uniform:true});
    S.streak={count:30,lastDate:api.todayKey(),best:30};
    S.daily.done.mission=true;
    S.dailyTotal=15;
    S.weekly.prog={correct:20,campaign:3,boss:1,theme:8};
    S.managerMode=true;
    S.reports=5;
    api.fillThemeStats&&api.fillThemeStats(100);
    api.seedGlossary&&api.seedGlossary(["2fa","accessctrl","antivirus","apt","backup"],3);
    if(api.chainById){
      var ch2=api.chainById("carajas");
      if(ch2&&ch2.stages){
        var sj;
        for(sj=0;sj<ch2.stages.length;sj++)
          S.chainDone["carajas__"+ch2.stages[sj].id]=100;
      }
    }
    S.medals={};
    api.checkMedals();
  }

  api.save();
  api.refreshAll();
  renderDemoStatus();
  toast(pt("Preset "+pct+"% applied","Preset "+pct+"% aplicado"));
}

function bindDemoMenu(){
  var sheet=$("demoMenuSheet");
  if(!sheet) return;

  $("demoMenuBtn")&&$("demoMenuBtn").addEventListener("click",function(e){
    e.stopPropagation();
    if(sheet.hidden) openDemoMenu(); else closeDemoMenu();
  });
  var demoBtn=$("demoMenuBtn");
  if(demoBtn){
    var lastTap=0;
    demoBtn.addEventListener("touchend",function(ev){
      var now=Date.now();
      if(now-lastTap<400) return;
      lastTap=now;
      ev.preventDefault();
      ev.stopPropagation();
      if(sheet.hidden) openDemoMenu(); else closeDemoMenu();
    },{passive:false});
  }
  $("settingsOpenDemoBtn")&&$("settingsOpenDemoBtn").addEventListener("click",function(e){
    e.stopPropagation();
    if(api&&api.toggleSettingsMenu) api.toggleSettingsMenu(false);
    openDemoMenu();
  });
  $("demoMenuClose")&&$("demoMenuClose").addEventListener("click",closeDemoMenu);
  $("demoMenuBackdrop")&&$("demoMenuBackdrop").addEventListener("click",closeDemoMenu);
  $("demoRefreshBtn")&&$("demoRefreshBtn").addEventListener("click",function(){
    api&&api.refreshAll();
    renderDemoStatus();
  });
  $("demoResetBtn")&&$("demoResetBtn").addEventListener("click",function(){
    if(!confirm(pt("Clear all progress and reload?","Zerar todo progresso e recarregar?"))) return;
    try{ localStorage.removeItem(api.storeKey); }catch(e){}
    location.reload();
  });

  document.querySelectorAll(".demo-preset-btn").forEach(function(b){
    b.addEventListener("click",function(){ applyPreset(parseInt(b.getAttribute("data-preset"),10)); });
  });

  var stateHost=$("demoStateActions");
  if(stateHost){
    [
      {k:"daily-done",l:"✅ Diária feita",fn:function(){ api.ensureDaily(); api.getState().daily.done.mission=true; api.save(); api.refreshAll(); renderDemoStatus(); }},
      {k:"daily-pend",l:"📅 Diária pendente",fn:function(){ api.ensureDaily(); api.getState().daily.done={}; api.save(); api.refreshAll(); renderDemoStatus(); }},
      {k:"week-bump",l:"🏆 Completar semana",fn:function(){ var S=api.getState(); api.ensureWeekly(); S.weekly.prog={correct:20,campaign:3,boss:1,theme:8}; api.save(); api.refreshAll(); renderDemoStatus(); }},
      {k:"week-zero",l:"↺ Zerar semana",fn:function(){ api.ensureWeekly(); api.getState().weekly.prog={}; api.save(); api.refreshAll(); renderDemoStatus(); }},
      {k:"camp-3",l:"🗺️ +3 campanhas",fn:function(){ api.bumpWeekly("campaign",3); renderDemoStatus(); }},
      {k:"boss-1",l:"🎯 +1 crise",fn:function(){ setBosses(Math.min(api.bossCompletedCount()+1,api.bossesCount()),70); api.bumpWeekly("boss",1); api.refreshAll(); renderDemoStatus(); }},
      {k:"coins",l:"🪙 +200 moedas",fn:function(){ api.getState().coins=(api.getState().coins||0)+200; api.save(); api.refreshAll(); renderDemoStatus(); }},
      {k:"mgr",l:"🧭 Gestor on/off",fn:function(){ var S=api.getState(); S.managerMode=!S.managerMode; api.save(); api.refreshAll(); renderDemoStatus(); }}
    ].forEach(function(act){
      var btn=document.createElement("button");
      btn.type="button";
      btn.className="demo-chip-btn";
      btn.textContent=act.l;
      btn.addEventListener("click",act.fn);
      stateHost.appendChild(btn);
    });
  }

  var navHost=$("demoNavGrid");
  if(navHost&&api&&api.nav){
    [
      {k:"home",l:"🏠 Início"},
      {k:"map",l:"🗺️ Mapa"},
      {k:"daily",l:"📅 Missões"},
      {k:"boss",l:"🎯 Crises"},
      {k:"profile",l:"📊 Eu"},
      {k:"shop",l:"🛒 Loja"},
      {k:"setup",l:"⚙️ Setup"},
      {k:"manager",l:"🧭 Gestor"},
      {k:"review",l:"📚 Revisão"}
    ].forEach(function(item){
      var btn=document.createElement("button");
      btn.type="button";
      btn.className="demo-nav-btn";
      btn.textContent=item.l;
      btn.addEventListener("click",function(){
        closeDemoMenu();
        if(api.nav[item.k]) api.nav[item.k]();
      });
      navHost.appendChild(btn);
    });
  }

  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"&&sheet&&!sheet.hidden) closeDemoMenu();
  });
}

window.initDemoMenu=function(demoApi){
  api=demoApi;
  bindDemoMenu();
};

if(window.gdvDemoApi) window.initDemoMenu(window.gdvDemoApi);

})();
