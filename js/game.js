/* Guardião Cibernético — Orbita
   Jogo bilíngue (PT/EN) · mapa D3 em orbita-world-map.js */
(function(){
"use strict";

/* Ponte global para onclick — confiável no Android (mesmo padrão da barra inferior) */
window.gdvNavClick=function(id,e){ if(window.__gdvRunNav) window.__gdvRunNav(id,e||null); };
window.gdvStartBoss=function(id,e){
  if(e&&e.preventDefault) e.preventDefault();
  if(e&&e.stopPropagation) e.stopPropagation();
  if(window.__gdvStartBoss) window.__gdvStartBoss(id);
};

/* -------------------- ESTADO / STATE -------------------- */
var STORE_KEY = "guardiao_orbita_v7";
var DEF = { lang:"pt", name:"", team:"mina", role:"field",
  dailyTotal:0,
  xp:0, coins:0, score:0, lives:3, avatar:"🛡️", resilience:100,
  a11y:{voice:false, contrast:false, large:false, motion:false, signs:false, fontScale:0, links:false, spacing:false, letterSpace:false, dyslexia:false, colorblind:"none", readingMode:false},
  done:{}, themeStats:{}, medals:{}, owned:{}, equipped:{avatar:"🛡️",frame:"default",skin:"default"},
  bossDone:{}, bossStats:{}, onboardingDone:false, daily:{date:"",done:{}}, weekly:{week:"",prog:{}}, teamScores:{},
  chainDone:{}, streak:{count:0,lastDate:"",best:0}, missed:{}, reports:0, managerMode:false, focusLearn:false, simpleUi:true, theme:"default", tipsSeen:{map:false,daily:false,boss:false}, glossaryFavs:[], glossaryLearned:{}, glossaryReview:[], glossaryReviewMeta:{}, glossaryLearnedXp:{}, glossaryQuizDone:0, offlineHintSeen:false, heroExpanded:false, uxV122:false };
var S = merge(load(), DEF);
function ensureValidProfile(){ if(typeof PROFILE!=="undefined") PROFILE.ensureState(S); }
ensureValidProfile();

function merge(a,b){ a=a||{}; for(var k in b){ if(a[k]===undefined) a[k]=b[k]; else if(b[k]&&typeof b[k]==="object"&&!Array.isArray(b[k])) a[k]=merge(a[k],b[k]); } return a; }
function ensureManagerMode(){ if(S.managerMode===undefined) S.managerMode=false; if(S.focusLearn===undefined) S.focusLearn=false; if(S.simpleUi===undefined) S.simpleUi=true; if(!S.theme) S.theme="default"; }
function load(){ try{ return JSON.parse(localStorage.getItem(STORE_KEY)); }catch(e){ return null; } }
function save(){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(S)); }catch(e){} }
function $(id){ return document.getElementById(id); }
function L(){ return S.lang; }
function tt(o){ return o? (o[L()]!==undefined?o[L()]:o.pt) : ""; }

/* -------------------- i18n (UI) -------------------- */
var UI = {
  "brand.main":{pt:"Guardião Cibernético",en:"Cyber Guardian"},
  "brand.sub":{pt:"Segurança digital",en:"Digital security"},
  "home.badge":{pt:"Treinamento de Segurança Digital · ~5 min/dia",en:"Digital Security Training · ~5 min/day"},
  "home.shortDesc":{pt:"Treinamento de cyber security em ~5 min/dia — um botão na Início guia seu próximo passo.",en:"Cyber security training in ~5 min/day — one Home button guides your next step."},
  "home.howTitle":{pt:"Como funciona",en:"How it works"},
  "home.howDaily":{pt:"Atividade de hoje",en:"Today's activity"},
  "home.howMap":{pt:"Jornada no mapa",en:"Map journey"},
  "home.howCrisis":{pt:"Simulação de crise",en:"Crisis simulation"},
  "home.nextPreview":{pt:"Depois disso: {next}",en:"Up next: {next}"},
  "home.weekRemPrefix":{pt:"Para fechar a semana: ",en:"To finish the week: "},
  "home.weekRemCorrect":{pt:"faltam {n} acertos",en:"{n} more correct answers"},
  "home.weekRemCampaign":{pt:"faltam {n} jornadas no mapa",en:"{n} more map journeys"},
  "home.weekRemBoss":{pt:"falta {n} simulação de crise",en:"{n} crisis simulation left"},
  "home.weekRemTheme":{pt:"faltam {n} do tema da semana",en:"{n} more on the week theme"},
  "home.weekRemDone":{pt:"✅ Metas da semana concluídas — continue evoluindo!",en:"✅ Weekly goals done — keep improving!"},
  "home.weekGoalsCount":{pt:"Semana: {done}/{total} metas",en:"Week: {done}/{total} goals"},
  "home.weekNextUnlock":{pt:"Próximo: {goal} → +40 XP",en:"Next: {goal} → +40 XP"},
  "home.weekNextDaily":{pt:"complete a atividade de hoje",en:"complete today's activity"},
  "home.weekNextMap":{pt:"{n} jornada(s) no mapa",en:"{n} map journey(s)"},
  "home.weekNextBoss":{pt:"1 simulação de crise",en:"1 crisis simulation"},
  "home.weekNextTheme":{pt:"{n} do tema da semana",en:"{n} on the week theme"},
  "home.weekNextCorrect":{pt:"{n} acertos",en:"{n} correct answers"},
  "home.weekMicroPrefix":{pt:"Próxima meta:",en:"Next goal:"},
  "home.ctaHintDaily":{pt:"+50 XP · ~5 min · mantém sequência",en:"+50 XP · ~5 min · keeps streak"},
  "home.ctaHintMap":{pt:"+XP · avança na meta semanal",en:"+XP · advances weekly goal"},
  "home.ctaHintBoss":{pt:"+XP · eleva maturidade",en:"+XP · raises maturity"},
  "home.ctaHintReview":{pt:"~3 min · reforça aprendizado",en:"~3 min · reinforces learning"},
  "home.nextAchK":{pt:"Próxima conquista",en:"Next achievement"},
  "home.nextAchLeft":{pt:"Faltam {n}",en:"{n} to go"},
  "home.teamSocial":{pt:"🛡️ Sua área ({team}): {n} guardiões treinaram hoje",en:"🛡️ Your area ({team}): {n} guardians trained today"},
  "home.firstSessionTitle":{pt:"🎉 Primeira atividade concluída!",en:"🎉 First activity complete!"},
  "home.firstSessionSub":{pt:"Sequência iniciada · +50 XP · medalha “Missão diária” a caminho",en:"Streak started · +50 XP · “Daily mission” medal on the way"},
  "streak.start":{pt:"🔥 Comece sua sequência hoje — 5 min bastam",en:"🔥 Start your streak today — 5 min is enough"},
  "streak.dayOne":{pt:"🔥 Dia 1 — 5 minutos bastam para começar sua sequência",en:"🔥 Day 1 — 5 minutes to start your streak"},
  "home.nextDaily":{pt:"Sua atividade de hoje está esperando",en:"Today's activity is waiting"},
  "home.nextDailySub":{pt:"5 situações rápidas · ~5 min · prioriza seus erros",en:"5 quick scenarios · ~5 min · prioritizes mistakes"},
  "home.nextReviewSub":{pt:"Você tem {n} revisões do que errou prontas para hoje.",en:"You have {n} mistake reviews ready for today."},
  "missions.focusTitle":{pt:"Seu foco agora",en:"Your focus now"},
  "missions.focusDaily":{pt:"1º — Atividade de hoje (~5 min)",en:"1st — Today's activity (~5 min)"},
  "missions.focusMap":{pt:"2º — Jornada no mapa",en:"2nd — Map journey"},
  "missions.focusOrder":{pt:"3º — Simulações de crise (quando tiver tempo)",en:"3rd — Crisis simulations (when you have time)"},
  "missions.alsoTitle":{pt:"Também conta para suas metas",en:"Also counts toward your goals"},
  "missions.alsoCrisis":{pt:"Simulações de crise avançadas → aba Desafios / Crises",en:"Advanced crisis simulations → Challenges / Crises tab"},
  "settings.uxV122":{pt:"Interface clássica (v122)",en:"Classic interface (v122)"},
  "settings.uxV122Sub":{pt:"Volta ao visual e textos da versão v122 (Início e Missões). Também use ?ux=122 na URL.",en:"Restores v122 look and copy (Home & Missions). You can also use ?ux=122 in the URL."},
  "settings.uxV122On":{pt:"Interface v122 ativa — desative em Configurações para ver a nova UX.",en:"v122 interface active — turn off in Settings to see the new UX."},
  "home.title":{pt:'Você é o <span class="accent">Guardião Digital</span>',en:'You are the <span class="accent">Digital Guardian</span>'},
  "home.desc":{pt:"Sua missão é proteger as operações da organização em todo o mundo por meio de decisões seguras no ambiente digital.",en:"Your mission is to protect the organization's operations worldwide through secure decisions in the digital environment."},
  "home.explore":{pt:"Explore minas, usinas, portos, ferrovias e escritórios, identifique ameaças cibernéticas, responda a incidentes simulados e fortaleça a resiliência das operações.",en:"Explore mines, plants, ports, railways and offices — identify cyber threats, respond to simulated incidents and strengthen operational resilience."},
  "home.impact":{pt:"Cada decisão que você toma pode proteger pessoas, informações e processos essenciais para o negócio.",en:"Every decision you make can protect people, information and processes essential to the business."},
  "home.objective":{pt:"🎯 <b>Objetivo do jogo:</b> reconhecer riscos digitais, aplicar boas práticas de segurança da informação e desenvolver a mentalidade de um verdadeiro Guardião Digital.",en:"🎯 <b>Game objective:</b> recognize digital risks, apply information security best practices and develop the mindset of a true Digital Guardian."},
  "home.journey":{pt:"🌍 Use o menu inferior — <strong>Início</strong>, <strong>Missões</strong>, <strong>Mapa</strong>, <strong>Desafios / Crises</strong> e <strong>Eu</strong>. Loja e guia ficam em ⚙️ Configurações.",en:"🌍 Use the bottom menu — <strong>Home</strong>, <strong>Missions</strong>, <strong>Map</strong>, <strong>Challenges / Crises</strong> and <strong>Me</strong>. Shop and guide are in ⚙️ Settings."},
  "home.langTitle":{pt:"Idioma / Language",en:"Language / Idioma"},
  "home.langSub":{pt:"Perguntas, respostas e narração seguem o idioma escolhido.",en:"Questions, answers and narration follow the chosen language."},
  "home.a11yTitle":{pt:"Acessibilidade / Accessibility",en:"Accessibility / Acessibilidade"},
  "home.a11ySub":{pt:"Configure narração, contraste, Libras e mais — agora ou depois no menu ♿ do topo.",en:"Set up narration, contrast, sign language and more — now or later in the top ♿ menu."},
  "home.a11yHint":{pt:"voz, contraste, Libras e mais no menu superior.",en:"voice, contrast, sign language and more in the top menu."},
  "a11y.openMenu":{pt:"♿ Acessibilidade",en:"♿ Accessibility"},
  "settings.title":{pt:"Configurações",en:"Settings"},
  "settings.theme":{pt:"Tema visual",en:"Visual theme"},
  "settings.themeDefault":{pt:"Padrão Orbita",en:"Orbita default"},
  "settings.themeLight":{pt:"Claro",en:"Light"},
  "settings.themeDark":{pt:"Escuro",en:"Dark"},
  "settings.glossary":{pt:"📖 Glossário",en:"📖 Glossary"},
  "settings.glossarySub":{pt:"Siglas e termos do jogo — com exemplos do dia a dia.",en:"Game acronyms and terms — with everyday examples."},
  "settings.glossarySearch":{pt:"Buscar termo",en:"Search term"},
  "settings.glossaryList":{pt:"Lista de termos do glossário",en:"Glossary term list"},
  "settings.glossaryPh":{pt:"Digite ou escolha na lista…",en:"Type or pick from the list…"},
  "settings.glossaryPrev":{pt:"Termo anterior",en:"Previous term"},
  "settings.glossaryNext":{pt:"Próximo termo",en:"Next term"},
  "settings.glossaryNavHint":{pt:"Use ← → ou os botões para ver o próximo termo",en:"Use ← → or the buttons to see the next term"},
  "settings.glossaryPick":{pt:"Escolha um termo",en:"Choose a term"},
  "settings.glossaryBrowse":{pt:"Ver lista completa",en:"Browse full list"},
  "settings.glossaryDef":{pt:"O que significa",en:"What it means"},
  "settings.glossaryAcr":{pt:"Sigla letra a letra",en:"Acronym spelled out"},
  "settings.glossaryFun":{pt:"No seu dia a dia",en:"In your daily life"},
  "settings.glossaryWhatIs":{pt:"O que é",en:"What it is"},
  "settings.glossaryDayToDay":{pt:"No seu dia a dia",en:"In your daily life"},
  "settings.glossaryRelated":{pt:"Termos relacionados",en:"Related terms"},
  "settings.glossaryMore":{pt:"Mais detalhes",en:"More details"},
  "settings.glossaryFullDef":{pt:"Definição completa",en:"Full definition"},
  "settings.glossaryAllCats":{pt:"Todos",en:"All"},
  "settings.glossaryLearned":{pt:"Já aprendi",en:"Mark learned"},
  "settings.glossaryLearnedDone":{pt:"Aprendido",en:"Learned"},
  "settings.glossaryReview":{pt:"Revisar depois",en:"Review later"},
  "settings.glossaryReviewing":{pt:"Para revisar",en:"To review"},
  "settings.glossaryReviewList":{pt:"🔖 Para revisar",en:"🔖 To review"},
  "settings.glossaryReviewEmpty":{pt:"Marque termos com 🔖 para revisar depois.",en:"Mark terms with 🔖 to review later."},
  "settings.glossaryExplore":{pt:"🔍 Explorar categoria",en:"🔍 Explore category"},
  "settings.glossaryQuiz":{pt:"❓ Quiz rápido",en:"❓ Quick quiz"},
  "settings.glossaryQuizBtn":{pt:"Quiz",en:"Quiz"},
  "settings.glossarySpeak":{pt:"Ouvir resumo",en:"Listen to summary"},
  "settings.glossaryNew":{pt:"Novo",en:"New"},
  "settings.glossaryRolePick":{pt:"Sugerido para seu papel:",en:"Suggested for your role:"},
  "settings.glossaryQuizCorrect":{pt:"✅ Correto! +10 XP",en:"✅ Correct! +10 XP"},
  "settings.glossaryQuizWrong":{pt:"Quase — veja a explicação abaixo.",en:"Almost — see the explanation below."},
  "settings.glossaryLearnXp":{pt:"+5 XP — termo aprendido!",en:"+5 XP — term learned!"},
  "settings.glossaryListCount":{pt:"Ver {n} termos",en:"View {n} terms"},
  "settings.glossaryEmpty":{pt:"Digite uma sigla ou escolha um termo na lista.",en:"Type an acronym or pick a term from the list."},
  "settings.glossaryFavsEmpty":{pt:"Toque ☆ em um termo para favoritar.",en:"Tap ☆ on a term to favorite it."},
  "settings.glossarySuggest":{pt:"Termos populares:",en:"Popular terms:"},
  "quiz.nextHint":{pt:"Responda para continuar →",en:"Answer to continue →"},
  "quiz.returnGlossary":{pt:"← Voltar à pergunta",en:"← Back to question"},
  "quiz.speak":{pt:"Ouvir cenário",en:"Listen to scenario"},
  "daily.doneTitle":{pt:"🎉 Atividade de hoje concluída!",en:"🎉 Today's activity complete!"},
  "daily.doneSub":{pt:"Volte amanhã para manter sua sequência e revisar novos cenários.",en:"Come back tomorrow to keep your streak and review new scenarios."},
  "home.previewLoop":{pt:"Seu treino: 📅 Atividade de hoje → 🗺️ Jornada no mapa → 🎯 Desafios / Crises",en:"Your training: 📅 Today's activity → 🗺️ Map journey → 🎯 Challenges / Crises"},
  "home.nextStepK":{pt:"Próximo passo recomendado",en:"Recommended next step"},
  "home.weekBarHint":{pt:"Toque para ver o resumo das metas — não inicia o jogo.",en:"Tap to view goal summary — does not start a session."},
  "home.weekBarAria":{pt:"Metas da semana — ver resumo",en:"Weekly goals — view summary"},
  "home.heroDecorAria":{pt:"Ilustração da cadeia operacional: mina, processamento, logística e mercados globais",en:"Operational chain illustration: mine, processing, logistics and global markets"},
  "weekly.emptyStart":{pt:"Semana nova — jogue a diária ou explore o mapa para começar as metas.",en:"New week — play daily or explore the map to start your goals."},
  "map.legendSummary":{pt:"{done} concluídos · {partial} em progresso · {pending} pendentes",en:"{done} complete · {partial} in progress · {pending} pending"},
  "toolbar.more":{pt:"Mais ferramentas",en:"More tools"},
  "glossary.cat.access":{pt:"Acesso",en:"Access"},
  "glossary.cat.threat":{pt:"Ameaças",en:"Threats"},
  "glossary.cat.network":{pt:"Rede",en:"Network"},
  "glossary.cat.data":{pt:"Dados",en:"Data"},
  "glossary.cat.ops":{pt:"Operações",en:"Operations"},
  "glossary.cat.ot":{pt:"OT / Industrial",en:"OT / Industrial"},
  "glossary.cat.compliance":{pt:"Compliance",en:"Compliance"},
  "glossary.cat.remote":{pt:"Remoto",en:"Remote"},
  "glossary.cat.control":{pt:"Controles",en:"Controls"},
  "glossary.cat.device":{pt:"Dispositivos",en:"Devices"},
  "glossary.cat.physical":{pt:"Física",en:"Physical"},
  "settings.openA11y":{pt:"♿ Acessibilidade",en:"♿ Accessibility"},
  "settings.simpleUi":{pt:"Modo simples",en:"Simple mode"},
  "settings.simpleUiSub":{pt:"Esconde nível, XP e maturidade no topo — ideal para começar.",en:"Hides level, XP and maturity in the header — ideal for beginners."},
  "settings.easyRead":{pt:"Leitura fácil",en:"Easy reading"},
  "settings.easyReadSub":{pt:"Liga ou desliga contraste, texto grande e espaçamento de uma vez.",en:"Turns contrast, large text and spacing on or off together."},
  "settings.easyReadOff":{pt:"Leitura fácil desativada",en:"Easy reading disabled"},
  "settings.editProfile":{pt:"✏️ Editar perfil",en:"✏️ Edit profile"},
  "settings.openGuide":{pt:"🧭 Reabrir guia do jogo",en:"🧭 Reopen game guide"},
  "settings.openShop":{pt:"🛒 Loja",en:"🛒 Shop"},
  "settings.glossaryFavs":{pt:"⭐ Favoritos",en:"⭐ Favorites"},
  "quiz.context":{pt:"Contexto",en:"Context"},
  "quiz.glossaryTip":{pt:"O que é isso?",en:"What is this?"},
  "quiz.repeatQ":{pt:"Repetir pergunta",en:"Repeat question"},
  "report.skipVisible":{pt:"Pular por agora",en:"Skip for now"},
  "tip.map":{pt:"Toque no país destacado para iniciar sua expedição. Use +/− para zoom.",en:"Tap the highlighted country to start your expedition. Use +/− to zoom."},
  "tip.daily":{pt:"5 situações rápidas — 2 revisam erros anteriores. Mantém sua sequência diária!",en:"5 quick scenarios — 2 review past mistakes. Keeps your daily streak!"},
  "tip.boss":{pt:"Crises estilo mesa — leia o cenário e tome decisões como na operação real.",en:"Tabletop crises — read the scenario and decide as in real operations."},
  "tip.dismiss":{pt:"Entendi",en:"Got it"},
  "home.weekBar":{pt:"Meta da semana",en:"Weekly goal"},
  "home.weekBarGo":{pt:"Ver detalhes →",en:"View details →"},
  "home.firstDay":{pt:"Dia 1 da sua sequência — 5 minutos de treino bastam para começar.",en:"Day 1 of your streak — 5 minutes of training is enough to start."},
  "session.title":{pt:"Resumo da sessão",en:"Session summary"},
  "session.streakKept":{pt:"🔥 Sequência mantida hoje!",en:"🔥 Streak kept today!"},
  "session.streakStart":{pt:"🔥 Sequência iniciada — volte amanhã!",en:"🔥 Streak started — come back tomorrow!"},
  "session.xpGain":{pt:"+{n} XP nesta sessão",en:"+{n} XP this session"},
  "weekly.checklist":{pt:"Metas da semana",en:"Weekly goals"},
  "weekly.checkDaily":{pt:"Jogar 5 dias (sequência)",en:"Play 5 days (streak)"},
  "weekly.checkCampaign":{pt:"3 jornadas no mapa",en:"3 map journeys"},
  "weekly.checkBoss":{pt:"1 crise vencida",en:"1 crisis beaten"},
  "boss.estTime":{pt:"~{n} min",en:"~{n} min"},
  "boss.recommended":{pt:"Recomendado",en:"Recommended"},
  "boss.completed":{pt:"Concluído",en:"Completed"},
  "boss.statusPending":{pt:"Pendente",en:"Pending"},
  "boss.statusDone":{pt:"Concluída",en:"Completed"},
  "boss.listSummary":{pt:"{done}/{total} histórias concluídas · {pending} pendentes",en:"{done}/{total} stories completed · {pending} pending"},
  "boss.sectionPending":{pt:"Histórias pendentes",en:"Pending stories"},
  "boss.sectionDone":{pt:"Histórias concluídas",en:"Completed stories"},
  "boss.scenes":{pt:"{n} cenas",en:"{n} scenes"},
  "boss.playStory":{pt:"Jogar história",en:"Play story"},
  "boss.replayStory":{pt:"Jogar novamente",en:"Play again"},
  "boss.nextAction":{pt:"Próxima crise →",en:"Next crisis →"},
  "boss.resultNext":{pt:"Continuar jornada",en:"Continue journey"},
  "nav.more":{pt:"Mais",en:"More"},
  "nav.me":{pt:"Eu",en:"Me"},
  "nav.badgeDaily":{pt:"Missão pendente",en:"Mission pending"},
  "offline.hint":{pt:"📶 Funciona offline após a primeira visita — seu progresso fica neste dispositivo.",en:"📶 Works offline after first visit — progress stays on this device."},
  "onboard.offlineNote":{pt:"📶 Após a primeira visita, funciona offline e seu progresso fica salvo neste dispositivo.",en:"📶 After the first visit, it works offline and your progress is saved on this device."},
  "profile.editSetup":{pt:"✏️ Editar perfil",en:"✏️ Edit profile"},
  "profile.weeklyGoals":{pt:"✅ Metas da semana",en:"✅ Weekly goals"},
  "cert.share":{pt:"📤 Compartilhar",en:"📤 Share"},
  "onboard.langT":{pt:"Idioma",en:"Language"},
  "onboard.langB":{pt:"Perguntas, respostas e narração seguem o idioma. Acessibilidade (♿) e configurações (⚙️) ficam no topo quando quiser.",en:"Questions, answers and narration follow the chosen language. Accessibility (♿) and settings (⚙️) are in the top bar anytime."},
  "onboard.a11yT":{pt:"Acessibilidade",en:"Accessibility"},
  "onboard.a11yB":{pt:"Ative narração, contraste, Libras ou redução de animações agora — ou ajuste depois no menu ♿.",en:"Enable narration, contrast, sign language or reduced motion now — or adjust later in the ♿ menu."},
  "onboard.profileT":{pt:"Personalize seu perfil",en:"Personalize your profile"},
  "onboard.profileB":{pt:"Na próxima tela: nome (opcional), onde você atua e como é seu trabalho. O jogo usa essa combinação para priorizar situações. Cerca de 20 segundos.",en:"On the next screen: name (optional), where you work and your routine. The game uses this combination to prioritize scenarios. About 20 seconds."},
  "onboard.playT":{pt:"Como jogar",en:"How to play"},
  "onboard.playB":{pt:"Fluxo do treino: 📅 Atividade de hoje → 🗺️ Jornada no mapa → 🎯 Desafios / Crises.\n\nNa tela Início, o botão principal sempre indica o próximo passo (ex.: ▶️ Atividade de hoje · 5 min). A barra de metas da semana só mostra o resumo — não inicia o jogo.",en:"Training flow: 📅 Today's activity → 🗺️ Map journey → 🎯 Challenges / Crises.\n\nOn Home, the main button always shows your next step (e.g. ▶️ Today's activity · 5 min). The weekly goals bar is for progress summary only — it does not start a session."},
  "onboard.readyT":{pt:"Pronto para começar",en:"Ready to start"},
  "onboard.readyB":{pt:"1) Defina onde você atua e como trabalha.\n2) Na Início, toque ▶️ Jogar agora — comece pela atividade de hoje.\n3) Menu inferior: Início → Missões → Mapa → Desafios / Crises → Eu. Loja e guia em ⚙️ Configurações.",en:"1) Set where you work and your routine.\n2) On Home, tap ▶️ Play now — start with today's activity.\n3) Bottom menu: Home → Missions → Map → Challenges / Crises → Me. Shop and guide in ⚙️ Settings."},
  "onboard.startSetup":{pt:"Personalizar agora →",en:"Personalize now →"},
  "mgr.kpiAdoption":{pt:"Adoção",en:"Adoption"},
  "mgr.kpiWeak":{pt:"Tema mais fraco",en:"Weakest theme"},
  "mgr.kpiStreak":{pt:"Sequência média",en:"Avg streak"},
  "hud.tip.settings":{pt:"Configurações — tema, perfil, loja, guia e preferências",en:"Settings — theme, profile, shop, guide and preferences"},
  "hud.tip.glossary":{pt:"Glossário — siglas e termos de cyber security",en:"Glossary — cyber security acronyms and terms"},
  "a11y.shortLabel":{pt:"Acessibilidade",en:"Accessibility"},
  "a11y.sec.read":{pt:"Leitura e narração",en:"Reading & narration"},
  "a11y.sec.visual":{pt:"Visual e cores",en:"Visual & colors"},
  "a11y.sec.text":{pt:"Texto e tipografia",en:"Text & typography"},
  "a11y.sec.signs":{pt:"Libras / ASL",en:"Sign language"},
  "home.expand":{pt:"📖 Saber mais sobre o jogo",en:"📖 Learn more about the game"},
  "home.collapse":{pt:"Recolher texto",en:"Collapse text"},
  "home.playNow":{pt:"▶️ Jogar agora",en:"▶️ Play now"},
  "home.weekLine":{pt:"Semana: {theme} · Acertos {correct}/20 · Campanhas {campaign}/3 · Missão {daily}",en:"Week: {theme} · Correct {correct}/20 · Campaigns {campaign}/3 · Mission {daily}"},
  "home.map":{pt:"🗺️ Mapa da Operação",en:"🗺️ Operations Map"},
  "home.install":{pt:"⬇️ Instalar app",en:"⬇️ Install app"},
  "home.heroIronTip":{pt:"Ilustração da cadeia operacional (somente visual)",en:"Operational chain illustration (visual only)"},
  "home.chain":{pt:"⛓️ Cadeia de Produção",en:"⛓️ Production Chain"},
  "home.weekTitle":{pt:"Minha semana",en:"My week"},
  "home.weekSub":{pt:"Metas da semana e próximo passo recomendado.",en:"Weekly goals and your recommended next step."},
  "home.weekPlay":{pt:"Jogar agora →",en:"Play now →"},
  "home.nextStart":{pt:"Comece por aqui",en:"Start here"},
  "home.nextContinue":{pt:"Continue de onde parou",en:"Continue where you left off"},
  "home.nextCampaignSub":{pt:"Sua jornada no mapa continua — proteja o próximo país e avance na meta semanal.",en:"Your map journey continues — protect the next country and advance your weekly goal."},
  "home.nextBoss":{pt:"Enfrente uma crise",en:"Face a crisis"},
  "home.nextBossSub":{pt:"Desafios / Crises estilo mesa elevam sua maturidade operacional.",en:"Tabletop Challenges / Crises raise your operational maturity."},
  "home.nextReview":{pt:"Revise seus erros",en:"Review your mistakes"},
  "home.nextGoDaily":{pt:"▶️ Atividade de hoje · 5 min",en:"▶️ Today's activity · 5 min"},
  "home.nextGoMap":{pt:"🗺️ Continuar jornada",en:"🗺️ Continue journey"},
  "home.nextGoBoss":{pt:"🎯 Simular crise",en:"🎯 Simulate crisis"},
  "home.nextGoReview":{pt:"📚 Revisar agora · ~3 min",en:"📚 Review now · ~3 min"},
  "home.weekTheme":{pt:"Tema da semana",en:"Week theme"},
  "home.weekCorrect":{pt:"Acertos semanais",en:"Weekly correct"},
  "home.weekCampaign":{pt:"Campanhas",en:"Campaigns"},
  "home.weekDaily":{pt:"Diária",en:"Daily"},
  "home.weekBoss":{pt:"Crise",en:"Crisis"},
  "mode.mapchain.h":{pt:"Cadeia em Desafios / Crises",en:"Chain in Challenges / Crises"},
  "mode.mapchain.t":{pt:"Aventura Carajás → China em etapas — proteja cada elo da logística de ferro.",en:"Carajás → China adventure in stages — protect each iron logistics link."},
  "daily.whyToday":{pt:"Por que jogar hoje?",en:"Why play today?"},
  "daily.streakRisk":{pt:"Sua sequência está em risco — jogue hoje para mantê-la.",en:"Your streak is at risk — play today to keep it."},
  "daily.streakOk":{pt:"Sequência mantida hoje — continue evoluindo.",en:"Streak kept today — keep improving."},
  "daily.themeLine":{pt:"Temas do dia incluem revisão dos seus erros anteriores.",en:"Today's scenarios include review of your past mistakes."},
  "daily.rewardLine":{pt:"+50 pontos · mantém sequência 🔥",en:"+50 points · keeps streak 🔥"},
  "daily.reviewLabel":{pt:"Revisões do que você errou",en:"Reviews of your mistakes"},
  "daily.itemName":{pt:"Atividade de hoje — 5 situações",en:"Today's activity — 5 scenarios"},
  "daily.doneNext":{pt:"✅ Feito — próximo: Jornada no mapa",en:"✅ Done — next: Map journey"},
  "nav.badgeWeekly":{pt:"metas semanais pendentes",en:"pending weekly goals"},
  "result.next":{pt:"Próximo passo",en:"Next step"},
  "result.home":{pt:"🏠 Início",en:"🏠 Home"},
  "result.weekly":{pt:"🏆 Metas da semana",en:"🏆 Weekly goals"},
  "review.title":{pt:"📋 Banco de Perguntas",en:"📋 Question Bank"},
  "review.sub":{pt:"Todas as perguntas do jogo — campanhas, diárias, cadeia e Desafios / Crises.",en:"All game questions — campaigns, dailies, chain and Challenges / Crises."},
  "review.allSrc":{pt:"Todas as fontes",en:"All sources"},
  "review.srcBank":{pt:"Campanhas / Diárias",en:"Campaigns / Dailies"},
  "review.srcChain":{pt:"Cadeia Carajás",en:"Carajás Chain"},
  "review.srcBoss":{pt:"Desafios / Crises",en:"Challenges / Crises"},
  "review.allThemes":{pt:"Todos os temas",en:"All themes"},
  "review.allDiff":{pt:"Todas as dificuldades",en:"All difficulties"},
  "review.searchPh":{pt:"Buscar texto…",en:"Search text…"},
  "pwa.installTitle":{pt:"⬇️ Instalar Guardião Digital",en:"⬇️ Install Digital Guardian"},
  "pwa.installAndroid":{pt:"No menu do navegador (⋯), escolha Instalar app ou Adicionar à tela inicial.",en:"In the browser menu (⋯), choose Install app or Add to home screen."},
  "pwa.ios1":{pt:"Toque em Compartilhar (ícone de seta para cima)",en:"Tap Share (arrow up icon)"},
  "pwa.ios2":{pt:"Escolha Adicionar à Tela de Início",en:"Choose Add to Home Screen"},
  "pwa.installClose":{pt:"Entendi",en:"Got it"},
  "settings.managerPanel":{pt:"🧭 Painel do gestor",en:"🧭 Manager panel"},
  "settings.managerPanelSub":{pt:"Exibe métricas da equipe e recomendações pedagógicas no menu Gestor.",en:"Shows team metrics and pedagogical recommendations in the Manager tab."},
  "settings.focusLearn":{pt:"Modo foco no aprendizado",en:"Learning focus mode"},
  "settings.focusLearnSub":{pt:"Esconde moedas e pontuação arcade durante o treino.",en:"Hides coins and arcade score during training."},
  "settings.a11yCatalog":{pt:"Recursos de acessibilidade",en:"Accessibility features"},
  "hud.tip.statsSummary":{pt:"Resumo do progresso — toque para abrir Eu",en:"Progress summary — tap to open Me"},
  "map.stickyGo":{pt:"▶️ Iniciar expedição",en:"▶️ Start expedition"},
  "map.detailChain":{pt:"Etapa da cadeia",en:"Chain stage"},
  "map.chainImpact":{pt:"Impacto na cadeia",en:"Chain impact"},
  "map.riskTitle":{pt:"Risco",en:"Risk"},
  "map.countryPrev":{pt:"País anterior",en:"Previous country"},
  "map.countryNext":{pt:"Próximo país",en:"Next country"},
  "map.navMissHint":{pt:"Use as setas ‹ › para trocar de país, ou × para fechar.",en:"Use ‹ › arrows to switch countries, or × to close."},
  "map.legPending":{pt:"Pendente",en:"Pending"},
  "map.legPartial":{pt:"Em progresso",en:"In progress"},
  "map.legDone":{pt:"Concluído",en:"Completed"},
  "a11y.menuTitle":{pt:"Acessibilidade",en:"Accessibility"},
  "a11y.langLabel":{pt:"Idioma",en:"Language"},
  "a11y.prefsLabel":{pt:"Preferências",en:"Preferences"},
  "a11y.close":{pt:"Fechar menu",en:"Close menu"},
  "home.modesTitle":{pt:"Modos de jogo",en:"Game modes"},
  "mode.campaign.h":{pt:"🗺️ Campanhas por país",en:"🗺️ Campaigns by country"},
  "mode.campaign.t":{pt:"Presença oficial da Orbita em 19 países — atuação e portfólio do mapa orbita.com.",en:"Orbita's official presence in 19 countries — activities and portfolio from the orbita.com map."},
  "mode.boss.h":{pt:"🎯 Desafios / Crises",en:"🎯 Challenges / Crises"},
  "mode.boss.t":{pt:"Crises simuladas estilo mesa: storytelling encadeado com mapas vetoriais animados.",en:"Tabletop simulated crises: chained storytelling with animated vector maps."},
  "mode.dw.h":{pt:"📅 Diárias & 🏆 Semanais",en:"📅 Dailies & 🏆 Weeklies"},
  "mode.dw.t":{pt:"Desafios que renovam e rendem XP.",en:"Challenges that refresh and grant XP."},
  "streak.title":{pt:"🔥 Sequência diária",en:"🔥 Daily streak"},
  "streak.sub":{pt:"Jogue todo dia para manter sua sequência e ganhar bônus.",en:"Play every day to keep your streak and earn bonuses."},
  "streak.days":{pt:"dias seguidos",en:"day streak"},
  "streak.best":{pt:"Recorde",en:"Best"},
  "streak.today":{pt:"✅ Sequência mantida hoje!",en:"✅ Streak kept today!"},
  "streak.risk":{pt:"Jogue hoje para não perder sua sequência de {n} dias.",en:"Play today to keep your {n}-day streak."},
  "streak.neutral":{pt:"Jogue hoje para iniciar sua sequência!",en:"Play today to start your streak!"},
  "streak.new":{pt:"🔥 Sequência iniciada! Dia 1.",en:"🔥 Streak started! Day 1."},
  "streak.up":{pt:"🔥 Sequência: ",en:"🔥 Streak: "},
  "streak.lost":{pt:"Sequência reiniciada.",en:"Streak reset."},
  "hud.tip.lang":{pt:"Idioma do jogo — toque na bandeira PT ou EN.",en:"Game language — tap the PT or EN flag."},
  "hud.tip.langPt":{pt:"Jogar em Português",en:"Play in Portuguese"},
  "hud.tip.langEn":{pt:"Jogar em Inglês",en:"Play in English"},
  "lang.switchLabel":{pt:"Idioma do jogo",en:"Game language"},
  "hud.tip.title":{pt:"Patente de maturidade (1–10) — evolui com XP; não é cargo na empresa.",en:"Maturity rank (1–10) — grows with XP; not your job title."},
  "hud.tip.lives":{pt:"Vidas restantes — você perde uma ao errar em situações críticas; recupere jogando bem.",en:"Lives remaining — you lose one on critical mistakes; recover by playing well."},
  "hud.tip.streak":{pt:"Sequência — dias seguidos jogando; mantenha para ganhar bônus.",en:"Streak — consecutive days played; keep it for bonuses."},
  "hud.tip.level":{pt:"Nível do guardião (1–10) — XP vem do mapa, missões e crises.",en:"Guardian level (1–10) — XP from map, missions and crises."},
  "hud.tip.xp":{pt:"Pontos de experiência (XP) — ganhos em campanhas, diárias, semanais e Desafios / Crises.",en:"Experience points (XP) — earned in campaigns, dailies, weeklies and Challenges / Crises."},
  "hud.tip.coins":{pt:"Moedas — moeda do jogo para comprar avatares, molduras e temas na loja.",en:"Coins — in-game currency to buy avatars, frames and themes in the shop."},
  "hud.tip.score":{pt:"Pontuação geral — soma do seu desempenho em acertos e missões concluídas.",en:"Overall score — sum of your performance in correct answers and completed missions."},
  "hud.tip.maturity":{pt:"Maturidade operacional — média em Desafios / Crises.",en:"Operational maturity — average across Challenges / Crises."},
  "hud.tip.fontDown":{pt:"Diminuir fonte — reduz o tamanho do texto em toda a interface.",en:"Decrease font — reduces text size across the interface."},
  "hud.tip.fontScale":{pt:"Tamanho atual da fonte — 0 é o padrão; use A− e A+ para ajustar.",en:"Current font size — 0 is default; use A− and A+ to adjust."},
  "hud.tip.fontUp":{pt:"Aumentar fonte — amplia o tamanho do texto em toda a interface.",en:"Increase font — enlarges text size across the interface."},
  "hud.tip.contrast":{pt:"Alto contraste — alterna cores fortes para facilitar a leitura.",en:"High contrast — toggles strong colors for easier reading."},
  "hud.tip.a11y":{pt:"Acessibilidade — voz, contraste, Libras e fonte",en:"Accessibility — voice, contrast, sign language and font"},
  "hud.tip.voice":{pt:"Narração por voz — lê em voz alta cenários e opções do quiz.",en:"Voice narration — reads scenarios and quiz options aloud."},
  "streak.bonus":{pt:"Bônus de sequência!",en:"Streak bonus!"},
  "streak.bonusXp":{pt:"Bônus de sequência! +{n} pontos",en:"Streak bonus! +{n} points"},
  "manager.demo":{pt:"ℹ️ Piloto local — métricas reais deste dispositivo para sua equipe. Integração corporativa agregada requer backend/LMS.",en:"ℹ️ Local pilot — real metrics from this device for your team. Corporate aggregation requires backend/LMS."},
  "manager.yourTeam":{pt:"Sua equipe (dados reais)",en:"Your team (real data)"},
  "manager.pending":{pt:"Outras equipes — aguardando dados agregados corporativos",en:"Other teams — awaiting corporate aggregated data"},
  "manager.recTitle":{pt:"💡 Recomendações pedagógicas",en:"💡 Pedagogical recommendations"},
  "manager.recEmpty":{pt:"Jogue campanhas, diárias ou Desafios / Crises para gerar recomendações.",en:"Play campaigns, dailies or Challenges / Crises to generate recommendations."},
  "pedagogy.recTitle":{pt:"🎯 Plano de estudo sugerido",en:"🎯 Suggested study plan"},
  "pedagogy.recWeak":{pt:"Reforce o tema",en:"Strengthen theme"},
  "pedagogy.recPlay":{pt:"Jogar agora",en:"Play now"},
  "pedagogy.drillMode":{pt:"Reforço de tema — sem penalidade",en:"Theme drill — no penalty"},
  "pedagogy.drillDone":{pt:"📈 Reforço concluído — veja seu radar atualizado",en:"📈 Drill complete — check your updated radar"},
  "pedagogy.reviewErrors":{pt:"📚 Revisar meus erros",en:"📚 Review my mistakes"},
  "pedagogy.reviewEmpty":{pt:"Nenhum erro registrado para revisão. Continue jogando!",en:"No errors recorded for review. Keep playing!"},
  "pedagogy.reviewMode":{pt:"Revisão guiada — sem penalidade",en:"Guided review — no penalty"},
  "report.title":{pt:"📢 Como você reportaria na Orbita?",en:"📢 How would you report at Orbita?"},
  "report.sub":{pt:"Reconhecer e reportar faz parte do comportamento seguro.",en:"Recognizing and reporting is part of safe behavior."},
  "report.how":{pt:"💡 Na vida real: use o botão \"Reportar Phishing\" no Outlook ou acione a Segurança da Informação. Reportar cedo contém o incidente.",en:"💡 In real life: use the \"Report Phishing\" button in Outlook or contact Information Security. Reporting early contains the incident."},
  "report.helpdesk":{pt:"Help Desk / Service Desk",en:"Help Desk / Service Desk"},
  "report.security":{pt:"Segurança da Informação",en:"Information Security"},
  "report.privacy":{pt:"Privacidade / DPO",en:"Privacy / DPO"},
  "report.skip":{pt:"Pular esta etapa",en:"Skip this step"},
  "report.done":{pt:"✅ Compromisso registrado — obrigado por reportar!",en:"✅ Commitment logged — thanks for reporting!"},
  "debrief.title":{pt:"📋 Debriefing pedagógico",en:"📋 Pedagogical debrief"},
  "debrief.errors":{pt:"Pontos de atenção nesta missão",en:"Watch points in this mission"},
  "debrief.tip":{pt:"Hábito seguro",en:"Safe habit"},
  "debrief.policy":{pt:"Consulte sempre as políticas oficiais da Orbita.",en:"Always consult Orbita's official policies."},
  "weekly.theme":{pt:"Tema da semana",en:"Week theme"},
  "weekly.themeGoal":{pt:"Acerte 8 situações do tema da semana",en:"Get 8 scenarios right on the week theme"},
  "profile.reset":{pt:"🗑️ Resetar progresso",en:"🗑️ Reset progress"},
  "profile.resetConfirm":{pt:"Apagar todo o progresso salvo neste navegador?",en:"Delete all progress saved in this browser?"},
  "profile.resetDone":{pt:"Progresso resetado.",en:"Progress reset."},
  "mode.mgr.h":{pt:"🧭 Painel do gestor",en:"🧭 Manager panel"},
  "mode.mgr.t":{pt:"Visão agregada por equipe (anônima) e exportação CSV.",en:"Aggregated team view (anonymous) and CSV export."},
  "a11y.voice":{pt:"Narração por voz",en:"Voice narration"},
  "a11y.voiceD":{pt:"Lê cenários e opções no idioma escolhido.",en:"Reads scenarios and options in the chosen language."},
  "a11y.contrast":{pt:"Alto contraste",en:"High contrast"},
  "a11y.contrastD":{pt:"Cores fortes para melhor leitura.",en:"Strong colors for better reading."},
  "a11y.large":{pt:"Texto grande",en:"Large text"},
  "a11y.largeD":{pt:"Aumenta o tamanho da fonte.",en:"Increases font size."},
  "a11y.motion":{pt:"Reduzir animações",en:"Reduce motion"},
  "a11y.motionD":{pt:"Menos movimento na tela.",en:"Less on-screen movement."},
  "a11y.signs":{pt:"Hand Talk (Libras)",en:"Hand Talk (ASL)"},
  "a11y.signsD":{pt:"Plugin Hand Talk da Orbita — tradutor de Libras + 22 recursos assistivos (fonte, leitura, cores, navegação).",en:"Orbita Hand Talk plugin — ASL translator + 22 assistive features (font, reading, colors, navigation)."},
  "a11y.signsHint":{pt:"Sem token Hand Talk: VLibras (PT) ou dicionário ASL (EN) como alternativa.",en:"Without Hand Talk token: VLibras (PT) or ASL dictionary (EN) as fallback."},
  "a11y.aslTitle":{pt:"Dicionário ASL",en:"ASL Dictionary"},
  "a11y.aslTranslate":{pt:"Traduzir seleção",en:"Translate selection"},
  "a11y.links":{pt:"Destaque de links",en:"Highlight links"},
  "a11y.linksD":{pt:"Realça links clicáveis da página.",en:"Highlights clickable links on the page."},
  "a11y.spacing":{pt:"Espaçamento entre linhas",en:"Line spacing"},
  "a11y.spacingD":{pt:"Aumenta o espaço vertical entre linhas.",en:"Increases vertical space between lines."},
  "a11y.letterSpace":{pt:"Espaçamento entre letras",en:"Letter spacing"},
  "a11y.letterSpaceD":{pt:"Aumenta o espaço entre caracteres.",en:"Increases space between characters."},
  "a11y.dyslexia":{pt:"Letras destacadas",en:"Dyslexia-friendly text"},
  "a11y.dyslexiaD":{pt:"Tipografia e espaçamento que auxiliam leitura (dislexia).",en:"Typography and spacing that aid reading (dyslexia)."},
  "a11y.colorblind":{pt:"Modo daltônico",en:"Color blind mode"},
  "a11y.colorblindD":{pt:"Filtros para protanopia, deuteranopia e tritanopia.",en:"Filters for protanopia, deuteranopia and tritanopia."},
  "a11y.readingMode":{pt:"Modo de leitura",en:"Reading mode"},
  "a11y.readingModeD":{pt:"Remove distrações e simplifica a visualização.",en:"Removes distractions and simplifies the view."},
  "a11y.fontDown":{pt:"Diminuir fonte",en:"Decrease font size"},
  "a11y.fontUp":{pt:"Aumentar fonte",en:"Increase font size"},
  "a11y.structure":{pt:"Estrutura da página",en:"Page structure"},
  "a11y.orbitaLink":{pt:"Acessibilidade Orbita",en:"Orbita Accessibility"},
  "a11y.catalogTitle":{pt:"Recursos de acessibilidade",en:"Accessibility features"},
  "a11y.catalogSub":{pt:"Alinhado ao site orbita.com — Hand Talk + recursos nativos do jogo.",en:"Aligned with orbita.com — Hand Talk + native game features."},
  "a11y.cat.signs":{pt:"Libras, ASL e IA",en:"Sign language & AI"},
  "a11y.cat.font":{pt:"Fonte e legibilidade",en:"Font & readability"},
  "a11y.cat.nav":{pt:"Navegação assistida",en:"Assisted navigation"},
  "a11y.cat.color":{pt:"Controle de cores",en:"Color control"},
  "a11y.cat.native":{pt:"Recursos nativos",en:"Native features"},
  "a11y.src.handtalk":{pt:"Hand Talk",en:"Hand Talk"},
  "a11y.src.native":{pt:"Nativo",en:"Native"},
  "a11y.src.both":{pt:"Hand Talk + Nativo",en:"Hand Talk + Native"},
  "home.langPtDesc":{pt:"Português (Brasil)",en:"Portuguese (Brazil)"},
  "home.langEnDesc":{pt:"Inglês (Estados Unidos)",en:"English (United States)"},
  "setup.nameTitle":{pt:"Seu nome",en:"Your name"},
  "setup.nameSub":{pt:"Opcional — aparece no certificado e no ranking da equipe.",en:"Optional — shown on your certificate and team ranking."},
  "setup.namePh":{pt:"Exemplo: Rodolfo Conte",en:"Example: Rodolfo Conte"},
  "setup.badge":{pt:"👤 Perfil rápido",en:"👤 Quick profile"},
  "setup.editBadge":{pt:"✏️ Editar perfil",en:"✏️ Edit profile"},
  "setup.head":{pt:"Personalize seu perfil",en:"Personalize your profile"},
  "setup.intro":{pt:"Nome (opcional). Em seguida, escolha onde você atua e como é seu trabalho. Leva cerca de 20 segundos.",en:"Name (optional). Then choose where you work and what best describes your routine. Takes about 20 seconds."},
  "setup.why":{pt:"💡 Todas as combinações são permitidas. Onde você atua define o contexto; como você trabalha define os riscos. O jogo usa suas escolhas para priorizar missões mais próximas da sua realidade.",en:"💡 All combinations are allowed. Where you work defines the context; how you work defines the risks. The game uses your choices to prioritize missions closer to your reality."},
  "setup.feedPartial":{pt:"⚠️ Falta uma escolha para completar seu perfil. Selecione onde você atua e como é seu trabalho para personalizar suas missões.",en:"⚠️ One choice is missing. Select where you work and what best describes your routine to personalize your missions."},
  "setup.feedHigh":{pt:"✅ Perfil personalizado: {area} + {rotina}. O jogo irá priorizar cenários, riscos e decisões próximos do seu dia a dia.",en:"✅ Personalized profile: {area} + {rotina}. The game will prioritize scenarios, risks and decisions close to your daily work."},
  "setup.feedMedium":{pt:"✅ Perfil ajustado: {area} + {rotina}. O jogo irá combinar situações do seu ambiente com desafios da sua rotina de trabalho.",en:"✅ Adjusted profile: {area} + {rotina}. The game will combine situations from your environment with challenges from your work routine."},
  "setup.feedLow":{pt:"ℹ️ Essa combinação é menos comum, mas pode acontecer. O jogo irá adaptar as missões para misturar os contextos selecionados de forma coerente.",en:"ℹ️ This combination is less common, but it can happen. The game will adapt missions to blend your selected contexts coherently."},
  "setup.feedSpecial":{pt:"🎯 Perfil especial identificado: {area} + {rotina}. As missões serão adaptadas com situações gerais e específicas do seu contexto — acessos, informações e decisões do dia a dia.",en:"🎯 Special profile identified: {area} + {rotina}. Missions will blend general and specific situations for your context — access, information and day-to-day decisions."},
  "setup.startToast":{pt:"🎮 Missão personalizada iniciada. Seus desafios foram ajustados com base em onde você atua e em como é seu trabalho.",en:"🎮 Personalized mission started. Your challenges were adjusted based on where you work and how you work."},
  "setup.editHead":{pt:"Editar perfil",en:"Edit profile"},
  "setup.editIntro":{pt:"Ajuste nome, área ou rotina — as próximas missões já refletem sua escolha.",en:"Adjust name, area or routine — upcoming missions reflect your choices right away."},
  "setup.nameOptional":{pt:"Adicionar nome (opcional)",en:"Add name (optional)"},
  "setup.goFirst":{pt:"▶️ Começar primeira atividade",en:"▶️ Start first activity"},
  "setup.save":{pt:"💾 Salvar e voltar",en:"💾 Save and go back"},
  "setup.saved":{pt:"Perfil atualizado.",en:"Profile updated."},
  "setup.teamTitle":{pt:"Onde você atua?",en:"Where do you work?"},
  "setup.teamSub":{pt:"Escolha sua área ou ambiente de trabalho.",en:"Choose your area or work environment."},
  "setup.roleTitle":{pt:"Como é o seu trabalho?",en:"What best describes your work?"},
  "setup.roleSub":{pt:"Escolha a atividade que mais representa sua rotina.",en:"Choose the activity that best represents your routine."},
  "setup.go":{pt:"▶️ Começar primeira atividade",en:"▶️ Start first activity"},
  "setup.banner":{pt:"👤 Defina onde você atua e como trabalha para missões mais relevantes.",en:"👤 Set where you work and how you work for more relevant missions."},
  "setup.bannerGo":{pt:"Personalizar agora",en:"Personalize now"},
  "setup.teamRequired":{pt:"Escolha onde você atua para continuar.",en:"Choose where you work to continue."},
  "setup.roleRequired":{pt:"Escolha como é o seu trabalho para continuar.",en:"Choose what best describes your work to continue."},
  "setup.managerTitle":{pt:"🧭 Modo gestor",en:"🧭 Manager mode"},
  "setup.managerSub":{pt:"Ative se você acompanha métricas da equipe. O painel aparece no menu Mais.",en:"Enable if you track team metrics. The panel appears in the More menu."},
  "setup.managerLabel":{pt:"Exibir painel do gestor",en:"Show manager panel"},
  "setup.prefsTitle":{pt:"⚙️ Preferências",en:"⚙️ Preferences"},
  "setup.prefsSub":{pt:"Ajuste o jogo ao seu perfil. Você pode mudar depois no Progresso.",en:"Adjust the game to your profile. You can change it later in Progress."},
  "setup.focusLabel":{pt:"🎯 Foco em aprender",en:"🎯 Focus on learning"},
  "setup.focusDesc":{pt:"Reduz ênfase em moedas e recompensas cosméticas para focar no conteúdo.",en:"Reduces emphasis on coins and cosmetic rewards to focus on content."},
  "footer.brand":{pt:"Guardião Cibernético",en:"Cyber Guardian"},
  "daily.srsDue":{pt:"{n} revisões do que você errou priorizadas na atividade de hoje",en:"{n} mistake reviews prioritized in today's activity"},
  "profile.streakStat":{pt:"Sequência",en:"Streak"},
  "map.vwmTitle":{pt:"A Orbita no mundo",en:"Orbita in the world"},
  "map.vwmHelper":{pt:"Toque num país para iniciar a expedição",en:"Tap a country to start the expedition"},
  "map.zoomToggle":{pt:"🔍 Ajustar zoom",en:"🔍 Adjust zoom"},
  "map.reset":{pt:"Ver mundo",en:"View world"},
  "map.moreOptions":{pt:"Mais informações do mapa",en:"More map information"},
  "map.clearSelection":{pt:"Limpar seleção",en:"Clear selection"},
  "map.legendActivity":{pt:"Atuação:",en:"Activity:"},
  "map.legendProduct":{pt:"Portfólio de Produtos:",en:"Product portfolio:"},
  "map.sub":{pt:"Com sede no Brasil, a Orbita atua em 19 países no mapa oficial. Clique no mapa, na legenda ou na lista para explorar cada presença.",en:"Headquartered in Brazil, Orbita is present in 19 countries on the official map. Click the map, legend or list to explore each presence."},
  "map.aboutTitle":{pt:"Presença global da Orbita",en:"Orbita's global presence"},
  "map.aboutIntro":{pt:"Com sede no Brasil, a Orbita é uma empresa global de mineração, com presença em 19 países no mapa oficial. A legenda de Atuação e Portfólio segue o componente de orbita.com/pt/onde-estamos.",en:"Headquartered in Brazil, Orbita is a global mining company present in 19 countries on the official map. The Activity and Portfolio legend follows the component at orbita.com/where-we-are."},
  "map.aboutWhy":{pt:"A Orbita atua em diferentes países para integrar de forma eficiente sua cadeia de valor global, conectando produção, processamento, logística e mercados consumidores — atendendo demandas regionais e apoiando o fornecimento de minerais para a indústria e a transição energética.",en:"Orbita operates across countries to efficiently integrate its global value chain, connecting production, processing, logistics and consumer markets — meeting regional demand and supporting mineral supply for industry and the energy transition."},
  "map.aboutTransition":{pt:"A presença global está alinhada à produção de cobre, níquel e cobalto — fundamentais para eletrificação, baterias e energia limpa — e ao fornecimento de minério de ferro de alta qualidade para processos com menor emissão de carbono.",en:"The global footprint is aligned with copper, nickel and cobalt production — essential for electrification, batteries and clean energy — and high-quality iron ore supply for lower-carbon production processes."},
  "map.presenceTypesTitle":{pt:"Tipos de atuação (mapa oficial)",en:"Activity types (official map)"},
  "map.activityTitle":{pt:"Atuação",en:"Activity"},
  "map.productsTitle":{pt:"Portfólio de produtos",en:"Product portfolio"},
  "map.countryListTitle":{pt:"Lista de países",en:"Country list"},
  "map.countryListSub":{pt:"Clique no país para ver a operação e iniciar a missão de treino.",en:"Click a country to see the operation and start the training mission."},
  "map.countryListFilterSub":{pt:"Países com: {label}",en:"Countries with: {label}"},
  "map.countryListEmpty":{pt:"Nenhum país com este filtro.",en:"No countries match this filter."},
  "map.countryListMore":{pt:"e mais {n} tipos",en:"and {n} more types"},
  "map.listActs":{pt:"Atuação",en:"Activity"},
  "map.listProducts":{pt:"Portfólio",en:"Portfolio"},
  "map.filterClear":{pt:"Limpar filtro: {label}",en:"Clear filter: {label}"},
  "map.filterAnnounce":{pt:"{n} países com {label}",en:"{n} countries with {label}"},
  "map.legendTitle":{pt:"Legenda",en:"Legend"},
  "map.legendIron":{pt:"Cadeia minério de ferro",en:"Iron ore chain"},
  "map.legendChain":{pt:"Etapa cadeia (clique)",en:"Chain stage (click)"},
  "map.hint":{pt:"Clique em um país ou na legenda para explorar — ou use a lista abaixo.",en:"Click a country or legend item to explore — or use the list below."},
  "map.hintIron":{pt:"Clique numa etapa no mapa animado ou na lista — proteja cada elo da cadeia Carajás → China.",en:"Click a stage on the animated map or in the list — protect each link in the Carajás → China chain."},
  "map.procWorld":{pt:"🌍 Mundo",en:"🌍 World"},
  "map.processTabsLabel":{pt:"Processos no mapa",en:"Map processes"},
  "map.procWorldTip":{pt:"Visão global — 19 países do mapa oficial Orbita.",en:"Global view — 19 countries from Orbita's official map."},
  "map.procIron":{pt:"⛓️ Cadeia ferro",en:"⛓️ Iron chain"},
  "map.procIronTip":{pt:"Cadeia animada Carajás → China — mina, usina, ferrovia, terminal, porto e cliente.",en:"Animated Carajás → China chain — mine, plant, railway, terminal, port and customer."},
  "map.procOffice":{pt:"🏢 Escritórios",en:"🏢 Offices"},
  "map.procOfficeTip":{pt:"Storytelling conectado nos escritórios Orbita — e-mail, estação, reunião, nuvem, remoto e SOC.",en:"Connected storytelling in Orbita offices — email, workstation, meeting, cloud, remote and SOC."},
  "map.hintOffice":{pt:"Clique numa cena no mapa animado ou na lista — cada decisão conecta a próxima etapa do escritório.",en:"Click a scene on the animated map or in the list — each decision connects to the next office stage."},
  "office.chainTitle":{pt:"🏢 Cadeia Digital — Escritórios Orbita",en:"🏢 Digital Chain — Orbita Offices"},
  "office.chainSub":{pt:"Do Rio a Singapura e Roterdã: storytelling conectado com situações reais de escritório. Uma brecha propaga o risco adiante.",en:"From Rio to Singapore and Rotterdam: connected storytelling with real office situations. One breach propagates risk downstream."},
  "office.chainFlow":{pt:"E-mail → Estação → Reunião → Nuvem → Remoto → SOC",en:"Email → Workstation → Meeting → Cloud → Remote → SOC"},
  "office.impactOk":{pt:"🟢 Escritórios íntegros: fluxo digital seguro entre Rio, Singapura e Roterdã.",en:"🟢 Offices intact: secure digital flow between Rio, Singapore and Rotterdam."},
  "office.impactBreach":{pt:"🔴 Brecha em \"{stage}\": o impacto se propaga pelos escritórios conectados — contratos, dados e reputação em risco.",en:"🔴 Breach at \"{stage}\": impact propagates across connected offices — contracts, data and reputation at risk."},
  "map.missionTitle":{pt:"Por que explorar o mapa?",en:"Why explore the map?"},
  "map.missionText":{pt:"Cada país é uma missão de treino: você conhece a operação da Orbita e pratica decisões de cyber security no contexto local.",en:"Each country is a training mission: learn Orbita's operations and practice cyber security decisions in the local context."},
  "map.expeditionTitle":{pt:"🔍 Expedição de treinamento",en:"🔍 Training expedition"},
  "map.expeditionSub":{pt:"Explore o mundo como numa missão global — desbloqueie desafios específicos em cada país.",en:"Explore the world like a global mission — unlock country-specific challenges."},
  "map.expeditionProgress":{pt:"{done}/{total} países explorados",en:"{done}/{total} countries explored"},
  "map.expeditionNext":{pt:"Próxima missão",en:"Next mission"},
  "map.expeditionGo":{pt:"▶️ Ir para próxima missão",en:"▶️ Go to next mission"},
  "map.expeditionDone":{pt:"Todos os países explorados — revise os com menor nota!",en:"All countries explored — revisit your lowest scores!"},
  "map.expeditionNew":{pt:"Novo destino",en:"New destination"},
  "map.trainingLabel":{pt:"6 situações de treino",en:"6 training scenarios"},
  "map.chainFlow":{pt:"Mina → Usina → Ferrovia → Terminal → Porto → Cliente",en:"Mine → Plant → Railway → Terminal → Port → Customer"},
  "map.resilience":{pt:"Maturidade operacional",en:"Operational maturity"},
  "map.resilienceTip":{pt:"Ataques reduzem produção, aumentam custos e emissões. Proteja cada elo da cadeia.",en:"Attacks reduce production, raise costs and emissions. Protect every link in the chain."},
  "map.chainListTitle":{pt:"Etapas da cadeia — clique para proteger",en:"Chain stages — click to protect"},
  "map.searchLabel":{pt:"Buscar país",en:"Search country"},
  "map.searchPh":{pt:"Buscar país…",en:"Search country…"},
  "map.searchEmpty":{pt:"Nenhum país encontrado.",en:"No country found."},
  "chain.title":{pt:"⛓️ Cadeia de Produção — Carajás → China",en:"⛓️ Production Chain — Carajás → China"},
  "chain.sub":{pt:"Sistema Norte da Orbita: da mina S11D (Carajás/PA), pela Estrada de Ferro Carajás (892 km) até o Terminal de Ponta da Madeira (São Luís/MA) e, por navio, até a China. Cada elo tem riscos cibernéticos — e uma brecha em qualquer ponto impacta toda a cadeia.",en:"Orbita's Northern System: from the S11D mine (Carajás/PA), along the 892 km Carajás Railway to the Ponta da Madeira Terminal (São Luís/MA) and, by ship, to China. Every link has cyber risks — and one breach anywhere impacts the whole chain."},
  "chain.play":{pt:"▶️ Proteger etapa",en:"▶️ Protect stage"},
  "chain.done":{pt:"✅ Protegida",en:"✅ Protected"},
  "chain.scenarios":{pt:"situações",en:"scenarios"},
  "chain.impactOk":{pt:"🟢 Cadeia íntegra: minério fluindo de Carajás (S11D) até a China sem interrupções.",en:"🟢 Chain intact: ore flowing from Carajás (S11D) to China without interruptions."},
  "chain.impactBreach":{pt:"🔴 Brecha em \"{stage}\": o impacto se propaga por toda a cadeia a jusante — produção parada, ~230 Mt/ano no porto em risco e o abastecimento da China ameaçado.",en:"🔴 Breach at \"{stage}\": the impact propagates down the whole chain — production halted, ~230 Mtpy at the port at risk and China's supply threatened."},
  "region.start":{pt:"▶️ Iniciar missão de treino",en:"▶️ Start training mission"},
  "quiz.integrity":{pt:"🏭 Saúde da operação",en:"🏭 Operation health"},
  "quiz.resilience":{pt:"🛡️ Proteção da operação",en:"🛡️ Operation protection"},
  "quiz.progress":{pt:"Pergunta {n} de {t}",en:"Question {n} of {t}"},
  "quiz.quit":{pt:"✖ Sair",en:"✖ Quit"},
  "quiz.prev":{pt:"← Voltar",en:"← Back"},
  "quiz.next":{pt:"Próxima →",en:"Next →"},
  "quiz.finish":{pt:"Concluir →",en:"Finish →"},
  "quiz.quitConfirm":{pt:"Sair da missão? O progresso desta partida não será salvo.",en:"Leave this mission? Progress in this run won't be saved."},
  "quit.title":{pt:"Sair da missão?",en:"Leave this mission?"},
  "quit.stay":{pt:"▶️ Continuar jogando",en:"▶️ Keep playing"},
  "quit.leave":{pt:"Sair mesmo assim",en:"Leave anyway"},
  "result.map":{pt:"🗺️ Mapa",en:"🗺️ Map"},
  "result.medals":{pt:"🏅 Medalhas",en:"🏅 Medals"},
  "result.rank":{pt:"📈 Ranking por equipe",en:"📈 Team ranking"},
  "boss.title":{pt:"🎯 Desafios / Crises",en:"🎯 Challenges / Crises"},
  "boss.sub":{pt:"Experiências estilo mesa com storytelling conectado e mapa vetorial animado — cada decisão avança a próxima cena.",en:"Tabletop experiences with connected storytelling and animated vector map — each decision advances the next scene."},
  "boss.storyMapLabel":{pt:"Storytelling · Mapa",en:"Storytelling · Map"},
  "boss.threat":{pt:"🛡️ Ameaça",en:"🛡️ Threat"},
  "boss.energy":{pt:"energia do ataque",en:"attack energy"},
  "boss.ops":{pt:"🏭 Maturidade operacional",en:"🏭 Operational maturity"},
  "chain.bossTitle":{pt:"⛓️ Cadeia Norte — Carajás → China",en:"⛓️ Northern Chain — Carajás → China"},
  "chain.playBoss":{pt:"▶️ Proteger a cadeia",en:"▶️ Protect the chain"},
  "chain.bossTag":{pt:"Aventura logística · 8 etapas",en:"Logistics adventure · 8 stages"},
  "boss.impactOk":{pt:"Operação protegida",en:"Operation protected"},
  "boss.impactBad":{pt:"Operação comprometida",en:"Operation compromised"},
  "boss.scene":{pt:"Cena",en:"Scene"},
  "boss.scenes":{pt:"cenas",en:"scenes"},
  "boss.scenario":{pt:"Cenário",en:"Scenario"},
  "boss.storyLabel":{pt:"História",en:"Story"},
  "boss.next":{pt:"Próxima cena →",en:"Next scene →"},
  "boss.finish":{pt:"Ver desfecho →",en:"See ending →"},
  "boss.backList":{pt:"← Voltar a Desafios / Crises",en:"← Back to Challenges / Crises"},
  "boss.defeated":{pt:"🐉 Missão tabletop concluída!",en:"🐉 Tabletop mission complete!"},
  "boss.contained":{pt:"Avaliação de resiliência",en:"Resilience assessment"},
  "boss.replay":{pt:"🔁 Repetir missão",en:"🔁 Replay mission"},
  "boss.maturityTitle":{pt:"Índice de Resiliência",en:"Resilience Index"},
  "boss.debriefGood":{pt:"O que você fez bem",en:"What you did well"},
  "boss.debriefImprove":{pt:"O que pode melhorar",en:"What can improve"},
  "boss.guardianRank":{pt:"Patente de resiliência",en:"Resilience rank"},
  "boss.bestRun":{pt:"Melhor resultado",en:"Best run"},
  "boss.notPlayed":{pt:"Não jogado",en:"Not played"},
  "profile.moreTitle":{pt:"Ver estatísticas e detalhes",en:"View stats and details"},
  "profile.bossRes":{pt:"🏭 Maturidade em Desafios / Crises",en:"🏭 Maturity in Challenges / Crises"},
  "profile.bossResSub":{pt:"Sua maturidade operacional nas crises simuladas — repita para subir de patente.",en:"Your operational maturity in simulated crises — replay to advance your rank."},
  "profile.completionTitle":{pt:"🎯 Sua jornada",en:"🎯 Your journey"},
  "profile.completionPct":{pt:"da jornada concluída",en:"of journey complete"},
  "profile.nextMilestone":{pt:"Próximo marco",en:"Next milestone"},
  "profile.reviewTitle":{pt:"📚 Revisão e reforço",en:"📚 Review and reinforcement"},
  "profile.reviewSub":{pt:"Treine erros sem penalidade — acertos contam no % do tema e no radar. Use o plano para focar o que está fraco.",en:"Train mistakes with no penalty — correct answers count toward theme % and the radar. Use the plan to focus weak areas."},
  "profile.connectNote":{pt:"Mapa, missões e crises alimentam o mesmo XP, conquistas (álbum), maturidade e certificado.",en:"Map, missions and crises feed the same XP, achievements (album), maturity and certificate."},
  "profile.albumSub":{pt:"Cada figurinha é uma conquista — toque para ver o que falta desbloquear.",en:"Each sticker is an achievement — tap to see what's left to unlock."},
  "profile.radarSub":{pt:"Visão geral dos temas — o plano acima prioriza os abaixo de 70%.",en:"Theme overview — the plan above prioritizes those below 70%."},
  "profile.reviewTrain":{pt:"📚 Treinar meus erros",en:"📚 Train my mistakes"},
  "profile.reviewTrainDue":{pt:"📚 Treinar meus erros ({n} pendentes)",en:"📚 Train my mistakes ({n} pending)"},
  "profile.themesWeak":{pt:"📉 Temas para reforçar",en:"📉 Themes to strengthen"},
  "profile.themesWeakSub":{pt:"Conectado ao plano de estudo — abaixo de 70% de acerto.",en:"Linked to the study plan — below 70% accuracy."},
  "profile.reviewBank":{pt:"📝 Banco de perguntas (autores)",en:"📝 Question bank (authors)"},
  "profile.backupTitle":{pt:"💾 Backup local",en:"💾 Local backup"},
  "profile.backupSub":{pt:"Exporte ou importe seu progresso neste navegador (JSON).",en:"Export or import your progress in this browser (JSON)."},
  "profile.export":{pt:"⬇️ Exportar JSON",en:"⬇️ Export JSON"},
  "profile.import":{pt:"⬆️ Importar JSON",en:"⬆️ Import JSON"},
  "profile.importOk":{pt:"Progresso importado com sucesso!",en:"Progress imported successfully!"},
  "profile.importErr":{pt:"Arquivo inválido ou corrompido.",en:"Invalid or corrupted file."},
  "profile.certCheckTitle":{pt:"Critérios do selo",en:"Seal criteria"},
  "profile.resIndex":{pt:"Índice médio",en:"Average index"},
  "onboard.skip":{pt:"Pular",en:"Skip"},
  "onboard.next":{pt:"Próximo →",en:"Next →"},
  "onboard.start":{pt:"▶️ Começar",en:"▶️ Start"},
  "onboard.step":{pt:"Passo",en:"Step"},
  "onboard.reopen":{pt:"Guia",en:"Guide"},
  "onboard.reopenTip":{pt:"Reabrir guia de introdução ao jogo",en:"Reopen the game introduction guide"},
  "quiz.personal":{pt:"💡 Na sua vida",en:"💡 In your life"},
  "progress.hub":{pt:"🔗 Como os modos se conectam",en:"🔗 How modes connect"},
  "progress.hubSub":{pt:"Tudo alimenta o mesmo progresso: XP, temas, conquistas, resiliência e certificado.",en:"Everything feeds the same progress: XP, themes, achievements, resilience and certificate."},
  "progress.reviewBank":{pt:"📋 Revisar banco de perguntas",en:"📋 Review question bank"},
  "progress.map":{pt:"Mapa",en:"Map"},
  "progress.mapD":{pt:"Campanhas por país no mapa mundial.",en:"Country campaigns on the world map."},
  "progress.daily":{pt:"Diária",en:"Daily"},
  "progress.dailyD":{pt:"5 situações (2 revisões de erros + temas fracos). Mantém sequência.",en:"5 scenarios (2 error reviews + weak themes). Keeps streak."},
  "progress.boss":{pt:"Desafios / Crises",en:"Challenges / Crises"},
  "progress.bossD":{pt:"Simulações estilo mesa (10 cenas cada). Contam para maturidade, conquistas e selo do certificado.",en:"Tabletop simulations (10 scenes each). Count toward maturity, achievements and certificate seal."},
  "progress.bossM":{pt:"Crises vencidas: {crises} · Cenas Carajás: {chain} · Maturidade média: {mat}",en:"Crises beaten: {crises} · Carajás scenes: {chain} · Avg maturity: {mat}"},
  "progress.bossNote":{pt:"Métricas independentes: crises (7 simulações), cenas da cadeia (8 etapas) e média de índice nas crises já jogadas.",en:"Independent metrics: crises (7 simulations), chain scenes (8 stages) and average index in crises you've played."},
  "progress.weekly":{pt:"Semanal",en:"Weekly"},
  "progress.weeklyD":{pt:"Metas que somam automaticamente enquanto você joga qualquer modo acima.",en:"Goals that add up automatically as you play any mode above."},
  "daily.title":{pt:"📅 Atividade de hoje",en:"📅 Today's activity"},
  "daily.play":{pt:"▶️ Começar atividade de hoje",en:"▶️ Start today's activity"},
  "weekly.title":{pt:"🏆 Metas da semana",en:"🏆 Weekly goals"},
  "weekly.intro":{pt:"Objetivos que renovam toda semana. Progridem enquanto você faz a atividade diária, jornadas no mapa e simulações de crise.",en:"Goals that refresh every week. They progress as you do today's activity, map journeys and crisis simulations."},
  "weekly.play":{pt:"🗺️ Jornada no mapa",en:"🗺️ Map journey"},
  "shop.title":{pt:"🛒 Loja de Recompensas",en:"🛒 Rewards Shop"},
  "shop.sub":{pt:"Use suas moedas para desbloquear avatares e itens cosméticos.",en:"Use your coins to unlock avatars and cosmetic items."},
  "shop.avatars":{pt:"🎭 Avatares",en:"🎭 Avatars"},
  "shop.frames":{pt:"🖼️ Molduras",en:"🖼️ Frames"},
  "shop.themes":{pt:"🎨 Temas visuais",en:"🎨 Visual themes"},
  "shop.equip":{pt:"Equipar",en:"Equip"},
  "shop.equipped":{pt:"Equipado",en:"Equipped"},
  "shop.default":{pt:"Padrão",en:"Default"},
  "a11y.reset":{pt:"Restaurar padrão",en:"Restore defaults"},
  "a11y.resetD":{pt:"Desativa todas as opções de acessibilidade e volta ao modo original.",en:"Turns off all accessibility options and returns to the original mode."},
  "a11y.resetDone":{pt:"Acessibilidade restaurada ao padrão.",en:"Accessibility restored to defaults."},
  "profile.title":{pt:"📊 Dashboard do Guardião",en:"📊 Guardian Dashboard"},
  "profile.sub":{pt:"Sua evolução acumulada (salva neste navegador).",en:"Your accumulated progress (saved in this browser)."},
  "profile.radar":{pt:"🎯 Radar de Competências",en:"🎯 Competency Radar"},
  "profile.ach":{pt:"🏅 Conquistas",en:"🏅 Achievements"},
  "profile.achSub":{pt:"Medalhas desbloqueadas na sua jornada — cada uma também vira figurinha no álbum.",en:"Medals unlocked on your journey — each one also becomes a sticker in the album."},
  "profile.certTitle":{pt:"📜 Certificado",en:"📜 Certificate"},
  "profile.certSub":{pt:"Gere seu certificado a qualquer momento com seu progresso atual — não é necessário concluir o jogo.",en:"Generate your certificate anytime with your current progress — no need to finish the game."},
  "profile.certAria":{pt:"Prévia do certificado de participação",en:"Participation certificate preview"},
  "profile.certGenerate":{pt:"🔄 Atualizar prévia",en:"🔄 Refresh preview"},
  "profile.certDownload":{pt:"⬇️ Baixar PNG",en:"⬇️ Download PNG"},
  "profile.certPrint":{pt:"🖨️ Imprimir",en:"🖨️ Print"},
  "profile.certAch":{pt:"Conquistas",en:"Achievements"},
  "profile.certViewCard":{pt:"🃏 Carta",en:"🃏 Card"},
  "profile.certViewFull":{pt:"📜 Completo",en:"📜 Full"},
  "profile.certFormat":{pt:"Formato da prévia",en:"Preview format"},
  "profile.albumTitle":{pt:"📒 Álbum de Conquistas",en:"📒 Achievement Album"},
  "profile.albumSpreadTitle":{pt:"GUARDIÃO CIBERNÉTICO",en:"CYBER GUARDIAN"},
  "profile.albumPasted":{pt:"figurinhas coladas",en:"stickers pasted"},
  "profile.albumLocked":{pt:"Figurinha faltando",en:"Missing sticker"},
  "profile.albumDone":{pt:"Colada",en:"Pasted"},
  "profile.albumComplete":{pt:"ÁLBUM DE CONQUISTAS COMPLETO",en:"ACHIEVEMENT ALBUM COMPLETE"},
  "profile.albumCollected":{pt:"CONQUISTAS COLETADAS",en:"ACHIEVEMENTS COLLECTED"},
  "profile.certCardType":{pt:"Guardião Cibernético",en:"Cyber Guardian"},
  "profile.certCardFlavor":{pt:"\"Proteger operações críticas começa com cada decisão consciente.\"",en:"\"Protecting critical operations starts with every conscious choice.\""},
  "profile.certCardLvShort":{pt:"Nv.",en:"Lv."},
  "profile.certCardLevel":{pt:"Nível",en:"Level"},
  "profile.certCardXp":{pt:"XP",en:"XP"},
  "profile.certCardCrises":{pt:"Crises",en:"Crises"},
  "profile.certCardChain":{pt:"Cadeia",en:"Chain"},
  "profile.certCardCountries":{pt:"Países",en:"Countries"},
  "profile.certCardAch":{pt:"Conquistas",en:"Achievements"},
  "profile.certCardRes":{pt:"Resiliência",en:"Resilience"},
  "profile.certCardStreak":{pt:"Sequência",en:"Streak"},
  "profile.certCardFooter":{pt:"Ferramenta educativa interna",en:"Internal educational tool"},
  "manager.title":{pt:"🧭 Painel do Gestor",en:"🧭 Manager Panel"},
  "manager.sub":{pt:"Visão agregada por equipe (anônima). Nenhum indivíduo é identificado.",en:"Aggregated team view (anonymous). No individual is identified."},
  "manager.export":{pt:"⬇️ Exportar CSV (equipes)",en:"⬇️ Export CSV (teams)"},
  "manager.exportThemes":{pt:"⬇️ Exportar temas (CSV)",en:"⬇️ Export themes (CSV)"},
  "manager.byTeam":{pt:"Taxa de acerto por equipe",en:"Accuracy by team"},
  "manager.weakest":{pt:"Temas mais fracos (geral)",en:"Weakest themes (overall)"},
  "common.home":{pt:"🏠 Início",en:"🏠 Home"},
  "nav.home":{pt:"Início",en:"Home"},
  "nav.map":{pt:"Mapa",en:"Map"},
  "nav.more":{pt:"Mais",en:"More"},
  "nav.boss":{pt:"Desafios / Crises",en:"Challenges / Crises"},
  "nav.daily":{pt:"Missões",en:"Missions"},
  "nav.missions":{pt:"Missões",en:"Missions"},
  "nav.weekly":{pt:"Semanal",en:"Weekly"},
  "nav.shop":{pt:"Loja",en:"Shop"},
  "nav.stats":{pt:"Eu",en:"Me"},
  "nav.manager":{pt:"Gestor",en:"Manager"},
  "nav.tip.home":{pt:"Início — idioma, acessibilidade e começar",en:"Home — language, accessibility and start"},
  "nav.tip.map":{pt:"Mapa — campanhas por país",en:"Map — country campaigns"},
  "nav.tip.more":{pt:"Mais opções — início e gestor",en:"More options — home and manager"},
  "nav.tip.boss":{pt:"Desafios / Crises — crises simuladas estilo mesa com storytelling",en:"Challenges / Crises — tabletop simulated crises with storytelling"},
  "nav.tip.weekly":{pt:"Desafios semanais",en:"Weekly challenges"},
  "nav.tip.shop":{pt:"Loja de recompensas",en:"Rewards shop"},
  "nav.tip.stats":{pt:"Seu progresso e medalhas",en:"Your progress and medals"},
  "nav.tip.manager":{pt:"Painel do gestor",en:"Manager dashboard"},
  "footer.txt":{pt:"Da mina ao porto, a segurança passa por você. Um clique pode impactar a operação... o seu pode proteger a Orbita.",en:"From mine to port, security starts with you. One click can impact operations... yours can protect Orbita."},
  "settings.uxV122Off":{pt:"Nova interface ativa (v123).",en:"New interface active (v123)."},
  "settings.demoTitle":{pt:"🧪 Menu demo (temporário)",en:"🧪 Demo menu (temporary)"},
  "settings.demoSub":{pt:"Avance o progresso do curso e teste a jornada integrada 0→100%.",en:"Advance course progress and test the full 0→100% journey."},
  "settings.demoOpen":{pt:"Abrir menu demo",en:"Open demo menu"},
  "nav.tip.missions":{pt:"Atividade de hoje e metas da semana",en:"Today's activity and weekly goals"}
};
/* Textos da interface v122 — ativados com S.uxV122 ou ?ux=122 na URL */
var UI_V122 = {
  "home.badge":{pt:"Operações globais • Cyber Security",en:"Global operations • Cyber Security"},
  "home.desc":{pt:"Sua missão é proteger as operações da organização em todo o mundo por meio de decisões seguras no ambiente digital.",en:"Your mission is to protect the organization's operations worldwide through secure decisions in the digital environment."},
  "home.previewLoop":{pt:"Seu loop de treino: 📅 Missão diária → 🗺️ Mapa global → 🎯 Desafios / Crises",en:"Your training loop: 📅 Daily mission → 🗺️ World map → 🎯 Challenges / Crises"},
  "home.firstDay":{pt:"Dia 1 da sua ofensiva — 5 minutos de treino bastam para começar.",en:"Day 1 of your streak — 5 minutes of training is enough to start."},
  "home.nextDaily":{pt:"Sua missão diária está esperando",en:"Your daily mission is waiting"},
  "home.nextDailySub":{pt:"5 situações rápidas mantêm sua ofensiva e priorizam o que você errou.",en:"5 quick scenarios keep your streak and prioritize what you missed."},
  "home.nextReviewSub":{pt:"Você tem {n} itens em revisão espaçada prontos para hoje.",en:"You have {n} items in spaced review ready for today."},
  "home.nextCampaignSub":{pt:"Sua expedição continua — proteja o próximo país no mapa e avance na meta semanal.",en:"Your expedition continues — protect the next country on the map and advance your weekly goal."},
  "home.nextGoDaily":{pt:"▶️ Jogar diária",en:"▶️ Play daily"},
  "tip.daily":{pt:"5 situações rápidas — 2 revisam erros anteriores. Mantém sua ofensiva!",en:"5 quick scenarios — 2 review past mistakes. Keeps your streak!"},
  "session.streakKept":{pt:"🔥 Ofensiva mantida hoje!",en:"🔥 Streak kept today!"},
  "session.streakStart":{pt:"🔥 Ofensiva iniciada — volte amanhã!",en:"🔥 Streak started — come back tomorrow!"},
  "weekly.checkDaily":{pt:"Jogar 5 dias (ofensiva)",en:"Play 5 days (streak)"},
  "weekly.checkCampaign":{pt:"3 campanhas no mapa",en:"3 map campaigns"},
  "mgr.kpiStreak":{pt:"Ofensiva média",en:"Avg streak"},
  "streak.title":{pt:"🔥 Ofensiva",en:"🔥 Streak"},
  "streak.today":{pt:"✅ Ofensiva mantida hoje!",en:"✅ Streak kept today!"},
  "streak.risk":{pt:"⚠️ Jogue hoje para não perder sua ofensiva!",en:"⚠️ Play today to keep your streak!"},
  "streak.neutral":{pt:"Jogue hoje para iniciar sua ofensiva!",en:"Play today to start your streak!"},
  "streak.new":{pt:"🔥 Ofensiva iniciada! Dia 1.",en:"🔥 Streak started! Day 1."},
  "streak.up":{pt:"🔥 Ofensiva: ",en:"🔥 Streak: "},
  "streak.lost":{pt:"Ofensiva reiniciada.",en:"Streak reset."},
  "streak.bonus":{pt:"Bônus de ofensiva!",en:"Streak bonus!"},
  "streak.bonusXp":{pt:"Bônus de ofensiva! +{n} XP",en:"Streak bonus! +{n} XP"},
  "hud.tip.streak":{pt:"Ofensiva — dias seguidos jogando; mantenha a sequência para bônus de moedas.",en:"Streak — consecutive days played; keep it going for coin bonuses."},
  "daily.doneTitle":{pt:"🎉 Missão diária concluída!",en:"🎉 Daily mission complete!"},
  "daily.doneSub":{pt:"Volte amanhã para manter sua ofensiva e revisar novos cenários.",en:"Come back tomorrow to keep your streak and review new scenarios."},
  "daily.streakRisk":{pt:"Sua ofensiva está em risco — jogue para manter a sequência.",en:"Your streak is at risk — play to keep it going."},
  "daily.streakOk":{pt:"Ofensiva mantida hoje — continue evoluindo.",en:"Streak kept today — keep improving."},
  "daily.rewardLine":{pt:"+50 XP · mantém ofensiva 🔥",en:"+50 XP · keeps streak 🔥"},
  "daily.srsDue":{pt:"{n} revisões espaçadas priorizadas na missão de hoje",en:"{n} spaced reviews prioritized in today's mission"},
  "daily.title":{pt:"📅 Missões Diárias",en:"📅 Daily Missions"},
  "daily.play":{pt:"▶️ Jogar missão do dia",en:"▶️ Play today's mission"},
  "weekly.title":{pt:"🏆 Desafios Semanais",en:"🏆 Weekly Challenges"},
  "weekly.intro":{pt:"Metas maiores que renovam toda semana. Progridem enquanto você joga campanhas, diárias e Desafios / Crises.",en:"Bigger goals that refresh every week. They progress as you play campaigns, dailies and Challenges / Crises."},
  "weekly.play":{pt:"🗺️ Jogar campanha",en:"🗺️ Play a campaign"},
  "progress.dailyD":{pt:"5 situações (2 revisões de erros + temas fracos). Mantém ofensiva.",en:"5 scenarios (2 error reviews + weak themes). Keeps streak."},
  "profile.streakStat":{pt:"Ofensiva",en:"Streak"},
  "nav.tip.missions":{pt:"Missões diárias e desafios semanais",en:"Daily missions and weekly challenges"},
  "home.weekLine":{pt:"Semana: {theme} · Acertos {correct}/20 · Campanhas {campaign}/3 · Missão {daily}",en:"Week: {theme} · Correct {correct}/20 · Campaigns {campaign}/3 · Mission {daily}"}
};
function ensureUxState(){ if(S.uxV122===undefined) S.uxV122=false; }
function uxLegacy(){ ensureUxState(); return !!S.uxV122; }
function t(key){
  if(uxLegacy() && UI_V122[key]){ var lv=UI_V122[key]; return lv[L()]||lv.pt; }
  var e=UI[key]; return e? (e[L()]||e.pt) : key;
}
function initUxFromUrl(){
  ensureUxState();
  var m=location.search.match(/[?&]ux=(122|v122|new|v2|123)(?:&|$)/i);
  if(m){
    var v=m[1].toLowerCase();
    S.uxV122=(v==="122"||v==="v122");
  } else {
    S.uxV122=false;
  }
  save();
}
function applyUxMode(){
  ensureUxState();
  document.body.classList.toggle("ux-v122",uxLegacy());
  document.body.classList.toggle("ux-v2",!uxLegacy());
}
function setUxV122(on){
  S.uxV122=!!on; save(); applyUxMode();
  applyI18n(); renderNextStep(); renderDaily(); renderWeekly();
  renderHomeHowStrip(); renderMissionsFocus(); renderUxBanner();
  var cb=$("optUxV122Settings"); if(cb) cb.checked=S.uxV122;
  toast(on?t("settings.uxV122On"):t("settings.uxV122Off"));
}
function streakRiskMsg(){
  ensureStreak();
  var n=S.streak.count||0, msg=t("streak.risk");
  return msg.indexOf("{n}")>=0?msg.replace("{n}",String(n)):msg;
}
function roleBasedNextSub(){
  var r=ROLES.filter(function(x){ return x.id===S.role; })[0];
  var tm=TEAMS.filter(function(x){ return x.id===S.team; })[0];
  if(!r) return "";
  var teamStr=tm?tt(tm)+(L()==="pt"?" · ":" · "):"";
  return (L()==="pt"?"Cenários da sua operação: ":"Scenarios from your operation: ")+teamStr+(L()==="pt"?r.ptd:r.end);
}
function weeklyGoalsDoneCount(){
  ensureWeekly();
  var wp=S.weekly.prog||{}, n=0;
  WEEKLY.forEach(function(w){ if((wp[w.id]||0)>=w.goal) n++; });
  return n;
}
function getWeekMicroGoal(){
  ensureWeekly(); ensureDaily();
  var wp=S.weekly.prog||{};
  if(!S.daily.done.mission) return {key:"daily", text:t("home.weekNextDaily")};
  var remM=Math.max(0,3-(wp.campaign||0));
  if(remM>0) return {key:"campaign", text:t("home.weekNextMap").replace("{n}",String(remM))};
  var remB=Math.max(0,1-(wp.boss||0));
  if(remB>0) return {key:"boss", text:t("home.weekNextBoss")};
  var remC=Math.max(0,20-(wp.correct||0));
  if(remC>0) return {key:"correct", text:t("home.weekNextCorrect").replace("{n}",String(remC))};
  var remT=Math.max(0,8-(wp.theme||0));
  if(remT>0) return {key:"theme", text:t("home.weekNextTheme").replace("{n}",String(remT))};
  return {key:"done", text:t("home.weekRemDone")};
}
function computeCtaHint(ns){
  if(!ns) return "";
  if(ns.ico==="📅") return t("home.ctaHintDaily");
  if(ns.ico==="🗺️") return t("home.ctaHintMap");
  if(ns.ico==="🎯") return t("home.ctaHintBoss");
  if(ns.ico==="📚") return t("home.ctaHintReview");
  return "";
}
function getNextAchievement(){
  ensureStreak();
  var list=[], i, m, left;
  for(i=0;i<MEDALS.length;i++){
    m=MEDALS[i];
    if(S.medals[m.id]) continue;
    left=0;
    if(m.id==="daily") left=Math.max(0,1-(S.dailyTotal||0));
    else if(m.id==="streak7") left=Math.max(0,7-(S.streak.count||0));
    else if(m.id==="streak30") left=Math.max(0,30-(S.streak.best||0));
    else if(m.id==="first") left=Object.keys(S.done||{}).length>=1?0:1;
    else if(m.id==="boss") left=bossCompletedCount()>=1?0:1;
    else left=99;
    list.push({medal:m, left:left});
  }
  list.sort(function(a,b){ return a.left-b.left; });
  return list[0]||null;
}
function teamSocialTodayCount(){
  if(!S.team) return 0;
  var bases={mina:12,ferrovia:9,porto:11,corporativo:15,ti:8,pelotizacao:10,energia:9,logistica:11};
  var base=bases[S.team]||10;
  return base+(new Date().getDay()%5);
}
function renderHomeProfileBadges(){
  var host=$("homeProfileBadges"); if(!host) return;
  if(uxLegacy()||!setupComplete()){ host.hidden=true; host.innerHTML=""; return; }
  var tm=TEAMS.filter(function(x){ return x.id===S.team; })[0];
  var r=ROLES.filter(function(x){ return x.id===S.role; })[0];
  host.innerHTML="";
  if(tm){ host.innerHTML+='<span class="home-profile-badge"><span aria-hidden="true">'+tm.ico+'</span> '+tt(tm)+'</span>'; }
  if(r){ host.innerHTML+='<span class="home-profile-badge"><span aria-hidden="true">👤</span> '+(L()==="pt"?r.ptd:r.end)+'</span>'; }
  host.hidden=!host.innerHTML;
}
function renderHomeNextAchievement(){
  var host=$("homeNextAchievement"); if(!host) return;
  if(uxLegacy()||!S.onboardingDone){ host.hidden=true; return; }
  var next=getNextAchievement();
  if(!next||next.left>50){ host.hidden=true; return; }
  var m=next.medal, hint=medalHint(m.id)||"";
  host.hidden=false;
  host.innerHTML='<div class="home-next-ach-k">'+t("home.nextAchK")+'</div>'
    +'<p class="home-next-ach-t">'+m.ico+' '+tt(m.name)+'</p>'
    +(next.left>0&&next.left<99?'<p class="home-next-ach-d">'+t("home.nextAchLeft").replace("{n}",String(next.left))+' · '+hint+'</p>':'<p class="home-next-ach-d">'+hint+'</p>');
}
function renderHomeTeamSocial(){
  var el=$("homeTeamSocial"); if(!el) return;
  if(uxLegacy()||!S.onboardingDone||!S.team){ el.hidden=true; return; }
  var tm=TEAMS.filter(function(x){ return x.id===S.team; })[0];
  if(!tm){ el.hidden=true; return; }
  el.hidden=false;
  el.textContent=t("home.teamSocial").replace("{team}",tt(tm)).replace("{n}",String(teamSocialTodayCount()));
}
function renderHomeStickyCta(){
  var wrap=$("homeStickyCta"), btn=$("homeStickyBtn");
  if(!wrap||!btn) return;
  ensureDaily();
  var onHome=$("screenHome")&&$("screenHome").classList.contains("active");
  var show=onHome&&S.onboardingDone&&!uxLegacy()&&!S.daily.done.mission;
  wrap.hidden=!show;
  document.body.classList.toggle("home-sticky-visible",show);
  if(show){
    var ns=computeNextStep();
    btn.textContent=ns.btn||t("home.playNow");
    btn.onclick=playNow;
  }
}
function profileThemeList(){
  var role=ROLE_THEMES[S.role]||[], team=TEAM_THEMES[S.team]||[], out=[], seen={}, i;
  for(i=0;i<role.length;i++){ if(!seen[role[i]]){ seen[role[i]]=1; out.push(role[i]); } }
  for(i=0;i<team.length;i++){ if(!seen[team[i]]){ seen[team[i]]=1; out.push(team[i]); } }
  return out;
}
function questionMatchesProfile(q){
  var role=S.role||"field", team=S.team||"mina";
  if(q.roles&&q.roles.indexOf(role)<0){
    var rt=ROLE_THEMES[role]||[];
    if(rt.indexOf(q.theme)<0) return false;
  }
  if(q.teams&&q.teams.indexOf(team)<0){
    var tt2=TEAM_THEMES[team]||[];
    if(tt2.indexOf(q.theme)<0) return false;
  }
  return true;
}
function questionProfileScore(q){
  var themes=profileThemeList(), score=0;
  if(q.teams&&q.teams.indexOf(S.team)>=0) score+=5;
  if(q.roles&&q.roles.indexOf(S.role)>=0) score+=4;
  if(q.qByTeam&&q.qByTeam[S.team]) score+=6;
  if(typeof PROFILE!=="undefined") score+=PROFILE.correlationScore(S.team,S.role);
  if(themes.indexOf(q.theme)>=0) score+=2;
  return score;
}
function applyTeamScenarioText(text,team){
  if(!text||!team||PROFILE.teamSkipsScenarioAdapt(team)) return text;
  var rep=TEAM_SCENARIO_REPLACE[team]; if(!rep) return text;
  var lang=L(), rules=rep[lang]||rep.pt||[], out=text, i;
  for(i=0;i<rules.length;i++) out=out.replace(rules[i][0],rules[i][1]);
  return out;
}
function getQuestionField(q,field){
  field=field||"q";
  var team=S.team||"mina", byTeam=q.qByTeam&&q.qByTeam[team];
  if(byTeam&&byTeam[field]) return tt(byTeam[field]);
  var raw=field==="q"?q.q:q[field];
  var text=tt(raw);
  if(field==="q"&&!PROFILE.teamSkipsScenarioAdapt(team)&&(q.theme==="port"||/\bporto\b|\bport terminal\b/i.test(text)))
    text=applyTeamScenarioText(text,team);
  return text;
}
function pickProfileQuestions(pool,count){
  count=count||6;
  var list=pool.filter(function(q){ return questionMatchesProfile(q); });
  if(list.length<count) list=pool.slice();
  var tierA=[], tierB=[], tierC=[], i, s;
  for(i=0;i<list.length;i++){
    s=questionProfileScore(list[i]);
    if(s>=5) tierA.push(list[i]); else if(s>=3) tierB.push(list[i]); else tierC.push(list[i]);
  }
  var picked=[].concat(shuffle(tierA),shuffle(tierB),shuffle(tierC)), seen={}, out=[];
  for(i=0;i<picked.length&&out.length<count;i++){
    var k=picked[i].id||("t"+picked[i].theme+i);
    if(!seen[k]){ seen[k]=1; out.push(picked[i]); }
  }
  if(out.length<count) shuffle(list).forEach(function(q){
    var k2=q.id||("f"+q.theme);
    if(!seen[k2]&&out.length<count){ seen[k2]=1; out.push(q); }
  });
  return shuffleQuestions(out.slice(0,count));
}
function nextStepPreviewText(ns){
  if(!ns||uxLegacy()) return "";
  ensureDaily(); ensureWeekly();
  if(!S.daily.done.mission) return "";
  if((S.weekly.prog.campaign||0)<3) return t("home.howMap");
  return t("home.howCrisis");
}
function renderHomeHowStrip(){
  var el=$("homeHowStrip"); if(!el) return;
  if(uxLegacy()||!S.onboardingDone){ el.hidden=true; return; }
  el.hidden=false;
  if(el.tagName==="DETAILS") el.open=(S.dailyTotal||0)<3;
}
function renderMissionsFocus(){
  var ban=$("missionsFocusBanner"), also=$("missionsAlsoCard");
  if(ban){
    if(uxLegacy()) ban.hidden=true;
    else{
      ban.hidden=false;
      var focus=$("missionsFocusText");
      if(focus){
        ensureDaily();
        focus.textContent=!S.daily.done.mission?t("missions.focusDaily"):t("missions.focusMap");
      }
    }
  }
  if(also) also.hidden=uxLegacy();
}
function renderUxBanner(){
  var el=$("uxV122Banner"); if(!el) return;
  el.hidden=!uxLegacy();
  if(!el.hidden) el.textContent=t("settings.uxV122On");
}
function renderHeroUxState(){
  var scene=$("heroScene"), card=$("heroCard");
  var shortEl=$("heroLeadShort"), longEl=$("heroLeadLong");
  if(card) card.classList.toggle("hero-ux-v2",!uxLegacy());
  if(shortEl&&longEl){
    if(uxLegacy()){ shortEl.hidden=true; longEl.hidden=false; }
    else if(!S.onboardingDone){ shortEl.hidden=false; longEl.hidden=true; }
    else if(S.onboardingDone&&!S.heroExpanded){ shortEl.hidden=true; longEl.hidden=true; }
    else { shortEl.hidden=true; longEl.hidden=false; }
  }
  if(scene) scene.setAttribute("aria-label",t("home.heroDecorAria"));
}
function langFlagSvg(lang){
  if(lang==="pt") return '<svg viewBox="0 0 36 24" class="flag-chip" aria-hidden="true"><rect width="36" height="24" fill="#009b3a"/><polygon points="18,2 34,12 18,22 2,12" fill="#fedf00"/><circle cx="18" cy="12" r="5.5" fill="#002776"/></svg>';
  return '<svg viewBox="0 0 36 24" class="flag-chip" aria-hidden="true"><rect width="36" height="24" fill="#B22234"/><rect y="2.3" width="36" height="2.3" fill="#fff"/><rect y="6.9" width="36" height="2.3" fill="#fff"/><rect y="11.5" width="36" height="2.3" fill="#fff"/><rect y="16.1" width="36" height="2.3" fill="#fff"/><rect y="20.7" width="36" height="2.3" fill="#fff"/><rect width="14.4" height="13.8" fill="#3C3B6E"/><circle cx="3.2" cy="2.8" r=".9" fill="#fff"/><circle cx="7.2" cy="2.8" r=".9" fill="#fff"/><circle cx="11.2" cy="2.8" r=".9" fill="#fff"/><circle cx="5.2" cy="5.8" r=".9" fill="#fff"/><circle cx="9.2" cy="5.8" r=".9" fill="#fff"/><circle cx="3.2" cy="8.8" r=".9" fill="#fff"/><circle cx="7.2" cy="8.8" r=".9" fill="#fff"/><circle cx="11.2" cy="8.8" r=".9" fill="#fff"/></svg>';
}
function updateLangSwitch(){
  document.querySelectorAll(".lang-switch-btn").forEach(function(b){
    b.setAttribute("aria-pressed", b.getAttribute("data-lang")===L()?"true":"false");
  });
}
function applyI18n(){
  document.querySelectorAll("[data-i18n]").forEach(function(el){ el.innerHTML = t(el.getAttribute("data-i18n")); });
  document.querySelectorAll("[data-i18n-ph]").forEach(function(el){ el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
  document.querySelectorAll("[data-i18n-attr]").forEach(function(el){
    el.getAttribute("data-i18n-attr").split(";").forEach(function(pair){
      var p=pair.split(":"); if(p.length===2) el.setAttribute(p[0].trim(), t(p[1].trim()));
    });
  });
  document.documentElement.setAttribute("lang", L()==="pt"?"pt-BR":"en");
  updateLangSwitch();
  applyHudTips();
  renderA11yMenu(); renderA11yCatalog(); updateHeroCaption(); renderSettingsUi();
}
function renderSettingsUi(){
  var sel=$("themeSelect");
  if(sel){
    var o=sel.options;
    if(o[0]) o[0].textContent=t("settings.themeDefault");
    if(o[1]) o[1].textContent=t("settings.themeLight");
    if(o[2]) o[2].textContent=t("settings.themeDark");
    sel.value=S.theme||"default";
  }
  var dl=$("glossaryWordList");
  if(dl) renderGlossaryWordList();
  renderGlossaryFavs(); renderGlossaryMeta();
  var su=$("optSimpleUiSettings"); if(su) su.checked=S.simpleUi!==false;
  syncEasyReadUi();
  requestAnimationFrame(syncBottomShellHeight);
}
function syncBottomShellHeight(){
  var shell=document.querySelector(".bottom-shell");
  if(!shell) return;
  var h=Math.ceil(shell.getBoundingClientRect().height);
  if(h>0) document.documentElement.style.setProperty("--bottom-shell-h",h+"px");
}
function applyHudTips(){
  var map={
    langSwitch:"hud.tip.lang", langPtBtn:"hud.tip.langPt", langEnBtn:"hud.tip.langEn",
    hudTitle:"hud.tip.title", hudLives:"hud.tip.lives",
    hudStreakBtn:"hud.tip.streak", hudLevelChip:"hud.tip.level", hudXpChip:"hud.tip.xp",
    hudCoinsChip:"hud.tip.coins", hudScoreChip:"hud.tip.score", hudMaturityChip:"hud.tip.maturity",
    glossaryBtn:"hud.tip.glossary", a11yBtn:"hud.tip.a11y", settingsBtn:"hud.tip.settings"
  };
  for(var id in map){
    var el=$(id), text=t(map[id]);
    if(!el) continue;
    el.setAttribute("title", text);
    el.setAttribute("aria-label", text);
  }
}
function setLang(lang){
  if(lang!=="pt"&&lang!=="en") return;
  S.lang=lang; save();
  document.querySelectorAll(".lang-card").forEach(function(x){ x.setAttribute("aria-pressed",x.getAttribute("data-lang")===lang?"true":"false"); });
  applyI18n(); renderTeams(); renderRoles(); refreshHud(); applySignLanguage(); renderGlossaryWordList();
  renderNextStep(); renderDaily(); renderWeekly(); renderHomeHowStrip(); renderMissionsFocus(); renderUxBanner();
  if($("screenSetup")&&$("screenSetup").classList.contains("active")) renderSetupUi();
  var ov=$("onboardOverlay"); if(ov&&!ov.hidden) renderOnboarding();
  if($("screenProfile")&&$("screenProfile").classList.contains("active")) renderProfile();
  if($("screenMap").classList.contains("active")){ drawMap(); renderMapExpedition(); }
}

/* -------------------- EQUIPES / PAPÉIS — ver js/profile-data.js (escalável) -------------------- */

/* -------------------- PROGRESSÃO / TITLES (níveis 1–10, escada de raridade) -------------------- */
var MAX_LEVEL = 10;
/* XP acumulado para entrar em cada nível; ~2600 XP no nível 10 (mapa + missões + crises). */
var LEVEL_XP = [0, 80, 200, 360, 560, 800, 1080, 1400, 1760, 2160, 2600];
var LEVEL_TITLES = [
  {lv:1,  ico:"🔰", pt:"Guardião em Jornada", en:"Journey Guardian"},
  {lv:2,  ico:"🥉", pt:"Guardião Bronze", en:"Bronze Guardian"},
  {lv:3,  ico:"🥈", pt:"Guardião Prata", en:"Silver Guardian"},
  {lv:4,  ico:"🥇", pt:"Guardião Ouro", en:"Gold Guardian"},
  {lv:5,  ico:"🔹", pt:"Guardião Platina", en:"Platinum Guardian"},
  {lv:6,  ico:"💎", pt:"Guardião Diamante", en:"Diamond Guardian"},
  {lv:7,  ico:"🛡️", pt:"Guardião Élite", en:"Elite Guardian"},
  {lv:8,  ico:"⚔️", pt:"Guardião Épico", en:"Epic Guardian"},
  {lv:9,  ico:"🌟", pt:"Guardião Mítico", en:"Mythic Guardian"},
  {lv:10, ico:"👑", pt:"Guardião Lendário", en:"Legendary Guardian"}
];
function levelOf(){
  var xp=S.xp||0, lv=1, i;
  for(i=1;i<LEVEL_XP.length;i++){ if(xp>=LEVEL_XP[i]) lv=i+1; else break; }
  return Math.min(MAX_LEVEL, lv);
}
function levelProgress(){
  var lv=levelOf();
  if(lv>=MAX_LEVEL) return {pct:100, cur:0, need:0, max:true};
  var floor=LEVEL_XP[lv-1], ceil=LEVEL_XP[lv], cur=(S.xp||0)-floor, need=ceil-floor;
  return {pct:need?Math.round(cur/need*100):100, cur:cur, need:need, max:false};
}
function xpForLevel(lv){ return LEVEL_XP[Math.max(0, Math.min(MAX_LEVEL, lv|0)-1)]||0; }
function xpForMaxLevel(){ return LEVEL_XP[MAX_LEVEL]; }
function currentTitle(){ var lv=levelOf(); return LEVEL_TITLES[lv-1]||LEVEL_TITLES[0]; }

/* -------------------- TEMAS / THEMES -------------------- */
var THEMES = {
  phishing:{ico:"🎣", pt:"Phishing", en:"Phishing"},
  password:{ico:"🔑", pt:"Senhas & MFA", en:"Passwords & MFA"},
  ot:{ico:"🏭", pt:"Sistemas Industriais (OT)", en:"Industrial Systems (OT)"},
  data:{ico:"🗂️", pt:"Proteção de Dados", en:"Data Protection"},
  device:{ico:"💻", pt:"Dispositivos", en:"Devices"},
  remote:{ico:"🌐", pt:"Trabalho Remoto", en:"Remote Work"},
  bec:{ico:"💸", pt:"Fraude Financeira (BEC)", en:"Financial Fraud (BEC)"},
  port:{ico:"🚢", pt:"Segurança Portuária", en:"Port Security"}
};

/* -------------------- PAÍSES / COUNTRIES (campanhas) -------------------- */
var COUNTRIES = [
  {id:"br", flag:"🇧🇷", name:{pt:"Brasil",en:"Brazil"},
    chain:{pt:"Sistema Norte: Carajás (S11D) → EFC (892 km) → Ponta da Madeira → China. Sistema Sudeste: Minas → EFVM → Tubarão.",en:"Northern System: Carajás (S11D) → Carajás Railway (892 km) → Ponta da Madeira → China. Southeastern System: Minas → EFVM → Tubarão."},
    desc:{pt:"A Orbita atua no Brasil de forma integrada, combinando mineração, logística e energia. Produz principalmente minério de ferro e metais como níquel e cobre, e opera ferrovias, portos e trens que conectam as operações aos mercados globais.",en:"In Brazil, Orbita operates in an integrated way, combining mining, logistics and energy. It mainly produces iron ore and metals such as nickel and copper, and runs railways, ports and trains connecting operations to global markets."},
    themes:["phishing","password","ot","data","port"]},
  {id:"ca", flag:"🇨🇦", name:{pt:"Canadá",en:"Canada"},
    chain:{pt:"Operação independente de metais base — minas subterrâneas, portos e escritórios.",en:"Standalone base-metals operation — underground mines, ports and offices."},
    desc:{pt:"No Canadá, a Orbita atua principalmente na produção de metais básicos para a transição energética, minas subterrâneas e operações de produção e beneficiamento de níquel, cobre, cobalto e metais do grupo da platina. O país também abriga infraestrutura logística, portos e escritórios.",en:"In Canada, Orbita mainly produces base metals for the energy transition, underground mines and operations focused on nickel, copper, cobalt and platinum group metals production and processing. The country also hosts logistics infrastructure, ports and offices."},
    themes:["phishing","data","ot","device"]},
  {id:"gb", flag:"🇬🇧", name:{pt:"Reino Unido",en:"United Kingdom"},
    chain:{pt:"Refino de níquel de alta pureza — cadeia industrial independente do Brasil.",en:"High-purity nickel refining — industrial chain independent from Brazil."},
    desc:{pt:"A Orbita atua no Reino Unido por meio do refino de níquel de alta pureza, com foco no atendimento a aplicações industriais e à cadeia de metais da transição energética.",en:"In the United Kingdom, Orbita operates through high-purity nickel refining, focused on industrial applications and the energy transition metals supply chain."},
    themes:["data","remote","phishing","ot"]},
  {id:"om", flag:"🇴🇲", name:{pt:"Omã",en:"Oman"},
    chain:{pt:"Usina de pelotização em Sohar — distribuição para Ásia e Europa.",en:"Sohar pelletizing plant — distribution to Asia and Europe."},
    desc:{pt:"Em Omã, a Orbita atua com foco industrial e logístico por meio de um complexo em Sohar, que inclui usina de pelotização e infraestrutura portuária.",en:"In Oman, Orbita operates with an industrial and logistics focus through a complex in Sohar, including a pelletizing plant and port infrastructure."},
    themes:["ot","port","phishing","device"]},
  {id:"my", flag:"🇲🇾", name:{pt:"Malásia",en:"Malaysia"},
    chain:{pt:"Terminal Teluk Rubiah — movimentação, armazenagem e distribuição de minério na Ásia.",en:"Teluk Rubiah terminal — ore handling, storage and distribution across Asia."},
    desc:{pt:"Na Malásia, a presença da Orbita está voltada à logística e à distribuição, com operações no terminal marítimo de Teluk Rubiah — movimentação, armazenagem e distribuição do minério de ferro, conectando as operações no Brasil aos clientes na Ásia.",en:"In Malaysia, Orbita's presence is focused on logistics and distribution, with operations at the Teluk Rubiah maritime terminal — handling, storage and distribution of iron ore, connecting Brazilian operations to customers in Asia."},
    themes:["port","ot","device","phishing"]},
  {id:"jp", flag:"🇯🇵", name:{pt:"Japão",en:"Japan"},
    chain:{pt:"Refino e fornecimento de produtos de níquel para clientes globais.",en:"Nickel refining and supply of nickel products to global customers."},
    desc:{pt:"A Orbita atua no Japão por meio de atividades industriais e comerciais, incluindo o refino de níquel e seu fornecimento para clientes ao redor do mundo.",en:"In Japan, Orbita operates through industrial and commercial activities, including nickel refining and supply to customers around the world."},
    themes:["data","phishing","password","ot"]},
  {id:"id", flag:"🇮🇩", name:{pt:"Indonésia",en:"Indonesia"},
    chain:{pt:"Participação minoritária na PT Orbita Indonesia — exploração e operação de níquel.",en:"Minority stake in PT Orbita Indonesia — nickel exploration and operation."},
    desc:{pt:"A atuação da Orbita na Indonésia ocorre por meio de uma participação minoritária na PT Orbita Indonesia, que explora ativos de níquel no país.",en:"Orbita's presence in Indonesia is through a minority stake in PT Orbita Indonesia, which explores nickel assets in the country."},
    themes:["ot","phishing","device","data"]},
  {id:"us", flag:"🇺🇸", name:{pt:"Estados Unidos",en:"United States"},
    chain:{pt:"Escritório comercial e Mega Hub — risco focado em BEC e contratos.",en:"Commercial office and Mega Hub — risk focused on BEC and contracts."},
    desc:{pt:"Escritórios comerciais nos EUA, com atuação também como Mega Hub na estratégia global da Orbita. Fraudes de pagamento (BEC) são a principal ameaça cibernética neste contexto.",en:"Commercial offices in the US, also serving as a Mega Hub in Orbita's global strategy. Payment fraud (BEC) is the main cyber threat in this context."},
    themes:["bec","phishing","password","data"]},
  {id:"pe", flag:"🇵🇪", name:{pt:"Peru",en:"Peru"},
    chain:{pt:"Presença de exploração greenfield — dados geológicos sensíveis.",en:"Greenfield exploration presence — sensitive geological data."},
    desc:{pt:"Escritório comercial e atividades de exploração mineral no Peru.",en:"Commercial office and mineral exploration activities in Peru."},
    themes:["data","phishing","device","remote"]},
  {id:"cl", flag:"🇨🇱", name:{pt:"Chile",en:"Chile"},
    chain:{pt:"Exploração mineral greenfield — proteção de dados de prospecção.",en:"Greenfield mineral exploration — protecting prospecting data."},
    desc:{pt:"Escritório comercial e exploração mineral no Chile.",en:"Commercial office and mineral exploration in Chile."},
    themes:["data","phishing","device","remote"]},
  {id:"ar", flag:"🇦🇷", name:{pt:"Argentina",en:"Argentina"},
    chain:{pt:"Escritório regional — relações comerciais e contratos.",en:"Regional office — commercial relations and contracts."},
    desc:{pt:"Escritório comercial na Argentina, apoiando relações comerciais e contratos na região.",en:"Commercial office in Argentina, supporting commercial relations and contracts in the region."},
    themes:["bec","phishing","password","data"]},
  {id:"ch", flag:"🇨🇭", name:{pt:"Suíça",en:"Switzerland"},
    chain:{pt:"Hub financeiro — pagamentos e trading de commodities.",en:"Financial hub — payments and commodity trading."},
    desc:{pt:"Escritório corporativo na Suíça — hub de trading e finanças.",en:"Corporate office in Switzerland — trading and finance hub."},
    themes:["bec","phishing","password","data"]},
  {id:"nl", flag:"🇳🇱", name:{pt:"Países Baixos",en:"Netherlands"},
    chain:{pt:"Escritório europeu — dados corporativos e conformidade.",en:"European office — corporate data and compliance."},
    desc:{pt:"Escritório corporativo nos Países Baixos.",en:"Corporate office in the Netherlands."},
    themes:["data","remote","phishing","device"]},
  {id:"ae", flag:"🇦🇪", name:{pt:"Emirados Árabes",en:"UAE"},
    chain:{pt:"Escritório regional e Mega Hub — viagens e dispositivos móveis.",en:"Regional office and Mega Hub — travel and mobile devices."},
    desc:{pt:"Escritório regional em Dubai, também integrado à rede de Mega Hubs da Orbita na região do Oriente Médio.",en:"Regional office in Dubai, also part of Orbita's Mega Hub network in the Middle East."},
    themes:["device","remote","password","phishing"]},
  {id:"cn", flag:"🇨🇳", name:{pt:"China",en:"China"},
    chain:{pt:"Principal destino de minério de ferro — acordos com portos para blending.",en:"Main iron ore destination — port agreements for blending."},
    desc:{pt:"Na China, a Orbita mantém presença comercial e de relacionamento com o mercado por meio de seus escritórios, apoiando clientes e conexões com a cadeia global de minério de ferro e metais. O país é o principal destino de suas vendas.",en:"In China, Orbita maintains a commercial and market relationship presence through its offices, supporting customers and connections with the global iron ore and metals supply chain. China is the main destination for its sales."},
    themes:["data","phishing","bec","device"]},
  {id:"in", flag:"🇮🇳", name:{pt:"Índia",en:"India"},
    chain:{pt:"Escritório comercial — relações com mercado indiano.",en:"Commercial office — relations with the Indian market."},
    desc:{pt:"Escritório comercial na Índia, apoiando relações com o mercado local.",en:"Commercial office in India, supporting relations with the local market."},
    themes:["data","phishing","bec","device"]},
  {id:"sg", flag:"🇸🇬", name:{pt:"Singapura",en:"Singapore"},
    chain:{pt:"Hub comercial — fluxo de pagamentos e dados regionais.",en:"Commercial hub — regional payments and data flows."},
    desc:{pt:"Hub estratégico da Ásia-Pacífico para relações comerciais e corporativas.",en:"Strategic Asia-Pacific hub for commercial and corporate relations."},
    themes:["bec","data","phishing","remote"]},
  {id:"au", flag:"🇦🇺", name:{pt:"Austrália",en:"Australia"},
    chain:{pt:"Escritório na Oceania — trabalho híbrido e dispositivos móveis.",en:"Oceania office — hybrid work and mobile devices."},
    desc:{pt:"Escritório comercial na Austrália.",en:"Commercial office in Australia."},
    themes:["remote","device","phishing","password"]},
  {id:"sa", flag:"🇸🇦", name:{pt:"Arábia Saudita",en:"Saudi Arabia"},
    chain:{pt:"Joint venture de pelotização para distribuição no Oriente Médio e Ásia.",en:"Pelletizing joint venture for distribution in the Middle East and Asia."},
    desc:{pt:"Mega Hub estratégico — joint venture de pelotização para distribuição no Oriente Médio e Ásia.",en:"Strategic Mega Hub — pelletizing joint venture for distribution in the Middle East and Asia."},
    themes:["bec","data","phishing","device"]}
];

/* Rotas de cadeia por produto — NÃO irradiam todas do Brasil */
var SUPPLY_ROUTES = [
  {id:"iron", cls:"iron", label:{pt:"Minério de ferro",en:"Iron ore"},
   pts:[{lat:-6,lon:-50},{lat:-2.5,lon:-44},{lat:4,lon:-35},{lat:4,lon:102},{lat:31,lon:121}]},
  {id:"nickel_ca", cls:"nickel", label:{pt:"Níquel (Canadá)",en:"Nickel (Canada)"},
   pts:[{lat:46.5,lon:-81},{lat:55,lon:-60},{lat:51,lon:-10}]},
  {id:"nickel_id", cls:"nickel", label:{pt:"Níquel (Indonésia)",en:"Nickel (Indonesia)"},
   pts:[{lat:-2.5,lon:121},{lat:1.3,lon:103},{lat:31,lon:121}]},
  {id:"pellet", cls:"pellet", label:{pt:"Pelotas (Omã)",en:"Pellets (Oman)"},
   pts:[{lat:22,lon:59},{lat:12,lon:75},{lat:4,lon:102}]}
];

/* -------------------- BANCO DE PERGUNTAS (js/questions-data.js) -------------------- */

/* -------------------- CADEIA DE PRODUÇÃO — js/chain-data.js -------------------- */

/* -------------------- CHEFÕES (dados em bosses-data.js) -------------------- */

/* -------------------- LOJA / SHOP -------------------- */
var AVATARS = [
  {id:"shield", ico:"🛡️", cost:0, tag:"ops", name:{pt:"Guardião",en:"Guardian"}, desc:{pt:"Padrão — defensor da operação",en:"Default — operation defender"}},
  {id:"miner", ico:"⛏️", cost:25, tag:"ops", name:{pt:"Minerador",en:"Miner"}, desc:{pt:"Operações de mina e britagem",en:"Mine and crushing operations"}},
  {id:"train", ico:"🚂", cost:35, tag:"ops", unlock:"chain1", name:{pt:"Ferroviário",en:"Railway"}, desc:{pt:"Desbloqueia ao completar 1 etapa da cadeia",en:"Unlock by completing 1 chain stage"}},
  {id:"ship", ico:"🚢", cost:35, tag:"ops", name:{pt:"Portuário",en:"Port operator"}, desc:{pt:"Terminais marítimos e carregamento",en:"Marine terminals and loading"}},
  {id:"factory", ico:"🏭", cost:40, tag:"ot", name:{pt:"Operador OT",en:"OT operator"}, desc:{pt:"Supervisório e automação industrial",en:"SCADA and industrial automation"}},
  {id:"analyst", ico:"👨‍💻", cost:45, tag:"sec", name:{pt:"Analista SOC",en:"SOC analyst"}, desc:{pt:"Monitoramento e resposta a incidentes",en:"Monitoring and incident response"}},
  {id:"detective", ico:"🕵️", cost:50, tag:"sec", name:{pt:"Detetive digital",en:"Digital detective"}, desc:{pt:"Investigação de phishing e fraudes",en:"Phishing and fraud investigation"}},
  {id:"robot", ico:"🤖", cost:55, tag:"ot", name:{pt:"Automação",en:"Automation"}, desc:{pt:"Sistemas autônomos e IoT industrial",en:"Autonomous systems and industrial IoT"}},
  {id:"ninja", ico:"🥷", cost:65, tag:"sec", name:{pt:"Operações discretas",en:"Stealth ops"}, desc:{pt:"Resposta silenciosa a ameaças",en:"Silent threat response"}},
  {id:"lock", ico:"🔐", cost:70, tag:"sec", name:{pt:"Criptógrafo",en:"Cryptographer"}, desc:{pt:"Proteção de dados e acessos",en:"Data and access protection"}},
  {id:"satellite", ico:"🛰️", cost:80, tag:"ot", name:{pt:"Monitor SCADA",en:"SCADA monitor"}, desc:{pt:"Vigilância de redes OT 24/7",en:"24/7 OT network surveillance"}},
  {id:"helmet", ico:"🦺", cost:90, tag:"ops", name:{pt:"Segurança de campo",en:"Field safety"}, desc:{pt:"EPI e cultura de segurança física",en:"PPE and physical safety culture"}}
];
var FRAMES = [
  {id:"default", ico:"⬜", cost:0, css:"frame-default", name:{pt:"Sem moldura",en:"No frame"}, desc:{pt:"Visual limpo",en:"Clean look"}},
  {id:"gold", ico:"🥇", cost:40, css:"frame-gold", name:{pt:"Moldura Ouro",en:"Gold frame"}, desc:{pt:"Conquistas e excelência",en:"Achievements and excellence"}},
  {id:"orbita", ico:"💚", cost:0, css:"frame-orbita", name:{pt:"Orbita Oficial",en:"Official Orbita"}, desc:{pt:"Cores da marca Orbita",en:"Orbita brand colors"}},
  {id:"lock", ico:"🔒", cost:45, css:"frame-lock", name:{pt:"Cadeado digital",en:"Digital lock"}, desc:{pt:"Segurança da informação",en:"Information security"}},
  {id:"chain", ico:"⛓️", cost:55, css:"frame-chain", unlock:"chain3", name:{pt:"Cadeia de suprimentos",en:"Supply chain"}, desc:{pt:"Desbloqueia com 3 etapas da cadeia",en:"Unlock with 3 chain stages"}},
  {id:"trophy", ico:"🏆", cost:70, css:"frame-trophy", name:{pt:"Conquistador",en:"Champion"}, desc:{pt:"Top do ranking de equipes",en:"Top of team rankings"}},
  {id:"shield", ico:"🔰", cost:80, css:"frame-shield", name:{pt:"Escudo reforçado",en:"Reinforced shield"}, desc:{pt:"Defesa máxima da operação",en:"Maximum operation defense"}}
];
var SKINS = [
  {id:"default", ico:"🌐", cost:0, css:"skin-default", name:{pt:"Orbita Padrão",en:"Orbita Default"}, desc:{pt:"Visual oficial do jogo",en:"Official game look"}},
  {id:"forest", ico:"🌿", cost:50, css:"skin-forest", name:{pt:"Floresta Amazônica",en:"Amazon Forest"}, desc:{pt:"Operações no bioma verde",en:"Operations in the green biome"}},
  {id:"ocean", ico:"🌊", cost:60, css:"skin-ocean", name:{pt:"Porto & Mar",en:"Port & Sea"}, desc:{pt:"Terminais e logística marítima",en:"Terminals and maritime logistics"}},
  {id:"mine", ico:"⛰️", cost:70, css:"skin-mine", name:{pt:"Mineração",en:"Mining"}, desc:{pt:"Tons terrosos da operação",en:"Earthy mining operation tones"}},
  {id:"night", ico:"🌙", cost:80, css:"skin-night", name:{pt:"SOC Noturno",en:"Night SOC"}, desc:{pt:"Sala de controle 24h",en:"24h control room"}},
  {id:"neon", ico:"💠", cost:90, css:"skin-neon", name:{pt:"Cyber Neon",en:"Cyber Neon"}, desc:{pt:"Estética hacker educativa",en:"Educational hacker aesthetic"}},
  {id:"alert", ico:"🔥", cost:100, css:"skin-alert", name:{pt:"Alerta Crítico",en:"Critical Alert"}, desc:{pt:"Modo crise e Desafios / Crises",en:"Crisis mode and Challenges / Crises"}}
];

/* -------------------- MEDALHAS / ACHIEVEMENTS -------------------- */
var MEDALS = [
  {id:"profile", ico:"👤", name:{pt:"Perfil definido",en:"Profile set"}, test:function(){ return setupComplete(); }},
  {id:"first", ico:"🗺️", name:{pt:"Primeira jornada",en:"First journey"}, test:function(){ return Object.keys(S.done).length>=1; }},
  {id:"explorer", ico:"🧭", name:{pt:"Explorador (5 países)",en:"Explorer (5 countries)"}, test:function(){ return Object.keys(S.done).length>=5; }},
  {id:"worldwide", ico:"🌎", rarity:"legendary", name:{pt:"Guardião mundial",en:"Worldwide guardian"}, test:function(){ return Object.keys(S.done).length>=COUNTRIES.length; }},
  {id:"daily", ico:"📅", name:{pt:"Missão diária",en:"Daily mission"}, test:function(){ return (S.dailyTotal||0)>=1; }},
  {id:"weekly", ico:"🏆", name:{pt:"Meta semanal",en:"Weekly goal"}, test:function(){ ensureWeekly(); var wp=S.weekly.prog||{}; return WEEKLY.some(function(w){ return (wp[w.id]||0)>=w.goal; }); }},
  {id:"perfect", ico:"💯", rarity:"rare", name:{pt:"Jornada perfeita",en:"Perfect journey"}, test:function(){ for(var k in S.done) if(S.done[k]>=100) return true; return false; }},
  {id:"chain", ico:"⛓️", name:{pt:"Cadeia Norte",en:"Northern chain"}, test:function(){ return chainStagesDone()>=1; }},
  {id:"boss", ico:"🎯", name:{pt:"Primeira crise",en:"First crisis"}, test:function(){ return bossCompletedCount()>=1; }},
  {id:"bossAll", ico:"🛡️", rarity:"rare", name:{pt:"Todas as crises",en:"All crises"}, test:function(){ return bossCompletedCount()>=BOSSES.length; }},
  {id:"bossResil", ico:"💎", rarity:"rare", name:{pt:"Guardião resiliente",en:"Resilient guardian"}, test:function(){ return bossAvgIndex()>=75||bossGoldCount()>=3; }},
  {id:"bossLegend", ico:"👑", rarity:"legendary", name:{pt:"Resiliência lendária",en:"Legendary resilience"}, test:function(){ return bossHasTier("legendary"); }},
  {id:"streak7", ico:"🔥", name:{pt:"Sequência 7 dias",en:"7-day streak"}, test:function(){ return (S.streak&&S.streak.best>=7)||(S.streak&&S.streak.count>=7); }},
  {id:"streak30", ico:"💥", rarity:"legendary", name:{pt:"Sequência 30 dias",en:"30-day streak"}, test:function(){ return S.streak&&S.streak.best>=30; }},
  {id:"gloss5", ico:"📖", name:{pt:"5 termos no glossário",en:"5 glossary terms"}, test:function(){ return glossaryLearnedCount()>=5; }},
  {id:"glossQuiz3", ico:"❓", name:{pt:"3 quizzes glossário",en:"3 glossary quizzes"}, test:function(){ return (S.glossaryQuizDone||0)>=3; }}
];

var MEDAL_HINTS={
  profile:{pt:"Personalize perfil: nome, área e rotina.",en:"Set up profile: name, area and routine."},
  first:{pt:"Conclua sua primeira jornada no mapa.",en:"Complete your first map journey."},
  explorer:{pt:"Conclua campanhas em 5 países.",en:"Complete campaigns in 5 countries."},
  worldwide:{pt:"Conclua todos os países do mapa.",en:"Complete every country on the map."},
  daily:{pt:"Finalize pelo menos 1 atividade diária.",en:"Finish at least 1 daily activity."},
  weekly:{pt:"Atinja uma meta semanal completa.",en:"Reach one full weekly goal."},
  perfect:{pt:"Acerte 100% em alguma jornada de país.",en:"Score 100% on any country journey."},
  chain:{pt:"Avance na cadeia Carajás (1+ etapa).",en:"Progress on the Carajás chain (1+ stage)."},
  boss:{pt:"Vença sua primeira crise em Desafios.",en:"Win your first crisis in Challenges."},
  bossAll:{pt:"Vença as 7 crises simuladas.",en:"Win all 7 simulated crises."},
  bossResil:{pt:"Maturidade média ≥75% ou 3 crises ouro.",en:"Average maturity ≥75% or 3 gold crises."},
  bossLegend:{pt:"Alcance patente lendária em alguma crise.",en:"Reach legendary rank on a crisis."},
  streak7:{pt:"Mantenha sequência de 7 dias jogando.",en:"Keep a 7-day play streak."},
  streak30:{pt:"Mantenha sequência de 30 dias.",en:"Keep a 30-day streak."},
  gloss5:{pt:"Aprenda 5 termos no glossário.",en:"Learn 5 glossary terms."},
  glossQuiz3:{pt:"Complete 3 quizzes do glossário.",en:"Complete 3 glossary quizzes."}
};

/* -------------------- ÁUDIO / NARRAÇÃO -------------------- */
var EMOJI_RE = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu;
function speak(text){
  if(!S.a11y.voice || !("speechSynthesis" in window)) return;
  try{
    window.speechSynthesis.cancel();
    var u=new SpeechSynthesisUtterance(String(text).replace(EMOJI_RE,"").trim());
    u.lang=L()==="pt"?"pt-BR":"en-US"; u.rate=.98;
    window.speechSynthesis.speak(u);
  }catch(e){}
}
function stopSpeak(){ if("speechSynthesis" in window) try{ window.speechSynthesis.cancel(); }catch(e){} }

/* -------------------- NAVEGAÇÃO -------------------- */
var NAVMAP={screenMap:"navMapBtn",screenBossList:"navBossBtn",screenDaily:"navDailyBtn",screenWeekly:"navDailyBtn",screenProfile:"navStatsBtn",screenHome:"navHomeBtn",screenManager:"navManagerBtn",screenShop:"navShopBtn"};
var NAV_IMMERSIVE=["screenQuiz","screenBoss"];
var NAV_HIDE=[];
function updateManagerNav(){
  var showMgr=!!S.managerMode;
  var btn=$("navManagerBtn"); if(btn) btn.hidden=!showMgr;
}
function show(id){
  stopSpeak();
  var scrollWeekly=id==="screenWeekly";
  if(scrollWeekly) id="screenDaily";
  if(id!=="screenMap" && typeof glStop==="function") glStop();
  document.querySelectorAll(".screen").forEach(function(s){ s.classList.remove("active"); });
  var el=$(id); if(el) el.classList.add("active");
  if(id==="screenHome"){ renderNextStep(); renderWeekCard(); renderFirstDayHint(); updateSetupBanner(); renderHomeHowStrip(); renderUxBanner(); }
  if(id==="screenSetup") updateSetupBanner();
  if(id==="screenMap"){ showContextTip("map"); renderMapExplorerHint(); updateSetupBanner(); syncMapDetailLayout(); }
  else{
    var sm=$("screenMap"); if(sm) sm.classList.remove("map-screen-fit");
    document.body.classList.remove("map-viewport-lock");
    document.documentElement.style.removeProperty("--map-viewport-h");
  }
  if(id==="screenDaily"){ showContextTip("daily"); renderDaily(); renderWeekly(); renderMissionsFocus(); }
  if(id==="screenBossList") showContextTip("boss");
  if(id==="screenReview"&&typeof window.initReviewBank==="function") window.initReviewBank();
  updateNavBadges();
  if(!scrollWeekly) window.scrollTo({top:0,behavior:S.a11y.motion?"auto":"smooth"});
  document.querySelectorAll(".bottom-nav-row button").forEach(function(b){ b.classList.remove("on"); });
  if(NAVMAP[id]){ var nb=$(NAVMAP[id]); if(nb) nb.classList.add("on"); }
  if(NAV_IMMERSIVE.indexOf(id)>=0) document.body.classList.add("nav-hidden");
  else document.body.classList.remove("nav-hidden");
  updateHomeCtaLayout();
  announce(el?(el.getAttribute("aria-label")||""):"");
  if(scrollWeekly){
    var card=$("missionsWeeklyCard");
    if(card) setTimeout(function(){ card.scrollIntoView({behavior:S.a11y.motion?"auto":"smooth",block:"start"}); },80);
  }
}
function announce(m){ var live=$("a11yLive"); if(!live) return; live.textContent=""; setTimeout(function(){ live.textContent=m; },40); }
var focusTrapState=null, toastQueue=[], toastShowing=false, glossaryFromQuiz=false, glossaryActiveId=null, glossaryActiveCat=null, glossaryQuizState=null;
var GLOSSARY_SUGGESTIONS=["mfa","phishing","dlp","ransomware"];
var GLOSSARY_CAT_EMOJI={access:"🔐",threat:"⚠️",network:"🌐",data:"📁",ops:"🛠️",ot:"🏭",compliance:"📜",remote:"🏠",control:"🛡️",device:"📱",physical:"🔒"};
var GLOSSARY_NEW_IDS=["typosquat","baiting","fakeportal","credtheft","imperson","supplierfraud","deepfake","macros","juicejack","lateral","backdoor","pwdmanager","screenlock","defaultpwd","homolog","permissions","exfiltr","firmware","remoteacc","rdp","itotbridge","recon","tabletop","playbook","phishreport"];
var GLOSSARY_CAT_THEME={threat:"phishing",access:"password",data:"data",ot:"ot",network:"port",remote:"remote",device:"device",control:"device",compliance:"data",ops:"port",physical:"port"};
var GLOSSARY_TERM_THEME={phishing:"phishing",mfa:"password",password:"password","2fa":"password",dlp:"data",vpn:"remote",scada:"ot",ics:"ot",hmi:"ot",plc:"ot",ot:"ot",bec:"bec",ransomware:"phishing",malware:"phishing",homolog:"device",badusb:"device",typosquat:"phishing",recon:"port"};
var GLOSSARY_RELATED={
  phishing:["mfa","phishreport","typosquat","socialeng"],mfa:["2fa","iam","password","vpn"],dlp:["classification","encryption","exfiltr","datalleak"],
  vpn:["remoteacc","rdp","byod","jumpserver"],ransomware:["backup","incident","edr","antivirus"],scada:["ics","hmi","plc","ot"],bec:["supplierfraud","imperson","deepfake","phishing"],
  firewall:["dmz","dns","segmentation","vpn"],iam:["accessctrl","permissions","2fa","mfa"],backup:["ransomware","incident","datalleak","encryption"],
  ot:["ics","scada","hmi","itotbridge"],lgpd:["gdpr","classification","dlp","datalleak"],password:["mfa","2fa","pwdmanager","defaultpwd"]
};
function trapFocus(container, returnEl){
  releaseFocusTrap();
  if(!container||container.hidden) return;
  var nodes=[].slice.call(container.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')).filter(function(n){ return !n.disabled&&n.offsetParent!==null; });
  if(!nodes.length) return;
  focusTrapState={container:container, nodes:nodes, ret:returnEl||document.activeElement, fn:function(e){
    if(e.key!=="Tab"||!focusTrapState) return;
    var f=focusTrapState.nodes[0], l=focusTrapState.nodes[focusTrapState.nodes.length-1];
    if(e.shiftKey&&document.activeElement===f){ e.preventDefault(); l.focus(); }
    else if(!e.shiftKey&&document.activeElement===l){ e.preventDefault(); f.focus(); }
  }};
  container.addEventListener("keydown", focusTrapState.fn);
  setTimeout(function(){ nodes[0].focus(); },30);
}
function releaseFocusTrap(){
  if(!focusTrapState) return;
  focusTrapState.container.removeEventListener("keydown", focusTrapState.fn);
  var r=focusTrapState.ret; focusTrapState=null;
  if(r&&r.focus) try{ r.focus(); }catch(e){}
}
function toast(m){
  if(!m) return;
  toastQueue.push(String(m));
  if(!toastShowing) pumpToast();
}
function pumpToast(){
  var w=$("toastWrap"); if(!w||!toastQueue.length){ toastShowing=false; return; }
  toastShowing=true;
  var item=toastQueue.shift(), d=document.createElement("div");
  d.className="toast"; d.setAttribute("role","status");
  if(item&&typeof item==="object"&&item.title){
    d.classList.add("toast-celebration");
    d.innerHTML='<span class="toast-t">'+item.title+'</span><span class="toast-s">'+item.sub+'</span>';
  } else d.textContent=String(item);
  w.appendChild(d);
  setTimeout(function(){
    if(d.parentNode) d.remove();
    toastShowing=false;
    if(toastQueue.length) pumpToast();
  },item&&item.title?4200:3200);
}
function celebrationToast(title,sub){ toastQueue.push({title:title,sub:sub}); if(!toastShowing) pumpToast(); }
function applyProductionUi(){
  var hideToolbarDemo=!(window.APP_SHOW_DEMO===true||/demo=1/.test(location.search));
  ["demoMenuBtn","demoOpenSettingsBtn","toolbarMoreDemo"].forEach(function(id){ var el=$(id); if(el) el.hidden=hideToolbarDemo; });
  var demoSettings=$("settingsOpenDemoBtn");
  if(demoSettings) demoSettings.hidden=false;
}
function updateHomeCtaLayout(){
  var onHome=$("screenHome")&&$("screenHome").classList.contains("active");
  var hero=$("homeHeroActions");
  document.body.classList.toggle("home-cta-visible",!!(onHome&&hero&&!hero.hidden));
  renderHomeStickyCta();
}
function renderHomeLoopPreview(){
  var el=$("homeLoopPreview"); if(!el) return;
  var show=!S.onboardingDone;
  el.hidden=!show;
  if(show) el.textContent=t("home.previewLoop");
}
function renderMapLegendSummary(){
  var el=$("mapLegendLive"); if(!el) return;
  var pending=0, partial=0, done=0;
  COUNTRIES.forEach(function(c){
    var p=S.done[c.id];
    if(p===undefined) pending++;
    else if(p>=100) done++;
    else partial++;
  });
  el.textContent=t("map.legendSummary").replace("{done}",String(done)).replace("{partial}",String(partial)).replace("{pending}",String(pending));
}
function toggleToolbarMore(force){
  var menu=$("toolbarMoreMenu"), btn=$("toolbarMoreBtn");
  if(!menu) return;
  var open=force!==undefined?!!force:menu.hidden;
  if(open){ toggleA11yMenu(false); toggleSettingsMenu(false); toggleGlossaryMenu(false); toggleStreakPopover(false); }
  menu.hidden=!open;
  if(btn) btn.setAttribute("aria-expanded",open?"true":"false");
  if(open) trapFocus(menu, btn);
  else if(focusTrapState&&focusTrapState.container===menu) releaseFocusTrap();
}
function wireA11yMenuKeyboard(){
  var menu=$("a11yMenu"); if(!menu||menu._kbWired) return;
  menu._kbWired=true;
  menu.addEventListener("keydown",function(e){
    if(menu.hidden) return;
    var items=[].slice.call(menu.querySelectorAll(".am-toggle,.am-action,.am-reset,.am-close"));
    if(!items.length) return;
    var i=items.indexOf(document.activeElement);
    if(e.key==="ArrowDown"||e.key==="ArrowRight"){ e.preventDefault(); items[(i<0?0:i+1)%items.length].focus(); }
    else if(e.key==="ArrowUp"||e.key==="ArrowLeft"){ e.preventDefault(); items[i<=0?items.length-1:i-1].focus(); }
    else if(e.key==="Home"){ e.preventDefault(); items[0].focus(); }
    else if(e.key==="End"){ e.preventDefault(); items[items.length-1].focus(); }
  });
}

/* -------------------- ACESSIBILIDADE -------------------- */
var A11Y_DEFAULT={voice:false,contrast:false,large:false,motion:false,signs:false,fontScale:0,links:false,spacing:false,letterSpace:false,dyslexia:false,colorblind:"none",readingMode:false,easyRead:false};
var A11Y_CATALOG=[
  {cat:"a11y.cat.signs",src:"handtalk",items:[
    {pt:"Tradutor de Libras / ASL",en:"Sign language translator"},
    {pt:"Sinônimos e significados",en:"Synonyms and meanings"}
  ]},
  {cat:"a11y.cat.font",src:"both",items:[
    {pt:"Tamanho de fonte (A+ / A-)",en:"Font size (A+ / A-)"},
    {pt:"Estilo de texto / dislexia",en:"Text style / dyslexia"},
    {pt:"Letras destacadas",en:"Highlighted letters"},
    {pt:"Espaçamento entre linhas",en:"Line spacing"},
    {pt:"Espaçamento entre letras",en:"Letter spacing"}
  ]},
  {cat:"a11y.cat.nav",src:"both",items:[
    {pt:"Leitor de sites (narração)",en:"Site reader (narration)",native:true},
    {pt:"Modo de leitura",en:"Reading mode",native:true},
    {pt:"Destaque de links",en:"Link highlighting",native:true},
    {pt:"Estrutura da página",en:"Page structure",native:true},
    {pt:"Pausar animações",en:"Pause animations",native:true},
    {pt:"Máscara, guia, lupa (Hand Talk)",en:"Mask, guide, magnifier (Hand Talk)",ht:true}
  ]},
  {cat:"a11y.cat.color",src:"both",items:[
    {pt:"Contraste de cores",en:"Color contrast"},
    {pt:"Intensidade de cores",en:"Color intensity"},
    {pt:"Modo daltônico",en:"Color blind mode"}
  ]},
  {cat:"a11y.cat.native",src:"native",items:[
    {pt:"Pular para o conteúdo principal",en:"Skip to main content"},
    {pt:"Controle de contraste",en:"Contrast control"},
    {pt:"Ajuste de fonte (A+ / A-)",en:"Font adjustment (A+ / A-)"},
    {pt:"Mudança de idioma PT ↔ EN",en:"Language switch PT ↔ EN"},
    {pt:"Página de acessibilidade Orbita",en:"Orbita accessibility page"}
  ]}
];
function sanitizeA11y(){
  var d=A11Y_DEFAULT;
  if(!S.a11y||typeof S.a11y!=="object"){ S.a11y=merge({},d); save(); return; }
  var before=JSON.stringify(S.a11y);
  ["voice","contrast","large","motion","signs","links","spacing","letterSpace","dyslexia","readingMode","easyRead"].forEach(function(k){
    S.a11y[k]=!!S.a11y[k];
  });
  var cbModes=["none","protanopia","deuteranopia","tritanopia"];
  if(cbModes.indexOf(S.a11y.colorblind)<0) S.a11y.colorblind="none";
  if(typeof S.a11y.fontScale!=="number"||isNaN(S.a11y.fontScale)) S.a11y.fontScale=0;
  if(S.a11y.fontScale<-2) S.a11y.fontScale=-2;
  if(S.a11y.fontScale>4) S.a11y.fontScale=4;
  if(JSON.stringify(S.a11y)!==before) save();
}
function resetA11yDefaults(){
  S.a11y=merge({},A11Y_DEFAULT);
  save(); applyA11y();
  toast(t("a11y.resetDone"));
  if(S.a11y.voice) speak(t("a11y.resetDone"));
}
function fontScaleClass(n){
  if(n<0) return "fs-neg"+Math.abs(n);
  return "fs-"+n;
}
function applyFontScale(){
  document.body.classList.remove("fs-neg2","fs-neg1","fs-0","fs-1","fs-2","fs-3","fs-4");
  var n=S.a11y.fontScale||0;
  if(n<-2) n=-2; if(n>4) n=4;
  S.a11y.fontScale=n;
  document.body.classList.add(fontScaleClass(n));
  var el=$("fontScaleLabel"); if(el) el.textContent=(n>0?"+":"")+n;
}
function cycleColorblind(){
  var order=["none","protanopia","deuteranopia","tritanopia"];
  var i=order.indexOf(S.a11y.colorblind||"none");
  S.a11y.colorblind=order[(i+1)%order.length];
  save(); applyA11y();
}
function renderA11yCatalog(){
  var box=$("a11yCatalog"); if(!box) return;
  var srcLabel={handtalk:t("a11y.src.handtalk"),native:t("a11y.src.native"),both:t("a11y.src.both")};
  var hasHT=window.SignLang&&window.SignLang.hasHandTalkToken&&window.SignLang.hasHandTalkToken();
  box.innerHTML=A11Y_CATALOG.map(function(g){
    var items=g.items.map(function(it){
      var tag="";
      if(it.ht&&!hasHT) tag=' <span class="a11y-tag-ht">Hand Talk</span>';
      else if(it.native) tag=' <span class="a11y-tag-ok">✓</span>';
      return "<li>"+tt(it)+tag+"</li>";
    }).join("");
    return '<div class="a11y-cat"><div class="a11y-cat-head"><span class="a11y-cat-title">'+t(g.cat)+'</span><span class="a11y-cat-src">'+srcLabel[g.src]+'</span></div><ul class="a11y-cat-list">'+items+"</ul></div>";
  }).join("");
}
function showPageStructure(){
  var heads=[];
  document.querySelectorAll("main h1, main h2, main h3, .section-title").forEach(function(el,i){
    var tag=el.tagName||"H2";
    heads.push("<li><span class='ps-tag'>"+tag+"</span> "+(el.textContent||"").trim()+"</li>");
  });
  var panel=$("pageStructurePanel");
  if(!panel){
    panel=document.createElement("div");
    panel.id="pageStructurePanel"; panel.className="page-structure-panel"; panel.setAttribute("role","dialog");
    panel.innerHTML='<div class="ps-head"><strong>'+t("a11y.structure")+'</strong><button type="button" class="ps-close" id="psClose">×</button></div><ul class="ps-list" id="psList"></ul>';
    document.body.appendChild(panel);
    $("psClose").addEventListener("click",function(){ panel.hidden=true; });
  }
  $("psList").innerHTML=heads.join("")||"<li>—</li>";
  panel.hidden=false;
}
function applyA11y(){
  try{
  var reduceMotion=S.a11y.motion;
  try{ if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches) reduceMotion=true; }catch(e){}
  document.body.classList.toggle("contrast",S.a11y.contrast);
  document.body.classList.toggle("large",S.a11y.large);
  document.body.classList.toggle("reduce-motion",reduceMotion);
  document.body.classList.toggle("highlight-links",S.a11y.links);
  document.body.classList.toggle("spacing-lines",S.a11y.spacing);
  document.body.classList.toggle("spacing-letters",S.a11y.letterSpace);
  document.body.classList.toggle("dyslexia",S.a11y.dyslexia);
  document.body.classList.toggle("reading-mode",S.a11y.readingMode);
  document.body.classList.remove("cb-protanopia","cb-deuteranopia","cb-tritanopia");
  if(S.a11y.colorblind&&S.a11y.colorblind!=="none") document.body.classList.add("cb-"+S.a11y.colorblind);
  applyFontScale();
  if($("optVoice")) $("optVoice").checked=S.a11y.voice;
  if($("optContrast")) $("optContrast").checked=S.a11y.contrast;
  if($("optLarge")) $("optLarge").checked=S.a11y.large;
  if($("optMotion")) $("optMotion").checked=S.a11y.motion;
  if($("optSigns")) $("optSigns").checked=S.a11y.signs;
  if($("optLinks")) $("optLinks").checked=S.a11y.links;
  if($("optSpacing")) $("optSpacing").checked=S.a11y.spacing;
  if($("optLetterSpace")) $("optLetterSpace").checked=S.a11y.letterSpace;
  if($("optDyslexia")) $("optDyslexia").checked=S.a11y.dyslexia;
  if($("optReadingMode")) $("optReadingMode").checked=S.a11y.readingMode;
  var cb=$("colorblindLabel"); if(cb) cb.textContent=S.a11y.colorblind==="none"?(L()==="pt"?"Desligado":"Off"):S.a11y.colorblind;
  renderA11yMenu();
  applySignLanguage();
  }catch(err){ console.error("applyA11y",err); }
}
function applySignLanguage(){
  if(window.SignLang) window.SignLang.apply(L(), !!S.a11y.signs);
  var hint=$("aslHint");
  if(hint) hint.hidden=!(S.a11y.signs && L()==="en" && !document.body.classList.contains("handtalk-on") && document.body.classList.contains("asl-on"));
}
/* Quick language + accessibility menu (topbar) */
function renderA11yMenu(){
  var cl=$("a11yMenuClose"); if(cl) cl.setAttribute("aria-label",t("a11y.close"));
  document.querySelectorAll("#a11yMenu .am-toggle").forEach(function(b){
    var k=b.getAttribute("data-opt");
    var on=k==="colorblind"?(S.a11y.colorblind&&S.a11y.colorblind!=="none"):!!S.a11y[k];
    var lab=b.querySelector(".am-toggle-label");
    if(k==="signs" && lab) lab.textContent=t("a11y.signs");
    if(k==="colorblind" && lab) lab.textContent=t("a11y.colorblind")+" ("+(S.a11y.colorblind==="none"?(L()==="pt"?"off":"off"):S.a11y.colorblind)+")";
    b.setAttribute("aria-checked", on?"true":"false");
    b.classList.toggle("on", on || (k==="colorblind" && S.a11y.colorblind!=="none"));
    b.setAttribute("aria-label",(lab?lab.textContent:"")+" — "+(on || (k==="colorblind" && S.a11y.colorblind!=="none")?(L()==="pt"?"ligado":"on"):(L()==="pt"?"desligado":"off")));
  });
}
function updateHeroCaption(){
  var svg=document.querySelector(".hero-svg"); if(!svg) return;
  var old=svg.querySelectorAll(".hero-caption"); old.forEach(function(n){ n.remove(); });
  var t1=document.createElementNS("http://www.w3.org/2000/svg","text");
  t1.setAttribute("class","hero-caption"); t1.setAttribute("x","450"); t1.setAttribute("y","24"); t1.setAttribute("text-anchor","middle"); t1.setAttribute("fill","#EDB111"); t1.setAttribute("font-size","11"); t1.setAttribute("font-weight","700"); t1.setAttribute("font-family","Segoe UI,sans-serif");
  t1.textContent=L()==="pt"?"Extração → Processamento → Logística → Mercados globais":"Extraction → Processing → Logistics → Global markets";
  var t2=document.createElementNS("http://www.w3.org/2000/svg","text");
  t2.setAttribute("class","hero-caption"); t2.setAttribute("x","450"); t2.setAttribute("y","40"); t2.setAttribute("text-anchor","middle"); t2.setAttribute("fill","#8ec8d0"); t2.setAttribute("font-size","9"); t2.setAttribute("font-family","Segoe UI,sans-serif");
  t2.textContent=L()==="pt"?"Recursos essenciais protegidos por decisões cibernéticas":"Essential resources protected by cyber decisions";
  svg.appendChild(t1); svg.appendChild(t2);
}

/* -------------------- GLOSSÁRIO / TEMA / CONFIG -------------------- */
/* GLOSSARY definido em js/glossary-data.js */
function applyTheme(){
  document.body.classList.remove("theme-default","theme-light","theme-dark");
  var th=S.theme||"default";
  if(th!=="default") document.body.classList.add("theme-"+th);
  var sel=$("themeSelect"); if(sel) sel.value=th;
}
function setTheme(th){
  if(["default","light","dark"].indexOf(th)<0) return;
  S.theme=th; save(); applyTheme();
}
function glossaryCatLabel(cat){
  return cat?t("glossary.cat."+cat)||cat:"";
}
function glossarySummary(g){
  if(!g) return "";
  if(g.summary) return tt(g.summary);
  var d=tt(g.def)||"";
  if(d.length<=140) return d;
  var cut=d.slice(0,137), sp=cut.lastIndexOf(" ");
  if(sp>80) cut=cut.slice(0,sp);
  return cut+"…";
}
function glossaryRelatedIds(g){
  if(!g) return [];
  if(g.related&&g.related.length) return g.related.slice(0,4);
  if(GLOSSARY_RELATED[g.id]) return GLOSSARY_RELATED[g.id].slice(0,4);
  return GLOSSARY.filter(function(x){ return x.id!==g.id&&x.cat===g.cat; }).slice(0,3).map(function(x){ return x.id; });
}
function glossaryLearnedCount(){
  ensureUxState();
  var n=0;
  if(!S.glossaryLearned) return 0;
  for(var k in S.glossaryLearned) if(S.glossaryLearned[k]) n++;
  return n;
}
function glossaryCatLearnedCount(cat){
  ensureUxState();
  if(!cat||!S.glossaryLearned) return 0;
  var n=0;
  GLOSSARY.forEach(function(g){ if(g.cat===cat&&S.glossaryLearned[g.id]) n++; });
  return n;
}
function getRoleGlossaryPicks(){
  var role=S.role||"admin", team=S.team||"mina";
  var picks=GLOSSARY_ROLE_PICKS[role]||GLOSSARY_ROLE_PICKS.default;
  var teamExtra=GLOSSARY_TEAM_PICKS[team]||[], out=[], seen={}, i;
  for(i=0;i<teamExtra.length;i++){ if(!seen[teamExtra[i]]){ seen[teamExtra[i]]=1; out.push(teamExtra[i]); } }
  for(i=0;i<picks.length;i++){ if(!seen[picks[i]]){ seen[picks[i]]=1; out.push(picks[i]); } }
  return out.slice(0,4);
}
function glossaryIsNew(id){ return GLOSSARY_NEW_IDS.indexOf(id)>=0; }
function glossaryReviewDue(id){
  ensureUxState();
  var m=S.glossaryReviewMeta&&S.glossaryReviewMeta[id];
  if(!m||!m.due) return true;
  return m.due<=todayKey();
}
function todayKey(){ var d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function addDaysKey(days){
  var d=new Date(); d.setDate(d.getDate()+days);
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
function toggleGlossaryLearned(id, goNext){
  ensureUxState();
  if(!S.glossaryLearned) S.glossaryLearned={};
  var was=!!S.glossaryLearned[id];
  if(was){ delete S.glossaryLearned[id]; }
  else {
    S.glossaryLearned[id]=true;
    if(!S.glossaryLearnedXp) S.glossaryLearnedXp={};
    if(!S.glossaryLearnedXp[id]){ S.glossaryLearnedXp[id]=true; addReward(5,0,0); toast(t("settings.glossaryLearnXp")); }
    var ri=S.glossaryReview?S.glossaryReview.indexOf(id):-1;
    if(ri>=0){ S.glossaryReview.splice(ri,1); if(S.glossaryReviewMeta) delete S.glossaryReviewMeta[id]; }
  }
  save(); checkMedals();
  if(goNext!==false&&!was){
    var next=glossaryNextUnlearnedId(id);
    if(next&&next!==id){ selectGlossaryTerm(next,false); return; }
  }
}
function glossaryNextUnlearnedId(afterId){
  var ids=getGlossaryNavIds(), start=afterId?ids.indexOf(afterId)+1:0;
  if(start<0) start=0;
  for(var i=start;i<ids.length;i++){ if(!S.glossaryLearned||!S.glossaryLearned[ids[i]]) return ids[i]; }
  for(var j=0;j<start;j++){ if(!S.glossaryLearned||!S.glossaryLearned[ids[j]]) return ids[j]; }
  return null;
}
function toggleGlossaryReview(id){
  ensureUxState();
  if(!S.glossaryReview) S.glossaryReview=[];
  if(!S.glossaryReviewMeta) S.glossaryReviewMeta={};
  var i=S.glossaryReview.indexOf(id);
  if(i>=0){ S.glossaryReview.splice(i,1); delete S.glossaryReviewMeta[id]; }
  else {
    S.glossaryReview.push(id);
    var prev=S.glossaryReviewMeta[id];
    var days=prev&&prev.days?Math.min(21,(prev.days||3)*2):3;
    S.glossaryReviewMeta[id]={added:todayKey(),due:addDaysKey(days),days:days};
  }
  save(); renderGlossaryReviewList();
}
function updateGlossaryListSummary(q){
  var sum=$("glossaryListSum"); if(!sum) return;
  var list=glossaryFilter(q||""), n=list.length;
  var cat=glossaryActiveCat?glossaryCatLabel(glossaryActiveCat):"";
  var base=t("settings.glossaryListCount").replace("{n}",String(n));
  sum.textContent=cat?base+" · "+cat:base;
}
function renderGlossaryReviewList(){
  var host=$("glossaryReviewList"); if(!host) return;
  ensureUxState();
  var due=(S.glossaryReview||[]).filter(function(id){ return glossaryReviewDue(id); });
  if(!due.length){ host.innerHTML='<p class="muted glossary-favs-empty">'+t("settings.glossaryReviewEmpty")+'</p>'; return; }
  host.innerHTML="";
  due.forEach(function(id){
    var g=GLOSSARY.filter(function(x){return x.id===id;})[0]; if(!g) return;
    var b=document.createElement("button");
    b.type="button"; b.className="glossary-fav-chip glossary-review-chip";
    b.textContent=g.term;
    b.addEventListener("click",function(){ openGlossaryForTerm(id); });
    host.appendChild(b);
  });
}
function startGlossaryExplore(){
  if(!glossaryActiveCat) glossaryActiveCat="threat";
  var search=$("glossarySearch"); if(search) search.value="";
  renderGlossaryCatChips();
  var list=glossaryFilter("").slice().sort(function(a,b){ return a.term.localeCompare(b.term); });
  var next=list.filter(function(g){ return !S.glossaryLearned||!S.glossaryLearned[g.id]; })[0]||list[0];
  if(next) selectGlossaryTerm(next.id,false);
  else renderGlossaryEmptyState();
}
function glossaryQuizQuestionForTerm(g){
  if(!g||typeof BANK==="undefined") return null;
  var themes=[];
  if(GLOSSARY_TERM_THEME[g.id]) themes.push(GLOSSARY_TERM_THEME[g.id]);
  if(g.cat&&GLOSSARY_CAT_THEME[g.cat]&&themes.indexOf(GLOSSARY_CAT_THEME[g.cat])<0) themes.push(GLOSSARY_CAT_THEME[g.cat]);
  var pool=BANK.filter(function(q){ return themes.indexOf(q.theme)>=0; });
  if(!pool.length) pool=BANK.slice();
  pool=pool.filter(function(q){ return questionMatchesProfile(q); });
  if(!pool.length) pool=BANK.filter(function(q){ return themes.indexOf(q.theme)>=0; });
  if(!pool.length) pool=BANK.slice();
  pool.sort(function(a,b){ return questionProfileScore(b)-questionProfileScore(a); });
  return pool[Math.floor(Math.random()*Math.min(3,pool.length))];
}
function startGlossaryQuiz(id){
  var g=GLOSSARY.filter(function(x){return x.id===id;})[0]; if(!g) return;
  var q=glossaryQuizQuestionForTerm(g); if(!q) return;
  glossaryQuizState={termId:id, q:q, answered:false};
  var panel=$("glossaryQuizPanel"), qEl=$("glossaryQuizQ"), opts=$("glossaryQuizOpts"), why=$("glossaryQuizWhy");
  if(!panel||!qEl||!opts) return;
  panel.hidden=false;
  if(why){ why.hidden=true; why.textContent=""; }
  qEl.textContent=getQuestionField(q,"q");
  opts.innerHTML="";
  (q.opts||[]).forEach(function(o,i){
    var b=document.createElement("button");
    b.type="button"; b.className="glossary-quiz-opt";
    b.textContent=tt(o);
    b.addEventListener("click",function(){ answerGlossaryQuiz(i); });
    opts.appendChild(b);
  });
}
function answerGlossaryQuiz(choice){
  if(!glossaryQuizState||glossaryQuizState.answered) return;
  var q=glossaryQuizState.q, opts=$("glossaryQuizOpts"), why=$("glossaryQuizWhy");
  glossaryQuizState.answered=true;
  var ok=choice===q.correct;
  if(opts) opts.querySelectorAll(".glossary-quiz-opt").forEach(function(b,i){
    b.disabled=true;
    if(i===q.correct) b.classList.add("correct");
    else if(i===choice&&!ok) b.classList.add("wrong");
  });
  if(why){ why.hidden=false; why.textContent=tt(q.why)||""; }
  if(ok){
    S.glossaryQuizDone=(S.glossaryQuizDone||0)+1;
    addReward(10,0,0); toast(t("settings.glossaryQuizCorrect")); checkMedals();
    if(glossaryQuizState.termId&&(!S.glossaryLearned||!S.glossaryLearned[glossaryQuizState.termId])) toggleGlossaryLearned(glossaryQuizState.termId,false);
    save();
  } else toast(t("settings.glossaryQuizWrong"));
}
function closeGlossaryQuiz(){
  var panel=$("glossaryQuizPanel"); if(panel) panel.hidden=true;
  glossaryQuizState=null;
}
function bindGlossaryCardActions(g){
  document.querySelectorAll(".glossary-action-btn[data-act]").forEach(function(b){
    b.addEventListener("click",function(e){
      e.stopPropagation();
      var act=b.getAttribute("data-act");
      if(act==="fav"){ toggleGlossaryFav(g.id); showGlossaryTerm(g.id); }
      else if(act==="learn"){ toggleGlossaryLearned(g.id); showGlossaryTerm(g.id); renderGlossaryMeta($("glossarySearch")?$("glossarySearch").value:""); renderGlossaryWordList(); renderGlossaryReviewList(); }
      else if(act==="review"){ toggleGlossaryReview(g.id); showGlossaryTerm(g.id); }
      else if(act==="quiz") startGlossaryQuiz(g.id);
      else if(act==="speak") speak(g.term+". "+glossarySummary(g));
    });
  });
  document.querySelectorAll(".glossary-related-chip").forEach(function(b){
    b.addEventListener("click",function(){ selectGlossaryTerm(b.getAttribute("data-gid"), false); });
  });
}
function updateGlossaryMobileBar(g){
  var bar=$("glossaryMobileBar"), acts=$("glossaryMobileActions");
  var isMobile=window.matchMedia("(max-width:640px)").matches;
  if(!bar) return;
  if(!glossaryActiveId||!isMobile){ bar.hidden=true; return; }
  bar.hidden=false;
  if(!g||!acts) return;
  var isFav=S.glossaryFavs&&S.glossaryFavs.indexOf(g.id)>=0;
  var isLearned=S.glossaryLearned&&S.glossaryLearned[g.id];
  var isReview=S.glossaryReview&&S.glossaryReview.indexOf(g.id)>=0;
  acts.innerHTML=
    '<button type="button" class="glossary-mob-btn'+(isFav?" on":"")+'" data-act="fav">'+(isFav?"⭐":"☆")+'</button>'+
    '<button type="button" class="glossary-mob-btn'+(isLearned?" on":"")+'" data-act="learn">✅</button>'+
    '<button type="button" class="glossary-mob-btn'+(isReview?" on":"")+'" data-act="review">🔖</button>'+
    '<button type="button" class="glossary-mob-btn" data-act="quiz">❓</button>'+
    '<button type="button" class="glossary-mob-btn" data-act="speak">🔊</button>';
  acts.querySelectorAll(".glossary-mob-btn").forEach(function(b){
    b.addEventListener("click",function(e){
      e.stopPropagation();
      var act=b.getAttribute("data-act");
      if(act==="fav"){ toggleGlossaryFav(g.id); showGlossaryTerm(g.id); }
      else if(act==="learn"){ toggleGlossaryLearned(g.id); showGlossaryTerm(g.id); renderGlossaryMeta($("glossarySearch")?$("glossarySearch").value:""); renderGlossaryWordList(); }
      else if(act==="review"){ toggleGlossaryReview(g.id); showGlossaryTerm(g.id); }
      else if(act==="quiz") startGlossaryQuiz(g.id);
      else if(act==="speak") speak(g.term+". "+glossarySummary(g));
    });
  });
}
function renderGlossaryCatChips(){
  var host=$("glossaryCatChips"); if(!host||typeof GLOSSARY==="undefined") return;
  var cats=[], seen={};
  GLOSSARY.forEach(function(g){ if(g.cat&&!seen[g.cat]){ seen[g.cat]=1; cats.push(g.cat); } });
  var all='<button type="button" class="glossary-cat-chip'+(!glossaryActiveCat?" active":"")+'" data-cat="" role="tab" aria-selected="'+(!glossaryActiveCat?"true":"false")+'">'+t("settings.glossaryAllCats")+'</button>';
  host.innerHTML=all+cats.map(function(c){
    var em=GLOSSARY_CAT_EMOJI[c]||"";
    var on=glossaryActiveCat===c;
    return '<button type="button" class="glossary-cat-chip'+(on?" active":"")+'" data-cat="'+c+'" role="tab" aria-selected="'+(on?"true":"false")+'">'+em+" "+glossaryCatLabel(c)+'</button>';
  }).join("");
  host.querySelectorAll(".glossary-cat-chip").forEach(function(b){
    b.addEventListener("click",function(e){
      e.stopPropagation();
      glossaryActiveCat=b.getAttribute("data-cat")||null;
      renderGlossaryCatChips();
      syncGlossaryFromSearch();
    });
  });
}
function renderGlossaryMeta(q){
  var el=$("glossaryCount"); if(!el||typeof GLOSSARY==="undefined") return;
  ensureUxState();
  var list=glossaryFilter(q||""), total=GLOSSARY.length;
  var learned=glossaryLearnedCount(), favs=S.glossaryFavs?S.glossaryFavs.length:0;
  var pct=total?Math.round(learned/total*100):0;
  var learnedLbl=L()==="pt"?"aprendidos":"learned";
  if((q||"").trim()||glossaryActiveCat){
    var msg=L()==="pt"?list.length+" de "+total+" termos":list.length+" of "+total+" terms";
    el.textContent=msg+" · "+favs+" ⭐ · "+pct+"% "+learnedLbl;
  } else {
    el.textContent=(L()==="pt"?total+" termos · ":total+" terms · ")+favs+" ⭐ · "+pct+"% "+learnedLbl;
  }
  var fill=$("glossaryProgressFill"), bar=$("glossaryProgress");
  if(fill) fill.style.width=pct+"%";
  if(bar){ bar.setAttribute("aria-valuenow",String(pct)); bar.setAttribute("aria-label",(L()==="pt"?"Progresso do glossário":"Glossary progress")+" "+pct+"%"); }
}
function glossaryMatchFromSearch(q){
  q=(q||"").trim(); if(!q) return null;
  var low=q.toLowerCase();
  var hit=GLOSSARY.filter(function(g){
    return g.term.toLowerCase()===low || g.id===low
      || (q.indexOf("—")>=0 && q.toLowerCase().indexOf(g.term.toLowerCase())===0);
  })[0];
  if(hit) return hit.id;
  var list=glossaryFilter(q);
  return list.length===1?list[0].id:null;
}
function glossaryFilter(q){
  q=(q||"").toLowerCase().trim();
  var list=GLOSSARY.slice();
  if(glossaryActiveCat) list=list.filter(function(g){ return g.cat===glossaryActiveCat; });
  if(!q) return list;
  return list.filter(function(g){
    return g.term.toLowerCase().indexOf(q)>=0 || g.id.indexOf(q)>=0
      || (tt(g.name)||"").toLowerCase().indexOf(q)>=0
      || (tt(g.def)||"").toLowerCase().indexOf(q)>=0
      || (g.acr&&(tt(g.acr)||"").toLowerCase().indexOf(q)>=0)
      || (g.cat&&(glossaryCatLabel(g.cat)||"").toLowerCase().indexOf(q)>=0);
  });
}
function syncGlossaryFromSearch(){
  var search=$("glossarySearch");
  if(!search) return;
  var q=search.value.trim();
  renderGlossaryWordList();
  var id=glossaryMatchFromSearch(search.value);
  if(id){ selectGlossaryTerm(id, false); return; }
  var list=glossaryFilter(search.value);
  if(list.length===1){ selectGlossaryTerm(list[0].id, false); return; }
  if(!q){ glossaryActiveId=null; renderGlossaryEmptyState(); updateGlossaryNav(); }
}
function getGlossaryNavIds(){
  var search=$("glossarySearch");
  var q=search?search.value.trim():"";
  var list=glossaryFilter(q);
  if(list.length<=1){
    if(glossaryActiveCat) list=GLOSSARY.filter(function(g){ return g.cat===glossaryActiveCat; });
    else list=GLOSSARY.slice();
  }
  return list.slice().sort(function(a,b){ return a.term.localeCompare(b.term); }).map(function(g){ return g.id; });
}
function glossaryNavIndex(){
  if(!glossaryActiveId) return -1;
  return getGlossaryNavIds().indexOf(glossaryActiveId);
}
function navigateGlossaryTerm(dir){
  var ids=getGlossaryNavIds();
  if(!ids.length) return;
  var idx=glossaryNavIndex();
  if(idx<0) idx=dir>0?-1:0;
  var next=idx+dir;
  if(next<0) next=ids.length-1;
  if(next>=ids.length) next=0;
  selectGlossaryTerm(ids[next], false);
  var panel=document.querySelector(".glossary-panel-detail");
  if(panel) panel.scrollTop=0;
  var card=$("glossaryCard"); if(card){ try{ card.focus(); }catch(e){} }
}
function updateGlossaryNav(){
  var nav=$("glossaryNav"), pos=$("glossaryNavPos"), prev=$("glossaryPrev"), next=$("glossaryNext"), hint=$("glossaryNavHint");
  var navM=$("glossaryNavMobile"), posM=$("glossaryNavPosM"), prevM=$("glossaryPrevM"), nextM=$("glossaryNextM"), bar=$("glossaryMobileBar");
  if(!nav) return;
  var ids=getGlossaryNavIds(), idx=glossaryNavIndex();
  var show=!!glossaryActiveId&&idx>=0&&ids.length>0;
  var isMobile=window.matchMedia("(max-width:640px)").matches;
  nav.hidden=!show||isMobile;
  if(navM) navM.hidden=!show||!isMobile;
  if(bar) bar.hidden=!show||!isMobile;
  if(hint) hint.hidden=!show||isMobile;
  if(!show){ updateGlossaryMobileBar(null); return; }
  var filtered=ids.length<(GLOSSARY?GLOSSARY.length:ids.length);
  var txt=(idx+1)+" / "+ids.length+(filtered?(L()==="pt"?" · filtrados":" · filtered"):"");
  if(pos) pos.textContent=txt;
  if(posM) posM.textContent=txt;
  var solo=ids.length<=1;
  [prev,next,prevM,nextM].forEach(function(btn){
    if(!btn) return;
    btn.disabled=solo;
    btn.setAttribute("aria-disabled",solo?"true":"false");
  });
}
function bindGlossaryKeyboard(){
  var menu=$("glossaryMenu"); if(!menu||menu._gkb) return;
  menu._gkb=true;
  menu.addEventListener("keydown",function(e){
    if(menu.hidden) return;
    var t=e.target, inSearch=t&&t.id==="glossarySearch";
    if(e.key==="/"&&!inSearch){ e.preventDefault(); var gs=$("glossarySearch"); if(gs) gs.focus(); return; }
    if(inSearch&&(e.key==="ArrowDown"||e.key==="ArrowRight")){ e.preventDefault(); if(!glossaryActiveId){ var ids=getGlossaryNavIds(); if(ids.length) selectGlossaryTerm(ids[0],false); } else navigateGlossaryTerm(1); return; }
    if(inSearch&&(e.key==="ArrowUp"||e.key==="ArrowLeft")){ e.preventDefault(); if(!glossaryActiveId){ var ids2=getGlossaryNavIds(); if(ids2.length) selectGlossaryTerm(ids2[ids2.length-1],false); } else navigateGlossaryTerm(-1); return; }
    if(inSearch) return;
    if(e.key==="ArrowRight"||e.key==="ArrowDown"){ e.preventDefault(); navigateGlossaryTerm(1); }
    else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){ e.preventDefault(); navigateGlossaryTerm(-1); }
  });
  if(!menu._gsw){
    menu._gsw=true;
    var sx=0;
    menu.addEventListener("touchstart",function(e){ if(e.touches.length===1) sx=e.touches[0].clientX; },{passive:true});
    menu.addEventListener("touchend",function(e){
      if(!glossaryActiveId||!e.changedTouches.length) return;
      var dx=e.changedTouches[0].clientX-sx;
      if(Math.abs(dx)<50) return;
      if(dx<0) navigateGlossaryTerm(1); else navigateGlossaryTerm(-1);
    },{passive:true});
  }
}
function selectGlossaryTerm(id, updateSearch){
  glossaryActiveId=id||null;
  if(updateSearch!==false){
    var g=GLOSSARY.filter(function(x){ return x.id===id; })[0];
    var search=$("glossarySearch");
    if(g&&search) search.value=g.term;
  }
  renderGlossaryWordList();
  if(id) showGlossaryTerm(id);
  else { renderGlossaryEmptyState(); updateGlossaryNav(); }
}
function renderGlossaryWordList(){
  var host=$("glossaryWordList"), search=$("glossarySearch");
  if(!host) return;
  var q=search?search.value:"", list=glossaryFilter(q).slice();
  list.sort(function(a,b){ return a.term.localeCompare(b.term); });
  host.innerHTML="";
  if(!list.length){
    host.innerHTML='<p class="glossary-list-empty muted">'+(L()==="pt"?"Nenhum termo encontrado.":"No terms found.")+'</p>';
    renderGlossaryMeta(q);
    updateGlossaryListSummary(q);
    return;
  }
  list.forEach(function(g){
    var b=document.createElement("button");
    b.type="button";
    b.className="glossary-word-item"+(glossaryActiveId===g.id?" active":"");
    b.setAttribute("role","option");
    b.setAttribute("aria-selected", glossaryActiveId===g.id?"true":"false");
    b.setAttribute("data-gid", g.id);
    var cat=g.cat?'<span class="glossary-word-cat">'+glossaryCatLabel(g.cat)+'</span>':"";
    var learned=S.glossaryLearned&&S.glossaryLearned[g.id]?'<span class="glossary-word-learned" aria-hidden="true">✓</span>':"";
    var novo=glossaryIsNew(g.id)?'<span class="glossary-new-badge">'+t("settings.glossaryNew")+'</span>':"";
    var reviewMark=S.glossaryReview&&S.glossaryReview.indexOf(g.id)>=0?'<span class="glossary-word-review" aria-hidden="true">🔖</span>':"";
    b.innerHTML=cat+'<span class="glossary-word-term">'+g.term+'</span>'+novo+'<span class="glossary-word-sep">—</span><span class="glossary-word-name">'+tt(g.name)+'</span>'+learned+reviewMark;
    b.addEventListener("click",function(e){ e.stopPropagation(); selectGlossaryTerm(g.id, false); });
    host.appendChild(b);
  });
  renderGlossaryMeta(q);
  updateGlossaryListSummary(q);
  scrollGlossaryActiveIntoView();
}
function scrollGlossaryActiveIntoView(){
  var host=$("glossaryWordList"); if(!host||!glossaryActiveId) return;
  var el=host.querySelector('[data-gid="'+glossaryActiveId+'"]');
  if(el) try{ el.scrollIntoView({block:"nearest",behavior:S.a11y&&S.a11y.motion?"auto":"smooth"}); }catch(e){}
}
function showGlossaryTerm(id){
  var host=$("glossaryCard"); if(!host) return;
  ensureUxState();
  if(!id){ renderGlossaryEmptyState(); return; }
  var g=GLOSSARY.filter(function(x){ return x.id===id; })[0];
  if(!g){ host.innerHTML=""; return; }
  var em=g.cat?(GLOSSARY_CAT_EMOJI[g.cat]||""):"";
  var cat=g.cat?'<span class="glossary-cat">'+em+" "+glossaryCatLabel(g.cat)+'</span>':"";
  var isFav=S.glossaryFavs&&S.glossaryFavs.indexOf(g.id)>=0;
  var isLearned=S.glossaryLearned&&S.glossaryLearned[g.id];
  var isReview=S.glossaryReview&&S.glossaryReview.indexOf(g.id)>=0;
  var novo=glossaryIsNew(g.id)?'<span class="glossary-new-badge">'+t("settings.glossaryNew")+'</span>':"";
  var related=glossaryRelatedIds(g);
  var relHtml=related.length?'<div class="glossary-related-k">'+t("settings.glossaryRelated")+'</div><div class="glossary-related">'+related.map(function(rid){
    var rg=GLOSSARY.filter(function(x){return x.id===rid;})[0]; if(!rg) return "";
    return '<button type="button" class="glossary-related-chip" data-gid="'+rid+'">'+rg.term+'</button>';
  }).join("")+'</div>':"";
  var sum=glossarySummary(g), fullDef=tt(g.def)||"";
  var nameBlock='<div class="glossary-name-block"><div class="glossary-def-k">'+t("settings.glossaryDef")+'</div><div class="glossary-name">'+tt(g.name)+'</div></div>';
  var acrBlock=g.acr?'<p class="glossary-acr glossary-acr-prominent"><span class="glossary-acr-k">'+t("settings.glossaryAcr")+'</span>'+tt(g.acr)+'</p>':"";
  var details="";
  if(fullDef.length>sum.length){
    details='<details class="glossary-more"><summary>'+t("settings.glossaryMore")+'</summary>'
      +'<div class="glossary-def-k">'+t("settings.glossaryFullDef")+'</div><p class="glossary-def">'+fullDef+'</p></details>';
  }
  host.innerHTML=
    cat+
    '<div class="glossary-term-row2"><div class="glossary-term">'+g.term+'</div>'+novo+'</div>'+
    nameBlock+
    acrBlock+
    '<div class="glossary-card-actions">'+
      '<button type="button" class="glossary-action-btn glossary-fav-toggle'+(isFav?" on":"")+'" data-act="fav" aria-label="'+(L()==="pt"?"Favorito":"Favorite")+'">'+(isFav?"⭐":"☆")+'</button>'+
      '<button type="button" class="glossary-action-btn glossary-learn-toggle'+(isLearned?" on":"")+'" data-act="learn">✅ '+(isLearned?t("settings.glossaryLearnedDone"):t("settings.glossaryLearned"))+'</button>'+
      '<button type="button" class="glossary-action-btn glossary-review-toggle'+(isReview?" on":"")+'" data-act="review">🔖 '+(isReview?t("settings.glossaryReviewing"):t("settings.glossaryReview"))+'</button>'+
      '<button type="button" class="glossary-action-btn glossary-quiz-toggle" data-act="quiz">❓ '+t("settings.glossaryQuizBtn")+'</button>'+
      '<button type="button" class="glossary-action-btn glossary-speak-toggle" data-act="speak" aria-label="'+t("settings.glossarySpeak")+'">🔊</button>'+
    '</div>'+
    '<div class="glossary-summary-block"><div class="glossary-def-k">'+t("settings.glossaryWhatIs")+'</div><p class="glossary-summary">'+sum+'</p></div>'+
    '<div class="glossary-fun-block"><div class="glossary-fun-k">'+t("settings.glossaryDayToDay")+'</div><p class="glossary-fun">'+tt(g.fun)+'</p></div>'+
    relHtml+details;
  bindGlossaryCardActions(g);
  var collapse=$("glossaryListCollapse");
  if(collapse&&window.matchMedia("(max-width:640px)").matches) collapse.open=false;
  updateGlossaryNav();
  updateGlossaryMobileBar(g);
}
function renderGlossaryEmptyState(){
  var host=$("glossaryCard"); if(!host) return;
  var nav=$("glossaryNav"), hint=$("glossaryNavHint"), bar=$("glossaryMobileBar");
  if(nav) nav.hidden=true;
  if(hint) hint.hidden=true;
  if(bar) bar.hidden=true;
  var popular=GLOSSARY_SUGGESTIONS.map(function(id){
    var g=GLOSSARY.filter(function(x){return x.id===id;})[0]; if(!g) return "";
    return '<button type="button" class="glossary-suggest-chip" data-gid="'+id+'">'+g.term+'</button>';
  }).join("");
  var role=getRoleGlossaryPicks().map(function(id){
    var g=GLOSSARY.filter(function(x){return x.id===id;})[0]; if(!g) return "";
    return '<button type="button" class="glossary-suggest-chip glossary-role-chip" data-gid="'+id+'">'+g.term+'</button>';
  }).join("");
  host.innerHTML='<p class="glossary-empty muted">'+t("settings.glossaryEmpty")+'</p>'
    +'<div class="glossary-suggest-k">'+t("settings.glossarySuggest")+'</div><div class="glossary-suggest">'+popular+'</div>'
    +'<div class="glossary-suggest-k">'+t("settings.glossaryRolePick")+'</div><div class="glossary-suggest">'+role+'</div>'
    +'<button type="button" class="glossary-explore-start btn btn-sm btn-ghost" id="glossaryExploreStart">'+t("settings.glossaryExplore")+'</button>';
  host.querySelectorAll(".glossary-suggest-chip").forEach(function(b){
    b.addEventListener("click",function(){ openGlossaryForTerm(b.getAttribute("data-gid")); });
  });
  var ex=$("glossaryExploreStart"); if(ex) ex.addEventListener("click",function(e){ e.stopPropagation(); startGlossaryExplore(); });
}
function syncOverlayBackdrop(){
  var bd=$("a11yBackdrop"); if(!bd) return;
  var am=$("a11yMenu"), sm=$("settingsMenu"), gm=$("glossaryMenu");
  var open=(am&&!am.hidden)||(sm&&!sm.hidden)||(gm&&!gm.hidden);
  bd.hidden=!open;
  bd.setAttribute("aria-hidden",open?"false":"true");
}
function positionGlossaryMenu(){
  var menu=$("glossaryMenu"), btn=$("glossaryBtn");
  if(!menu||!btn||menu.hidden) return;
  if(window.matchMedia("(max-width:640px)").matches){
    menu.style.top=""; menu.style.right=""; menu.style.left=""; menu.style.bottom=""; menu.style.width="";
    return;
  }
  var r=btn.getBoundingClientRect(), w=Math.min(720, window.innerWidth-28);
  menu.style.top=(r.bottom+8)+"px";
  menu.style.right=Math.max(8, window.innerWidth-r.right)+"px";
  menu.style.left="auto";
  menu.style.width=w+"px";
}
function toggleGlossaryMenu(force){
  var menu=$("glossaryMenu"),btn=$("glossaryBtn");
  if(!menu) return;
  var open=force!==undefined?!!force:menu.hidden;
  if(open){ toggleA11yMenu(false); toggleSettingsMenu(false); toggleStreakPopover(false); toggleToolbarMore(false); }
  menu.hidden=!open;
  menu.setAttribute("aria-modal",open?"true":"false");
  if(btn) btn.setAttribute("aria-expanded",open?"true":"false");
  syncOverlayBackdrop();
  document.body.classList.toggle("glossary-menu-open",open);
  if(open){
    positionGlossaryMenu();
    renderGlossaryCatChips();
    renderGlossaryWordList(); renderGlossaryFavs(); renderGlossaryReviewList();
    if(glossaryActiveId) showGlossaryTerm(glossaryActiveId);
    else renderGlossaryEmptyState();
    trapFocus(menu, btn);
    bindGlossaryKeyboard();
    var gs=$("glossarySearch"); if(gs){ gs.focus(); try{ gs.select(); }catch(e){} }
  } else {
    releaseFocusTrap();
    closeGlossaryQuiz();
    if(glossaryFromQuiz){ glossaryFromQuiz=false; var rh=$("quizGlossaryReturn"); if(rh) rh.hidden=false; }
  }
}
function toggleSettingsMenu(force){
  var menu=$("settingsMenu"),btn=$("settingsBtn");
  if(!menu) return;
  var open=force!==undefined?!!force:menu.hidden;
  if(open){ toggleA11yMenu(false); toggleStreakPopover(false); toggleGlossaryMenu(false); toggleToolbarMore(false); }
  menu.hidden=!open;
  menu.setAttribute("aria-modal",open?"true":"false");
  if(btn) btn.setAttribute("aria-expanded",open?"true":"false");
  syncOverlayBackdrop();
  document.body.classList.toggle("settings-menu-open",open);
  if(open){ renderA11yCatalog(); var ts=$("themeSelect"); if(ts) ts.value=S.theme||"default"; trapFocus(menu, btn); }
  else releaseFocusTrap();
}
function toggleA11yMenu(force){
  var menu=$("a11yMenu"),btn=$("a11yBtn"); if(!menu) return;
  var open=force!==undefined?!!force:menu.hidden;
  if(open){ toggleSettingsMenu(false); toggleStreakPopover(false); toggleGlossaryMenu(false); toggleToolbarMore(false); }
  menu.hidden=!open;
  menu.setAttribute("aria-modal",open?"true":"false");
  if(btn) btn.setAttribute("aria-expanded", open?"true":"false");
  syncOverlayBackdrop();
  document.body.classList.toggle("a11y-menu-open", open);
  if(open){ renderA11yCatalog(); trapFocus(menu, btn); }
  else releaseFocusTrap();
}

/* -------------------- HUD -------------------- */
function applyCosmetics(){
  if(!S.equipped) S.equipped={avatar:"🛡️",frame:"default",skin:"default"};
  if(!S.equipped.frame) S.equipped.frame="default";
  if(!S.equipped.skin) S.equipped.skin="default";
  var badge=$("hudAvatar");
  if(badge){
    badge.textContent=S.equipped.avatar||"🛡️";
    badge.className="logo-badge";
    var fr=FRAMES.find(function(f){ return f.id===S.equipped.frame; })||FRAMES[0];
    if(fr && fr.css!=="frame-default") badge.classList.add(fr.css);
  }
  document.body.classList.remove("skin-default","skin-forest","skin-ocean","skin-mine","skin-night","skin-neon","skin-alert");
  var sk=SKINS.find(function(s){ return s.id===S.equipped.skin; })||SKINS[0];
  if(sk) document.body.classList.add(sk.css);
}
function toggleStreakPopover(force){
  var pop=$("streakPopover"), btn=$("hudStreakBtn");
  if(!pop) return;
  var open=force!==undefined?!!force:pop.hidden;
  if(open){ toggleA11yMenu(false); toggleSettingsMenu(false); toggleGlossaryMenu(false); toggleToolbarMore(false); renderHudStreak(); }
  pop.hidden=!open;
  if(btn) btn.setAttribute("aria-expanded", open?"true":"false");
  document.body.classList.toggle("streak-pop-open", open);
  if(open) trapFocus(pop, btn);
  else if(focusTrapState&&focusTrapState.container===pop) releaseFocusTrap();
}
function renderHudStreak(){
  ensureStreak();
  var btn=$("hudStreakBtn");
  var n=S.streak.count||0, best=S.streak.best||0, today=streakPlayedToday();
  var numEl=$("hudStreakNum");
  if(numEl) numEl.textContent=String(n);
  if(btn){
    btn.classList.remove("streak-hud-active","streak-hud-risk","streak-hud-neutral");
    if(today && n>0) btn.classList.add("streak-hud-active");
    else if(n>0 && !today) btn.classList.add("streak-hud-risk");
    else btn.classList.add("streak-hud-neutral");
    btn.setAttribute("title", t("hud.tip.streak"));
    btn.setAttribute("aria-label", t("hud.tip.streak")+" — "+n+" "+t("streak.days"));
  }
  var countEl=$("streakPopCount"), bestEl=$("streakPopBest"), statusEl=$("streakPopStatus");
  if(countEl) countEl.textContent=n;
  if(bestEl) bestEl.textContent=best;
  if(statusEl){
    var status;
    if(today) status=t("streak.today");
    else if(n===0) status=t("streak.start");
    else if(n<=1&&!today) status=t("streak.dayOne");
    else if(n>0) status=streakRiskMsg();
    else status=t("streak.neutral");
    statusEl.textContent=status;
    statusEl.className="streak-pop-status"+(today?" streak-pop-ok":(n>0?" streak-pop-risk":" streak-pop-neutral"));
  }
}
function refreshHud(){
  var xp=$("hudXp"), score=$("hudScore"), lvl=$("hudLevel"), title=$("hudTitle");
  if(xp) xp.textContent=S.xp;
  if(score) score.textContent=S.score;
  if(lvl) lvl.textContent=levelOf();
  if(title){ var ti=currentTitle(); title.textContent=ti.ico+" "+tt(ti); }
  renderHudStreak();
  ensureBossStats();
  var avg=bossAvgIndex(), chip=$("hudMaturityChip");
  if(chip) chip.textContent="🛡️ "+avg+"%";
  var sum=$("hudStatsSummary");
  if(sum) sum.textContent="📊 Nv "+levelOf()+"/"+MAX_LEVEL+" · ⭐ "+S.xp+(S.simpleUi===false?" · 🛡️ "+avg+"%":"");
  applyCosmetics();
  renderLives();
}
function renderLives(){ var el=$("hudLives"); if(!el) return; var n=Math.max(0,S.lives||0); el.textContent="❤️".repeat(n)+"🖤".repeat(Math.max(0,3-n)); }
function addReward(xp,coins,scr){ S.xp+=xp||0; S.score+=scr||0; checkMedals(); refreshHud(); save(); }

/* -------------------- ESTATÍSTICAS DE TEMA -------------------- */
function recordTheme(theme,ok){
  var s=S.themeStats[theme]||{c:0,t:0}; s.t++; if(ok) s.c++; S.themeStats[theme]=s;
}
function themeAcc(theme){ var s=S.themeStats[theme]; return s&&s.t? Math.round(s.c/s.t*100):null; }

/* -------------------- PEDAGOGIA: SRS, PONTE PESSOAL, REPORTAR -------------------- */
var SRS_INTERVALS=[1,3,7];
var REPORT_THEMES={phishing:1,bec:1,data:1};
var WEEK_THEME_ROTATION=["phishing","ot","bec","password","data","port","device","remote"];
var PERSONAL_BY_THEME={
  phishing:{pt:"Na vida pessoal: desconfie de links urgentes em SMS, e-mail ou redes — confirme pela fonte oficial.",en:"In personal life: be wary of urgent links in SMS, email or social media — confirm via the official source."},
  password:{pt:"Na vida pessoal: senha única + autenticação em duas etapas no banco e e-mail protegem você como no trabalho.",en:"In personal life: unique passwords + two-factor on bank and email protect you like at work."},
  ot:{pt:"Na vida pessoal: dispositivos da smart home na rede de visitas podem abrir brechas — separe redes.",en:"In personal life: smart-home devices on guest networks can open gaps — separate networks."},
  data:{pt:"Na vida pessoal: fotos de documentos no grupo da família podem vazar — compartilhe só o necessário.",en:"In personal life: document photos in family groups can leak — share only what's needed."},
  device:{pt:"Na vida pessoal: bloquear o celular ao sair da mesa evita acesso indevido em segundos.",en:"In personal life: locking your phone when you step away prevents access in seconds."},
  remote:{pt:"Na vida pessoal: VPN ou dados móveis em redes públicas — Wi-Fi aberto é porta aberta.",en:"In personal life: VPN or mobile data on public networks — open Wi-Fi is an open door."},
  bec:{pt:"Na vida pessoal: PIX urgente por WhatsApp de 'parente'? Ligue antes — contas clonadas imitam quem você confia.",en:"In personal life: urgent PIX on WhatsApp from a 'relative'? Call first — cloned accounts mimic people you trust."},
  port:{pt:"Na vida pessoal: estranhos fotografando sua casa ou prédio podem mapear rotinas — avise a segurança.",en:"In personal life: strangers photographing your home or building may map routines — alert security."}
};
var BOSS_THEME_DEFAULT={ransom:"ot",ceo:"bec",otintr:"ot",omphish:"phishing",leakchain:"data",portintr:"port"};
var ORBITA_POLICY_URL="https://www.orbita.com/pt/sustentabilidade/governanca";

function fullBank(){ return BANK.concat(typeof COUNTRY_BANK!=="undefined"?COUNTRY_BANK:[]); }
function getPersonal(q){ return q&&(q.personal||(q.theme&&PERSONAL_BY_THEME[q.theme]))||null; }
function todayNum(){ var d=new Date(); return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate(); }
function ensureMissed(){ if(!S.missed) S.missed={}; }
function recordMiss(q,ok,ctx){
  ensureMissed(); var id=qKey(q,ctx); if(ok){ if(S.missed[id]&&S.missed[id].streak>=2) delete S.missed[id]; else if(S.missed[id]){ S.missed[id].streak=(S.missed[id].streak||0)+1; if(S.missed[id].streak>=2) delete S.missed[id]; else { var iv=S.missed[id].interval||0; S.missed[id].interval=Math.min(iv+1,SRS_INTERVALS.length-1); S.missed[id].nextReview=todayNum()+SRS_INTERVALS[S.missed[id].interval]; } } save(); return; }
  var m=S.missed[id]||{interval:0,streak:0,theme:q.theme,nextReview:0}; m.streak=0; m.theme=q.theme||m.theme; m.lastSeen=todayNum(); m.nextReview=todayNum()+SRS_INTERVALS[0]; m.interval=0; S.missed[id]=m; save();
}
function qKey(q,ctx){ if(q.id) return q.id; if(cur.mode==="chain"&&cur.chainKey){ var p=cur.chainKey.split("__"); return p[0]+"_"+p[1]+"_q"+(cur.i+1); } return "q_"+(q.theme||"x")+"_"+cur.i; }
function srsDueItems(){
  ensureMissed(); var today=todayNum(), out=[], byId={};
  fullBank().forEach(function(q){ byId[q.id]=q; });
  CHAINS.forEach(function(ch){ ch.stages.forEach(function(st){ st.qs.forEach(function(q,i){ byId[ch.id+"_"+st.id+"_q"+(i+1)]=q; }); }); });
  for(var id in S.missed){ if(S.missed[id].nextReview<=today&&byId[id]) out.push(byId[id]); }
  return out;
}
function allMissedQuestions(){
  ensureMissed(); var byId={}, out=[];
  fullBank().forEach(function(q){ byId[q.id]=q; });
  CHAINS.forEach(function(ch){ ch.stages.forEach(function(st){ st.qs.forEach(function(q,i){ var id=ch.id+"_"+st.id+"_q"+(i+1); byId[id]=q; }); }); });
  for(var id in S.missed){ if(byId[id]){ var qq=Object.assign({id:id},byId[id]); out.push(qq); } }
  return out;
}
function bossPhaseTheme(b,ph){ if(ph.theme) return ph.theme; var t=(ph.q&&ph.q.pt||"").toLowerCase();
  if(/e-mail|phishing|link|macro|smishing|sms/.test(t)) return "phishing";
  if(/senha|password|mfa|credencial/.test(t)) return "password";
  if(/pagamento|transfer|banco|fornecedor|ceo|bec|bitcoin|conta/.test(t)) return "bec";
  if(/dados|lgpd|vazamento|planilha|relat|privacidade/.test(t)) return "data";
  if(/crach|porto|terminal|drone|fotograf/.test(t)) return "port";
  if(/vpn|wi-fi|remoto|viagem|hotspot/.test(t)) return "remote";
  if(/tablet|app|dispositivo|notebook|pen drive|usb|firmware/.test(t)) return "device";
  return BOSS_THEME_DEFAULT[b.id]||"ot";
}
function getWeekTheme(){ var wk=weekKey(), n=parseInt((wk.split("-W")[1]||"1"),10); return WEEK_THEME_ROTATION[(n-1)%WEEK_THEME_ROTATION.length]; }
function overallAcc(){ var c=0,t=0,k; for(k in S.themeStats){ c+=(S.themeStats[k].c||0); t+=(S.themeStats[k].t||0); } return t?Math.round(c/t*100):null; }
function weakestThemeKey(){ var list=themesNeedingWork(70); return list.length?list[0].k:null; }
function themesNeedingWork(threshold){
  threshold=threshold||70;
  var list=[], k, a;
  for(k in THEMES){
    a=themeAcc(k);
    if(a!==null&&a<threshold) list.push({k:k,a:a});
  }
  list.sort(function(x,y){ return x.a-y.a; });
  return list;
}
function pedagogicalRecommendations(){
  var recs=[], weakList=themesNeedingWork(70), wt, wtAcc;
  weakList.slice(0,3).forEach(function(w){
    recs.push({ico:THEMES[w.k].ico,txt:t("pedagogy.recWeak")+" "+tt(THEMES[w.k])+" · "+w.a+"%",action:"theme",theme:w.k,acc:w.a});
  });
  wt=getWeekTheme(); wtAcc=themeAcc(wt);
  if(wtAcc===null||wtAcc<80) recs.push({ico:THEMES[wt].ico,txt:(L()==="pt"?"Semana: ":"Week: ")+tt(THEMES[wt])+(wtAcc!==null?" · "+wtAcc+"%":""),action:"weekly",theme:wt});
  if((bossCompletedCount()||0)<1) recs.push({ico:"🎯",txt:L()==="pt"?"Pratique transferência: jogue uma crise":"Practice transfer: play a crisis",action:"boss"});
  return recs.slice(0,4);
}
function renderPedagogyRec(hostId){
  var host=$(hostId); if(!host) return;
  var recs=pedagogicalRecommendations();
  if(!recs.length){ host.innerHTML='<p class="muted">'+t("manager.recEmpty")+'</p>'; return; }
  host.innerHTML='<div class="ped-rec-title">'+t("pedagogy.recTitle")+'</div>';
  recs.forEach(function(r){
    var row=document.createElement("div"); row.className="ped-rec-item"+(r.acc!==undefined&&r.acc<70?" ped-rec-item--weak":"");
    row.innerHTML='<span class="ped-rec-ico">'+r.ico+'</span><span class="ped-rec-txt">'+r.txt+'</span>';
    var play=document.createElement("button"); play.className="btn btn-ghost btn-sm"; play.textContent=t("pedagogy.recPlay");
    play.addEventListener("click",function(){
      if(r.action==="review") startReviewErrors();
      else if(r.action==="boss"){ renderBossList(); show("screenBossList"); }
      else if(r.action==="weekly"&&r.theme) startThemeDrill(r.theme);
      else if(r.action==="theme"&&r.theme) startThemeDrill(r.theme);
      else openMap(null,true);
    });
    row.appendChild(play); host.appendChild(row);
  });
}
var quitCallback=null;
function showQuitDialog(cb){
  quitCallback=cb;
  var dlg=$("quitDialog"), msg=$("quitDialogMsg");
  if(!dlg) return;
  if(msg) msg.textContent=t("quiz.quitConfirm");
  dlg.hidden=false;
  document.body.classList.add("quit-open");
  var stay=$("quitDialogCancel"); if(stay) stay.focus();
}
function hideQuitDialog(){ quitCallback=null; var dlg=$("quitDialog"); if(dlg) dlg.hidden=true; document.body.classList.remove("quit-open"); }
function applySimpleUi(){
  document.body.classList.toggle("simple-ui",S.simpleUi!==false);
}
function playNow(){
  var ns=computeNextStep();
  if(ns&&ns.act) ns.act();
}
function updateQuizResilienceVisibility(){
  var el=document.querySelector("#screenQuiz .integrity-res");
  if(!el) return;
  var show=false;
  if(cur.qStates){ for(var k in cur.qStates){ if(cur.qStates[k]&&!cur.qStates[k].ok){ show=true; break; } } }
  el.classList.toggle("quiz-resilience-hidden",!show);
}
function updateQuizProgress(){
  var lab=$("quizProgressLabel"), fill=$("quizProgressFill"), bar=fill&&fill.parentNode;
  if(!lab||!cur.questions||!cur.questions.length) return;
  var n=cur.i+1, tot=cur.questions.length, pct=Math.round(n/tot*100);
  lab.textContent=t("quiz.progress").replace("{n}",String(n)).replace("{t}",String(tot));
  if(fill) fill.style.width=pct+"%";
  if(bar){ bar.setAttribute("aria-valuenow",String(pct)); bar.setAttribute("aria-label",lab.textContent); }
}
function initQuizSession(){ cur.sessionLog=[]; cur.qStates={}; cur.optOrder={}; cur.reportPending=false; cur.reportDone=false; glossaryFromQuiz=false; var rs=$("reportStep"); if(rs) rs.hidden=true; var rh=$("quizGlossaryReturn"); if(rh) rh.hidden=true; updateQuizResilienceVisibility(); }
function countQuizCorrect(){ var n=0,i; if(!cur.qStates) return 0; for(i=0;i<cur.questions.length;i++){ if(cur.qStates[i]&&cur.qStates[i].ok) n++; } return n; }
function rebuildSessionLog(){ cur.sessionLog=[]; var i; for(i=0;i<cur.questions.length;i++){ if(cur.qStates[i]) cur.sessionLog.push({q:cur.questions[i],ok:cur.qStates[i].ok,i:i}); } }
function updateQuizNav(){
  var prev=$("prevBtn"), next=$("nextBtn"), hint=$("quizNextHint"); if(!prev||!next) return;
  prev.disabled=cur.i<=0||!!cur.reportPending;
  var answered=!!(cur.qStates&&cur.qStates[cur.i]);
  if(hint){
    if(!answered&&!cur.reportPending){ hint.hidden=false; hint.textContent=t("quiz.nextHint"); }
    else hint.hidden=true;
  }
  if(cur.reportPending){ next.style.display="none"; return; }
  if(answered){
    next.style.display="inline-block";
    next.textContent=cur.i>=cur.questions.length-1?t("quiz.finish"):t("quiz.next");
  } else next.style.display="none";
}
function quizQuit(){
  if(cur.reportPending){
    cur.reportPending=false;
    var rs=$("reportStep"); if(rs) rs.hidden=true;
  }
  showQuitDialog(function(){
    stopSpeak();
    cur.reportPending=false;
    if(cur.mode==="daily"){ renderDaily(); show("screenDaily"); }
    else if(cur.mode==="review"){ renderProfile(); show("screenProfile"); }
    else if(cur.mode==="chain"){ renderBossList(); show("screenBossList"); }
    else if(cur.mode==="campaign") returnToMap();
    else show("screenHome");
  });
}
function prevQuestion(){
  if(cur.reportPending||cur.i<=0) return;
  cur.i--; cur.reportPending=false; var rs=$("reportStep"); if(rs) rs.hidden=true;
  renderQuestion();
}
function showReportPrompt(q){
  var rs=$("reportStep"); if(!rs) return;
  cur.reportPending=true; updateQuizNav(); rs.hidden=false;
  rs.innerHTML='<div class="report-title">'+t("report.title")+'</div><p class="report-sub">'+t("report.sub")+'</p><div class="report-btns"></div><button type="button" class="btn btn-ghost report-skip-main" id="reportSkipMain">'+t("report.skipVisible")+'</button><p class="report-how">'+t("report.how")+'</p>';
  var box=rs.querySelector(".report-btns");
  [{k:"report.helpdesk"},{k:"report.security"},{k:"report.privacy"}].forEach(function(ch){
    var b=document.createElement("button"); b.className="btn btn-blue btn-sm"; b.textContent=t(ch.k);
    b.addEventListener("click",function(){ completeReport(); }); box.appendChild(b);
  });
  var sk=$("reportSkipMain")||rs.querySelector(".report-skip-main");
  if(sk) sk.addEventListener("click",function(){ cur.reportPending=false; rs.hidden=true; updateQuizNav(); $("nextBtn").focus(); });
}
function completeReport(){ S.reports=(S.reports||0)+1; addReward(5,2,0); save(); cur.reportPending=false;
  if(cur.qStates&&cur.qStates[cur.i]) cur.qStates[cur.i].reportDone=true;
  var rs=$("reportStep");
  if(rs){ rs.innerHTML='<p class="report-done">'+t("report.done")+'</p>'; rs.hidden=false; }
  updateQuizNav(); $("nextBtn").focus(); toast(t("report.done")); }
function renderCampaignDebrief(){
  var host=$("campaignDebrief"); if(!host) return;
  if(!cur.sessionLog||!cur.sessionLog.length||cur.mode==="review"||cur.mode==="daily"){ host.hidden=true; return; }
  var wrong=cur.sessionLog.filter(function(x){ return !x.ok; });
  host.hidden=false;
  var html='<div class="section-title">'+t("debrief.title")+'</div>';
  if(wrong.length){ html+='<div class="debrief-k">'+t("debrief.errors")+'</div><ul class="debrief-list">';
    wrong.slice(0,3).forEach(function(x){ html+='<li><strong>'+tt(THEMES[x.q.theme])+'</strong>: '+tt(x.q.why)+'</li>'; }); html+='</ul>'; }
  var tip=wrong.length?wrong[0].q.theme:weakestThemeKey();
  if(tip&&PERSONAL_BY_THEME[tip]) html+='<div class="debrief-tip"><span class="debrief-k">'+t("debrief.tip")+':</span> '+tt(PERSONAL_BY_THEME[tip])+'</div>';
  html+='<p class="muted debrief-policy"><a href="'+ORBITA_POLICY_URL+'" target="_blank" rel="noopener">'+t("debrief.policy")+'</a></p>';
  host.innerHTML=html;
}
function startReviewErrors(){
  var qs=srsDueItems().length?srsDueItems():allMissedQuestions();
  if(!qs.length){ toast(t("pedagogy.reviewEmpty")); return; }
  cur.mode="review"; cur.country={id:"review",name:{pt:"Revisão dos erros",en:"Mistake review"},flag:"📚"};
  cur.questions=shuffleQuestions(qs.slice()); cur.i=0; cur.correct=0; cur.integrity=100; S.lives=99; initQuizSession();
  show("screenQuiz"); renderQuestion();
}
function startThemeDrill(theme){
  if(!theme||!THEMES[theme]){ openMap(null,true); return; }
  var pool=fullBank().filter(function(q){ return q.theme===theme&&questionMatchesProfile(q); });
  if(pool.length<3) pool=fullBank().filter(function(q){ return q.theme===theme; });
  if(!pool.length){ toast(L()==="pt"?"Sem perguntas deste tema — abrindo mapa.":"No questions for this theme — opening map."); openMap(null,true); return; }
  cur.mode="themeDrill";
  cur.country={id:"theme_"+theme,name:{pt:"Reforço: "+tt(THEMES[theme]),en:"Drill: "+tt(THEMES[theme])},flag:THEMES[theme].ico};
  cur.questions=pickProfileQuestions(pool,Math.min(6,pool.length)); cur.i=0; cur.correct=0; cur.integrity=100; S.lives=99; initQuizSession();
  show("screenQuiz"); renderQuestion();
}

/* -------------------- RANKING SIMULADO POR EQUIPE -------------------- */
function ensureTeamScores(){ /* ranking honesto: sem scores fake */ }
function renderRank(host){
  if(!host) return;
  var acc=overallAcc();
  var tm=TEAMS.filter(function(t){ return t.id===S.team; })[0];
  host.innerHTML="";
  if(!tm){ host.innerHTML='<p class="muted">'+(L()==="pt"?"Escolha uma equipe no início.":"Choose a team at setup.")+'</p>'; return; }
  var d=document.createElement("div"); d.className="rank-item you";
  d.innerHTML='<span class="rank-pos">★</span><span>'+tm.ico+' '+tt(tm)+'</span><span class="rank-bar"><span class="rf" style="width:'+(acc||0)+'%"></span></span><span class="rank-val">'+(acc!==null?acc+'%':(L()==="pt"?"Sem dados":"No data"))+'</span>';
  host.appendChild(d);
  var note=document.createElement("p"); note.className="muted"; note.style.marginTop="8px";
  note.textContent=L()==="pt"?"Só sua equipe neste dispositivo — sem ranking simulado de outras equipes.":"Only your team on this device — no simulated rankings for other teams.";
  host.appendChild(note);
}

/* ==========================================================
   MAPA GLOBAL (D3 / orbita-world-map.js)
   ========================================================== */
var VW=960,VH=520,mapProcess=null,mapHitActive=null,chainStageActive=null,mapSearchQuery="",view={x:0,y:0,w:VW,h:VH};
var MAP_UNIFORM_VIEW_W=400;
var MAP_PROCESSES=[{id:null, label:"map.procWorld", tip:"map.procWorldTip"}];
function normalizeMapProcess(){ mapProcess=null; }
function mapChainMode(){ return false; }
function mapTabId(procId){ return procId===null||procId===undefined?"world":String(procId); }
var mapTabFocusId=null;
function focusMapTab(btn){
  var bar=$("mapProcessBar"); if(!bar||!btn) return;
  bar.querySelectorAll(".map-process-btn").forEach(function(b){
    b.setAttribute("tabindex",b===btn?"0":"-1");
    b.setAttribute("aria-selected",b===btn?"true":"false");
  });
  var stage=$("mapStage");
  if(stage) stage.setAttribute("aria-labelledby",btn.id);
  btn.focus();
  btn.scrollIntoView({behavior:S.a11y.motion?"auto":"smooth",block:"nearest",inline:"nearest"});
}
function bindMapProcessKeys(bar){
  if(!bar||bar._mapKeysBound) return;
  bar._mapKeysBound=true;
  bar.addEventListener("keydown",function(e){
    var tabs=Array.prototype.slice.call(bar.querySelectorAll(".map-process-btn"));
    if(!tabs.length) return;
    var i=tabs.indexOf(document.activeElement);
    var next=-1;
    if(e.key==="ArrowRight"||e.key==="ArrowDown"){ e.preventDefault(); next=i<0?0:(i+1)%tabs.length; }
    else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){ e.preventDefault(); next=i<0?tabs.length-1:(i-1+tabs.length)%tabs.length; }
    else if(e.key==="Home"){ e.preventDefault(); next=0; }
    else if(e.key==="End"){ e.preventDefault(); next=tabs.length-1; }
    if(next>=0){
      var t=tabs[next];
      var pid=t.getAttribute("data-process");
      mapTabFocusId=pid;
      setMapProcess(pid==="world"?null:pid);
    }
  });
}
function restoreMapTabFocus(){
  if(!mapTabFocusId) return;
  var t=$("map-tab-"+mapTabFocusId);
  if(t) focusMapTab(t);
  mapTabFocusId=null;
}
function renderMapProcessBar(){
  var bar=$("mapProcessBar"); if(!bar) return;
  if(MAP_PROCESSES.length<=1){ bar.hidden=true; return; }
  bar.hidden=false;
  bar.innerHTML="";
  MAP_PROCESSES.forEach(function(p){
    var tid=mapTabId(p.id);
    var on=mapProcess===p.id||(mapProcess===null&&p.id===null);
    var b=document.createElement("button");
    b.type="button";
    b.id="map-tab-"+tid;
    b.className="map-process-btn"+(on?" on":"");
    b.setAttribute("role","tab");
    b.setAttribute("data-process",tid);
    b.setAttribute("aria-selected",on?"true":"false");
    b.setAttribute("tabindex",on?"0":"-1");
    b.setAttribute("aria-controls","mapStage");
    b.textContent=t(p.label);
    b.setAttribute("title",t(p.tip));
    b.setAttribute("aria-label",t(p.label)+". "+t(p.tip));
    b.addEventListener("click",function(){ mapTabFocusId=tid; setMapProcess(p.id); });
    bar.appendChild(b);
  });
  bindMapProcessKeys(bar);
  var active=bar.querySelector(".map-process-btn.on");
  var stage=$("mapStage");
  if(stage&&active) stage.setAttribute("aria-labelledby",active.id);
}
function setMapProcess(id){
  mapProcess=id;
  normalizeMapProcess();
  chainStageActive=null;
  view={x:0,y:0,w:VW,h:VH};
  drawMap();
}
function updateMapContext(){
  var el=$("mapContext"); if(!el) return;
  var proc=MAP_PROCESSES.filter(function(p){ return mapProcess===p.id||(mapProcess===null&&p.id===null); })[0];
  el.textContent=proc?t(proc.label):"";
  var sw=$("mapSearchWrap"); if(sw) sw.hidden=false;
}
function scrollMapListItem(sel){
  var el=document.querySelector(sel);
  if(el) el.scrollIntoView({behavior:S.a11y.motion?"auto":"smooth",block:"nearest"});
}
function applyMapSearch(){
  var q=(mapSearchQuery||"").trim().toLowerCase();
  var empty=$("mapSearchEmpty");
  var any=false;
  document.querySelectorAll("#countryList .country-btn").forEach(function(b){
    var name=(b.getAttribute("data-search")||b.textContent||"").toLowerCase();
    var show=!q||name.indexOf(q)>=0;
    b.classList.toggle("map-hidden",!show);
    if(show) any=true;
  });
  document.querySelectorAll("#countryList .country-group").forEach(function(g){
    var vis=g.querySelectorAll(".country-btn:not(.map-hidden)").length>0;
    g.classList.toggle("map-group-hidden",!vis);
    if(vis) any=true;
  });
  if(empty) empty.hidden=any||!q;
}
function updateMapHint(){
  var h=$("mapHint"); if(!h) return;
  h.textContent=t("map.hint");
}
function setChainStageHighlight(id, scroll){
  chainStageActive=id||null;
  document.querySelectorAll("#bossChainFlow .chain-stage").forEach(function(el){
    el.classList.toggle("active",!!id&&el.getAttribute("data-stage")===id);
  });
  var anim=$("bossChainAnim");
  if(anim) anim.querySelectorAll(".cmap-pin").forEach(function(el){
    el.classList.toggle("active",!!id&&el.getAttribute("data-stage")===id);
  });
  if(scroll&&id) scrollMapListItem('#bossChainFlow .chain-stage[data-stage="'+id+'"]');
}
var CHAIN_BOSS_CFG={
  ransom:{chainId:"carajas",emoji:"⛓️",tag:{pt:"Sistema Norte · Cadeia",en:"Northern System · Chain"},
    name:{pt:"Cadeia Norte — Carajás → China",en:"Northern Chain — Carajás → China"},
    desc:{pt:"Proteja cada elo do Sistema Norte — da mina S11D ao cliente na China. Uma brecha impacta toda a cadeia a jusante.",en:"Protect every link of the Northern System — from the S11D mine to the customer in China. One breach hits the whole chain downstream."},
    intro:{pt:"Você é o Guardião Digital do Sistema Norte. O minério sai de Carajás, percorre 892 km na EFC até Ponta da Madeira e segue à China. O mapa dinâmico mostra onde você está e o que já foi comprometido.",en:"You are the Digital Guardian of the Northern System. Ore leaves Carajás, travels 892 km on the EFC to Ponta da Madeira, then on to China. The live map shows where you are and what is already compromised."},
    impactBad:{pt:"Brecha em \"{stage}\": o impacto se propaga a jusante na cadeia.",en:"Breach at \"{stage}\": impact propagates downstream."},
    impactOk:{pt:"Elo protegido — a cadeia segue íntegra.",en:"Link protected — the chain stays intact."}},
  officechain:{chainId:"office",emoji:"🏢",tag:{pt:"Escritórios · Digital",en:"Offices · Digital"},
    name:{pt:"Cadeia Digital — Escritórios",en:"Digital Chain — Offices"},
    desc:{pt:"Do Rio a Singapura e Roterdã: proteja cada cena do escritório. Uma brecha propaga risco pelos escritórios conectados.",en:"From Rio to Singapore and Rotterdam: protect each office scene. One breach propagates risk across connected offices."},
    intro:{pt:"Você é o Guardião Digital dos escritórios Orbita. Uma segunda-feira começa com um e-mail suspeito no Rio — e cada decisão conecta a próxima cena, do desk à nuvem, da reunião ao SOC.",en:"You are the Digital Guardian of Orbita offices. A Monday starts with a suspicious email in Rio — and each decision connects to the next scene, from desk to cloud, meeting to SOC."},
    impactBad:{pt:"Brecha em \"{stage}\": o impacto se propaga pelos escritórios conectados.",en:"Breach at \"{stage}\": impact propagates across connected offices."},
    impactOk:{pt:"Cena protegida — o fluxo digital segue seguro.",en:"Scene protected — the digital flow stays secure."}}
};
function hydrateChainBoss(bossId){
  try{
    if(typeof BOSSES==="undefined"||!BOSSES||!BOSSES.length) return;
    var cfg=CHAIN_BOSS_CFG[bossId]; if(!cfg) return;
    var b=null,i;
    for(i=0;i<BOSSES.length;i++){ if(BOSSES[i].id===bossId){ b=BOSSES[i]; break; } }
    if(!b) return;
    if(b.chainVisual&&b.phases&&b.phases.length&&b.phases[0]&&b.phases[0].stageId) return;
    var ch=chainById(cfg.chainId);
    if(!ch||!ch.stages||!ch.stages.length) return;
    var phases=[];
    for(i=0;i<ch.stages.length;i++){
      var st=ch.stages[i], q=st.qs&&st.qs[0]?st.qs[0]:null, next=ch.stages[i+1];
      var snPt=(st.name&&st.name.pt?String(st.name.pt):"").replace(/^\d+\.\s*/,"");
      var snEn=(st.name&&st.name.en?String(st.name.en):"").replace(/^\d+\.\s*/,"");
      var snShort=snPt.length>16?snPt.slice(0,15)+"…":snPt;
      phases.push({
        stageId:st.id,
        theme:q&&q.theme?q.theme:"phishing",
        scene:{pt:"Cena "+(i+1)+" — "+snPt,en:"Scene "+(i+1)+" — "+snEn},
        q:q&&q.q?q.q:{pt:st.desc&&st.desc.pt?st.desc.pt:"",en:st.desc&&st.desc.en?st.desc.en:""},
        opts:q&&q.opts?q.opts:[{pt:"Seguir procedimento oficial",en:"Follow official procedure"},{pt:"Improvisar sob pressão",en:"Improvise under pressure"}],
        correct:q&&typeof q.correct==="number"?q.correct:0,
        impactOk:q&&q.why?q.why:{pt:cfg.impactOk.pt,en:cfg.impactOk.en},
        impactBad:{pt:cfg.impactBad.pt.replace("{stage}",snShort),en:cfg.impactBad.en.replace("{stage}",snShort)},
        bridge:next?{pt:"Próxima cena: "+(next.name&&next.name.pt?next.name.pt:"")+". "+(next.desc&&next.desc.pt?next.desc.pt:""),en:"Next scene: "+(next.name&&next.name.en?next.name.en:"")+". "+(next.desc&&next.desc.en?next.desc.en:"")}:null
      });
    }
    if(!phases.length) return;
    b.chainVisual=true; b.mapVisual=true; b.chainId=cfg.chainId; b.mapSceneId=cfg.chainId;
    b.emoji=cfg.emoji; b.tag=cfg.tag; b.name=cfg.name; b.desc=cfg.desc; b.intro=cfg.intro;
    b.phases=phases;
  }catch(err){ console.error("hydrateChainBoss",bossId,err); }
}
function hydrateNorthernBoss(){ hydrateChainBoss("ransom"); hydrateChainBoss("officechain"); hydrateAllBossMaps(); }
function hydrateAllBossMaps(){
  if(typeof BOSSES==="undefined"||!BOSSES.length) return;
  BOSSES.forEach(function(b){
    b.mapVisual=true;
    if(!b.mapSceneId) b.mapSceneId=b.chainId||b.id;
  });
}
function bossHasMap(b){ return !!(b&&b.mapVisual); }
function scrollBossMapToActive(){
  var host=$("bossChainVisual");
  if(!host||host.hidden||!window.matchMedia("(orientation:portrait)").matches) return;
  requestAnimationFrame(function(){
    var pin=host.querySelector(".cmap-pin.active");
    var svg=host.querySelector("svg.boss-map-svg");
    if(!pin||!svg) return;
    var tr=pin.getAttribute("transform")||"";
    var m=tr.match(/translate\(([\d.]+)/);
    if(!m) return;
    var pinX=parseFloat(m[1])/1000;
    var svgW=svg.offsetWidth;
    var hostW=host.clientWidth;
    host.scrollLeft=Math.max(0,Math.min(pinX*svgW-hostW*0.38,svgW-hostW));
  });
}
function renderBossChainVisual(){
  var host=$("bossChainVisual"); if(!host) return;
  var b=bossCur.boss;
  if(!bossHasMap(b)){ host.hidden=true; host.innerHTML=""; return; }
  if(typeof renderBossMapSvg!=="function"){ host.hidden=true; return; }
  try{
    var out=renderBossMapSvg(b,bossCur.phase||0,bossCur.phaseStates,L());
    host.className="boss-chain-visual boss-chain-visual--"+(out.theme||"finance");
    host.innerHTML=out.svg||"";
    host.hidden=!out.svg;
    scrollBossMapToActive();
  }catch(err){
    console.error("renderBossChainVisual",err);
    host.hidden=true; host.innerHTML="";
  }
}
function renderBossChainSection(){ /* cadeia integrada ao chefão Northern Chain */ }
function openBossChain(scroll){
  hydrateNorthernBoss();
  renderBossList();
  show("screenBossList");
  if(scroll!==false){
    setTimeout(function(){
      var card=document.querySelector('.boss-card[data-boss="ransom"]');
      if(card) card.scrollIntoView({behavior:S.a11y.motion?"auto":"smooth",block:"center"});
    },80);
  }
}
function renderChainStageList(){
  var flow=$("bossChainFlow"), cap=$("bossChainCaption"), note=$("bossChainImpactNote");
  if(!flow) return;
  var ch=chainById(curChainId);
  if(cap) cap.textContent=tt(ch.cap);
  if(note){
    var bi=chainCompromised(ch);
    if(bi>=0){ note.className="chain-impact-note breach"; note.innerHTML=t("chain.impactBreach").replace("{stage}",shortName(tt(ch.stages[bi].name))); }
    else { note.className="chain-impact-note ok"; note.innerHTML=t("chain.impactOk"); }
  }
  flow.innerHTML="";
  ch.stages.forEach(function(st,i){
    var key=chainKey(ch.id,st.id), acc=S.chainDone[key], done=acc!==undefined, bad=done&&acc<60;
    var b=document.createElement("button");
    b.className="chain-stage"+(bad?" compromised":(done?" done":""))+(chainStageActive===st.id?" active":"");
    b.setAttribute("data-stage",st.id);
    b.setAttribute("aria-label",tt(st.name)+". "+tt(st.desc));
    b.innerHTML='<div class="cs-top"><span class="cs-num">'+(bad?"⚠":(done?"✔":(i+1)))+'</span><span class="cs-ico">'+st.ico+'</span></div>'
      +'<div class="cs-name">'+tt(st.name)+'</div>'
      +'<div class="cs-desc">'+tt(st.desc)+'</div>'
      +'<div class="cs-foot"><span>'+st.qs.length+' '+t("chain.scenarios")+'</span><span>'+(done?'<span class="cs-check">'+acc+'%</span>':'▶')+'</span></div>';
    b.addEventListener("click",function(){ startChain(ch.id,st.id); });
    b.addEventListener("mouseenter",function(){ setChainStageHighlight(st.id); });
    b.addEventListener("mouseleave",function(){ if(chainStageActive!==st.id) setChainStageHighlight(chainStageActive); });
    b.addEventListener("focus",function(){ setChainStageHighlight(st.id); });
    flow.appendChild(b);
  });
}
function renderAnimatedChainMap(){
  var host=$("bossChainAnim"); if(!host) return;
  var ch=chainById(curChainId);
  var toChina=(L()==="pt"?"Minério → China 🇨🇳":"Ore → China 🇨🇳");
  var svg='<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid meet" width="100%" role="img" aria-label="'+t("map.procIronTip")+'">';
  svg+='<defs>'
    +'<linearGradient id="cmSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd3e8"/><stop offset="1" stop-color="#dff1f5"/></linearGradient>'
    +'<linearGradient id="cmGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f7a4a"/><stop offset="1" stop-color="#2c5836"/></linearGradient>'
    +'<linearGradient id="cmSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b8fb0"/><stop offset="1" stop-color="#16607a"/></linearGradient>'
    +'</defs>';
  svg+=cmapScene();
  var n=ch.stages.length;
  function pinAt(i){ return CMAP_ROUTE[i]?{x:CMAP_ROUTE[i][0],y:CMAP_ROUTE[i][1]}:cmapPoint(n>1?i/(n-1):0); }
  var d="M"+CMAP_ROUTE.map(function(p){ return p[0]+","+p[1]; }).join(" L");
  svg+='<path d="'+d+'" fill="none" stroke="#EDB111" stroke-width="3" stroke-dasharray="7 6" opacity=".9"/>';
  svg+='<g transform="translate(600,150)"><rect x="0" y="0" width="150" height="22" rx="11" fill="rgba(6,24,32,.82)"/><text x="12" y="15" font-size="12" fill="#EDB111" font-weight="700">'+toChina+'</text></g>';
  var bi=chainCompromised(ch);
  if(bi>=0){
    var bpts=[]; for(var bx=bi;bx<n;bx++){ var bp=pinAt(bx); bpts.push(bp.x+","+bp.y); }
    svg+='<polyline class="cmap-breach" points="'+bpts.join(" ")+'" fill="none" stroke="#ff4d4f" stroke-width="5" stroke-dasharray="11 8" opacity=".95"/>';
  }
  ch.stages.forEach(function(st,i){
    var pt=pinAt(i);
    var key=chainKey(ch.id,st.id), acc=S.chainDone[key], done=acc!==undefined, bad=done&&acc<60;
    var fill=bad?"#ff4d4f":done?"#2fbf71":"#EDB111";
    svg+='<g class="cmap-pin'+(bad?" compromised":(done?" done":""))+(chainStageActive===st.id?" active":"")+'" data-stage="'+st.id+'" tabindex="0" role="button" transform="translate('+pt.x.toFixed(1)+','+pt.y.toFixed(1)+')">';
    svg+='<title>'+tt(st.name)+'</title>';
    svg+='<circle class="cmap-pin-halo" r="17" fill="'+fill+'" opacity=".22"/>';
    svg+='<circle class="cmap-pin-dot" r="13" fill="'+fill+'" stroke="#04141b" stroke-width="1.5"/>';
    svg+='<text y="5" font-size="13" text-anchor="middle" font-weight="800" fill="#04141b">'+(bad?"!":(done?"✔":(i+1)))+'</text>';
    svg+='<g class="cmap-pin-label"><rect x="-46" y="-40" width="92" height="18" rx="9" fill="rgba(6,24,32,.9)"/><text y="-27" font-size="11" text-anchor="middle" fill="#eaf2f6">'+(i+1)+". "+shortName(tt(st.name))+'</text></g>';
    svg+='</g>';
  });
  svg+='</svg>';
  host.innerHTML=svg;
  host.querySelectorAll(".cmap-pin").forEach(function(g){
    var sid=g.getAttribute("data-stage");
    g.addEventListener("click",function(e){ e.stopPropagation(); setChainStageHighlight(sid,true); startChain(ch.id,sid); });
    g.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); startChain(ch.id,sid); } });
    g.addEventListener("mouseenter",function(){ setChainStageHighlight(sid); });
    g.addEventListener("mouseleave",function(){ if(chainStageActive!==sid) setChainStageHighlight(chainStageActive); });
    g.addEventListener("focus",function(){ setChainStageHighlight(sid); });
  });
}
var mapBgClickHintShown=false;
var _mapResetDepth=0;
var mapDragMoved=false;
var MAP_DRAG_THRESH=8;
function setMapDragMoved(v){
  mapDragMoved=!!v;
  try{ window.__mapDragMoved=mapDragMoved; }catch(_e){}
}
function isMapWorldView(){ return !mapHitActive&&!isMapDetailOpen(); }
function isMapDetailOpen(){
  var stage=$("mapStage"), panel=$("mapDetail");
  return !!(stage&&stage.classList.contains("map-detail-open")&&panel&&!panel.hidden);
}
function mapDetailMissHint(){
  if(!mapBgClickHintShown){ mapBgClickHintShown=true; toast(t("map.navMissHint")); }
}
var THREAT_RESILIENCE={phishing:2,password:2,bec:3,malware:5,ransomware:15,ot:20,sap:25,data:3,device:4,remote:3,port:5};
function isDenseMapCountry(gameId){
  if(gameId==="br"||gameId==="ca") return true;
  if(typeof OrbitaWorldMap==="undefined"||!OrbitaWorldMap.getCountry) return false;
  var off=OrbitaWorldMap.getCountry(gameId,L());
  if(!off) return false;
  return off.activities.length+off.products.length>=8;
}
function officialPresenceHTML(gameId){
  if(typeof OrbitaWorldMap==="undefined"||!OrbitaWorldMap.getCountry) return "";
  var off=OrbitaWorldMap.getCountry(gameId,L()); if(!off) return "";
  function actBlock(){
    if(!off.activities.length) return "";
    return '<div class="md-presence"><b>'+t("map.activityTitle")+':</b><div class="presence-row">'
      +off.activities.map(function(id){ return '<span class="presence-chip">'+OrbitaWorldMap.getActivityLabel(id,L())+'</span>'; }).join("")
      +'</div></div>';
  }
  function prodBlock(){
    if(!off.products.length) return "";
    return '<div class="md-presence"><b>'+t("map.productsTitle")+':</b><div class="presence-row">'
      +off.products.map(function(id){ return '<span class="presence-chip mineral-chip">'+OrbitaWorldMap.getProductLabel(id,L())+'</span>'; }).join("")
      +'</div></div>';
  }
  return actBlock()+prodBlock();
}
function renderMapAbout(){
  var el=$("mapAbout"); if(!el||typeof OrbitaWorldMap==="undefined"||!OrbitaWorldMap.getActivityItems) return;
  var chips=OrbitaWorldMap.getActivityItems().map(function(it){
    return '<span class="presence-chip">'+(L()==="en"?it.labelEn:it.labelPt)+'</span>';
  }).join("");
  el.innerHTML='<p class="map-about-p">'+t("map.aboutIntro")+'</p>'
    +'<p class="map-about-p">'+t("map.aboutWhy")+'</p>'
    +'<p class="map-about-p">'+t("map.aboutTransition")+'</p>'
    +'<p class="map-about-p"><b>'+t("map.presenceTypesTitle")+':</b></p>'
    +'<div class="presence-row">'+chips+'</div>';
}
function restoreVwmLegendHTML(){
  var leg=$("mapLegend"); if(!leg) return;
  leg.className="vwm-legend";
  leg.innerHTML='<div class="vwm-legend-group vwm-legend-group-activity"><strong class="vwm-legend-title" data-i18n="map.legendActivity">'+t("map.legendActivity")+'</strong><div class="vwm-legend-items" id="mapActivityLegend"></div></div>'
    +'<div class="vwm-legend-group vwm-legend-group-product"><strong class="vwm-legend-title" data-i18n="map.legendProduct">'+t("map.legendProduct")+'</strong><div class="vwm-legend-items" id="mapProductLegend"></div></div>';
}
function renderMapLegend(){
  var leg=$("mapLegend"); if(!leg) return;
  restoreVwmLegendHTML();
  if(typeof OrbitaWorldMap!=="undefined"&&OrbitaWorldMap.isReady()) OrbitaWorldMap.refresh();
}
function formatCountryListSummary(vc){
  var lines=formatCountryListLines(vc);
  if(lines.acts&&lines.prods) return lines.acts+" · "+lines.prods;
  return lines.acts||lines.prods||"";
}
function formatCountryListLines(vc){
  if(typeof OrbitaWorldMap==="undefined") return {acts:"",prods:""};
  var f=OrbitaWorldMap.getFilter?OrbitaWorldMap.getFilter():null;
  if(f&&f.filterId){
    if(f.filterType==="activity"&&vc.activities.indexOf(f.filterId)>=0) return {acts:OrbitaWorldMap.getActivityLabel(f.filterId,L()),prods:""};
    if(f.filterType==="product"&&vc.products.indexOf(f.filterId)>=0) return {acts:"",prods:OrbitaWorldMap.getProductLabel(f.filterId,L())};
  }
  var actLabels=vc.activities.map(function(id){ return OrbitaWorldMap.getActivityLabel(id,L()); });
  var prodLabels=vc.products.map(function(id){ return OrbitaWorldMap.getProductLabel(id,L()); });
  function trimList(labels){
    if(!labels.length) return "";
    if(labels.length<=2) return labels.join(", ");
    return labels[0]+", "+labels[1]+" "+t("map.countryListMore").replace("{n}",String(labels.length-2));
  }
  return {acts:trimList(actLabels),prods:trimList(prodLabels)};
}
function clearMapFilter(){
  if(isMapDetailOpen()) return;
  if(typeof OrbitaWorldMap!=="undefined"&&OrbitaWorldMap.clearSelection) OrbitaWorldMap.clearSelection(true);
  renderCountryList();
}
function countryMatchesMapFilter(vc){
  if(typeof OrbitaWorldMap==="undefined"||!OrbitaWorldMap.getFilter) return true;
  var f=OrbitaWorldMap.getFilter();
  if(!f||!f.filterId) return true;
  if(f.filterType==="activity") return vc.activities.indexOf(f.filterId)>=0;
  if(f.filterType==="product") return vc.products.indexOf(f.filterId)>=0;
  return true;
}
function mapFilterLabel(){
  if(typeof OrbitaWorldMap==="undefined"||!OrbitaWorldMap.getFilter) return "";
  var f=OrbitaWorldMap.getFilter();
  if(!f||!f.filterId) return "";
  if(f.filterType==="activity") return OrbitaWorldMap.getActivityLabel(f.filterId,L());
  if(f.filterType==="product") return OrbitaWorldMap.getProductLabel(f.filterId,L());
  return "";
}
function renderCountryList(){
  var list=$("countryList"); if(!list) return;
  list.innerHTML="";
  list.className="country-groups";
  if(typeof OrbitaWorldMap==="undefined"||!OrbitaWorldMap.getCountries){
    return;
  }
  var countries=OrbitaWorldMap.getCountries(L());
  countries.sort(function(a,b){
    if(a.gameId==="br") return -1;
    if(b.gameId==="br") return 1;
    return a.name.localeCompare(b.name);
  });
  var playable=countries.filter(function(vc){ return !!vc.gameId&&COUNTRIES.some(function(c){ return c.id===vc.gameId; }); });
  var filterLabel=mapFilterLabel();
  if(filterLabel) playable=playable.filter(countryMatchesMapFilter);
  var sec=document.createElement("section");
  sec.className="country-group country-group--all"+(filterLabel?" country-group--filtered":"");
  sec.setAttribute("aria-label",t("map.countryListTitle"));
  var sub=filterLabel?t("map.countryListFilterSub").replace("{label}",filterLabel):t("map.countryListSub");
  sec.innerHTML='<div class="cg-head"><h3 class="cg-title">'+t("map.countryListTitle")+'</h3><span class="cg-count">'+playable.length+' '+(L()==="pt"?"países":"countries")+'</span></div>'
    +(filterLabel?'<button type="button" class="map-filter-clear" id="mapListFilterClear">'+t("map.filterClear").replace("{label}",filterLabel)+'</button>':"")
    +'<p class="cg-sub">'+sub+'</p>';
  var rows=document.createElement("div"); rows.className="country-list-rows";
  if(!playable.length){
    rows.innerHTML='<p class="country-list-empty">'+t("map.countryListEmpty")+'</p>';
  } else playable.forEach(function(vc){
    var c=COUNTRIES.filter(function(x){ return x.id===vc.gameId; })[0]; if(!c) return;
    var nextExp=nextExpeditionCountry();
    var actLabels=vc.activities.map(function(id){ return OrbitaWorldMap.getActivityLabel(id,L()); });
    var prodLabels=vc.products.map(function(id){ return OrbitaWorldMap.getProductLabel(id,L()); });
    var lines=formatCountryListLines(vc);
    var summary=formatCountryListSummary(vc);
    var detailHtml="";
    if(lines.acts) detailHtml+='<span class="country-row-line"><span class="country-row-k">'+t("map.listActs")+':</span> '+lines.acts+'</span>';
    if(lines.prods) detailHtml+='<span class="country-row-line"><span class="country-row-k">'+t("map.listProducts")+':</span> '+lines.prods+'</span>';
    var b=document.createElement("button"); b.className="country-btn country-row";
    b.setAttribute("data-id",c.id);
    b.setAttribute("data-search",vc.name+" "+actLabels.join(" ")+" "+prodLabels.join(" ")+" "+summary);
    b.innerHTML='<span class="cf">'+c.flag+'</span>'
      +'<span class="country-row-main"><span class="cn">'+vc.name+'</span>'
      +(detailHtml?'<span class="country-row-summary">'+detailHtml+'</span>':'')
      +'</span>'
      +(S.done[c.id]?'<span class="ck">'+S.done[c.id]+'%</span>':(c.id===nextExp.id?'<span class="country-badge country-badge-next">🎯</span>':'<span class="country-badge country-badge-new">'+(L()==="pt"?"Novo":"New")+'</span>'));
    b.addEventListener("click",function(){ openMapDetailCountry(c.id); });
    b.addEventListener("mouseenter",function(){ setMapHitHighlight(c.id); });
    b.addEventListener("mouseleave",function(){ if(mapHitActive!==c.id) setMapHitHighlight(mapHitActive); });
    b.addEventListener("focus",function(){ setMapHitHighlight(c.id); });
    rows.appendChild(b);
  });
  sec.appendChild(rows);
  list.appendChild(sec);
  var clr=$("mapListFilterClear");
  if(clr) clr.addEventListener("click",clearMapFilter);
  var live=$("mapFilterLive");
  if(live){
    if(filterLabel) live.textContent=t("map.filterAnnounce").replace("{n}",String(playable.length)).replace("{label}",filterLabel);
    else live.textContent="";
  }
  if(mapHitActive){
    document.querySelectorAll("#countryList .country-btn").forEach(function(b){
      b.classList.toggle("list-active",b.getAttribute("data-id")===mapHitActive);
    });
  }
  applyMapSearch();
}
function setMapHitHighlight(id, scroll){
  mapHitActive=id||null;
  document.querySelectorAll("#countryList .country-btn").forEach(function(b){
    b.classList.toggle("list-active",!!id&&b.getAttribute("data-id")===id);
  });
  if(typeof OrbitaWorldMap!=="undefined"&&OrbitaWorldMap.isReady()){
    if(id) OrbitaWorldMap.highlightGameId(id,{keepFilter:true});
    else OrbitaWorldMap.clearCountryHighlight();
  }
  if(scroll&&id) scrollMapListItem('.country-btn[data-id="'+id+'"]:not(.map-hidden)');
}
function drawOrbitaRoutes(){
  if(typeof OrbitaWorldMap==="undefined"||!OrbitaWorldMap.isReady()) return;
  OrbitaWorldMap.drawRoutes([]);
}
var orbitaMapInitPromise=null;
function ensureOrbitaWorldMap(cb){
  if(typeof OrbitaWorldMap==="undefined"){ if(cb) cb(false); return; }
  if(OrbitaWorldMap.isReady()){ if(cb) cb(true); return; }
  restoreVwmLegendHTML();
  if(!orbitaMapInitPromise){
    orbitaMapInitPromise=OrbitaWorldMap.init({
      svg:$("mapSvg"), tooltip:$("mapTooltip"), loading:$("mapLoading"), clearBtn:$("mapClearBtn"),
      activityLegend:$("mapActivityLegend"), productLegend:$("mapProductLegend"),
      lang:L,
      onCountryClick:function(gameId){
        if(mapDragMoved){ setMapDragMoved(false); return; }
        if(!gameId) return;
        openMapDetailCountry(gameId);
      },
      onBeforeClearSelection:function(){
        if(mapDragMoved){ setMapDragMoved(false); return false; }
        if(isMapDetailOpen()){ mapDetailMissHint(); return false; }
        return true;
      },
      onClearSelection:function(){
        if(_mapResetDepth>0) return;
        if(mapDragMoved){ setMapDragMoved(false); return; }
        resetMapView();
      },
      onFilterChange:function(){ renderCountryList(); }
    });
  }
  orbitaMapInitPromise.then(function(){ if(cb) cb(true); }).catch(function(){ if(cb) cb(false); });
}
function syncMapProgress(){
  if(typeof OrbitaWorldMap==="undefined"||!OrbitaWorldMap.setProgress) return;
  var m={};
  COUNTRIES.forEach(function(c){ if(S.done&&S.done[c.id]!==undefined&&S.done[c.id]!==null) m[c.id]=S.done[c.id]; });
  OrbitaWorldMap.setProgress(m);
  renderMapLegendSummary();
}
function finishWorldMapUI(){
  updateViewBox();
  syncMapProgress();
  renderMapLegend();
  var cl=$("countryList"); if(cl) cl.hidden=false;
  renderCountryList();
  renderMapProcessBar();
  updateMapHint();
  updateMapContext();
  renderMapAbout();
  renderMapMission();
  renderMapExpedition();
  renderMapResilience();
  applyMapSearch();
  restoreMapTabFocus();
  mapReady=true;
  updateMapCountryNav();
}
function closeMapDetail(){
  mapHitActive=null; setMapHitHighlight(null); chainStageActive=null; setChainStageHighlight(null);
  var p=$("mapDetail"); if(p) p.hidden=true;
  var foot=$("mapDetailFooter"); if(foot){ foot.hidden=true; foot.innerHTML=""; }
  var tip=$("mapTooltip"); if(tip) tip.hidden=true;
  var stage=$("mapStage"); if(stage) stage.classList.remove("map-detail-open");
  syncMapDetailLayout(); updateMapCountryNav();
}
function resetMapView(){
  if(_mapResetDepth>0) return;
  _mapResetDepth++;
  closeMapDetail();
  view={x:0,y:0,w:VW,h:VH};
  updateViewBox();
  renderMapExplorerHint();
  updateMapContext();
  var more=$("mapMoreOptions"); if(more) more.removeAttribute("open");
  window.scrollTo(0,0);
  if(typeof OrbitaWorldMap!=="undefined"&&OrbitaWorldMap.clearSelection) OrbitaWorldMap.clearSelection(true);
  syncMapDetailLayout();
  updateMapCountryNav();
  requestAnimationFrame(measureMapViewport);
  _mapResetDepth--;
}
function getPlayableCountryIds(){
  if(typeof OrbitaWorldMap==="undefined"||!OrbitaWorldMap.getCountries) return COUNTRIES.map(function(c){ return c.id; });
  var countries=OrbitaWorldMap.getCountries(L());
  countries.sort(function(a,b){
    if(a.gameId==="br") return -1;
    if(b.gameId==="br") return 1;
    return a.name.localeCompare(b.name);
  });
  return countries.filter(function(vc){
    return !!vc.gameId&&COUNTRIES.some(function(c){ return c.id===vc.gameId; })&&countryMatchesMapFilter(vc);
  }).map(function(vc){ return vc.gameId; });
}
function navigateMapCountry(dir){
  var ids=getPlayableCountryIds();
  if(!ids.length) return;
  if(!mapHitActive){ openMapDetailCountry(ids[0]); setMapHitHighlight(ids[0],true); return; }
  var idx=ids.indexOf(mapHitActive);
  if(idx<0) idx=0;
  var next=idx+dir;
  if(next<0) next=ids.length-1;
  if(next>=ids.length) next=0;
  openMapDetailCountry(ids[next]);
  setMapHitHighlight(ids[next],true);
}
function updateMapCountryNav(){
  var nav=$("mapCountryNav");
  if(!nav) return;
  var onMap=$("screenMap")&&$("screenMap").classList.contains("active");
  var open=!!onMap&&mapReady&&!mapChainMode();
  nav.hidden=!open;
  var legend=$("mapProgressLegend");
  if(legend) legend.hidden=!open||isMapWorldView();
  renderCountryNavCounter();
  renderMapLegendSummary();
}
function renderCountryNavCounter(){
  var el=$("mapCountryNavCounter"); if(!el) return;
  var nav=$("mapCountryNav");
  if(nav&&nav.hidden){ el.hidden=true; return; }
  var ids=getPlayableCountryIds();
  var idx=mapHitActive?ids.indexOf(mapHitActive):-1;
  if(idx<0||!ids.length){ el.hidden=true; el.textContent=""; return; }
  el.hidden=false;
  el.textContent=(idx+1)+" / "+ids.length;
}
function setMapDetailAction(btnHtml,clickFn){
  var foot=$("mapDetailFooter"); if(!foot) return;
  if(!btnHtml){ foot.hidden=true; foot.innerHTML=""; return; }
  foot.innerHTML=btnHtml;
  foot.hidden=false;
  var btn=foot.querySelector("button");
  if(btn&&clickFn) btn.addEventListener("click",clickFn);
}
function buildMapDetailHTML(c,official){
  var themes=c.themes.map(function(th){ return '<span class="tag md-risk-tag">'+tt(THEMES[th])+'</span>'; }).join("");
  var prog=S.done[c.id]? ((L()==="pt"?"Melhor: ":"Best: ")+S.done[c.id]+"%") : (L()==="pt"?"Missão de treino disponível":"Training mission available");
  var name=official?official.name:tt(c.name);
  return '<h3><span class="md-code">'+c.id.toUpperCase()+'</span> '+name+'</h3>'
    +(official?'<p class="md-tag md-tag-official">'+official.phrase+'</p>':'')
    +'<p class="md-tag md-tag-train">'+t("map.trainingLabel")+'</p>'
    +officialPresenceHTML(c.id)
    +'<p class="md-desc">'+tt(c.desc)+'</p>'
    +'<div class="md-chain"><b>'+t("map.chainImpact")+':</b> '+tt(c.chain)+'</div>'
    +'<div class="md-risks"><b>'+t("map.riskTitle")+':</b><div class="chip-row md-risk-row">'+themes+'</div></div>'
    +'<div class="md-progress">'+prog+'</div>';
}
function openMapDetailCountry(id){
  var c=COUNTRIES.filter(function(x){return x.id===id;})[0]; if(!c) return;
  cur.country=c;
  mapHitActive=id;
  setMapHitHighlight(id);
  var tip=$("mapTooltip"); if(tip) tip.hidden=true;
  var stage=$("mapStage"); if(stage){ stage.classList.add("map-detail-open"); }
  var body=$("mapDetailBody"), panel=$("mapDetail"); if(!body||!panel) return;
  var official=(typeof OrbitaWorldMap!=="undefined"&&OrbitaWorldMap.getCountry)?OrbitaWorldMap.getCountry(id,L()):null;
  body.innerHTML=buildMapDetailHTML(c,official);
  body.scrollTop=0;
  setMapDetailAction('<button type="button" class="btn btn-primary btn-lg map-detail-play" id="mapDetailPlay">'+t("region.start")+'</button>',startCampaign);
  panel.hidden=false;
  syncMapDetailLayout();
  zoomToCountry(id);
  scrollMapIntoView();
  updateMapCountryNav();
  requestAnimationFrame(measureMapViewport);
  speak((official?official.name:tt(c.name))+". "+(official?official.phrase:tt(c.desc)));
}
function openMapDetailChain(stageId){
  setChainStageHighlight(stageId);
  var ch=chainById(curChainId), st=null;
  for(var i=0;i<ch.stages.length;i++) if(ch.stages[i].id===stageId) st=ch.stages[i];
  if(!st) return;
  var body=$("mapDetailBody"), panel=$("mapDetail"); if(!body||!panel) return;
  var key=chainKey(ch.id,st.id), acc=S.chainDone[key], done=acc!==undefined;
  var prog=done? ((L()==="pt"?"Resultado: ":"Result: ")+acc+"%") : (L()==="pt"?"Etapa ainda não protegida":"Stage not yet protected");
  var bi=chainCompromised(ch), impact="";
  if(bi>=0 && ch.stages[bi].id===stageId) impact='<div class="md-chain" style="border-color:#e5534b;background:#fff5f5">'+t("chain.impactBreach").replace("{stage}",shortName(tt(st.name)))+'</div>';
  else if(bi<0) impact='<div class="md-chain">'+t("chain.impactOk")+'</div>';
  body.innerHTML='<h3>'+tt(st.name)+'</h3>'
    +'<div class="md-tag">'+t("map.detailChain")+' · '+tt(ch.name)+'</div>'
    +'<p class="md-desc">'+tt(st.desc)+'</p>'
    +impact
    +'<div class="md-progress">'+st.qs.length+' '+t("chain.scenarios")+' · '+prog+'</div>';
  setMapDetailAction('<button type="button" class="btn btn-primary btn-sm map-detail-play" id="mapDetailChainPlay">'+t("chain.play")+'</button>',function(){ startChain(ch.id,st.id); });
  panel.hidden=false;
  speak(tt(st.name)+". "+tt(st.desc));
}
function renderMapMission(){
  var el=$("mapMission"); if(!el) return;
  var minerals=["Fe","Pelotas","Ni","Cu","Co","PGM","Au","Ag"];
  el.innerHTML='<p class="map-mission-p">'+t("map.missionText")+'</p>'
    +'<div class="map-minerals">'+minerals.map(function(m){ return '<span class="mineral-chip">'+m+'</span>'; }).join("")+'</div>'
    +'<p class="map-chain-flow">'+t("map.chainFlow")+'</p>';
}
function renderMapResilience(){
  var el=$("mapResilienceBar"), val=$("mapResilienceVal"), wrap=$("mapResilienceWrap");
  var r=Math.max(0,Math.min(100,S.resilience!=null?S.resilience:100));
  if(el){ el.style.width=r+"%"; el.style.background=r>60?"var(--green)":r>30?"var(--gold)":"var(--bad)"; }
  if(val) val.textContent=r+"%";
  if(wrap){ var bar=wrap.querySelector(".bar"); if(bar) bar.setAttribute("aria-valuenow",String(r)); }
}
function applyResilienceHit(theme){
  var hit=THREAT_RESILIENCE[theme]||3;
  S.resilience=Math.max(0,(S.resilience!=null?S.resilience:100)-hit);
  save();
  renderMapResilience();
  renderQuizResilience();
}
function renderQuizResilience(){
  var r=Math.max(0,Math.min(100,S.resilience!=null?S.resilience:100));
  var v=$("quizResilienceVal"), f=$("quizResilienceFill"), bar=f&&f.parentNode;
  if(v) v.textContent=r+"%";
  if(f){ f.style.width=r+"%"; f.style.background=r>60?"var(--green)":r>30?"var(--gold)":"var(--bad)"; }
  if(bar){ bar.setAttribute("aria-valuenow",String(r)); bar.setAttribute("aria-label",t("quiz.resilience")); }
}
var mapReady=false;
function drawMap(){
  try{
  normalizeMapProcess();
  closeMapDetail();
  var svg=$("mapSvg"); if(!svg) return;
  var cl=$("countryList");
  if(cl) cl.hidden=false;
  var loadNode=$("mapLoading");
  if(loadNode&&typeof OrbitaWorldMap!=="undefined"&&OrbitaWorldMap.isReady()) loadNode.hidden=true;
  else if(loadNode){ loadNode.hidden=false; loadNode.classList.remove("is-error"); }
  ensureOrbitaWorldMap(function(ok){
    if(ok){
      drawOrbitaRoutes();
      setMapHitHighlight(mapHitActive);
    }
    finishWorldMapUI();
  });
  }catch(err){ console.error("drawMap",err); finishWorldMapUI(); }
}
function ensureMap(){ if(!mapReady) drawMap(); }
function updateViewBox(){ var s=$("mapSvg"); if(s) s.setAttribute("viewBox",view.x+" "+view.y+" "+view.w+" "+view.h); }
var mapReduceMotion=function(){
  if(S.a11y&&S.a11y.motion) return true;
  return !!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);
};
var viewAnimRaf=null;
function cancelViewAnim(){ if(viewAnimRaf){ cancelAnimationFrame(viewAnimRaf); viewAnimRaf=null; } }
function animateView(target){
  cancelViewAnim();
  if(mapReduceMotion()){ view.x=target.x; view.y=target.y; view.w=target.w; view.h=target.h; updateViewBox(); return; }
  var start={x:view.x,y:view.y,w:view.w,h:view.h};
  var t0=null,dur=320;
  function step(ts){
    if(t0===null) t0=ts;
    var k=Math.min(1,(ts-t0)/dur);
    var e=k<0.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
    view.x=start.x+(target.x-start.x)*e;
    view.y=start.y+(target.y-start.y)*e;
    view.w=start.w+(target.w-start.w)*e;
    view.h=start.h+(target.h-start.h)*e;
    updateViewBox();
    if(k<1) viewAnimRaf=requestAnimationFrame(step);
    else{ viewAnimRaf=null; measureMapViewport(); }
  }
  viewAnimRaf=requestAnimationFrame(step);
}
function mapPaneAspect(){
  var inner=document.querySelector(".vwm-map-stage-inner");
  if(inner){ var r=inner.getBoundingClientRect(); if(r.width>0&&r.height>0) return r.width/r.height; }
  return VW/VH;
}
function zoomToCountry(gameId){
  if(typeof OrbitaWorldMap==="undefined"||!OrbitaWorldMap.isReady()||!gameId) return;
  var v=OrbitaWorldMap.getCountryView(gameId,{aspect:mapPaneAspect(),uniform:true,fixedW:MAP_UNIFORM_VIEW_W});
  if(!v) return;
  var nw=Math.max(50,Math.min(VW,v.targetW));
  var nh=Math.max(50,Math.min(VH,v.targetH||nw*(VH/VW)));
  animateView({
    w:nw, h:nh,
    x:Math.max(0,Math.min(VW-nw,v.cx-nw/2)),
    y:Math.max(0,Math.min(VH-nh,v.cy-nh/2))
  });
}
function scrollMapIntoView(){
  var stage=$("mapStage"), sm=$("screenMap");
  if(!stage||sm&&sm.classList.contains("map-screen-fit")) return;
  requestAnimationFrame(function(){
    stage.scrollIntoView({behavior:"smooth",block:"start"});
  });
}
function measureMapViewport(){
  var sm=$("screenMap");
  if(!sm||!sm.classList.contains("map-screen-fit")) return;
  syncBottomShellHeight();
  var anchor=sm.querySelector(".card")||sm;
  var top=Math.max(0,anchor.getBoundingClientRect().top);
  var shell=document.querySelector(".bottom-shell");
  var bottomH=shell?shell.getBoundingClientRect().height:parseInt(getComputedStyle(document.documentElement).getPropertyValue("--bottom-shell-h"),10)||112;
  var more=$("mapMoreOptions");
  var moreH=0;
  if(more&&!more.hidden){
    var sum=more.querySelector("summary");
    if(sum) moreH=Math.ceil(sum.getBoundingClientRect().height)+6;
  }
  var h=Math.max(320,Math.floor(window.innerHeight-top-bottomH-moreH-2));
  document.documentElement.style.setProperty("--map-viewport-h",h+"px");
}
function syncMapDetailLayout(){
  var stage=$("mapStage"), ow=$("orbitaWorldMap"), sm=$("screenMap");
  var detailOpen=!!(stage&&stage.classList.contains("map-detail-open"));
  var onMap=!!(sm&&sm.classList.contains("active"));
  if(ow) ow.classList.toggle("map-detail-active",detailOpen);
  if(sm) sm.classList.toggle("map-screen-fit",onMap);
  document.body.classList.toggle("map-viewport-lock",onMap);
  if(onMap){
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        syncBottomShellHeight();
        measureMapViewport();
      });
      setTimeout(measureMapViewport,400);
    });
  } else {
    document.documentElement.style.removeProperty("--map-viewport-h");
    document.body.classList.remove("map-viewport-lock");
  }
}
function panMapHorizontal(dir){
  if(mapChainMode()) return;
  cancelViewAnim();
  var step=Math.max(80,view.w*0.4);
  var nx=Math.max(0,Math.min(VW-view.w,view.x+dir*step));
  animateView({x:nx,y:view.y,w:view.w,h:view.h});
}
function bindMapCountryNavArrows(){
  function wire(btnId,navDir,panDir){
    var btn=$(btnId); if(!btn) return;
    btn.addEventListener("click",function(e){
      e.stopPropagation();
      if(isMapWorldView()) panMapHorizontal(panDir);
      else navigateMapCountry(navDir);
    });
  }
  wire("mapCountryPrev",-1,-1);
  wire("mapCountryNext",1,1);
}
function zoomTo(cx,cy,f){ cancelViewAnim(); var nw=Math.max(140,Math.min(VW,view.w*f)),nh=nw*(VH/VW); view.x=Math.max(0,Math.min(VW-nw,cx-nw/2)); view.y=Math.max(0,Math.min(VH-nh,cy-nh/2)); view.w=nw; view.h=nh; updateViewBox(); }
function resetView(){
  cancelViewAnim();
  view={x:0,y:0,w:VW,h:VH};
  updateViewBox();
  updateMapCountryNav();
}
function focusIronChain(){ openBossChain(true); }
function bindMapPanZoom(){
  var wrap=$("mapStage"),svg=$("mapSvg");
  if(!wrap||!svg) return;
  var drag=false,dragMoved=false,sx,sy,ox,oy;
  var pointers={},pinch=null;
  var lastTap=0,lastTapX=0,lastTapY=0;
  function ptCount(){ return Object.keys(pointers).length; }
  function toView(clientX,clientY){ var r=svg.getBoundingClientRect(); return {x:view.x+(clientX-r.left)/r.width*view.w, y:view.y+(clientY-r.top)/r.height*view.h}; }
  function mapPanBlocker(el){
    return el&&el.closest&&el.closest(".map-detail,.map-zoom-float,.map-country-nav,.cmap-pin,.vwm-tooltip,.vwm-legend-button");
  }
  wrap.addEventListener("pointerdown",function(e){
    if(mapChainMode()) return;
    if(mapPanBlocker(e.target)) return;
    try{ wrap.setPointerCapture(e.pointerId); }catch(_e){}
    pointers[e.pointerId]={x:e.clientX,y:e.clientY};
    if(ptCount()===2){
      cancelViewAnim();
      drag=false; dragMoved=false; wrap.classList.remove("dragging");
      var ks=Object.keys(pointers),a=pointers[ks[0]],b=pointers[ks[1]];
      var mid=toView((a.x+b.x)/2,(a.y+b.y)/2);
      pinch={dist:Math.hypot(a.x-b.x,a.y-b.y)||1,cx:mid.x,cy:mid.y,w:view.w};
      return;
    }
    drag=true; dragMoved=false; setMapDragMoved(false);
    wrap.classList.add("dragging"); sx=e.clientX; sy=e.clientY; ox=view.x; oy=view.y;
  });
  window.addEventListener("pointermove",function(e){
    if(pointers[e.pointerId]) pointers[e.pointerId]={x:e.clientX,y:e.clientY};
    if(pinch&&ptCount()>=2){
      setMapDragMoved(true);
      var ks=Object.keys(pointers),a=pointers[ks[0]],b=pointers[ks[1]];
      var dist=Math.hypot(a.x-b.x,a.y-b.y)||1;
      var nw=Math.max(120,Math.min(VW,pinch.w*(pinch.dist/dist))),nh=nw*(VH/VW);
      view.w=nw; view.h=nh;
      view.x=Math.max(0,Math.min(VW-nw,pinch.cx-nw/2));
      view.y=Math.max(0,Math.min(VH-nh,pinch.cy-nh/2));
      updateViewBox();
      return;
    }
    if(!drag) return;
    if(Math.abs(e.clientX-sx)>MAP_DRAG_THRESH||Math.abs(e.clientY-sy)>MAP_DRAG_THRESH){
      dragMoved=true;
      setMapDragMoved(true);
    }
    var r=svg.getBoundingClientRect(),kx=view.w/r.width,ky=view.h/r.height;
    view.x=Math.max(0,Math.min(VW-view.w,ox-(e.clientX-sx)*kx));
    view.y=Math.max(0,Math.min(VH-view.h,oy-(e.clientY-sy)*ky));
    updateViewBox();
  });
  function endPointer(e){
    var wasDrag=dragMoved||mapDragMoved;
    if(!mapChainMode()&&!wasDrag&&e.pointerType!=="mouse"&&ptCount()===1&&!pinch){
      var isCountry=e.target.closest&&e.target.closest(".vwm-country,.cmap-pin,.map-detail,.map-zoom-float,.map-country-nav,.vwm-legend-button");
      var now=Date.now();
      if(!isCountry&&now-lastTap<300&&Math.abs(e.clientX-lastTapX)<30&&Math.abs(e.clientY-lastTapY)<30){
        var p=toView(e.clientX,e.clientY); zoomTo(p.x,p.y,0.6); lastTap=0;
      } else { lastTap=now; lastTapX=e.clientX; lastTapY=e.clientY; }
    }
    if(pointers[e.pointerId]) delete pointers[e.pointerId];
    if(ptCount()<2) pinch=null;
    if(ptCount()===0){
      if(drag&&dragMoved) setMapDragMoved(true);
      drag=false; dragMoved=false;
      if(wrap) wrap.classList.remove("dragging");
      if(mapDragMoved){
        setTimeout(function(){ setMapDragMoved(false); },120);
      }
    }
  }
  window.addEventListener("pointerup",endPointer);
  window.addEventListener("pointercancel",endPointer);
  wrap.addEventListener("click",function(e){
    if(mapDragMoved){ e.stopPropagation(); e.preventDefault(); }
  },true);
  wrap.addEventListener("wheel",function(e){ if(mapChainMode()) return; e.preventDefault(); var p=toView(e.clientX,e.clientY); zoomTo(p.x,p.y,e.deltaY>0?1.2:.83); },{passive:false});
}
function countriesExploredCount(){ return Object.keys(S.done||{}).length; }
function nextExpeditionCountry(){
  var i,c,played=S.done||{};
  for(i=0;i<COUNTRIES.length;i++){ if(!played[COUNTRIES[i].id]) return COUNTRIES[i]; }
  var worst=null,worstAcc=101;
  for(i=0;i<COUNTRIES.length;i++){
    c=COUNTRIES[i];
    if(played[c.id]<worstAcc){ worstAcc=played[c.id]; worst=c; }
  }
  return worst||COUNTRIES[0];
}
function setupComplete(){ return !!S.team&&!!S.role; }
function focusExpeditionCountry(id){
  if(!id) return;
  setMapHitHighlight(id,true);
  openMapDetailCountry(id);
}
function renderMapExpedition(){
  var host=$("mapExpedition"); if(!host) return;
  var next=nextExpeditionCountry(), done=countriesExploredCount(), total=COUNTRIES.length;
  var allDone=done>=total;
  host.innerHTML='<div class="map-expedition-head"><div><div class="map-expedition-title">'+t("map.expeditionTitle")+'</div><div class="map-expedition-sub">'+t("map.expeditionSub")+'</div></div><span class="map-expedition-progress">'+t("map.expeditionProgress").replace("{done}",String(done)).replace("{total}",String(total))+'</span></div>'
    +'<div class="map-expedition-next"><span class="map-expedition-flag">'+next.flag+'</span><div><div class="map-expedition-k">'+(allDone?t("map.expeditionDone"):t("map.expeditionNext"))+'</div><div class="map-expedition-name">'+tt(next.name)+'</div><div class="map-expedition-meta">'+t("map.trainingLabel")+(S.done[next.id]?' · '+(L()==="pt"?"Melhor: ":"Best: ")+S.done[next.id]+"%":' · '+t("map.expeditionNew"))+'</div></div></div>'
    +'<button type="button" class="btn btn-primary btn-sm" id="mapExpeditionGo">'+t("map.expeditionGo")+'</button>';
  var btn=$("mapExpeditionGo");
  if(btn) btn.addEventListener("click",function(){ focusExpeditionCountry(next.id); });
  var sticky=$("mapStickyGo"), stickyBtn=$("mapStickyGoBtn");
  if(sticky&&stickyBtn){
    sticky.hidden=false;
    stickyBtn.textContent=t("map.stickyGo")+" — "+next.flag+" "+tt(next.name);
    stickyBtn.onclick=function(){ focusExpeditionCountry(next.id); };
  }
}
function openMap(process, reset, focusExpedition){
  if(process==="iron"){ openBossChain(true); return; }
  if(arguments.length>0) mapProcess=process||null;
  normalizeMapProcess();
  if(reset||!mapReady) view={x:0,y:0,w:VW,h:VH};
  if(mapReady) drawMap();
  else ensureMap();
  show("screenMap");
  if(focusExpedition){
    var next=nextExpeditionCountry();
    if(next) setTimeout(function(){ focusExpeditionCountry(next.id); pulseNextCountry(); }, mapReady?120:480);
  }
}
function returnToMap(){ openMap(null,false); }
var cur={country:null,questions:[],i:0,correct:0,integrity:100,mode:"campaign"};
function shuffle(a){ for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)),t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function shuffleQuestions(qs){ return shuffle(qs.map(function(q,i){ return q; })); }
function weakThemes(n){
  return themesNeedingWork(70).slice(0,n||3).map(function(x){ return x.k; });
}
function buildCampaign(c){
  var pool=fullBank().filter(function(q){
    var countryOk=!q.countries||q.countries.indexOf(c.id)>=0;
    return countryOk&&(c.themes.indexOf(q.theme)>=0||q.countries&&q.countries.indexOf(c.id)>=0);
  });
  var picked=pickProfileQuestions(pool,6), pickedIds={}, pi;
  for(pi=0;pi<picked.length;pi++){ if(picked[pi].id) pickedIds[picked[pi].id]=1; }
  if(picked.length<6){
    var extra=shuffle(fullBank().filter(function(q){ return !pickedIds[q.id]&&(!q.countries||q.countries.indexOf(c.id)>=0); }));
    if(extra.length<6-picked.length) extra=extra.concat(shuffle(fullBank().filter(function(q){ return !pickedIds[q.id]; })));
    picked=picked.concat(shuffleQuestions(extra.slice(0,6-picked.length)));
  }
  return picked.length>6?shuffleQuestions(picked.slice(0,6)):picked;
}
function buildDaily(){
  var pool=shuffle(fullBank().slice()), weak=weakThemes(2), picked=[], i,q, due=srsDueItems();
  for(i=0;i<due.length&&picked.length<2;i++){ if(picked.indexOf(due[i])<0) picked.push(due[i]); }
  for(i=0;i<weak.length;i++){
    var themePool=pool.filter(function(x){ return x.theme===weak[i]&&picked.indexOf(x)<0&&questionMatchesProfile(x); });
    if(!themePool.length) themePool=pool.filter(function(x){ return x.theme===weak[i]&&picked.indexOf(x)<0; });
    themePool.sort(function(a,b){ return questionProfileScore(b)-questionProfileScore(a); });
    q=themePool[0];
    if(q) picked.push(q);
  }
  var rest=pool.filter(function(x){ return picked.indexOf(x)<0; });
  rest.sort(function(a,b){ return questionProfileScore(b)-questionProfileScore(a); });
  for(i=0;i<rest.length&&picked.length<5;i++){ if(picked.indexOf(rest[i])<0) picked.push(rest[i]); }
  return shuffleQuestions(picked.slice(0,5));
}
function startCampaign(){
  cur.mode="campaign"; cur.questions=buildCampaign(cur.country); cur.i=0; cur.correct=0; cur.integrity=100; S.lives=3; initQuizSession(); renderLives();
  show("screenQuiz"); renderQuestion();
}
function startDaily(){
  cur.mode="daily"; cur.country={id:"daily",name:{pt:"Missão do Dia",en:"Daily Mission"},flag:"📅"};
  cur.questions=buildDaily(); cur.i=0; cur.correct=0; cur.integrity=100; S.lives=3; initQuizSession(); renderLives();
  show("screenQuiz"); renderQuestion();
}
function renderPersonalBridge(q){
  var el=$("personalBridge"); if(!el) return;
  var p=getPersonal(q);
  if(p){ el.hidden=false; el.innerHTML='<span class="personal-k">'+t("quiz.personal")+':</span> '+tt(p); }
  else el.hidden=true;
}
function renderQuestion(){
  var q=cur.questions[cur.i],c=cur.country;
  if(!cur.qStates) cur.qStates={};
  if(!cur.optOrder) cur.optOrder={};
  setIntegrity(); renderQuizResilience(); updateQuizResilienceVisibility(); updateQuizProgress();
  $("themeTag").textContent=THEMES[q.theme].ico+" "+tt(THEMES[q.theme]);
  var diffTxt=L()==="pt"?["","Fácil","Médio","Difícil"]:["","Easy","Medium","Hard"];
  $("diffTag").textContent=diffTxt[q.diff]||"";
  var modeLbl=cur.mode==="review"?t("pedagogy.reviewMode"):(L()==="pt"?"Situação ":"Scenario ");
  $("progressLine").textContent=modeLbl+" "+(cur.i+1)+"/"+cur.questions.length+" • "+c.flag+" "+tt(c.name);
  $("sceneTitleTxt").textContent=(L()==="pt"?"Decisão do Guardião":"Guardian's Decision");
  $("sceneText").textContent=getQuestionField(q,"q");
  renderPersonalBridge(q);
  renderQuizContext();
  renderQuizGlossaryHint(q.theme);
  var opts=$("options"); opts.innerHTML="";
  var order=cur.optOrder[cur.i];
  if(!order){ order=shuffle(q.opts.map(function(o,idx){ return {o:o,idx:idx}; })); cur.optOrder[cur.i]=order; }
  var letters=["A","B","C","D"], st=cur.qStates[cur.i];
  order.forEach(function(item,pos){
    var b=document.createElement("button"); b.className="opt"; b.setAttribute("data-idx",String(item.idx));
    if(item.idx===q.correct) b.setAttribute("data-correct","1");
    b.innerHTML='<span class="kx">'+letters[pos]+'</span><span>'+tt(item.o)+'</span>';
    if(st){ b.disabled=true; if(item.idx===st.selectedIdx) b.classList.add(st.ok?"correct":"wrong"); if(item.idx===q.correct) b.classList.add("correct"); }
    else b.addEventListener("click",function(){ answer(item.idx,b,q); });
    opts.appendChild(b);
  });
  var rs=$("reportStep"); if(rs) rs.hidden=true;
  if(st){
    $("feedback").className=st.feedbackClass||"feedback";
    $("feedback").innerHTML=st.feedbackHtml||"";
    if(st.reportDone&&rs){ rs.hidden=false; rs.innerHTML='<p class="report-done">'+t("report.done")+'</p>'; }
  } else { $("feedback").className="feedback"; $("feedback").innerHTML=""; }
  updateQuizNav();
  speak(getQuestionField(q,"q"));
}
function setIntegrity(){
  $("integrityVal").textContent=cur.integrity+"%"; var f=$("integrityFill"), bar=f&&f.parentNode;
  if(f){ f.style.width=cur.integrity+"%"; f.style.background=cur.integrity>60?"var(--green)":cur.integrity>30?"var(--gold)":"var(--bad)"; }
  if(bar){ bar.setAttribute("aria-valuenow",cur.integrity); bar.setAttribute("aria-valuemin","0"); bar.setAttribute("aria-valuemax","100"); bar.setAttribute("aria-label",t("quiz.integrity")); }
}
function answer(idx,btn,q){
  if(cur.qStates&&cur.qStates[cur.i]) return;
  $("options").querySelectorAll(".opt").forEach(function(b){ b.disabled=true; });
  var ok=idx===q.correct,fb=$("feedback"),review=cur.mode==="review",drill=cur.mode==="themeDrill";
  if(drill){ recordTheme(q.theme,ok); recordMiss(q,ok); if(ok) addReward(5,2,0); }
  else if(review){ recordTheme(q.theme,ok); recordMiss(q,ok); if(ok) addReward(5,2,0); else save(); }
  else { recordTheme(q.theme,ok); recordMiss(q,ok); }
  if(ok){ btn.classList.add("correct"); if(!review&&!drill) addReward(10,5,q.diff*10); fb.className="feedback show good"; fb.innerHTML="✅ <b>"+(L()==="pt"?"Correto!":"Correct!")+"</b> "+tt(q.why); }
  else if(review||drill){ btn.classList.add("wrong"); $("options").querySelectorAll(".opt").forEach(function(b){ if(b.getAttribute("data-correct")==="1") b.classList.add("correct"); }); fb.className="feedback show err"; fb.innerHTML="❌ <b>"+(L()==="pt"?"Revise:":"Review:")+"</b> "+tt(q.why); }
  else{ btn.classList.add("wrong"); $("options").querySelectorAll(".opt").forEach(function(b){ if(b.getAttribute("data-correct")==="1") b.classList.add("correct"); }); cur.integrity=Math.max(0,cur.integrity-20); S.lives=Math.max(0,(S.lives||3)-1); renderLives(); applyResilienceHit(q.theme); fb.className="feedback show err"; fb.innerHTML="❌ <b>"+(L()==="pt"?"Cuidado!":"Careful!")+"</b> "+tt(q.why)+(THREAT_RESILIENCE[q.theme]?" <span class='res-hit'>−"+THREAT_RESILIENCE[q.theme]+"% "+(L()==="pt"?"resiliência":"resilience")+"</span>":""); save(); }
  if(!cur.qStates) cur.qStates={};
  cur.qStates[cur.i]={selectedIdx:idx,ok:ok,feedbackClass:fb.className,feedbackHtml:fb.innerHTML,reportDone:false};
  cur.correct=countQuizCorrect();
  speak((ok?(L()==="pt"?"Correto. ":"Correct. "):(L()==="pt"?"Cuidado. ":"Careful. "))+tt(q.why));
  setIntegrity(); renderQuizResilience(); updateQuizResilienceVisibility();
  if(!review&&!drill){ bumpWeekly("correct",ok?1:0); if(ok&&q.theme===getWeekTheme()) bumpWeekly("theme",1); }
  if(!ok&&!review&&!drill&&REPORT_THEMES[q.theme]) showReportPrompt(q);
  else { cur.reportPending=false; updateQuizNav(); $("nextBtn").focus(); }
}
function nextQuestion(){
  if(cur.reportPending) return;
  if(cur.i>=cur.questions.length-1&&cur.qStates&&cur.qStates[cur.i]){ finishCampaign(); return; }
  cur.i++;
  if(cur.i>=cur.questions.length||(cur.mode!=="review"&&cur.mode!=="themeDrill"&&(S.lives||0)<=0)){ finishCampaign(); return; }
  renderQuestion();
}
function finishCampaign(){
  rebuildSessionLog();
  cur.correct=countQuizCorrect();
  var c=cur.country,total=cur.questions.length,acc=Math.round(cur.correct/total*100),win=cur.integrity>0&&acc>=60;
  if(cur.mode==="review"){ save(); show("screenProfile"); renderProfile(); toast(L()==="pt"?"📚 Revisão concluída — temas atualizados":"📚 Review complete — themes updated"); return; }
  if(cur.mode==="themeDrill"){ save(); checkMedals(); show("screenProfile"); renderProfile(); toast(t("pedagogy.drillDone")); return; }
  if(cur.mode==="campaign"){ S.done[c.id]=Math.max(S.done[c.id]||0,acc); bumpWeekly("campaign",1); syncMapProgress(); }
  if(cur.mode==="chain"){ S.chainDone[cur.chainKey]=Math.max(S.chainDone[cur.chainKey]||0,acc); }
  if(cur.mode==="daily"){ markDailyDone(win); recordStreak(); }
  else if(win) recordStreak();
  checkMedals(); save();
  var hero=$("resultHero"); var titlePt=win?"Operação protegida!":"Operação comprometida",titleEn=win?"Operation protected!":"Operation compromised";
  hero.innerHTML='<div class="big">'+(win?"🏆":"⚠️")+'</div><h2>'+(L()==="pt"?titlePt:titleEn)+'</h2><p style="color:var(--steel)">'+c.flag+" "+tt(c.name)+'</p>';
  var lab=L()==="pt"?{a:"Acertos",b:"Precisão",c:"Integridade",d:"XP total"}:{a:"Correct",b:"Accuracy",c:"Integrity",d:"Total XP"};
  $("statsGrid").innerHTML='<div class="stat"><div class="v">'+cur.correct+"/"+total+'</div><div class="l">'+lab.a+'</div></div><div class="stat"><div class="v">'+acc+'%</div><div class="l">'+lab.b+'</div></div><div class="stat"><div class="v">'+cur.integrity+'%</div><div class="l">'+lab.c+'</div></div><div class="stat"><div class="v">'+S.xp+'</div><div class="l">'+lab.d+'</div></div>';
  renderCampaignDebrief(); renderThemeErrors($("themeErrors")); renderMedals($("medalsBox")); renderRank($("rankList"));
  renderSessionFeedback(win,acc);
  renderPostSessionActions("resultPostActions");
  var rmb=$("resultMapBtn");
  if(rmb){
    if(cur.mode==="chain"){ rmb.textContent=L()==="pt"?"⛓️ Voltar a Desafios / Crises":"⛓️ Back to Challenges / Crises"; rmb.onclick=function(){ renderBossList(); show("screenBossList"); }; }
    else { rmb.textContent=t("result.map"); rmb.onclick=returnToMap; }
  }
  show("screenResult"); speak((L()==="pt"?titlePt:titleEn)+". "+(L()==="pt"?"Precisão ":"Accuracy ")+acc+"%.");
  if(win) toast(L()==="pt"?"🏆 "+tt(c.name)+" protegido!":"🏆 "+tt(c.name)+" protected!");
}
function renderThemeErrors(host){
  host.innerHTML="";
  var arr=Object.keys(S.themeStats||{}).map(function(th){ return {th:th,a:themeAcc(th)}; }).filter(function(x){ return x.a!==null; }).sort(function(a,b){ return a.a-b.a; });
  if(!arr.length){ host.innerHTML='<div class="muted">'+(L()==="pt"?"Jogue para ver suas estatísticas por tema.":"Play to see your stats by theme.")+'</div>'; return; }
  var weakN=arr.filter(function(x){ return x.a<70; }).length;
  if(weakN){
    var note=document.createElement("p");
    note.className="theme-weak-note muted";
    note.textContent=t("profile.themesWeakSub");
    host.appendChild(note);
  }
  arr.forEach(function(x){
    var d=document.createElement("div");
    d.className="theme-err"+(x.a<70?" theme-err-weak":"");
    var right='<span class="theme-err-pct">'+x.a+'%</span>';
    if(x.a<70){
      var btn=document.createElement("button");
      btn.type="button";
      btn.className="btn btn-ghost btn-sm theme-err-btn";
      btn.textContent=t("pedagogy.recPlay");
      btn.addEventListener("click",function(e){ e.stopPropagation(); startThemeDrill(x.th); });
      d.innerHTML='<span>'+THEMES[x.th].ico+' '+tt(THEMES[x.th])+'</span>';
      var wrap=document.createElement("span");
      wrap.className="theme-err-right";
      wrap.innerHTML=right;
      wrap.appendChild(btn);
      d.appendChild(wrap);
    } else {
      d.innerHTML='<span>'+THEMES[x.th].ico+' '+tt(THEMES[x.th])+'</span><span>'+x.a+'%</span>';
    }
    host.appendChild(d);
  });
}

/* ==========================================================
   CADEIA DE PRODUÇÃO
   ========================================================== */
var curChainId=CHAINS[0].id;
function chainById(id){ for(var i=0;i<CHAINS.length;i++) if(CHAINS[i].id===id) return CHAINS[i]; return CHAINS[0]; }
function chainKey(chId,stId){ return chId+"__"+stId; }
function chainCompromised(ch){
  for(var i=0;i<ch.stages.length;i++){ var acc=S.chainDone[chainKey(ch.id,ch.stages[i].id)]; if(acc!==undefined&&acc<60) return i; }
  return -1;
}
function renderChain(){
  var ch=chainById(curChainId);
  $("chainImgCap").textContent=tt(ch.cap);
  var note=$("chainImpactNote"), bi=chainCompromised(ch);
  if(note){
    if(bi>=0){ note.className="chain-impact-note breach"; note.innerHTML=t("chain.impactBreach").replace("{stage}",shortName(tt(ch.stages[bi].name))); }
    else { note.className="chain-impact-note ok"; note.innerHTML=t("chain.impactOk"); }
  }
  renderChainMap(ch);
  var flow=$("chainFlow"); flow.innerHTML="";
  ch.stages.forEach(function(st){
    var key=chainKey(ch.id,st.id), acc=S.chainDone[key], done=acc!==undefined, bad=done&&acc<60;
    var b=document.createElement("button"); b.className="chain-stage"+(bad?" compromised":(done?" done":""));
    b.setAttribute("data-stage",st.id);
    b.setAttribute("aria-label", tt(st.name)+". "+tt(st.desc));
    b.innerHTML='<div class="cs-top"><span class="cs-num">'+(bad?"⚠":(done?"✔":st.ico))+'</span><span class="cs-ico">'+st.ico+'</span></div>'
      +'<div class="cs-name">'+tt(st.name)+'</div>'
      +'<div class="cs-desc">'+tt(st.desc)+'</div>'
      +'<div class="cs-foot"><span>'+st.qs.length+' '+t("chain.scenarios")+'</span><span>'+(done?'<span class="cs-check">'+acc+'%</span>':'▶')+'</span></div>';
    b.addEventListener("click",function(){ startChain(ch.id,st.id); });
    flow.appendChild(b);
  });
}

/* ---- Mapa ilustrado — escritórios (SVG) ---- */
var OFFICE_ROUTE=[[70,235],[210,198],[360,215],[520,175],[680,205],[890,228]];
function offmapPoint(f){
  var pts=OFFICE_ROUTE,segs=[],total=0,i;
  for(i=0;i<pts.length-1;i++){ var dx=pts[i+1][0]-pts[i][0],dy=pts[i+1][1]-pts[i][1],len=Math.sqrt(dx*dx+dy*dy); segs.push(len); total+=len; }
  var target=f*total,acc=0;
  for(i=0;i<segs.length;i++){ if(acc+segs[i]>=target){ var t=segs[i]?(target-acc)/segs[i]:0; return {x:pts[i][0]+(pts[i+1][0]-pts[i][0])*t, y:pts[i][1]+(pts[i+1][1]-pts[i][1])*t}; } acc+=segs[i]; }
  var last=pts[pts.length-1]; return {x:last[0], y:last[1]};
}
function offmapScene(sfx){
  sfx=sfx||"";
  var s='',lbl=L()==="pt"?"ESCRITÓRIOS ORBITA — RIO → SINGAPURA → ROTERDÃ":"ORBITA OFFICES — RIO → SINGAPORE → ROTTERDAM";
  s+='<rect x="0" y="0" width="1000" height="300" fill="url(#omSky'+sfx+')"/>';
  s+='<rect x="20" y="10" width="960" height="74" rx="10" fill="rgba(6,24,32,.18)" stroke="rgba(0,126,122,.4)" stroke-width="1.5"/>';
  s+='<text x="500" y="30" font-size="11" text-anchor="middle" fill="rgba(255,255,255,.9)" font-weight="700">'+lbl+'</text>';
  s+='<path d="M80,52 Q260,38 500,48 Q740,42 920,54" fill="none" stroke="rgba(0,126,122,.45)" stroke-width="2"/>';
  s+='<path class="om-data-flow" d="M108,50 L500,46 L892,50" fill="none" stroke="#EDB111" stroke-width="2.5" opacity=".75"/>';
  s+='<circle cx="108" cy="50" r="9" fill="#007E7A"/><text x="108" y="68" font-size="9" text-anchor="middle" fill="#eaf2f6" font-weight="700">🇧🇷 RIO</text>';
  s+='<circle cx="500" cy="46" r="9" fill="#007E7A"/><text x="500" y="68" font-size="9" text-anchor="middle" fill="#eaf2f6" font-weight="700">🇸🇬 SG</text>';
  s+='<circle cx="892" cy="50" r="9" fill="#007E7A"/><text x="892" y="68" font-size="9" text-anchor="middle" fill="#eaf2f6" font-weight="700">🇳🇱 RTM</text>';
  s+='<rect x="0" y="88" width="1000" height="212" fill="url(#omFloor'+sfx+')"/>';
  s+='<line x1="0" y1="128" x2="1000" y2="128" stroke="rgba(255,255,255,.1)" stroke-width="1"/>';
  /* 1 E-mail */
  s+='<rect x="28" y="152" width="82" height="52" rx="4" fill="#4a5568"/><rect x="36" y="160" width="66" height="36" rx="2" fill="#cbe8f2"/>';
  s+='<g class="om-email-ping" transform="translate(78,148)"><rect x="-14" y="-16" width="28" height="18" rx="4" fill="#EDB111"/><text x="0" y="-3" font-size="11" text-anchor="middle">📧</text></g>';
  s+='<rect x="42" y="208" width="54" height="26" rx="3" fill="#3d4f58"/>';
  /* 2 Estação */
  s+='<rect x="168" y="172" width="74" height="44" rx="4" fill="#2d3740"/><rect x="176" y="158" width="58" height="34" rx="2" fill="#1a2330" stroke="#5a6a72" stroke-width="2"/>';
  s+='<rect x="184" y="166" width="42" height="22" fill="#cbe8f2" opacity=".85"/><rect x="226" y="186" width="8" height="18" rx="2" fill="#EDB111" class="om-usb"/>';
  /* 3 Reunião */
  s+='<rect x="308" y="142" width="104" height="82" rx="4" fill="rgba(0,126,122,.12)" stroke="#007E7A" stroke-width="2"/>';
  s+='<rect x="324" y="156" width="72" height="46" rx="3" fill="#1a2a35"/><circle cx="346" cy="176" r="9" fill="#5a8a9a"/><circle cx="374" cy="176" r="9" fill="#5a8a9a"/>';
  s+='<rect x="356" y="188" width="12" height="7" fill="#EDB111" class="om-video-flicker" rx="2"/>';
  /* 4 Nuvem */
  s+='<rect x="468" y="152" width="92" height="72" rx="4" fill="#3d4f58"/>';
  for(var ry=0;ry<3;ry++){ s+='<rect x="478" y="'+(162+ry*20)+'" width="72" height="14" rx="2" fill="#2a353d"/><circle class="om-cloud-pulse" cx="538" cy="'+(169+ry*20)+'" r="3" fill="#2fbf71"/>'; }
  s+='<path class="om-data-flow" d="M514,148 Q528,128 542,148" fill="none" stroke="#EDB111" stroke-width="2"/>';
  /* 5 Remoto */
  s+='<rect x="618" y="138" width="112" height="92" rx="6" fill="rgba(237,177,17,.1)" stroke="rgba(237,177,17,.35)" stroke-width="1.5"/>';
  s+='<text x="674" y="154" font-size="9" text-anchor="middle" fill="rgba(255,255,255,.75)">✈ '+(L()==="pt"?"REMOTO":"REMOTE")+'</text>';
  s+='<ellipse cx="654" cy="200" rx="20" ry="11" fill="#4a5568"/><rect x="638" y="184" width="42" height="28" rx="2" fill="#2d3740"/>';
  s+='<circle cx="712" cy="172" r="11" fill="none" stroke="#ff6b6b" stroke-width="2" opacity=".55"/>';
  /* 6 SOC */
  s+='<rect x="778" y="146" width="184" height="76" rx="4" fill="#0a2a32" stroke="#007E7A" stroke-width="2"/>';
  s+='<rect x="788" y="156" width="36" height="26" rx="2" fill="#1a3a45"/><rect x="828" y="156" width="36" height="26" rx="2" fill="#1a3a45"/>';
  s+='<rect x="868" y="156" width="36" height="26" rx="2" fill="#1a3a45"/><rect x="908" y="156" width="44" height="26" rx="2" fill="#1a3a45"/>';
  s+='<g transform="translate(932,198)"><path d="M0 0 L12 2 L12 12 Q6 20 0 16 Q-6 20 -12 12 L-12 2 Z" fill="url(#omShield'+sfx+')" opacity=".9"/><rect x="-4" y="4" width="8" height="6" rx="1" fill="#fff" opacity=".85"/></g>';
  s+='<path d="M'+OFFICE_ROUTE.map(function(p){return p[0]+","+p[1];}).join(" L")+'" fill="none" stroke="rgba(237,177,17,.2)" stroke-width="2" stroke-dasharray="5 5"/>';
  return s;
}

/* ---- Mapa ilustrado da cadeia ferro (SVG) ---- */
var CMAP_ROUTE=[[95,248],[222,205],[306,206],[404,186],[504,214],[600,250],[760,232],[978,246]];
function cmapPoint(f){
  var pts=CMAP_ROUTE,segs=[],total=0,i;
  for(i=0;i<pts.length-1;i++){ var dx=pts[i+1][0]-pts[i][0],dy=pts[i+1][1]-pts[i][1],len=Math.sqrt(dx*dx+dy*dy); segs.push(len); total+=len; }
  var target=f*total,acc=0;
  for(i=0;i<segs.length;i++){ if(acc+segs[i]>=target){ var t=segs[i]?(target-acc)/segs[i]:0; return {x:pts[i][0]+(pts[i+1][0]-pts[i][0])*t, y:pts[i][1]+(pts[i+1][1]-pts[i][1])*t}; } acc+=segs[i]; }
  var last=pts[pts.length-1]; return {x:last[0], y:last[1]};
}
/* ---- Desenho vetorial de um caminhão fora de estrada (haul truck) ---- */
function haulTruck(cx,cy,sc,cls,dumping,flip){
  return '<g class="cm-haul'+(cls?" "+cls:"")+'" transform="translate('+cx+','+cy+') scale('+(flip?-sc:sc)+','+sc+')">'
    +'<ellipse cx="0" cy="3" rx="36" ry="4.5" fill="rgba(0,0,0,.18)"/>'
    +'<g class="cm-dump'+(dumping?" dumping":"")+'">'
      +'<polygon points="-32,-25 8,-25 2,-9 -28,-9" fill="#e0aa43" stroke="#8a6a1e" stroke-width="1.5"/>'
      +'<polygon class="cm-ore" points="-28,-25 4,-25 0,-33 -24,-33" fill="#7a4f28"/>'
    +'</g>'
    +'<rect x="-32" y="-11" width="60" height="8" rx="2.5" fill="#333f45"/>'
    +'<path d="M12,-25 L29,-25 L31,-12 L12,-12 Z" fill="#f4c20d" stroke="#b8890a" stroke-width="1"/>'
    +'<rect x="15" y="-23" width="11" height="8" rx="1" fill="#cbe8f2"/>'
    +'<circle cx="-17" cy="-2" r="9.5" fill="#15181a" stroke="#525a5e" stroke-width="2.5"/>'
    +'<circle cx="19" cy="-2" r="9.5" fill="#15181a" stroke="#525a5e" stroke-width="2.5"/>'
    +'<circle cx="-17" cy="-2" r="3.2" fill="#727a7f"/><circle cx="19" cy="-2" r="3.2" fill="#727a7f"/>'
    +'</g>';
}
function cmapScene(){
  var em=function(x,y,s,g){ return '<text x="'+x+'" y="'+y+'" font-size="'+s+'" text-anchor="middle"'+(g?' class="'+g+'"':'')+'>'; };
  var s='';
  /* céu + sol */
  s+='<rect x="0" y="0" width="1000" height="300" fill="url(#cmSky)"/>';
  s+='<circle cx="880" cy="52" r="30" fill="#ffe08a" opacity=".8"/>';
  s+='<g fill="#ffffff" opacity=".7"><ellipse cx="300" cy="46" rx="34" ry="13"/><ellipse cx="330" cy="40" rx="26" ry="12"/><ellipse cx="560" cy="60" rx="30" ry="12"/></g>';
  /* massa de terra (Brasil: Pará → Maranhão) e oceano (Atlântico → China) */
  s+='<polygon points="0,300 60,150 150,178 300,150 470,168 640,175 792,196 792,300" fill="url(#cmGround)"/>';
  s+='<rect x="792" y="196" width="208" height="104" fill="url(#cmSea)"/>';
  s+='<path class="cmap-wave" d="M792,214 Q840,206 890,214 T1000,214" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="2"/>';
  s+='<path class="cmap-wave2" d="M792,232 Q846,224 900,232 T1010,232" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="2"/>';
  /* rótulos geográficos */
  s+='<text x="250" y="140" font-size="13" text-anchor="middle" fill="rgba(255,255,255,.85)" font-weight="700" letter-spacing="1">🇧🇷 BRASIL · PARÁ → MARANHÃO</text>';
  s+='<text x="890" y="214" font-size="11" text-anchor="middle" fill="rgba(255,255,255,.9)" font-weight="700">OCEANO ATLÂNTICO →</text>';

  /* ===== 1. MINA S11D — bancadas, escavadeira, caminhões fora de estrada ===== */
  s+='<polygon points="0,300 6,238 150,238 150,300" fill="#6f5137"/>';
  s+='<polygon points="0,238 14,196 132,196 150,238" fill="#7d5c3e"/>';
  s+='<polygon points="18,196 30,162 116,162 128,196" fill="#8a6746"/>';
  s+='<polyline points="6,238 150,238" stroke="#5a4230" stroke-width="2" fill="none"/><polyline points="14,196 132,196" stroke="#5a4230" stroke-width="2" fill="none"/>';
  /* escavadeira (braço animado carregando o caminhão) */
  s+='<g transform="translate(40,232)">'
    +'<rect x="-16" y="2" width="40" height="8" rx="3" fill="#242b2f"/>'
    +'<rect x="-14" y="-14" width="30" height="16" rx="3" fill="#f4c20d" stroke="#b8890a"/>'
    +'<rect x="-10" y="-11" width="10" height="8" fill="#cbe8f2"/>'
    +'<g class="cm-exc-arm">'
      +'<line x1="6" y1="-8" x2="34" y2="-24" stroke="#e0aa43" stroke-width="6" stroke-linecap="round"/>'
      +'<line x1="34" y1="-24" x2="48" y2="-6" stroke="#c99a2e" stroke-width="5" stroke-linecap="round"/>'
      +'<path d="M42,-4 q7,10 15,3 l-3,-13 z" fill="#59666d" stroke="#2b3438" stroke-width="1"/>'
    +'</g>'
    +'</g>';
  /* caminhão sendo carregado (parado sob a escavadeira) */
  s+=haulTruck(104,250,0.82,"",false);
  /* caminhão trafegando na estrada da mina */
  s+=haulTruck(150,272,0.62,"cm-haul-move",false);

  /* ===== 2. BRITAGEM (hopper) + caminhão despejando minério ===== */
  s+='<rect x="196" y="210" width="52" height="40" rx="3" fill="#5b6b73"/>';
  s+='<polygon points="198,210 246,210 236,190 208,190" fill="#48565d"/>';
  s+='<polygon points="210,190 234,190 226,182 218,182" fill="#39454b"/>';
  /* caminhão de costas despejando no britador (dump animado, espelhado p/ abrir à direita) */
  s+=haulTruck(186,248,0.8,"",true,true);

  /* ===== 3. CORREIA DE LONGA DISTÂNCIA (TCLD) — inclinada e animada ===== */
  s+='<line x1="248" y1="230" x2="360" y2="196" stroke="#2b3438" stroke-width="10"/>';
  s+='<line class="cmap-belt" x1="248" y1="230" x2="360" y2="196" stroke="#e0aa43" stroke-width="3.5"/>';
  s+='<circle cx="250" cy="230" r="7" fill="#1c2427"/><circle cx="358" cy="196" r="7" fill="#1c2427"/>';
  s+='<line x1="290" y1="222" x2="290" y2="238" stroke="#3a464c" stroke-width="3"/><line x1="326" y1="212" x2="326" y2="230" stroke="#3a464c" stroke-width="3"/>';

  /* ===== 4. USINA DE PROCESSAMENTO A SECO ===== */
  s+='<rect x="366" y="178" width="76" height="60" rx="3" fill="#55636c"/>';
  s+='<rect x="374" y="150" width="16" height="88" rx="5" fill="#7a878f"/><rect x="396" y="140" width="16" height="98" rx="5" fill="#7a878f"/>';
  s+='<rect x="430" y="130" width="9" height="108" fill="#404a4f"/>';
  s+='<g class="cm-smoke" fill="rgba(255,255,255,.55)"><circle cx="404" cy="132" r="7"/><circle cx="410" cy="120" r="6"/><circle cx="416" cy="108" r="5"/></g>';
  s+='<rect x="372" y="196" width="12" height="12" fill="#cbe8f2"/><rect x="392" y="196" width="12" height="12" fill="#cbe8f2"/><rect x="412" y="196" width="12" height="12" fill="#cbe8f2"/>';

  /* ===== 5. PÁTIO & CARREGAMENTO ===== */
  s+='<polygon points="452,244 486,206 520,244" fill="#7a5a3a"/><polygon points="500,244 528,214 556,244" fill="#8a6844"/>';
  s+='<rect x="470" y="196" width="70" height="6" rx="3" fill="#455055"/><line x1="504" y1="202" x2="504" y2="226" stroke="#5b6b73" stroke-width="4"/>';

  /* ===== 6. FERROVIA EFC (892 km) — trem animado (locomotiva + vagões) ===== */
  s+='<line x1="470" y1="266" x2="720" y2="256" stroke="#3a464c" stroke-width="4"/><line x1="470" y1="272" x2="720" y2="262" stroke="#3a464c" stroke-width="4"/>';
  for(var tx=474;tx<716;tx+=20){ s+='<line x1="'+tx+'" y1="264" x2="'+(tx+5)+'" y2="270" stroke="#2b3438" stroke-width="3"/>'; }
  s+='<g class="cm-train">'
    +'<g transform="translate(0,0)"><rect x="0" y="-20" width="30" height="18" rx="3" fill="#0f6e6a"/><rect x="4" y="-17" width="10" height="8" fill="#cbe8f2"/><rect x="30" y="-14" width="8" height="12" fill="#0a4f4c"/><circle cx="8" cy="2" r="4" fill="#15181a"/><circle cx="24" cy="2" r="4" fill="#15181a"/></g>'
    +'<g transform="translate(44,0)"><path d="M0,-14 L34,-14 L32,-2 L2,-2 Z" fill="#8a5a2b"/><rect x="0" y="-16" width="34" height="4" fill="#5c6a72"/><circle cx="8" cy="2" r="4" fill="#15181a"/><circle cx="26" cy="2" r="4" fill="#15181a"/></g>'
    +'<g transform="translate(86,0)"><path d="M0,-14 L34,-14 L32,-2 L2,-2 Z" fill="#8a5a2b"/><rect x="0" y="-16" width="34" height="4" fill="#5c6a72"/><circle cx="8" cy="2" r="4" fill="#15181a"/><circle cx="26" cy="2" r="4" fill="#15181a"/></g>'
    +'</g>';

  /* ===== 7. TERMINAL DE PONTA DA MADEIRA (píer + shiploader + navio atracado) ===== */
  s+='<rect x="726" y="238" width="66" height="10" fill="#455055"/>';
  s+='<line x1="736" y1="238" x2="736" y2="192" stroke="#5b6b73" stroke-width="5"/><line x1="736" y1="196" x2="792" y2="196" stroke="#5b6b73" stroke-width="5"/>';
  s+='<line class="cmap-belt" x1="740" y1="230" x2="786" y2="212" stroke="#e0aa43" stroke-width="3"/>';
  s+='<rect x="784" y="196" width="4" height="26" fill="#c99a2e"/>';
  /* navio atracado */
  s+='<g transform="translate(800,236)"><path d="M0,0 L64,0 L58,16 L6,16 Z" fill="#b23b32" stroke="#7d271f" stroke-width="1.5"/><rect x="10" y="-10" width="44" height="10" fill="#7a4f28"/><rect x="46" y="-20" width="14" height="12" fill="#e8eef1"/></g>';

  /* ===== 8. ROTA MARÍTIMA → CHINA (Orbitamax navegando) ===== */
  s+='<g class="cm-ship"><path d="M0,0 L74,0 L66,20 L8,20 Z" fill="#c0453b" stroke="#7d271f" stroke-width="1.5"/><rect x="12" y="-12" width="52" height="12" fill="#7a4f28"/><rect x="54" y="-24" width="16" height="14" fill="#eef3f5"/><rect x="57" y="-21" width="10" height="6" fill="#9fb7c2"/></g>';
  /* China (destino) */
  s+='<polygon points="962,196 1000,190 1000,300 950,300 946,244 958,220" fill="#b0392e" opacity=".9"/>';
  s+='<text x="978" y="230" font-size="20" text-anchor="middle">🇨🇳</text>';
  s+='<text x="978" y="250" font-size="12" text-anchor="middle" fill="#fff" font-weight="800">CHINA</text>';
  return s;
}
function renderChainMap(ch){
  var host=$("chainMap"); if(!host) return;
  var toChina=(L()==="pt"?"Minério → China 🇨🇳":"Ore → China 🇨🇳");
  var svg='<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid meet" width="100%" role="img" aria-label="'+ (L()==="pt"?"Cadeia de produção: da mina ao porto e até a China":"Production chain: from mine to port and on to China") +'">';
  svg+='<defs>'
    +'<linearGradient id="cmSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd3e8"/><stop offset="1" stop-color="#dff1f5"/></linearGradient>'
    +'<linearGradient id="cmGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f7a4a"/><stop offset="1" stop-color="#2c5836"/></linearGradient>'
    +'<linearGradient id="cmSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b8fb0"/><stop offset="1" stop-color="#16607a"/></linearGradient>'
    +'</defs>';
  svg+=cmapScene();
  var n=ch.stages.length;
  function pinAt(i){ return CMAP_ROUTE[i]?{x:CMAP_ROUTE[i][0],y:CMAP_ROUTE[i][1]}:cmapPoint(n>1?i/(n-1):0); }
  // rota (linha dourada tracejada ligando as etapas)
  var d="M"+CMAP_ROUTE.map(function(p){ return p[0]+","+p[1]; }).join(" L");
  svg+='<path d="'+d+'" fill="none" stroke="#EDB111" stroke-width="3" stroke-dasharray="7 6" opacity=".9"/>';
  // legenda "até a China"
  svg+='<g transform="translate(600,150)"><rect x="0" y="0" width="150" height="22" rx="11" fill="rgba(6,24,32,.82)"/><text x="12" y="15" font-size="12" fill="#EDB111" font-weight="700">'+toChina+'</text></g>';
  // brecha: propaga o impacto por toda a cadeia a jusante
  var bi=chainCompromised(ch);
  if(bi>=0){
    var bpts=[]; for(var bx=bi;bx<n;bx++){ var bp=pinAt(bx); bpts.push(bp.x+","+bp.y); }
    svg+='<polyline class="cmap-breach" points="'+bpts.join(" ")+'" fill="none" stroke="#ff4d4f" stroke-width="5" stroke-dasharray="11 8" opacity=".95"/>';
    for(var wx=bi+1;wx<n;wx++){ var wp=pinAt(wx); svg+='<text class="cmap-warn" x="'+wp.x+'" y="'+(wp.y-24)+'" font-size="17" text-anchor="middle">⚠️</text>'; }
  }
  // pinos das etapas
  ch.stages.forEach(function(st,i){
    var pt=pinAt(i);
    var key=chainKey(ch.id,st.id), acc=S.chainDone[key], done=acc!==undefined, bad=done&&acc<60;
    var fill=bad?"#ff4d4f":done?"#2fbf71":"#EDB111";
    svg+='<g class="cmap-pin'+(bad?" compromised":(done?" done":""))+'" data-stage="'+st.id+'" tabindex="0" role="button" transform="translate('+pt.x.toFixed(1)+','+pt.y.toFixed(1)+')">';
    svg+='<title>'+tt(st.name)+'</title>';
    svg+='<circle class="cmap-pin-halo" r="17" fill="'+fill+'" opacity=".22"/>';
    svg+='<circle class="cmap-pin-dot" r="13" fill="'+fill+'" stroke="#04141b" stroke-width="1.5"/>';
    svg+='<text y="5" font-size="13" text-anchor="middle" font-weight="800" fill="#04141b">'+(bad?"!":(done?"✔":(i+1)))+'</text>';
    svg+='<g class="cmap-pin-label"><rect x="-46" y="-40" width="92" height="18" rx="9" fill="rgba(6,24,32,.9)"/><text y="-27" font-size="11" text-anchor="middle" fill="#eaf2f6">'+(i+1)+". "+shortName(tt(st.name))+'</text></g>';
    svg+='</g>';
  });
  svg+='</svg>';
  host.innerHTML=svg;
  host.querySelectorAll(".cmap-pin").forEach(function(g){
    var id=g.getAttribute("data-stage");
    g.addEventListener("click",function(){ startChain(ch.id,id); });
    g.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); startChain(ch.id,id); } });
  });
}
function shortName(name){ var s=name.replace(/^\d+\.\s*/,""); return s.length>16? s.slice(0,15)+"…":s; }
function startChain(chId,stId){
  var ch=chainById(chId),st=null; for(var i=0;i<ch.stages.length;i++) if(ch.stages[i].id===stId) st=ch.stages[i];
  if(!st) return;
  cur.mode="chain"; cur.chainKey=chainKey(chId,stId);
  cur.country={id:cur.chainKey, name:{pt:tt(ch.name)+" · "+st.name.pt, en:tt(ch.name)+" · "+st.name.en}, flag:st.ico};
  cur.questions=shuffleQuestions(st.qs.slice()); cur.i=0; cur.correct=0; cur.integrity=100; S.lives=3; initQuizSession(); renderLives();
  show("screenQuiz"); renderQuestion();
}

/* -------------------- CHEFÕES — MATURIDADE / RESILIÊNCIA -------------------- */
var BOSS_TIERS={
  legendary:{ico:"🏆",title:{pt:"Guardião Lendário",en:"Legendary Guardian"},outcomes:[
    {pt:"✅ Produção preservada",en:"✅ Production preserved"},
    {pt:"✅ Ferrovia operando normalmente",en:"✅ Railway operating normally"},
    {pt:"✅ Operações portuárias sem impacto",en:"✅ Port operations unaffected"},
    {pt:"✅ Clientes atendidos no prazo",en:"✅ Customers served on time"},
    {pt:"✅ Auditoria sem não conformidades",en:"✅ Audit with no non-conformities"}
  ],msg:{pt:"Você antecipou ameaças, coordenou equipes e protegeu toda a cadeia da mina ao porto. Sua liderança fortaleceu a resiliência global da Orbita.",en:"You anticipated threats, coordinated teams and protected the whole chain from mine to port. Your leadership strengthened Orbita's global resilience."}},
  gold:{ico:"🥇",title:{pt:"Vitória Ouro",en:"Gold Victory"},outcomes:[
    {pt:"✅ Operação mantida",en:"✅ Operation maintained"},
    {pt:"✅ Impactos mínimos aos negócios",en:"✅ Minimal business impact"},
    {pt:"✅ Recuperação rápida dos sistemas",en:"✅ Fast system recovery"}
  ],msg:{pt:"Sua resposta foi eficaz. Mesmo diante da crise, a operação permaneceu segura e resiliente.",en:"Your response was effective. Even amid the crisis, operations remained safe and resilient."}},
  silver:{ico:"🥈",title:{pt:"Vitória Prata",en:"Silver Victory"},outcomes:[
    {pt:"⚠ Pequenos atrasos operacionais",en:"⚠ Minor operational delays"},
    {pt:"⚠ Algumas equipes sobrecarregadas",en:"⚠ Some teams overloaded"},
    {pt:"✅ Serviços críticos preservados",en:"✅ Critical services preserved"}
  ],msg:{pt:"A operação foi mantida, mas existem oportunidades de melhoria nos processos de prevenção e resposta.",en:"Operations were maintained, but there are opportunities to improve prevention and response processes."}},
  bronze:{ico:"🥉",title:{pt:"Vitória Bronze",en:"Bronze Victory"},outcomes:[
    {pt:"⚠ Produção parcialmente afetada",en:"⚠ Production partially affected"},
    {pt:"⚠ Recuperação lenta",en:"⚠ Slow recovery"},
    {pt:"⚠ Maior esforço operacional",en:"⚠ Greater operational effort"}
  ],msg:{pt:"A equipe conseguiu conter a crise, mas os impactos poderiam ter sido menores com ações mais rápidas e coordenadas.",en:"The team contained the crisis, but impacts could have been smaller with faster, coordinated actions."}},
  severe:{ico:"❌",title:{pt:"Incidente Grave",en:"Serious Incident"},outcomes:[
    {pt:"🔴 Sistemas críticos indisponíveis",en:"🔴 Critical systems unavailable"},
    {pt:"🔴 Impacto na cadeia logística",en:"🔴 Supply chain impact"},
    {pt:"🔴 Aumento do risco operacional",en:"🔴 Increased operational risk"}
  ],msg:{pt:"A interrupção afetou operações importantes. Revise as decisões tomadas e fortaleça as camadas de proteção.",en:"The disruption affected important operations. Review your decisions and strengthen protection layers."}},
  systemic:{ico:"☠️",title:{pt:"Crise Sistêmica",en:"Systemic Crisis"},outcomes:[
    {pt:"🔴 Mina afetada",en:"🔴 Mine affected"},
    {pt:"🔴 Ferrovia afetada",en:"🔴 Railway affected"},
    {pt:"🔴 Porto afetado",en:"🔴 Port affected"},
    {pt:"🔴 Clientes impactados",en:"🔴 Customers impacted"},
    {pt:"🔴 Necessidade de resposta emergencial",en:"🔴 Emergency response required"}
  ],msg:{pt:"A ameaça se propagou por toda a cadeia operacional. A recuperação exigirá esforço coordenado entre tecnologia, operação e negócios.",en:"The threat spread across the entire operational chain. Recovery will require coordinated effort across technology, operations and business."}}
};
var BOSS_RANKS=[
  {min:95,id:"legendary",ico:"👑",pt:"Guardião Lendário",en:"Legendary Guardian"},
  {min:85,id:"master",ico:"🏆",pt:"Guardião Mestre",en:"Master Guardian"},
  {min:75,id:"expert",ico:"🥇",pt:"Guardião Especialista",en:"Expert Guardian"},
  {min:65,id:"advanced",ico:"🥈",pt:"Guardião Avançado",en:"Advanced Guardian"},
  {min:50,id:"apprentice",ico:"🥉",pt:"Guardião Aprendiz",en:"Apprentice Guardian"},
  {min:0,id:"training",ico:"⚠️",pt:"Guardião em Treinamento",en:"Guardian in Training"}
];
var BOSS_IDX_LABELS={
  availability:{pt:"Disponibilidade Operacional",en:"Operational Availability"},
  resilience:{pt:"Resiliência Organizacional",en:"Organizational Resilience"},
  exposure:{pt:"Exposição ao Risco",en:"Risk Exposure"},
  preparation:{pt:"Preparação para Crises",en:"Crisis Preparedness"},
  maturity:{pt:"Maturidade Cibernética",en:"Cyber Maturity"}
};
function ensureBossStats(){
  if(!S.bossStats||typeof S.bossStats!=="object") S.bossStats={};
  var k;
  for(k in S.bossDone){ if(S.bossDone[k]===true&&!S.bossStats[k]) S.bossStats[k]={plays:1,best:bossDefaultMetrics(55),last:bossDefaultMetrics(55)}; }
}
function bossDefaultMetrics(idx){
  idx=Math.max(0,Math.min(100,idx|0));
  var m={availability:idx,resilience:idx,exposure:100-idx,preparation:idx,maturity:idx,index:idx,tier:"bronze",rankId:"training"};
  m.tier=bossComputeTier(m);
  m.rankId=bossGuardianRank(idx).id;
  return m;
}
function bossCompletedCount(){ ensureBossStats(); var n=0,i; for(i=0;i<BOSSES.length;i++) if(S.bossStats[BOSSES[i].id]) n++; return n; }
function bossCompletedIds(){ ensureBossStats(); var ids={},i,b; for(i=0;i<BOSSES.length;i++){ b=BOSSES[i].id; if(S.bossStats[b]||S.bossDone[b]) ids[b]=true; } return Object.keys(ids); }
function bossAvgIndex(){
  ensureBossStats(); var sum=0,n=0,k;
  for(k in S.bossStats){ if(S.bossStats[k].best) { sum+=S.bossStats[k].best.index; n++; } }
  return n?Math.round(sum/n):0;
}
function bossHasTier(tier){ ensureBossStats(); var k; for(k in S.bossStats){ if(S.bossStats[k].best&&S.bossStats[k].best.tier===tier) return true; } return false; }
function bossGoldCount(){ ensureBossStats(); var n=0,k,t; for(k in S.bossStats){ t=S.bossStats[k].best&&S.bossStats[k].best.tier; if(t==="legendary"||t==="gold") n++; } return n; }
function bossGuardianRank(idx){ var i,r=BOSS_RANKS[BOSS_RANKS.length-1]; for(i=0;i<BOSS_RANKS.length;i++) if(idx>=BOSS_RANKS[i].min){ r=BOSS_RANKS[i]; break; } return r; }
function bossComputeTier(m){
  if(m.availability<40) return "systemic";
  if(m.availability<65) return "severe";
  if(m.availability>=95&&m.resilience>=90&&m.exposure<=10) return "legendary";
  if(m.availability>=90&&m.resilience>=80&&m.exposure<=20) return "gold";
  if(m.availability>=80&&m.resilience>=65&&m.exposure<=35) return "silver";
  if(m.availability>=65&&m.resilience>=50) return "bronze";
  return "severe";
}
function bossComputeMetrics(cur){
  var n=cur.boss.phases.length, wrong=cur.wrong||0, correct=cur.correct||0;
  var availability=Math.round(Math.max(0,Math.min(100,100-wrong*7-Math.max(0,cur.hp-15)*0.35)));
  var resilience=Math.round(Math.max(0,Math.min(100,cur.ops)));
  var exposure=Math.round(Math.max(0,Math.min(100,cur.hp)));
  var preparation=Math.round(Math.max(0,Math.min(100,(correct/n)*100-wrong*4+(correct>=8?10:correct>=6?5:0))));
  var maturity=Math.round(Math.max(0,Math.min(100,availability*0.28+resilience*0.28+(100-exposure)*0.18+preparation*0.14+cur.ops*0.12)));
  var index=Math.round((availability+resilience+(100-exposure)+preparation+maturity)/5);
  var tier=bossComputeTier({availability:availability,resilience:resilience,exposure:exposure});
  var rank=bossGuardianRank(index);
  return {availability:availability,resilience:resilience,exposure:exposure,preparation:preparation,maturity:maturity,index:index,tier:tier,rankId:rank.id};
}
function bossTierReward(tier){ var r={legendary:{xp:60},gold:{xp:50},silver:{xp:40},bronze:{xp:30},severe:{xp:20},systemic:{xp:15}}; return r[tier]||r.bronze; }
function bossSaveRun(bossId,metrics){
  ensureBossStats();
  var prev=S.bossStats[bossId], best=prev&&prev.best?prev.best:null;
  var entry={plays:(prev?prev.plays:0)+1,last:metrics,best:best};
  if(!best||metrics.index>best.index) entry.best=metrics;
  else entry.best=best;
  S.bossStats[bossId]=entry;
  S.bossDone[bossId]=true;
}
function bossBarHtml(key,pct,invert){
  var lbl=BOSS_IDX_LABELS[key]?tt(BOSS_IDX_LABELS[key]):key;
  var val=Math.round(pct);
  var filled=Math.round(val/10);
  var bar=""; var i;
  for(i=0;i<10;i++) bar+=(i<filled?"█":"░");
  var cls=invert?(val<=20?"good":val<=35?"warn":"bad"):(val>=80?"good":val>=50?"warn":"bad");
  return '<div class="boss-idx-row"><span class="boss-idx-lbl">'+lbl+'</span><span class="boss-idx-bar '+cls+'" aria-hidden="true">'+bar+'</span><span class="boss-idx-val">'+val+'%</span></div>';
}
function bossDebriefFromLog(log){
  var good=[],improve=[],i,e;
  for(i=0;i<(log||[]).length;i++){
    e=log[i];
    if(e.ok&&good.length<4) good.push("✅ "+tt(e.good));
    if(!e.ok&&improve.length<4) improve.push("⚠ "+tt(e.bad));
  }
  if(!good.length) good.push(L()==="pt"?"✅ Concluiu todas as cenas da missão":"✅ Completed all mission scenes");
  if(!improve.length) improve.push(L()==="pt"?"⚠ Continue treinando prevenção e resposta coordenada":"⚠ Keep training prevention and coordinated response");
  return {good:good,improve:improve};
}
function bossTierInfo(tier){ return BOSS_TIERS[tier]||BOSS_TIERS.bronze; }

/* ==========================================================
   BOSS FIGHTS
   ========================================================== */
var bossCur={boss:null,phase:0,hp:100,ops:100,answered:false,correct:0,wrong:0,log:[]};
function bossImpactText(ph,ok){
  if(ph.impactOk&&ph.impactBad) return ok?tt(ph.impactOk):tt(ph.impactBad);
  return tt(ph.why);
}
function renderBossBars(){
  var hpF=$("bossHpFill"), opsF=$("bossOpsFill"), opsV=$("bossOpsVal");
  if(hpF){ hpF.style.width=bossCur.hp+"%"; var hpBar=hpF.parentNode; if(hpBar){ hpBar.setAttribute("role","progressbar"); hpBar.setAttribute("aria-valuenow",bossCur.hp); hpBar.setAttribute("aria-valuemin","0"); hpBar.setAttribute("aria-valuemax","100"); } }
  if(opsF){ opsF.style.width=bossCur.ops+"%"; opsF.style.background=bossCur.ops>60?"var(--green)":bossCur.ops>30?"var(--gold)":"var(--bad)"; var opsBar=opsF.parentNode; if(opsBar){ opsBar.setAttribute("role","progressbar"); opsBar.setAttribute("aria-valuenow",bossCur.ops); opsBar.setAttribute("aria-valuemin","0"); opsBar.setAttribute("aria-valuemax","100"); } }
  if(opsV) opsV.textContent=bossCur.ops+"%";
}
function renderBossSceneTrack(b,active){
  var track=$("bossSceneTrack"); if(!track) return;
  track.innerHTML="";
  for(var i=0;i<b.phases.length;i++){
    var dot=document.createElement("span");
    dot.className="boss-scene-dot"+(i<active?" done":"")+(i===active?" active":"");
    dot.setAttribute("aria-hidden","true");
    track.appendChild(dot);
  }
}
function renderBossList(){
  hydrateNorthernBoss();
  var host=$("bossList"); if(!host) return;
  ensureBossStats();
  host.innerHTML="";
  var list=BOSSES.slice().sort(function(a,b){
    if(a.chainId==="carajas"&&b.chainId!=="carajas") return -1;
    if(a.chainId!=="carajas"&&b.chainId==="carajas") return 1;
    if(a.chainId==="office"&&b.chainId!=="office"&&b.chainId!=="carajas") return -1;
    if(a.chainId!=="office"&&b.chainId==="office") return 1;
    return 0;
  });
  var pending=[], done=[];
  list.forEach(function(b){
    var st=S.bossStats[b.id], best=st&&st.best;
    if(best) done.push(b); else pending.push(b);
  });
  var head=document.createElement("div");
  head.className="boss-list-head";
  head.innerHTML=
    '<div class="boss-list-summary">'+t("boss.listSummary").replace("{done}",String(done.length)).replace("{total}",String(BOSSES.length)).replace("{pending}",String(pending.length))+'</div>'+
    '<div class="boss-list-legend" aria-hidden="true">'+
      '<span class="boss-legend-item boss-legend-pending">▶ '+t("boss.statusPending")+'</span>'+
      '<span class="boss-legend-item boss-legend-done">✅ '+t("boss.statusDone")+'</span>'+
    '</div>';
  host.appendChild(head);
  function appendSection(title, items, isDone){
    if(!items.length) return;
    var sec=document.createElement("div");
    sec.className="boss-list-section"+(isDone?" boss-list-section--done":" boss-list-section--pending");
    var h=document.createElement("h3");
    h.className="boss-list-section-k";
    h.textContent=title+" ("+items.length+")";
    sec.appendChild(h);
    var grid=document.createElement("div");
    grid.className="boss-list-section-grid";
    items.forEach(function(b){ grid.appendChild(buildBossCard(b,isDone)); });
    sec.appendChild(grid);
    host.appendChild(sec);
  }
  appendSection(t("boss.sectionPending"), pending, false);
  appendSection(t("boss.sectionDone"), done, true);
}
function buildBossCard(b,isDone){
  var st=S.bossStats[b.id], best=st&&st.best, tier=best?bossTierInfo(best.tier):null;
  var d=document.createElement("button");
  d.type="button";
  d.setAttribute("data-boss",b.id);
  d.addEventListener("click",function(){ startBoss(b.id); });
  var rec=getRecommendedBossId()===b.id;
  d.className="boss-card boss-card--tabletop boss-card--map"+(isDone?" boss-card--done":" boss-card--pending")+(rec&&!isDone?" boss-card--rec":"");
  var phaseN=b.phases&&b.phases.length?b.phases.length:0;
  var estMin=Math.max(3,Math.round(phaseN*1.5));
  var tagLabel=b.tag?tt(b.tag):t("boss.storyMapLabel");
  var preview=tt(b.desc).length>90?tt(b.desc).slice(0,87)+"…":tt(b.desc);
  var statusPill=isDone
    ?'<span class="boss-status-pill boss-status-pill--done">✅ '+t("boss.statusDone")+(best&&tier?' · <span class="boss-status-tier">'+tier.ico+' '+best.index+'%</span>':"")+'</span>'
    :'<span class="boss-status-pill boss-status-pill--pending">▶ '+t("boss.statusPending")+'</span>';
  var meta=t("boss.estTime").replace("{n}",String(estMin))+" · "+t("boss.scenes").replace("{n}",String(phaseN));
  if(rec&&!isDone) meta+=' · <span class="boss-rec-tag">'+t("boss.recommended")+'</span>';
  var actionLabel=isDone?t("boss.replayStory"):t("boss.playStory");
  var ariaStatus=isDone?(t("boss.statusDone")+(best?" "+best.index+"%":"")):t("boss.statusPending");
  d.setAttribute("aria-label",tt(b.name)+". "+ariaStatus+". "+actionLabel);
  d.innerHTML=
    statusPill+
    '<span class="be" aria-hidden="true">'+b.emoji+'</span>'+
    '<div class="boss-card-body">'+
      '<span class="boss-card-tag">'+tagLabel+'</span>'+
      '<div class="bt">'+tt(b.name)+'</div>'+
      '<div class="bd">'+preview+'</div>'+
      '<div class="boss-card-meta">'+meta+'</div>'+
    '</div>'+
    '<span class="boss-card-action" aria-hidden="true">'+(isDone?"↻":"▶")+'</span>';
  return d;
}
function startBoss(id){
  hydrateNorthernBoss();
  bossCur.boss=BOSSES.filter(function(x){return x.id===id;})[0];
  if(!bossCur.boss){ console.error("startBoss: boss not found",id); return; }
  bossCur.phase=0; bossCur.hp=100; bossCur.ops=100; bossCur.answered=false; bossCur.correct=0; bossCur.wrong=0; bossCur.log=[]; bossCur.phaseStates={};
  renderBossPhase(); show("screenBoss");
}
function updateBossNav(){
  var prev=$("bossPrevBtn"), next=$("bossNext");
  if(prev) prev.disabled=bossCur.phase<=0;
  if(next){
    var st=bossCur.phaseStates&&bossCur.phaseStates[bossCur.phase];
    if(st||bossCur.answered) next.style.display="inline-block";
    else next.style.display="none";
  }
}
function bossPrev(){
  if(bossCur.phase<=0) return;
  bossCur.phase--;
  renderBossPhase();
}
function bossQuit(){
  showQuitDialog(function(){ renderBossList(); show("screenBossList"); });
}
function renderBossPhase(){
  var b=bossCur.boss;
  if(!b||!b.phases||!b.phases.length) return;
  var ph=b.phases[bossCur.phase];
  if(!ph) return;
  var st=bossCur.phaseStates&&bossCur.phaseStates[bossCur.phase];
  if(st){ bossCur.hp=st.hp; bossCur.ops=st.ops; }
  $("bossHeader").innerHTML='<span class="be">'+b.emoji+'</span><div><h2>'+tt(b.name)+'</h2><div class="bd">'+tt(b.desc)+'</div></div>';
  var intro=$("bossStoryIntro");
  if(intro){
    if(bossCur.phase===0&&b.intro&&!st){ intro.hidden=false; intro.innerHTML='<span class="boss-story-k">'+t("boss.scenario")+'</span><p>'+tt(b.intro)+'</p>'; }
    else intro.hidden=true;
  }
  renderBossSceneTrack(b,bossCur.phase);
  renderBossChainVisual();
  var bridge=$("bossBridge");
  if(bridge){
    var prev=bossCur.phase>0?b.phases[bossCur.phase-1]:null;
    if(prev&&prev.bridge){ bridge.hidden=false; bridge.innerHTML='<span class="boss-bridge-k">↳</span> '+tt(prev.bridge); }
    else bridge.hidden=true;
  }
  var sceneEl=$("bossSceneLabel");
  if(sceneEl) sceneEl.textContent=ph.scene?tt(ph.scene):(t("boss.scene")+" "+(bossCur.phase+1));
  $("bossHpFill").style.width=bossCur.hp+"%";
  renderBossBars();
  $("bossPhaseNum").textContent=(L()==="pt"?"Cena ":"Scene ")+(bossCur.phase+1)+"/"+b.phases.length;
  $("bossPrompt").textContent=tt(ph.q);
  var bp=$("bossPersonalBridge");
  if(bp){ var th=bossPhaseTheme(b,ph), p=getPersonal({theme:th,personal:ph.personal}); if(p){ bp.hidden=false; bp.innerHTML='<span class="personal-k">'+t("quiz.personal")+':</span> '+tt(p); } else bp.hidden=true; }
  var opts=$("bossOptions"); opts.innerHTML="";
  bossCur.answered=!!st;
  var order=st&&st.order?st.order:shuffle(ph.opts.map(function(o,i){ return {o:o,idx:i}; }));
  if(!st) bossCur._optOrder=order;
  var letters=["A","B","C","D"];
  order.forEach(function(item,pos){
    var btn=document.createElement("button");
    btn.className="opt";
    if(item.idx===ph.correct) btn.setAttribute("data-correct","1");
    btn.innerHTML='<span class="kx">'+letters[pos]+'</span><span>'+tt(item.o)+'</span>';
    if(st){ btn.disabled=true; if(item.idx===st.selectedIdx) btn.classList.add(st.ok?"correct":"wrong"); if(item.idx===ph.correct) btn.classList.add("correct"); }
    else btn.addEventListener("click",function(){ bossAnswer(item.idx,btn,ph,order); });
    opts.appendChild(btn);
  });
  var fb=$("bossFb");
  if(st){ fb.className=st.feedbackClass||"feedback"; fb.innerHTML=st.feedbackHtml||""; }
  else { fb.className="feedback"; fb.innerHTML=""; }
  var nxt=$("bossNext");
  if(nxt) nxt.textContent=bossCur.phase>=b.phases.length-1?t("boss.finish"):(L()==="pt"?"Próxima cena →":"Next scene →");
  updateBossNav();
  if(!st) speak(tt(b.name)+". "+(ph.scene?tt(ph.scene)+". ":"")+tt(ph.q));
}
function bossAnswer(idx,btn,ph,order){
  if(bossCur.answered) return;
  bossCur.answered=true;
  $("bossOptions").querySelectorAll(".opt").forEach(function(b){ b.disabled=true; });
  var ok=idx===ph.correct,fb=$("bossFb"),impact=bossImpactText(ph,ok);
  var b=bossCur.boss, th=bossPhaseTheme(b,ph);
  var bq={id:b.id+"_s"+(bossCur.phase+1),theme:th,why:ph.impactOk||ph.why};
  recordTheme(th,ok); recordMiss(bq,ok);
  if(ok){
    btn.classList.add("correct");
    bossCur.correct++;
    bossCur.hp=Math.max(0,bossCur.hp-Math.ceil(100/bossCur.boss.phases.length));
    bossCur.ops=Math.min(100,bossCur.ops+8);
    addReward(15,8,20);
    fb.className="feedback show good";
    fb.innerHTML="✅ <strong>"+t("boss.impactOk")+":</strong> "+impact;
  } else {
    btn.classList.add("wrong");
    bossCur.wrong++;
    $("bossOptions").querySelectorAll(".opt").forEach(function(b){ if(b.getAttribute("data-correct")==="1") b.classList.add("correct"); });
    bossCur.hp=Math.min(100,bossCur.hp+Math.ceil(60/bossCur.boss.phases.length));
    bossCur.ops=Math.max(0,bossCur.ops-12);
    fb.className="feedback show err";
    fb.innerHTML="⚠️ <strong>"+t("boss.impactBad")+":</strong> "+impact;
  }
  if(!bossCur.phaseStates) bossCur.phaseStates={};
  bossCur.phaseStates[bossCur.phase]={selectedIdx:idx,ok:ok,feedbackClass:fb.className,feedbackHtml:fb.innerHTML,hp:bossCur.hp,ops:bossCur.ops,order:order||bossCur._optOrder};
  bossCur.log.push({good:ph.impactOk||ph.why,bad:ph.impactBad||ph.why,ok:ok});
  if(b.chainId&&ph.stageId){
    var key=chainKey(b.chainId||"carajas",ph.stageId);
    S.chainDone[key]=ok?100:40;
    save();
  }
  renderBossBars();
  renderBossChainVisual();
  speak((ok?(L()==="pt"?"Correto. ":"Correct. "):(L()==="pt"?"Risco. ":"Risk. "))+impact);
  bumpWeekly("correct",ok?1:0); if(ok&&th===getWeekTheme()) bumpWeekly("theme",1);
  updateBossNav(); $("bossNext").focus();
}
function bossNext(){
  if(bossCur.phase>=bossCur.boss.phases.length-1&&bossCur.answered){ finishBoss(); return; }
  bossCur.phase++;
  if(bossCur.phase>=bossCur.boss.phases.length){ finishBoss(); return; }
  renderBossPhase();
}
function finishBoss(){
  var b=bossCur.boss, m=bossComputeMetrics(bossCur), tier=bossTierInfo(m.tier), rank=bossGuardianRank(m.index);
  var prevBest=S.bossStats&&S.bossStats[b.id]&&S.bossStats[b.id].best?S.bossStats[b.id].best.index:0;
  bossSaveRun(b.id,m);
  var rew=bossTierReward(m.tier);
  addReward(rew.xp,0,m.index);
  bumpWeekly("boss",1); recordStreak(); checkMedals(); save();
  var debrief=bossDebriefFromLog(bossCur.log);
  var improved=m.index>prevBest;
  var outcomes=tier.outcomes.map(function(o){ return "<li>"+tt(o)+"</li>"; }).join("");
  var idxHtml=bossBarHtml("availability",m.availability)+bossBarHtml("resilience",m.resilience)+bossBarHtml("exposure",m.exposure,true)+bossBarHtml("preparation",m.preparation)+bossBarHtml("maturity",m.maturity);
  var goodLi=debrief.good.map(function(x){ return "<li>"+x+"</li>"; }).join("");
  var impLi=debrief.improve.map(function(x){ return "<li>"+x+"</li>"; }).join("");
  $("bossResult").innerHTML=
    '<div class="boss-result-wrap">'+
      '<div class="boss-tier-hero tier-'+m.tier+'"><div class="boss-tier-ico">'+tier.ico+'</div><h2>'+tt(tier.title)+'</h2>'+
      '<p class="boss-tier-sub">'+b.emoji+' '+tt(b.name)+' · '+t("boss.maturityTitle")+': <strong>'+m.index+'%</strong>'+(improved&&prevBest?(' <span class="boss-new-best">↑ '+(L()==="pt"?"novo recorde":"new best")+'</span>'):'')+'</p></div>'+
      '<div class="boss-rank-badge"><span class="boss-rank-ico">'+rank.ico+'</span><div><div class="boss-rank-k">'+t("boss.guardianRank")+'</div><div class="boss-rank-v">'+rank[L()]+'</div></div></div>'+
      '<div class="boss-idx-panel"><div class="boss-idx-title">'+t("boss.maturityTitle")+'</div>'+idxHtml+'</div>'+
      '<div class="boss-outcomes"><ul>'+outcomes+'</ul><p class="boss-result-epilogue">'+tt(tier.msg)+'</p></div>'+
      '<div class="boss-debrief"><div class="boss-debrief-col"><div class="boss-debrief-k">'+t("boss.debriefGood")+'</div><ul>'+goodLi+'</ul></div>'+
      '<div class="boss-debrief-col"><div class="boss-debrief-k warn">'+t("boss.debriefImprove")+'</div><ul>'+impLi+'</ul></div></div>'+
    '</div>';
  bossCur.lastBossId=b.id;
  renderPostSessionActions("bossPostActions",true);
  show("screenBossResult");
  speak(tt(tier.title)+". "+tt(tier.msg));
  toast(tier.ico+" "+tt(tier.title)+(improved?" ↑":""));
}

/* ==========================================================
   DIÁRIAS & SEMANAIS
   ========================================================== */
function todayKey(){ var d=new Date(); return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(); }
function yesterdayKey(){ var d=new Date(); d.setDate(d.getDate()-1); return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(); }
function ensureStreak(){ if(!S.streak) S.streak={count:0,lastDate:"",best:0}; }
function chainStagesDone(){ return Object.keys(S.chainDone||{}).length; }
function chainCarajasDone(){
  var ch=chainById("carajas"), n=0, i;
  if(!ch||!ch.stages) return 0;
  for(i=0;i<ch.stages.length;i++){
    if(S.chainDone[chainKey("carajas",ch.stages[i].id)]!==undefined) n++;
  }
  return n;
}
function progressBossMetrics(){
  var crises=bossCompletedCount()+'/'+BOSSES.length;
  var chain=chainCarajasDone()+'/'+chainTotalStages();
  var mat=bossAvgIndex()+'%';
  return t("progress.bossM").replace("{crises}",crises).replace("{chain}",chain).replace("{mat}",mat);
}
function meetsUnlock(item){
  if(!item.unlock) return true;
  if(item.unlock==="chain1") return chainStagesDone()>=1;
  if(item.unlock==="chain3") return chainStagesDone()>=3;
  if(item.unlock==="countries5") return Object.keys(S.done||{}).length>=5;
  return false;
}
function recordStreak(){
  ensureStreak();
  var today=todayKey(), yest=yesterdayKey(), prev=S.streak.lastDate, was=S.streak.count;
  if(prev===today) return was;
  if(prev===yest){ S.streak.count=(S.streak.count||0)+1; }
  else if(!prev){ S.streak.count=1; toast(t("streak.new")); }
  else{ S.streak.count=1; if(was>1) toast(t("streak.lost")); }
  S.streak.lastDate=today;
  if(S.streak.count>(S.streak.best||0)) S.streak.best=S.streak.count;
  var bonuses={3:10,7:25,14:50,30:100};
  if(bonuses[S.streak.count]){ addReward(S.streak.count*5); toast(t("streak.bonusXp").replace("{n}",String(S.streak.count*5))); }
  else if(S.streak.count>1) toast(t("streak.up")+S.streak.count+" "+t("streak.days"));
  save(); refreshHud(); renderStreakCard(); checkMedals();
  return S.streak.count;
}
function streakPlayedToday(){ ensureStreak(); return S.streak.lastDate===todayKey(); }
function renderStreakCard(){
  var card=$("streakCard"); if(!card) return;
  ensureStreak();
  var n=S.streak.count||0, best=S.streak.best||0, today=streakPlayedToday();
  $("streakCount").textContent=n;
  $("streakBest").textContent=best;
  var status;
  if(today) status=t("streak.today");
  else if(n===0) status=t("streak.start");
  else if(n<=1&&!today) status=t("streak.dayOne");
  else if(n>0) status=streakRiskMsg();
  else status=t("streak.neutral");
  $("streakStatus").textContent=status;
  card.classList.toggle("streak-active",today);
  card.classList.toggle("streak-risk",!today&&n>0);
  renderHudStreak();
}
function resetProgress(){
  if(!confirm(t("profile.resetConfirm"))) return;
  localStorage.removeItem(STORE_KEY);
  location.reload();
}
function weekKey(){ var d=new Date(); var on=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())); var day=on.getUTCDay()||7; on.setUTCDate(on.getUTCDate()+4-day); var ys=new Date(Date.UTC(on.getUTCFullYear(),0,1)); var wn=Math.ceil((((on-ys)/86400000)+1)/7); return on.getUTCFullYear()+"-W"+wn; }
function ensureDaily(){ if(S.daily.date!==todayKey()){ S.daily={date:todayKey(),done:{}}; save(); } }
function markDailyDone(won){
  ensureDaily();
  var first=!S.daily.done.mission;
  S.daily.done.mission=true;
  if(first){
    S.dailyTotal=(S.dailyTotal||0)+1;
    if(won){
      addReward(50);
      if(S.dailyTotal===1) celebrationToast(t("home.firstSessionTitle"), t("home.firstSessionSub"));
      else celebrationToast(t("daily.doneTitle"), t("daily.doneSub")+(L()==="pt"?" (+50 XP)":" (+50 XP)"));
    }
  }
  save();
}
function renderDaily(){
  ensureDaily(); renderStreakCard(); renderMissionsFocus();
  $("dailyDate").textContent=(L()==="pt"?"Hoje: ":"Today: ")+new Date().toLocaleDateString(L()==="pt"?"pt-BR":"en-US");
  var due=srsDueCount(), srs=$("dailySrsNote");
  if(srs){
    if(due>0){ srs.hidden=false; srs.textContent=t("daily.srsDue").replace("{n}",String(due)); }
    else srs.hidden=true;
  }
  var meta=$("dailyMeta");
  if(meta){
    ensureStreak();
    var streakMsg=streakPlayedToday()?t("daily.streakOk"):t("daily.streakRisk");
    var reviewVal=uxLegacy()?(due>0?due+" SRS":"—"):(due>0?String(due):"—");
    var reviewLab=uxLegacy()?"SRS":t("daily.reviewLabel");
    meta.innerHTML='<div class="daily-meta-grid">'
      +'<div class="daily-meta-item" aria-label="'+t("streak.days")+'"><span class="daily-meta-k" aria-hidden="true">🔥</span><span class="daily-meta-v">'+(S.streak.count||0)+' '+t("streak.days")+'</span></div>'
      +'<div class="daily-meta-item" aria-label="'+reviewLab+'"><span class="daily-meta-k" aria-hidden="true">📚</span><span class="daily-meta-v">'+reviewVal+'</span><span class="daily-meta-lab">'+reviewLab+'</span></div>'
      +'<div class="daily-meta-item" aria-label="'+(L()==="pt"?"5 situações":"5 scenarios")+'"><span class="daily-meta-k" aria-hidden="true">🎯</span><span class="daily-meta-v">5</span><span class="daily-meta-lab">'+(L()==="pt"?"situações":"scenarios")+'</span></div>'
      +'</div><p class="daily-why">'+t("daily.whyToday")+' — '+streakMsg+'</p><p class="muted daily-theme-line">'+t("daily.themeLine")+'</p>';
  }
  var host=$("dailyList"); host.innerHTML="";
  var done=!!S.daily.done.mission;
  var itemName=uxLegacy()?(L()==="pt"?"Missão do dia — 5 situações":"Daily mission — 5 scenarios"):t("daily.itemName");
  var item=document.createElement("div"); item.className="mission-item"+(done?" done":"");
  item.innerHTML='<span class="mem">'+(done?"✅":"📅")+'</span><div class="mtxt"><div class="mname">'+itemName+'</div><div class="mrew">'+t("daily.rewardLine")+'</div></div>';
  host.appendChild(item);
  var startBtn=$("dailyStartBtn");
  if(startBtn){
    if(done&&!uxLegacy()){
      startBtn.disabled=false;
      startBtn.textContent=t("daily.doneNext");
      startBtn.onclick=function(){ openMap(null,true); };
    } else {
      startBtn.disabled=done;
      startBtn.onclick=startDaily;
      startBtn.textContent=done?(L()==="pt"?"✅ Concluída hoje":"✅ Done today"):t("daily.play");
    }
  }
}
var WEEKLY=[
  {id:"correct", goal:20, ico:"🎯", name:{pt:"Acerte 20 situações",en:"Get 20 scenarios right"}},
  {id:"campaign", goal:3, ico:"🗺️", name:{pt:"Complete 3 jornadas no mapa",en:"Complete 3 map journeys"}},
  {id:"boss", goal:1, ico:"🎯", name:{pt:"Vença 1 simulação de crise",en:"Beat 1 crisis simulation"}},
  {id:"theme", goal:8, ico:"📚", themed:true, name:{pt:"Acerte 8 do tema da semana",en:"Get 8 on the week theme"}}
];
function ensureWeekly(){ if(S.weekly.week!==weekKey()){ S.weekly={week:weekKey(),prog:{}}; save(); } }
function bumpWeekly(id,n){ if(!n) return; ensureWeekly(); S.weekly.prog[id]=(S.weekly.prog[id]||0)+n; var w=WEEKLY.filter(function(x){return x.id===id;})[0]; if(w && S.weekly.prog[id]===w.goal){ addReward(40); toast((L()==="pt"?"🏆 Semanal concluída: ":"🏆 Weekly done: ")+tt(w.name)+" (+40 XP)"); } save(); renderWeekCard(); updateNavBadges(); }
function renderWeekly(){
  ensureWeekly();
  var wt=getWeekTheme();
  $("weeklyWeek").textContent=(L()==="pt"?"Semana ":"Week ")+S.weekly.week+" · "+t("weekly.theme")+": "+THEMES[wt].ico+" "+tt(THEMES[wt]);
  var host=$("weeklyList"); host.innerHTML="";
  var wp=S.weekly.prog||{};
  var hasProg=WEEKLY.some(function(w){ return (wp[w.id]||0)>0; });
  if(uxLegacy()&&!hasProg){
    host.innerHTML='<p class="weekly-empty muted">'+t("weekly.emptyStart")+'</p>';
    return;
  }
  WEEKLY.forEach(function(w){
    var p=Math.min(w.goal,S.weekly.prog[w.id]||0),pct=Math.round(p/w.goal*100),done=p>=w.goal;
    var label=tt(w.name);
    if(w.themed) label=(L()==="pt"?"Acerte 8 em ":"Get 8 on ")+tt(THEMES[wt]);
    if(uxLegacy()&&w.id==="campaign") label=(L()==="pt"?"Complete 3 campanhas":"Complete 3 campaigns");
    if(uxLegacy()&&w.id==="boss") label=(L()==="pt"?"Vença 1 crise":"Beat 1 crisis");
    var d=document.createElement("div"); d.className="mission-item"+(done?" done":"");
    var pts=uxLegacy()?"+40 XP":"+40 "+(L()==="pt"?"pontos":"points");
    d.innerHTML='<span class="mem">'+(done?"✅":w.ico)+'</span><div class="mtxt"><div class="mname">'+label+'</div><div class="mrew">'+p+"/"+w.goal+' • '+pts+'</div><div class="mini-bar" role="progressbar" aria-valuemin="0" aria-valuemax="'+w.goal+'" aria-valuenow="'+p+'"><span class="mf" style="width:'+pct+'%"></span></div></div>';
    host.appendChild(d);
  });
}

/* ==========================================================
   LOJA / SHOP
   ========================================================== */
function renderShop(){
  $("shopCoins").textContent=S.coins;
  function shopLabel(item,owned,eq,prefix){
    if(eq) return t("shop.equipped");
    if(owned) return t("shop.equip");
    if(item.cost===0) return t("shop.default");
    return "🪙 "+item.cost;
  }
  function renderGrid(list,hostId,prefix,equipKey,getCss){
    var host=$(hostId); if(!host) return;
    host.innerHTML="";
    list.forEach(function(a){
      var owned=a.cost===0||S.owned[prefix+"_"+a.id]||meetsUnlock(a);
      var eq=S.equipped[equipKey]===a.id||(equipKey==="avatar"&&S.equipped.avatar===a.ico);
      var d=document.createElement("button");
      d.className="shop-item"+(owned?" owned":"")+(eq?" equipped":"");
      d.title=tt(a.desc||a.name);
      var price=shopLabel(a,owned,eq,prefix);
      if(a.unlock&&!meetsUnlock(a)&&!S.owned[prefix+"_"+a.id]) price="🔒";
      d.innerHTML='<span class="si">'+a.ico+'</span><span class="sn">'+tt(a.name)+'</span><span class="sd">'+tt(a.desc||{pt:"",en:""})+'</span><span class="sn shop-price">'+price+'</span>';
      d.addEventListener("click",function(){ buyOrEquipCosmetic(prefix,equipKey,a,owned); });
      host.appendChild(d);
    });
  }
  renderGrid(AVATARS,"avatarShop","av","avatar");
  renderGrid(FRAMES,"frameShop","fr","frame");
  renderGrid(SKINS,"themeShop","sk","skin");
}
function buyOrEquipCosmetic(prefix,equipKey,a,owned){
  if(!owned&&!meetsUnlock(a)){ toast(L()==="pt"?"Complete Desafios / Crises para desbloquear":"Complete Challenges / Crises to unlock"); return; }
  if(!owned){
    if(S.coins<a.cost){ toast(L()==="pt"?"Moedas insuficientes":"Not enough coins"); return; }
    S.coins-=a.cost; S.owned[prefix+"_"+a.id]=true;
    toast(L()==="pt"?"Item desbloqueado!":"Item unlocked!");
  }
  if(equipKey==="avatar") S.equipped.avatar=a.ico;
  else S.equipped[equipKey]=a.id;
  refreshHud(); checkMedals(); save(); renderShop();
}

/* ==========================================================
   MEDALHAS
   ========================================================== */
function checkMedals(){ MEDALS.forEach(function(m){ if(!S.medals[m.id] && m.test()){ S.medals[m.id]=true; toast((L()==="pt"?"🏅 Conquista: ":"🏅 Achievement: ")+tt(m.name)); } }); save(); }
function renderMedals(host){ host.innerHTML=""; MEDALS.forEach(function(m){ var got=!!S.medals[m.id]; var d=document.createElement("div"); d.className="medal"+(got?"":" locked"); d.innerHTML='<span class="mi">'+m.ico+'</span><span class="mn">'+tt(m.name)+'</span>'; host.appendChild(d); }); }
function medalHint(id){ var h=MEDAL_HINTS[id]; return h?tt(h):id; }
function albumSlotTap(id){
  var m=MEDALS.filter(function(x){ return x.id===id; })[0]; if(!m) return;
  if(S.medals[m.id]) toast("🏅 "+t("profile.albumDone")+": "+tt(m.name));
  else toast("🔒 "+t("profile.albumLocked")+" — "+medalHint(id));
}
function renderAchievementAlbum(){
  var grid=$("albumSpread"), prog=$("albumProgress"); if(!grid) return;
  checkMedals();
  var earned=medalsEarned(), total=MEDALS.length, pct=Math.round(earned/Math.max(1,total)*100);
  if(prog){
    var complete=earned>=total;
    prog.innerHTML='<div class="album-progress-track" aria-hidden="true"><div class="album-progress-fill" style="width:'+pct+'%"></div></div>'+
      '<div class="album-progress-label"><strong>'+earned+'/'+total+'</strong> '+t("profile.albumCollected")+'</div>';
    var titleEl=$("albumSpreadTitle");
    if(titleEl) titleEl.textContent=complete?t("profile.albumComplete"):t("profile.albumSpreadTitle");
  }
  grid.innerHTML="";
  MEDALS.forEach(function(m,i){
    var got=!!S.medals[m.id], num=String(i+1).padStart(2,"0");
    var rarity=m.rarity||"common";
    var btn=document.createElement("button");
    btn.type="button";
    btn.className="album-slot"+(got?" is-earned":" is-missing")+(got?" rarity-"+rarity:"");
    btn.setAttribute("data-medal",m.id);
    btn.setAttribute("aria-label",(got?t("profile.albumDone"):t("profile.albumLocked"))+": "+tt(m.name));
    if(got){
      btn.innerHTML='<div class="album-sticker"><span class="album-sticker-shine" aria-hidden="true"></span><span class="album-sticker-corner" aria-hidden="true"></span><div class="album-sticker-art"><span class="album-sticker-ico" aria-hidden="true">'+m.ico+'</span></div><div class="album-sticker-footer"><span class="album-sticker-num">'+num+'</span><span class="album-sticker-sep">-</span><span class="album-sticker-name">'+tt(m.name)+'</span></div></div>';
    } else {
      btn.innerHTML='<div class="album-placeholder"><span class="album-placeholder-mark" aria-hidden="true">'+num+'</span><div class="album-placeholder-art"><span class="album-placeholder-lock" aria-hidden="true">🔒</span><span class="album-placeholder-ico" aria-hidden="true">'+m.ico+'</span></div><div class="album-placeholder-footer"><span class="album-placeholder-num">'+num+'</span><span class="album-placeholder-sep">-</span><span class="album-placeholder-name">'+tt(m.name)+'</span></div></div>';
    }
    btn.addEventListener("click",function(){ albumSlotTap(m.id); });
    grid.appendChild(btn);
  });
}

/* ==========================================================
   DASHBOARD + RADAR
   ========================================================== */
function renderBossProgress(){
  var host=$("bossProgressList"); if(!host) return;
  ensureBossStats();
  var avg=bossAvgIndex(), rank=bossGuardianRank(avg);
  var head=$("bossProgressHead");
  if(head) head.innerHTML='<span class="boss-prog-rank">'+rank.ico+' '+rank[L()]+'</span><span class="boss-prog-avg">'+t("profile.resIndex")+': <strong>'+avg+'%</strong> · '+bossCompletedCount()+'/'+BOSSES.length+'</span>';
  host.innerHTML="";
  BOSSES.forEach(function(b){
    var st=S.bossStats[b.id], best=st&&st.best, tier=best?bossTierInfo(best.tier):null;
    var row=document.createElement("div");
    row.className="boss-prog-row"+(best?"":" boss-prog-row--empty");
    var bar=best?bossBarHtml("maturity",best.index):"";
    row.innerHTML='<div class="boss-prog-top"><span class="boss-prog-ico">'+b.emoji+'</span><span class="boss-prog-name">'+tt(b.name)+'</span>'+
      (best?'<span class="boss-prog-tier">'+tier.ico+' '+best.index+'%</span>':'<span class="boss-prog-tier muted">'+t("boss.notPlayed")+'</span>')+
      '</div>'+(best?'<div class="boss-prog-bar">'+bar+'</div>':'');
    host.appendChild(row);
  });
}
function chainTotalStages(){ var ch=chainById(curChainId); return ch?ch.stages.length:0; }
function srsDueCount(){ return srsDueItems().length; }
function medalsEarned(){ var n=0; MEDALS.forEach(function(m){ if(S.medals[m.id]) n++; }); return n; }
function journeyCompletionPct(){
  var countries=Object.keys(S.done).length/Math.max(1,COUNTRIES.length)*40;
  var bosses=bossCompletedCount()/Math.max(1,BOSSES.length)*30;
  var medals=medalsEarned()/Math.max(1,MEDALS.length)*20;
  var chain=chainStagesDone()/Math.max(1,chainTotalStages())*10;
  return Math.min(100,Math.round(countries+bosses+medals+chain));
}
function nextMilestoneText(){
  if(Object.keys(S.done).length<10) return (L()==="pt"?"Conclua 10 países no mapa":"Complete 10 countries on the map");
  if(bossCompletedCount()<1) return (L()==="pt"?"Vença sua primeira crise":"Beat your first crisis");
  if(chainStagesDone()<3) return (L()==="pt"?"Proteja 3 etapas da Cadeia Norte":"Protect 3 Northern Chain stages");
  if(bossAvgIndex()<70) return (L()==="pt"?"Alcance 70% de maturidade em uma crise":"Reach 70% maturity in a crisis");
  if(medalsEarned()<6) return (L()==="pt"?"Desbloqueie mais conquistas":"Unlock more achievements");
  return (L()==="pt"?"Mantenha a sequência e revise temas fracos":"Keep your streak and review weak themes");
}
function weekPlayAction(){
  ensureDaily(); ensureWeekly();
  if(!S.daily.done.mission) return function(){ renderDaily(); show("screenDaily"); };
  if((S.weekly.prog.campaign||0)<3) return function(){ openMap(null,true,true); };
  if(bossCompletedCount()<1||(S.weekly.prog.boss||0)<1) return function(){ renderBossList(); show("screenBossList"); };
  return function(){ renderProfile(); show("screenProfile"); };
}
function applyFocusLearn(){
  var on=!!S.focusLearn;
  document.body.classList.toggle("focus-learn",on);
}
function computeNextStep(){
  ensureDaily(); ensureWeekly();
  var due=srsDueCount();
  if(!S.daily.done.mission){
    return {ico:"📅",title:t("home.nextDaily"),sub:t("home.nextDailySub"),btn:t("home.nextGoDaily"),act:function(){ renderDaily(); show("screenDaily"); }};
  }
  if(due>0){
    return {ico:"📚",title:t("home.nextReview"),sub:t("home.nextReviewSub").replace("{n}",String(due)),btn:t("home.nextGoReview"),act:startReviewErrors};
  }
  if((S.weekly.prog.campaign||0)<3){
    return {ico:"🗺️",title:t("home.nextContinue"),sub:t("home.nextCampaignSub"),btn:t("home.nextGoMap"),act:function(){ openMap(null,true,true); }};
  }
  return {ico:"🎯",title:t("home.nextBoss"),sub:t("home.nextBossSub"),btn:t("home.nextGoBoss"),act:function(){ renderBossList(); show("screenBossList"); }};
}
function renderNextStep(){
  var card=$("nextStepCard"); if(!card) return;
  var hero=$("homeHeroActions");
  applyHeroCompact();
  renderHomeLoopPreview();
  renderHomeHowStrip();
  renderHeroUxState();
  renderUxBanner();
  updateHomeCtaLayout();
  if(!S.onboardingDone){ card.hidden=true; if(hero) hero.hidden=false; renderHomeStickyCta(); return; }
  if(hero) hero.hidden=true;
  var ns=computeNextStep();
  var ico=$("nextStepIco"), ti=$("nextStepTitle"), sub=$("nextStepSub"), btn=$("nextStepBtn");
  var wkBtn=$("nextStepWeeklyBtn"), preview=$("nextStepPreview"), ctaHint=$("nextStepCtaHint");
  if(ico) ico.textContent=ns.ico;
  if(ti) ti.textContent=ns.title;
  if(sub) sub.textContent=ns.sub;
  if(btn){ btn.textContent=ns.btn||t("home.playNow"); btn.onclick=playNow; }
  if(ctaHint){
    var hint=uxLegacy()?"":computeCtaHint(ns);
    ctaHint.textContent=hint;
    ctaHint.hidden=!hint;
    ctaHint.setAttribute("aria-hidden",hint?"false":"true");
  }
  if(wkBtn) wkBtn.hidden=true;
  var stepK=$("nextStepK");
  if(stepK) stepK.textContent=t("home.nextStepK");
  if(preview){
    var pv=nextStepPreviewText(ns);
    if(pv&&!uxLegacy()){ preview.hidden=false; preview.textContent=t("home.nextPreview").replace("{next}",pv); }
    else preview.hidden=true;
  }
  card.classList.toggle("next-step-ux-v2",!uxLegacy());
  renderStreakCard();
  renderHomeProfileBadges();
  renderWeekLine();
  renderHomeNextAchievement();
  renderHomeTeamSocial();
  renderFirstDayHint();
  card.hidden=false;
  renderHomeStickyCta();
}
function applyHeroCompact(){
  var card=$("heroCard"), exp=$("heroExpandable"), btn=$("heroExpandBtn");
  if(!card) return;
  var compact=!!S.onboardingDone&&!S.heroExpanded;
  card.classList.toggle("hero-compact",compact);
  if(exp){
    if(!uxLegacy()&&!S.onboardingDone) exp.hidden=!S.heroExpanded;
    else exp.hidden=compact;
  }
  if(btn){
    btn.hidden=uxLegacy()?!S.onboardingDone:false;
    if(!btn.hidden) btn.textContent=S.heroExpanded?t("home.collapse"):t("home.expand");
  }
  renderHeroUxState();
}
function updateSetupBanner(){
  var ban=$("setupBanner"); if(!ban) return;
  var onSetup=$("screenSetup")&&$("screenSetup").classList.contains("active");
  var showBanner=S.onboardingDone&&!setupComplete()&&!onSetup;
  ban.hidden=!showBanner;
}
function weeklyPendingCount(){
  ensureWeekly();
  var n=0, wp=S.weekly.prog||{};
  WEEKLY.forEach(function(w){ if((wp[w.id]||0)<w.goal) n++; });
  return n;
}
function renderPostSessionActions(hostId,withWeekly){
  var host=$(hostId); if(!host) return;
  host.innerHTML="";
  var ns=computeNextStep();
  var lab=document.createElement("div"); lab.className="post-session-k"; lab.textContent=t("result.next"); host.appendChild(lab);
  var primary=document.createElement("button");
  primary.className="btn btn-primary";
  primary.textContent=ns.btn||t("home.playNow");
  primary.onclick=function(){ ns.act(); };
  host.appendChild(primary);
  if(withWeekly){
    var wk=document.createElement("button");
    wk.className="btn btn-ghost";
    wk.textContent=t("result.weekly");
    wk.onclick=function(){ openWeeklyScreen(); };
    host.appendChild(wk);
  }
  var home=document.createElement("button");
  home.className="btn btn-ghost";
  home.textContent=t("result.home");
  home.onclick=function(){ show("screenHome"); };
  host.appendChild(home);
}
function renderWeekLine(){
  var host=$("nextStepWeek"), goalEl=$("weekNextGoal"), chips=$("weekChips");
  ensureWeekly(); ensureDaily();
  var wp=S.weekly.prog||{}, wt=getWeekTheme();
  if(uxLegacy()){
    if(host){
      host.hidden=false;
      var daily=S.daily.done.mission?(L()==="pt"?"✅ Feita":"✅ Done"):(L()==="pt"?"Pendente":"Pending");
      host.textContent=t("home.weekLine")
        .replace("{theme}",THEMES[wt].ico+" "+tt(THEMES[wt]))
        .replace("{correct}",String(wp.correct||0))
        .replace("{campaign}",String(wp.campaign||0))
        .replace("{daily}",daily);
    }
    if(goalEl) goalEl.textContent="";
    if(chips){ chips.hidden=true; chips.innerHTML=""; }
  } else {
    if(host){ host.hidden=true; host.textContent=""; }
    var micro=getWeekMicroGoal();
    if(goalEl){
      goalEl.textContent=micro.key==="done"?micro.text:(t("home.weekMicroPrefix")+" "+micro.text);
    }
    if(chips){
      var chipData=[
        {id:"correct",ico:"🎯",cur:wp.correct||0,goal:20},
        {id:"campaign",ico:"🗺️",cur:wp.campaign||0,goal:3},
        {id:"boss",ico:"🎯",cur:wp.boss||0,goal:1}
      ];
      chips.innerHTML="";
      chipData.forEach(function(c){
        var done=c.cur>=c.goal;
        var b=document.createElement("button");
        b.type="button";
        b.className="week-chip"+(done?" done":"");
        b.setAttribute("role","listitem");
        b.textContent=c.ico+" "+c.cur+"/"+c.goal;
        b.onclick=openWeeklyScreen;
        chips.appendChild(b);
      });
      chips.hidden=false;
    }
  }
  renderWeekProgressBar();
}
function setFocusLearn(on){
  S.focusLearn=!!on; save(); applyFocusLearn(); refreshHud();
  var a=$("optFocusLearn"), b=$("optFocusLearnProfile");
  if(a) a.checked=S.focusLearn; if(b) b.checked=S.focusLearn;
}
function setManagerMode(on){
  S.managerMode=!!on; save(); updateManagerNav();
  var a=$("optManager");
  if(a) a.checked=S.managerMode;
}
function renderWeekCard(){ renderWeekLine(); }
function renderCompletionCard(){
  var host=$("completionBody"); if(!host) return;
  var pct=journeyCompletionPct();
  host.innerHTML='<div class="completion-ring">'+pct+'%</div><div class="completion-meta">'
    +Object.keys(S.done).length+'/'+COUNTRIES.length+' '+(L()==="pt"?"países":"countries")+' · '
    +bossCompletedCount()+'/'+BOSSES.length+' '+(L()==="pt"?"crises":"challenges")+' · '
    +chainStagesDone()+'/'+chainTotalStages()+' '+(L()==="pt"?"etapas cadeia":"chain stages")+' · '
    +medalsEarned()+'/'+MEDALS.length+' '+(L()==="pt"?"conquistas":"achievements")
    +'</div><div class="completion-milestone"><b>'+t("profile.nextMilestone")+':</b> '+nextMilestoneText()+'</div>';
}
function renderReviewSection(){
  var host=$("reviewActions"); if(!host) return;
  host.innerHTML='';
  var due=srsDueCount();
  var tr=document.createElement("button");
  tr.className="btn btn-primary btn-sm";
  tr.textContent=due?t("profile.reviewTrainDue").replace("{n}",String(due)):t("profile.reviewTrain");
  tr.onclick=startReviewErrors;
  host.appendChild(tr);
  var lk=document.createElement("button"); lk.className="btn btn-ghost btn-sm"; lk.textContent=t("profile.reviewBank");
  lk.onclick=function(){ if(typeof window.initReviewBank==="function") window.initReviewBank(); show("screenReview"); };
  host.appendChild(lk);
}
function renderCertChecklist(){
  var host=$("certChecklist"); if(!host) return;
  var items=[
    {ok:Object.keys(S.done).length>=10, pt:"10 países no mapa", en:"10 countries on the map"},
    {ok:bossCompletedCount()>=4, pt:"4 crises vencidas", en:"4 crises beaten"},
    {ok:bossAvgIndex()>=70, pt:"70% maturidade média em Desafios / Crises", en:"70% average maturity in Challenges / Crises"},
    {ok:(S.streak&&S.streak.best>=7), pt:"Ofensiva de 7 dias", en:"7-day streak"}
  ];
  host.innerHTML='<div class="cert-check-k">'+t("profile.certCheckTitle")+'</div>';
  items.forEach(function(it){
    var d=document.createElement("div"); d.className="cert-check-item"+(it.ok?" done":"");
    d.textContent=(it.ok?"✅":"⬜")+" "+(L()==="pt"?it.pt:it.en);
    host.appendChild(d);
  });
}
function exportProgress(){
  var blob=new Blob([JSON.stringify(S,null,2)],{type:"application/json"});
  var a=document.createElement("a"); a.href=URL.createObjectURL(blob);
  a.download="guardiao-orbita-"+(S.name||"jogador").replace(/\s+/g,"-")+".json";
  a.click(); URL.revokeObjectURL(a.href);
}
function importProgress(file){
  var reader=new FileReader();
  reader.onload=function(){
    try{
      var data=JSON.parse(reader.result);
      if(!data||typeof data!=="object") throw 0;
      S=merge(data,DEF); save();
      toast(t("profile.importOk"));
      location.reload();
    }catch(e){ toast(t("profile.importErr")); }
  };
  reader.readAsText(file);
}
function renderProgressHub(){
  var host=$("progressHub"); if(!host) return;
  ensureWeekly(); ensureBossStats();
  var wp=S.weekly.prog||{};
  host.innerHTML=
    '<div class="prog-hub-grid">'+
      '<div class="prog-hub-item"><span class="prog-hub-ico">🗺️</span><div><div class="prog-hub-t">'+t("progress.map")+'</div><div class="prog-hub-d">'+t("progress.mapD")+'</div><div class="prog-hub-m">'+Object.keys(S.done).length+'/'+COUNTRIES.length+' · '+(wp.campaign||0)+'/3</div></div></div>'+
      '<div class="prog-hub-item"><span class="prog-hub-ico">📅</span><div><div class="prog-hub-t">'+t("progress.daily")+'</div><div class="prog-hub-d">'+t("progress.dailyD")+'</div><div class="prog-hub-m">🔥 '+(S.streak.count||0)+' · '+(wp.correct||0)+'/20</div></div></div>'+
      '<div class="prog-hub-item"><span class="prog-hub-ico">🐉</span><div><div class="prog-hub-t">'+t("progress.boss")+'</div><div class="prog-hub-d">'+t("progress.bossD")+'</div><div class="prog-hub-m">'+progressBossMetrics()+'</div><div class="prog-hub-note muted">'+t("progress.bossNote")+'</div></div></div>'+
      '<div class="prog-hub-item"><span class="prog-hub-ico">🏆</span><div><div class="prog-hub-t">'+t("progress.weekly")+'</div><div class="prog-hub-d">'+t("progress.weeklyD")+'</div><div class="prog-hub-m">'+(wp.theme||0)+'/8 '+tt(THEMES[getWeekTheme()])+'</div></div></div>'+
    '</div>';
}
function renderProfile(){
  var lab=L()==="pt"?{a:"Nível",b:"XP",c:"Ofensiva",d:"Maturidade",e:"Reportes"}:{a:"Level",b:"XP",c:"Streak",d:"Maturity",e:"Reports"};
  ensureStreak(); ensureBossStats();
  var avg=bossAvgIndex(), br=bossGuardianRank(avg);
  var lp=levelProgress();
  $("profileStats").innerHTML='<div class="stat"><div class="v">'+levelOf()+'/'+MAX_LEVEL+'</div><div class="l">'+lab.a+(lp.max?"":(" · "+lp.pct+"%"))+'</div></div><div class="stat"><div class="v">'+S.xp+'/'+xpForMaxLevel()+'</div><div class="l">'+lab.b+'</div></div><div class="stat"><div class="v">🔥 '+(S.streak.count||0)+'</div><div class="l">'+lab.c+'</div></div><div class="stat"><div class="v">'+br.ico+' '+avg+'%</div><div class="l">'+lab.d+'</div></div><div class="stat"><div class="v">📢 '+(S.reports||0)+'</div><div class="l">'+lab.e+'</div></div>';
  renderCompletionCard(); renderReviewSection(); renderCertChecklist();
  renderBossProgress(); renderPedagogyRec("pedagogyRec"); drawRadar(); renderRank($("profileRank")); renderAchievementAlbum(); renderCertificatePreview();
}
function certTeamRole(){
  var team="", role="";
  TEAMS.forEach(function(tm){ if(tm.id===S.team) team=tt(tm); });
  ROLES.forEach(function(r){ if(r.id===S.role) role=r[L()]; });
  return {team:team,role:role};
}
function certEllipsis(ctx,text,maxW){
  if(ctx.measureText(text).width<=maxW) return text;
  var t=text;
  while(t.length>1&&ctx.measureText(t+"…").width>maxW) t=t.slice(0,-1);
  return t+"…";
}
function certRoundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}
function certDrawAchievements(ctx,W,startY){
  checkMedals();
  var earned=MEDALS.filter(function(m){ return !!S.medals[m.id]; }).length;
  var cols=3, padX=56, usableW=W-padX*2, cellW=usableW/cols, cellH=56;
  ctx.textAlign="center";
  ctx.fillStyle="#005f5c"; ctx.font="700 13px Segoe UI,sans-serif";
  ctx.fillText("🏅 "+t("profile.certAch")+" ("+earned+"/"+MEDALS.length+")", W/2, startY);
  ctx.strokeStyle="#e8e8e8"; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(100,startY+8); ctx.lineTo(W-100,startY+8); ctx.stroke();
  MEDALS.forEach(function(m,i){
    var col=i%cols, row=Math.floor(i/cols);
    var cx=padX+col*cellW+cellW/2;
    var cardX=padX+col*cellW+8, cardY=startY+18+row*cellH;
    var cardW=cellW-16, cardH=cellH-10;
    var got=!!S.medals[m.id];
    ctx.save();
    ctx.globalAlpha=got?1:0.45;
    if(got){ ctx.fillStyle="#f4faf9"; ctx.strokeStyle="#007E7A"; }
    else { ctx.fillStyle="#f5f5f5"; ctx.strokeStyle="#c8d4d8"; }
    ctx.lineWidth=got?1.5:1;
    certRoundRect(ctx,cardX,cardY,cardW,cardH,6);
    ctx.fill(); ctx.stroke();
    ctx.textAlign="center";
    ctx.font=(got?"700":"600")+" 20px Segoe UI Emoji,Segoe UI,sans-serif";
    ctx.fillStyle=got?"#1a1a1a":"#8a9aa0";
    ctx.fillText(m.ico, cx, cardY+24);
    ctx.font=(got?"700":"500")+" 8.5px Segoe UI,sans-serif";
    var label=certEllipsis(ctx, tt(m.name), cardW-10);
    ctx.fillText(label, cx, cardY+40);
    ctx.restore();
  });
  return startY+18+Math.ceil(MEDALS.length/cols)*cellH+10;
}
function certDrawStats(ctx,W,startY,stats){
  var cols=3, padX=70, usableW=W-padX*2, colW=usableW/cols, rowH=38;
  ctx.textAlign="center";
  stats.forEach(function(row,i){
    var col=i%cols, r=Math.floor(i/cols);
    var cx=padX+col*colW+colW/2;
    var y=startY+r*rowH;
    ctx.font="600 10px Segoe UI,sans-serif";
    ctx.fillStyle="#5c706e";
    ctx.fillText(row[0], cx, y);
    ctx.font="700 15px Segoe UI,sans-serif";
    ctx.fillStyle="#1a1a1a";
    ctx.fillText(row[1], cx, y+18);
  });
  return startY+Math.ceil(stats.length/cols)*rowH+10;
}
function certDrawResilienceSeal(ctx,W,startY,pt){
  var earned=!!(S.medals.bossResil||S.medals.bossLegend);
  var avg=bossAvgIndex(), rank=bossGuardianRank(avg);
  var y=startY;
  ctx.textAlign="center";
  ctx.fillStyle="#005f5c"; ctx.font="700 12px Segoe UI,sans-serif";
  ctx.fillText(pt?"🛡️ Selo de Resiliência Operacional":"🛡️ Operational Resilience Seal", W/2, y);
  var cx=W/2, cy=y+30, r=22;
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
  ctx.fillStyle=earned?"#fff8e6":"#f0f0f0"; ctx.fill();
  ctx.strokeStyle=earned?"#ECB11F":"#c8d4d8"; ctx.lineWidth=earned?3:1.5; ctx.stroke();
  ctx.font="700 20px Segoe UI Emoji,Segoe UI,sans-serif";
  ctx.fillStyle=earned?"#1a1a1a":"#8a9aa0";
  ctx.fillText(earned?rank.ico:"🔒", cx, cy+6);
  ctx.font=(earned?"600":"500")+" 9px Segoe UI,sans-serif";
  ctx.fillStyle=earned?"#005f5c":"#8a9aa0";
  var sealTxt=earned?(rank[pt?"pt":"en"]+" · "+avg+"%"):(pt?"Conclua Desafios / Crises com alta maturidade":"Complete Challenges / Crises with high maturity");
  ctx.fillText(certEllipsis(ctx,sealTxt,W-100), W/2, y+62);
  return y+72;
}
var certViewMode="card";
function setCertView(mode){
  certViewMode=mode==="full"?"full":"card";
  var wrap=$("certPreviewWrap"), bc=$("certViewCardBtn"), bf=$("certViewFullBtn");
  if(wrap) wrap.classList.toggle("cert-preview-wrap--card",certViewMode==="card");
  if(bc) bc.classList.toggle("on",certViewMode==="card");
  if(bf) bf.classList.toggle("on",certViewMode==="full");
  if(bc) bc.setAttribute("aria-selected",certViewMode==="card"?"true":"false");
  if(bf) bf.setAttribute("aria-selected",certViewMode==="full"?"true":"false");
  renderCertificatePreview();
}
function certCardTier(avg){
  if(avg>=75) return {outer1:"#3a2c0a",outer2:"#171004",inner:"#ECB11F",accent:"#c9920d",glow:"#fff4cc",face1:"#241a08",face2:"#120c02",label:"legendary",labelTxt:{pt:"LENDÁRIO",en:"LEGENDARY"},chipAccent:"#c9920d"};
  if(avg>=50) return {outer1:"#0f3d3a",outer2:"#06181a",inner:"#5ec4be",accent:"#007E7A",glow:"#e8f6f5",face1:"#0c2622",face2:"#081613",label:"rare",labelTxt:{pt:"RARO",en:"RARE"},chipAccent:"#007E7A"};
  return {outer1:"#3d2a1c",outer2:"#1c130a",inner:"#d4a574",accent:"#b87333",glow:"#f5ebe0",face1:"#241a12",face2:"#140f0a",label:"common",labelTxt:{pt:"COMUM",en:"COMMON"},chipAccent:"#b87333"};
}
function teamIcon(id){ var r="🛡️"; TEAMS.forEach(function(tm){ if(tm.id===id) r=tm.ico; }); return r; }
function certDrawGem(ctx,cx,cy,r,fill,stroke){
  ctx.save(); ctx.translate(cx,cy); ctx.rotate(Math.PI/4);
  ctx.fillStyle=fill; ctx.fillRect(-r,-r,r*2,r*2);
  if(stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=1; ctx.strokeRect(-r,-r,r*2,r*2); }
  ctx.restore();
}
function certDrawDivider(ctx,cx,y,halfW,color){
  ctx.save();
  ctx.strokeStyle=color; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(cx-halfW,y); ctx.lineTo(cx-9,y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+9,y); ctx.lineTo(cx+halfW,y); ctx.stroke();
  certDrawGem(ctx,cx,y,3,color);
  ctx.restore();
}
function certDrawChip(ctx,x,y,w,h,ico,value,label,accent){
  certRoundRect(ctx,x,y,w,h,7);
  ctx.fillStyle="rgba(255,255,255,0.94)"; ctx.fill();
  ctx.lineWidth=1; ctx.strokeStyle="rgba(0,60,58,0.22)"; ctx.stroke();
  var cx=x+17, cy=y+h/2, r=12;
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fillStyle=accent; ctx.fill();
  ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.font="12px Segoe UI Emoji,Segoe UI,sans-serif"; ctx.fillStyle="#fff";
  ctx.fillText(ico,cx,cy+1);
  ctx.textBaseline="alphabetic"; ctx.textAlign="left";
  ctx.font="800 12.5px Segoe UI,sans-serif"; ctx.fillStyle="#0f2a28";
  ctx.fillText(certEllipsis(ctx,value,w-38),x+35,y+h*0.45);
  ctx.font="600 7.4px Segoe UI,sans-serif"; ctx.fillStyle="#5c706e";
  ctx.fillText(certEllipsis(ctx,label,w-38),x+35,y+h*0.78);
}
function certCardTypeLine(tr){
  var parts=[t("profile.certCardType")];
  if(tr.role) parts.push(tr.role);
  if(tr.team) parts.push(tr.team);
  return parts.join(" — ");
}
function certDrawCreamStatLine(ctx,x,y,w,line,accent){
  ctx.textAlign="left"; ctx.textBaseline="middle";
  var cx=x+12, cy=y+10;
  ctx.beginPath(); ctx.arc(cx,cy,9,0,Math.PI*2); ctx.fillStyle=accent; ctx.fill();
  ctx.textAlign="center"; ctx.font="10px Segoe UI Emoji,Segoe UI,sans-serif"; ctx.fillStyle="#fff";
  ctx.fillText(line.ico,cx,cy+1);
  ctx.textAlign="left"; ctx.font="600 10px Segoe UI,sans-serif"; ctx.fillStyle="#1f2f34";
  ctx.fillText(certEllipsis(ctx,line.txt,w-34),x+26,y+10);
}
function certCardArt(ctx,x,y,w,h,teamId){
  var sky=ctx.createLinearGradient(x,y,x,y+h);
  sky.addColorStop(0,"#4a90b8"); sky.addColorStop(0.55,"#7eb8d4"); sky.addColorStop(1,"#c4dde8");
  ctx.fillStyle=sky; ctx.fillRect(x,y,w,h);
  ctx.save();
  ctx.beginPath(); ctx.rect(x,y,w,h); ctx.clip();
  var gnd=y+h*0.62;
  ctx.fillStyle="#3d5c3a"; ctx.fillRect(x,gnd,w,h-(gnd-y));
  ctx.strokeStyle="rgba(255,255,255,0.08)"; ctx.lineWidth=1;
  for(var iso=0;iso<6;iso++){
    var iy=gnd-4-iso*10;
    ctx.beginPath(); ctx.moveTo(x,iy); ctx.lineTo(x+w,iy); ctx.stroke();
  }
  if(teamId==="mina"){
    for(var i=0;i<4;i++){
      var tx=x+18+i*88, th=h*0.22+i*6;
      ctx.fillStyle=i%2?"#6b4f3a":"#5a4030";
      ctx.beginPath(); ctx.moveTo(tx,gnd); ctx.lineTo(tx+70,gnd); ctx.lineTo(tx+50,gnd-th); ctx.lineTo(tx-10,gnd-th); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle="#2a2a2a"; certRoundRect(ctx,x+w*0.12,gnd-28,w*0.35,22,4); ctx.fill();
    ctx.fillStyle="#ECB11F"; ctx.fillRect(x+w*0.14,gnd-24,w*0.08,10);
  } else if(teamId==="ferrovia"){
    ctx.strokeStyle="#444"; ctx.lineWidth=3;
    for(var r=0;r<3;r++){ var ry=gnd-8-r*18; ctx.beginPath(); ctx.moveTo(x,ry); ctx.lineTo(x+w,ry); ctx.stroke(); }
    ctx.fillStyle="#2a2a2a"; ctx.fillRect(x+w*0.55,gnd-42,48,34);
    ctx.fillStyle="#007E7A"; ctx.fillRect(x+w*0.58,gnd-36,36,12);
  } else if(teamId==="porto"){
    ctx.fillStyle="#1e4a6e"; ctx.fillRect(x,gnd-6,w,10);
    ctx.fillStyle="#5a6a78"; ctx.fillRect(x+w*0.62,gnd-52,10,46);
    ctx.fillStyle="#3d4f55"; ctx.beginPath(); ctx.moveTo(x+w*0.08,gnd-4); ctx.lineTo(x+w*0.42,gnd-4); ctx.lineTo(x+w*0.38,gnd-22); ctx.lineTo(x+w*0.12,gnd-22); ctx.closePath(); ctx.fill();
    ctx.fillStyle="#ECB11F"; ctx.fillRect(x+w*0.64,gnd-58,22,6);
  } else if(teamId==="corporativo"){
    ctx.fillStyle="#5c6a72";
    [0.1,0.28,0.46,0.64].forEach(function(fx,i){
      var bh=38+i*14; ctx.fillRect(x+w*fx,gnd-bh,w*0.14,bh);
      ctx.fillStyle="#7a8a94"; ctx.fillRect(x+w*(fx+0.02),gnd-bh-18,w*0.04,6); ctx.fillStyle="#5c6a72";
    });
  } else if(teamId==="ot"){
    ctx.fillStyle="#6a7078"; ctx.fillRect(x+w*0.08,gnd-48,w*0.55,48);
    ctx.fillStyle="#8a9098"; for(var p=0;p<4;p++) ctx.fillRect(x+w*0.1+p*22,gnd-40,8,28);
    ctx.strokeStyle="#ECB11F"; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x+w*0.7,gnd-30); ctx.lineTo(x+w*0.92,gnd-18); ctx.stroke();
  } else if(teamId==="ti"){
    ctx.fillStyle="rgba(0,126,122,0.25)";
    for(var gx=0;gx<8;gx++) for(var gy=0;gy<5;gy++) ctx.fillRect(x+gx*(w/8),y+gy*(h*0.35/5),w/8-2,h*0.35/5-2);
    ctx.font="48px Segoe UI Emoji,sans-serif"; ctx.textAlign="center"; ctx.fillText("🛡️",x+w/2,y+h*0.38);
  } else if(teamId==="logistica"){
    ctx.fillStyle="#8B6914"; certRoundRect(ctx,x+w*0.1,gnd-34,w*0.22,28,3); ctx.fill();
    certRoundRect(ctx,x+w*0.36,gnd-28,w*0.18,22,3); ctx.fill();
    ctx.fillStyle="#2a2a2a"; ctx.fillRect(x+w*0.12,gnd-12,w*0.5,8);
  } else if(teamId==="energia"){
    ctx.fillStyle="#6a7a88"; ctx.fillRect(x+w*0.68,gnd-56,8,56);
    ctx.fillStyle="#e8e8e8"; for(var b=0;b<3;b++) ctx.fillRect(x+w*0.5+b*28,gnd-36,20,4);
    ctx.font="36px Segoe UI Emoji,sans-serif"; ctx.textAlign="center"; ctx.fillText("⚡",x+w*0.32,y+h*0.42);
  } else if(teamId==="projetos"){
    ctx.strokeStyle="rgba(0,126,122,0.45)"; ctx.lineWidth=1;
    for(var lx=0;lx<10;lx++){ ctx.beginPath(); ctx.moveTo(x+lx*(w/10),y); ctx.lineTo(x+lx*(w/10),gnd); ctx.stroke(); }
    for(var ly=0;ly<8;ly++){ ctx.beginPath(); ctx.moveTo(x,y+ly*(h*0.55/8)); ctx.lineTo(x+w,y+ly*(h*0.55/8)); ctx.stroke(); }
    ctx.strokeStyle="#ECB11F"; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x+w*0.2,y+h*0.45); ctx.lineTo(x+w*0.55,y+h*0.28); ctx.lineTo(x+w*0.82,y+h*0.4); ctx.stroke();
  } else if(teamId==="esg"){
    ctx.fillStyle="#2d6a3e"; ctx.beginPath(); ctx.arc(x+w*0.78,y+h*0.28,22,0,Math.PI*2); ctx.fill();
    ctx.font="40px Segoe UI Emoji,sans-serif"; ctx.textAlign="center"; ctx.fillText("🌿",x+w*0.35,y+h*0.42);
  } else {
    ctx.fillStyle="#007E7A";
    [[0.25,0.35],[0.55,0.28],[0.72,0.45],[0.4,0.55]].forEach(function(dot){
      ctx.beginPath(); ctx.arc(x+w*dot[0],y+h*dot[1],5,0,Math.PI*2); ctx.fill();
    });
    ctx.strokeStyle="#ECB11F"; ctx.lineWidth=2; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.moveTo(x+w*0.25,y+h*0.35); ctx.lineTo(x+w*0.55,y+h*0.28); ctx.lineTo(x+w*0.72,y+h*0.45); ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
  var vg=ctx.createRadialGradient(x+w/2,y+h*0.42,h*0.15,x+w/2,y+h*0.5,w*0.72);
  vg.addColorStop(0,"rgba(0,0,0,0)"); vg.addColorStop(1,"rgba(0,0,0,0.4)");
  ctx.save(); certRoundRect(ctx,x,y,w,h,6); ctx.clip(); ctx.fillStyle=vg; ctx.fillRect(x,y,w,h); ctx.restore();
  ctx.strokeStyle="rgba(0,0,0,0.35)"; ctx.lineWidth=1; ctx.strokeRect(x+0.5,y+0.5,w-1,h-1);
}
function renderCertificateCard(){
  var cv=$("certCanvas"); if(!cv||!cv.getContext) return;
  var W=400,H=580,pt=L()==="pt";
  var dpr=Math.max(1,Math.min(window.devicePixelRatio||1,3));
  cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
  var ctx=cv.getContext("2d"); ctx.setTransform(dpr,0,0,dpr,0,0);
  var title=currentTitle(),tr=certTeamRole(),tier=certCardTier(bossAvgIndex());
  var name=(S.name&&S.name.trim())?S.name.trim():(pt?"Guardião Cibernético":"Cyber Guardian");
  var dateStr=new Date().toLocaleDateString(pt?"pt-BR":"en-US",{year:"numeric",month:"short",day:"numeric"});
  var avgRes=bossAvgIndex(),resRank=bossGuardianRank(avgRes);
  checkMedals();
  var achEarned=MEDALS.filter(function(m){ return !!S.medals[m.id]; }).length;
  var lvShort=t("profile.certCardLvShort"), lvLbl=t("profile.certCardLevel");

  ctx.fillStyle="#050d11"; certRoundRect(ctx,0,0,W,H,20); ctx.fill();
  if(tier.label==="legendary"){
    ctx.save(); ctx.shadowColor=tier.inner; ctx.shadowBlur=24;
    certRoundRect(ctx,3,3,W-6,H-6,19); ctx.fillStyle="rgba(236,177,31,0.12)"; ctx.fill(); ctx.restore();
  }

  var bezelGrad=ctx.createLinearGradient(0,0,W,H);
  bezelGrad.addColorStop(0,"#c9a227"); bezelGrad.addColorStop(0.35,tier.outer1); bezelGrad.addColorStop(1,tier.outer2);
  certRoundRect(ctx,4,4,W-8,H-8,18); ctx.fillStyle=bezelGrad; ctx.fill();
  ctx.save(); certRoundRect(ctx,4,4,W-8,H-8,18); ctx.clip();
  var sheen=ctx.createLinearGradient(0,0,W,H*0.45);
  sheen.addColorStop(0,"rgba(255,255,255,0.22)"); sheen.addColorStop(0.4,"rgba(255,255,255,0.04)"); sheen.addColorStop(1,"rgba(255,255,255,0)");
  ctx.fillStyle=sheen; ctx.fillRect(0,0,W,H*0.45);
  ctx.restore();

  var faceGrad=ctx.createLinearGradient(0,16,0,H-16);
  faceGrad.addColorStop(0,tier.face1); faceGrad.addColorStop(1,tier.face2);
  certRoundRect(ctx,14,14,W-28,H-28,12); ctx.fillStyle=faceGrad; ctx.fill();
  ctx.lineWidth=1.5; ctx.strokeStyle=tier.inner; ctx.stroke();
  [[15,15],[W-15,15],[15,H-15],[W-15,H-15]].forEach(function(p){ certDrawGem(ctx,p[0],p[1],4,tier.inner,"rgba(0,0,0,.45)"); });

  var headY=22, headH=28;
  ctx.fillStyle="rgba(0,0,0,0.42)"; certRoundRect(ctx,22,headY,W-44,headH,6); ctx.fill();
  ctx.textAlign="left"; ctx.textBaseline="middle";
  ctx.fillStyle="#eaf2f6"; ctx.font="700 13px Segoe UI,sans-serif";
  ctx.fillText(certEllipsis(ctx,name,W-130),30,headY+headH/2);
  ctx.textAlign="right"; ctx.font="700 12px Segoe UI,sans-serif"; ctx.fillStyle=tier.glow;
  ctx.fillText(lvShort+" "+levelOf(),W-30,headY+headH/2);
  ctx.textBaseline="alphabetic"; ctx.textAlign="left";

  var artX=26,artY=58,artW=W-52,artH=178;
  certRoundRect(ctx,artX,artY,artW,artH,7); ctx.save(); ctx.clip();
  certCardArt(ctx,artX,artY,artW,artH,S.team||"");
  ctx.restore();
  certRoundRect(ctx,artX,artY,artW,artH,7); ctx.lineWidth=2; ctx.strokeStyle=tier.inner; ctx.stroke();

  var tlabel=tier.labelTxt[pt?"pt":"en"];
  ctx.font="800 7.5px Segoe UI,sans-serif";
  var tlw=ctx.measureText(tlabel).width+14;
  ctx.fillStyle="rgba(4,10,13,0.78)"; certRoundRect(ctx,artX+7,artY+7,tlw,15,4); ctx.fill();
  ctx.strokeStyle=tier.inner; ctx.lineWidth=1; ctx.stroke();
  ctx.textAlign="center"; ctx.fillStyle=tier.inner;
  ctx.fillText(tlabel,artX+7+tlw/2,artY+7+10.5);
  ctx.textAlign="left";

  var typeY=artY+artH+10,typeH=24;
  ctx.fillStyle="#0a1218"; certRoundRect(ctx,22,typeY,W-44,typeH,5); ctx.fill();
  ctx.lineWidth=1; ctx.strokeStyle=tier.inner; ctx.stroke();
  ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.font="600 9.5px Segoe UI,sans-serif"; ctx.fillStyle="#eaf2f6";
  ctx.fillText(certEllipsis(ctx,certCardTypeLine(tr),W-52),W/2,typeY+typeH/2);
  ctx.textBaseline="alphabetic"; ctx.textAlign="left";

  var creamY=typeY+typeH+10,creamH=188,creamW=W-44;
  var creamGrad=ctx.createLinearGradient(22,creamY,22,creamY+creamH);
  creamGrad.addColorStop(0,"#faf6ee"); creamGrad.addColorStop(1,"#efe6d4");
  certRoundRect(ctx,22,creamY,creamW,creamH,8); ctx.fillStyle=creamGrad; ctx.fill();
  ctx.lineWidth=1; ctx.strokeStyle="rgba(180,160,120,0.45)"; ctx.stroke();

  var statLines=[
    {ico:"⚔",txt:"× "+lvLbl+" "+levelOf()+" · "+t("profile.certCardXp")+" "+S.xp},
    {ico:"🐉",txt:t("profile.certCardCrises")+" "+bossCompletedCount()+"/"+BOSSES.length+" · "+t("profile.certCardChain")+" "+chainStagesDone()+"/"+chainTotalStages()},
    {ico:"🌍",txt:t("profile.certCardCountries")+" "+Object.keys(S.done).length+"/"+COUNTRIES.length+" · 🏅 "+t("profile.certCardAch")+" "+achEarned+"/"+MEDALS.length},
    {ico:"🛡",txt:t("profile.certCardRes")+" "+avgRes+"% · "+resRank.ico+" "+resRank[pt?"pt":"en"]}
  ];
  var sy=creamY+16;
  statLines.forEach(function(line){
    certDrawCreamStatLine(ctx,22,sy,creamW,line,tier.chipAccent);
    sy+=22;
  });

  certDrawDivider(ctx,W/2,sy+6,62,tier.accent);
  sy+=20;
  ctx.textAlign="center"; ctx.font="700 10.5px Segoe UI,sans-serif"; ctx.fillStyle="#005f5c";
  ctx.fillText(title.ico+" "+title[pt?"pt":"en"],W/2,sy);
  sy+=18;
  ctx.font="italic 9px Segoe UI,Georgia,serif"; ctx.fillStyle="#4a5a60"; ctx.textAlign="left";
  ctx.fillText(certEllipsis(ctx,t("profile.certCardFlavor"),creamW-20),32,sy);

  var footY=H-58;
  ctx.fillStyle="rgba(0,0,0,0.35)"; certRoundRect(ctx,22,footY,W-44,36,6); ctx.fill();
  ctx.textAlign="center"; ctx.font="700 10px Segoe UI,sans-serif"; ctx.fillStyle=tier.inner;
  ctx.fillText("◆ ORBITA ◆",W/2,footY+12);
  ctx.font="500 8px Segoe UI,sans-serif"; ctx.fillStyle="#9fb0b8";
  ctx.fillText(dateStr+"  ·  "+title.ico+" "+title[pt?"pt":"en"],W/2,footY+24);
  ctx.fillText(t("profile.certCardFooter"),W/2,footY+34);
}
function renderCertificateFull(){
  var cv=$("certCanvas"); if(!cv||!cv.getContext) return;
  var W=800, pt=L()==="pt";
  var title=currentTitle(), tr=certTeamRole();
  var name=(S.name&&S.name.trim())?S.name.trim():(pt?"Guardião Cibernético":"Cyber Guardian");
  var dateStr=new Date().toLocaleDateString(pt?"pt-BR":"en-US",{year:"numeric",month:"long",day:"numeric"});
  var avgRes=bossAvgIndex(), resRank=bossGuardianRank(avgRes);
  var stats=[
    [pt?"Nível":"Level", String(levelOf())],
    [pt?"XP":"XP", String(S.xp)],
    [pt?"Países":"Countries", Object.keys(S.done).length+"/"+COUNTRIES.length],
    [pt?"Crises":"Crises", bossCompletedCount()+"/"+BOSSES.length],
    [pt?"Cadeia":"Chain", chainStagesDone()+"/"+chainTotalStages()],
    [pt?"Resiliência":"Resilience", avgRes+"%"],
    [pt?"Sequência":"Streak", String(S.streak.count||0)+(pt?" d":" d")]
  ];
  var achRows=Math.ceil(MEDALS.length/3);
  var H=Math.max(920, 500+achRows*56+150);
  cv.width=W; cv.height=H;
  var ctx=cv.getContext("2d");
  ctx.fillStyle="#ffffff"; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle="#007E7A"; ctx.lineWidth=6; ctx.strokeRect(18,18,W-36,H-36);
  ctx.strokeStyle="#ECB11F"; ctx.lineWidth=2; ctx.strokeRect(28,28,W-56,H-56);
  ctx.fillStyle="#007E7A"; ctx.font="600 14px Segoe UI,sans-serif"; ctx.textAlign="center";
  ctx.fillText("ORBITA", W/2, 52);
  ctx.fillStyle="#1a1a1a"; ctx.font="700 24px Segoe UI,sans-serif";
  ctx.fillText(pt?"Certificado de Participação":"Certificate of Participation", W/2, 82);
  ctx.font="500 13px Segoe UI,sans-serif"; ctx.fillStyle="#3d4f55";
  ctx.fillText(pt?"Guardião Cibernético":"Cyber Guardian", W/2, 104);
  ctx.strokeStyle="#ECB11F"; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(120,114); ctx.lineTo(W-120,114); ctx.stroke();
  ctx.fillStyle="#1a1a1a"; ctx.font="700 28px Segoe UI,sans-serif";
  ctx.fillText(certEllipsis(ctx,name,W-120), W/2, 148);
  ctx.font="600 16px Segoe UI,sans-serif"; ctx.fillStyle="#005f5c";
  ctx.fillText(title.ico+" "+title[pt?"pt":"en"], W/2, 174);
  var y=192;
  if(tr.team||tr.role){
    ctx.font="500 12px Segoe UI,sans-serif"; ctx.fillStyle="#3d4f55";
    ctx.fillText([tr.team,tr.role].filter(Boolean).join(" • "), W/2, y);
    y+=22;
  }
  ctx.strokeStyle="#e8e8e8"; ctx.beginPath(); ctx.moveTo(120,y); ctx.lineTo(W-120,y); ctx.stroke();
  y+=16;
  y=certDrawStats(ctx,W,y,stats);
  y+=18;
  y=certDrawAchievements(ctx,W,y);
  y+=10;
  y=certDrawResilienceSeal(ctx,W,y,pt);
  y+=28;
  ctx.textAlign="center"; ctx.font="italic 10px Segoe UI,sans-serif"; ctx.fillStyle="#3d4f55";
  ctx.fillText(pt?"Reconhece a participação na trilha educativa de Cyber Security da Orbita.":"Recognizes participation in Orbita's Cyber Security learning journey.", W/2, y);
  ctx.font="500 10px Segoe UI,sans-serif"; ctx.fillStyle="#5c706e";
  ctx.fillText(dateStr, W/2, y+18);
  ctx.fillText(pt?"Ferramenta educativa interna — não substitui certificações oficiais.":"Internal educational tool — not an official certification.", W/2, y+34);
}
function renderCertificatePreview(){
  if(certViewMode==="card") renderCertificateCard();
  else renderCertificateFull();
}
function downloadCertificate(){
  renderCertificatePreview();
  var cv=$("certCanvas"); if(!cv||!cv.toBlob) return;
  var fname=certViewMode==="card"?"guardiao-orbita-carta.png":"guardiao-orbita-certificado.png";
  cv.toBlob(function(blob){
    if(!blob) return;
    var url=URL.createObjectURL(blob);
    var a=document.createElement("a");
    a.href=url; a.download=fname;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); },500);
  },"image/png");
}
function printCertificate(){
  renderCertificatePreview();
  var cv=$("certCanvas"); if(!cv) return;
  var data=cv.toDataURL("image/png");
  var win=window.open("","_blank","noopener,noreferrer,width=860,height=640");
  if(!win){ downloadCertificate(); return; }
  var docTitle=L()==="pt"?"Certificado — Guardião Cibernético":"Certificate — Cyber Guardian";
  win.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>'+docTitle+'</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f0f0f0}img{max-width:100%;height:auto;box-shadow:0 4px 24px rgba(0,0,0,.15)}@media print{body{background:#fff}img{box-shadow:none}}</style></head><body><img src="'+data+'" alt="'+docTitle+'" onload="setTimeout(function(){window.print()},300)"></body></html>');
  win.document.close();
}
function renderRadarTable(){
  var host=$("radarTable"); if(!host) return;
  var rows=Object.keys(THEMES).map(function(k){ var a=themeAcc(k); return '<tr><td>'+THEMES[k].ico+' '+tt(THEMES[k])+'</td><td>'+(a===null?"—":a+"%")+'</td></tr>'; }).join("");
  host.innerHTML='<table class="radar-table"><caption class="sr-only">'+t("profile.radar")+'</caption><thead><tr><th>'+(L()==="pt"?"Tema":"Theme")+'</th><th>%</th></tr></thead><tbody>'+rows+'</tbody></table>';
}
function drawRadar(){
  var cv=$("radarCanvas"); if(!cv||!cv.getContext) return; var ctx=cv.getContext("2d"); var W=cv.width,H=cv.height,cx=W/2,cy=H/2,R=Math.min(W,H)/2-40;
  ctx.clearRect(0,0,W,H);
  var keys=Object.keys(THEMES),n=keys.length;
  ctx.strokeStyle="rgba(255,255,255,.15)"; ctx.fillStyle="rgba(255,255,255,.55)"; ctx.font="12px Segoe UI,sans-serif";
  for(var ring=1;ring<=4;ring++){ ctx.beginPath(); for(var i=0;i<=n;i++){ var a=Math.PI*2*i/n-Math.PI/2,r=R*ring/4; var x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r; if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); } ctx.stroke(); }
  for(var j=0;j<n;j++){ var ang=Math.PI*2*j/n-Math.PI/2; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(ang)*R,cy+Math.sin(ang)*R); ctx.stroke();
    var lx=cx+Math.cos(ang)*(R+18),ly=cy+Math.sin(ang)*(R+18); ctx.textAlign=Math.abs(Math.cos(ang))<.3?"center":(Math.cos(ang)>0?"left":"right"); ctx.fillText(THEMES[keys[j]].ico,lx,ly+4); }
  ctx.beginPath(); ctx.fillStyle="rgba(237,177,17,.28)"; ctx.strokeStyle="#EDB111"; ctx.lineWidth=2;
  for(var k=0;k<=n;k++){ var kk=k%n,acc=themeAcc(keys[kk]); var val=(acc===null?10:acc)/100; var an=Math.PI*2*kk/n-Math.PI/2,rr=R*Math.max(.08,val); var xx=cx+Math.cos(an)*rr,yy=cy+Math.sin(an)*rr; if(k===0) ctx.moveTo(xx,yy); else ctx.lineTo(xx,yy); }
  ctx.fill(); ctx.stroke();
}

/* ==========================================================
   PAINEL DO GESTOR + CSV
   ========================================================== */
function renderManager(){
  var demo=$("mgrDemo");
  renderManagerKpisSimple();
  var host=$("mgrTeams"); host.innerHTML="";
  var acc=overallAcc()||0;
  var tmOnly=TEAMS.filter(function(t){ return t.id===S.team; })[0];
  if(tmOnly){
    var dYou=document.createElement("div"); dYou.className="mgr-row mgr-row-you";
    dYou.innerHTML='<span class="mname">'+tmOnly.ico+' '+tt(tmOnly)+' <span class="mgr-you-tag">✓</span></span><span class="rank-bar"><span class="rf" style="width:'+acc+'%"></span></span><span class="rank-val">'+acc+'%</span>';
    host.appendChild(dYou);
  }
  var pend=$("mgrPending"); if(pend) pend.textContent=L()==="pt"?"Outras equipes aparecerão quando houver dados reais de piloto (não simulados).":"Other teams will appear when real pilot data exists (not simulated).";
  if(demo) demo.textContent=L()==="pt"?"Piloto local: só sua equipe neste dispositivo tem métricas reais.":"Local pilot: only your team on this device has real metrics.";
  var th=$("mgrThemes"); th.innerHTML=""; var arr=Object.keys(THEMES).map(function(k){ return {k:k,acc:themeAcc(k)}; }).filter(function(x){ return x.acc!==null; }).sort(function(a,b){ return a.acc-b.acc; });
  if(!arr.length) th.innerHTML='<div class="muted">'+(L()==="pt"?"Sem dados ainda — jogue algumas campanhas.":"No data yet — play some campaigns.")+'</div>';
  arr.slice(0,5).forEach(function(x){ var d=document.createElement("div"); d.className="theme-err"; d.innerHTML='<span>'+THEMES[x.k].ico+' '+tt(THEMES[x.k])+'</span><span>'+x.acc+'%</span>'; th.appendChild(d); });
  renderPedagogyRec("mgrPedagogyRec");
}
function downloadCSV(name,rows){ var csv=rows.map(function(r){ return r.map(function(c){ return '"'+String(c).replace(/"/g,'""')+'"'; }).join(","); }).join("\n"); var blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"}); var url=URL.createObjectURL(blob); var a=document.createElement("a"); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(url); },500); }
function exportTeams(){
  var teamName=""; TEAMS.forEach(function(tm){ if(tm.id===S.team) teamName=tt(tm); });
  var rows=[[L()==="pt"?"Equipe":"Team",L()==="pt"?"Taxa de acerto (%)":"Accuracy (%)",L()==="pt"?"Origem":"Source"]];
  rows.push([teamName,overallAcc()||0,L()==="pt"?"Piloto local — dispositivo atual":"Local pilot — current device"]);
  downloadCSV("guardiao_equipe_"+S.team+".csv",rows);
}
function exportThemes(){ var rows=[[L()==="pt"?"Tema":"Theme",L()==="pt"?"Acertos":"Correct",L()==="pt"?"Total":"Total",L()==="pt"?"%":"%"]]; for(var k in THEMES){ var s=S.themeStats[k]||{c:0,t:0}; rows.push([tt(THEMES[k]),s.c,s.t,s.t?Math.round(s.c/s.t*100):0]); } downloadCSV("guardiao_temas.csv",rows); }

/* ==========================================================
   SETUP
   ========================================================== */
function renderTeams(){ var g=$("teamsGrid"); if(!g) return; g.innerHTML=""; TEAMS.forEach(function(tm){ var b=document.createElement("button"); b.className="pick"; b.setAttribute("aria-pressed",S.team===tm.id?"true":"false"); b.innerHTML='<div class="pi">'+tm.ico+'</div><div class="pn">'+tt(tm)+'</div>'; b.addEventListener("click",function(){ S.team=tm.id; save(); renderTeams(); }); g.appendChild(b); }); renderSetupProfileFeedback(); }
function renderRoles(){ var g=$("rolesGrid"); if(!g) return; g.innerHTML=""; ROLES.forEach(function(r){ var b=document.createElement("button"); b.className="pick"; b.setAttribute("aria-pressed",S.role===r.id?"true":"false"); b.innerHTML='<div class="pi">'+r.ico+'</div><div class="pn">'+r[L()]+'</div><div class="pd">'+r[L()+"d"]+'</div>'; b.addEventListener("click",function(){ S.role=r.id; save(); renderRoles(); }); g.appendChild(b); }); renderSetupProfileFeedback(); }
function setupProfileLabels(){
  var area="", rotina="";
  if(S.team){ var tm=PROFILE.getTeam(S.team); area=tm?tt(tm):S.team; }
  if(S.role){ var r=PROFILE.getRole(S.role); rotina=r?r[L()]:S.role; }
  return {area:area,rotina:rotina};
}
function renderSetupProfileFeedback(){
  var el=$("setupProfileFeedback");
  if(!el) return;
  if(setupEditMode){ el.hidden=true; return; }
  var team=S.team||"", role=S.role||"", labels=setupProfileLabels();
  if(!team&&!role){ el.hidden=true; return; }
  if(!team||!role){
    el.className="setup-profile-feedback warn";
    el.textContent=t("setup.feedPartial");
    el.hidden=false;
    return;
  }
  var st=PROFILE.setupProfileState(team,role), key="setup.feed"+(st==="high"?"High":st==="medium"?"Medium":st==="low"?"Low":st==="special"?"Special":"Medium");
  el.className="setup-profile-feedback "+st;
  el.textContent=t(key).replace(/\{area\}/g,labels.area).replace(/\{rotina\}/g,labels.rotina);
  el.hidden=false;
}
function setupStartToast(){
  var labels=setupProfileLabels();
  var msg=t("setup.startToast");
  if(labels.area&&labels.rotina) msg+=" "+labels.area+" + "+labels.rotina;
  toast(msg);
}
var setupEditMode=false;
function applySetupDefaults(){
  if(!setupEditMode) return;
  if(!S.team) S.team=PROFILE.defaultTeam;
  if(!S.role) S.role=PROFILE.defaultRole;
  save();
}
function renderSetupUi(){
  applySetupDefaults();
  var badge=$("setupBadge"), head=$("setupHead"), intro=$("setupIntro"), why=$("setupWhy"), btn=$("setupGoBtn"), nameBlock=$("setupNameBlock"), nameInput=$("playerName");
  if(nameBlock) nameBlock.hidden=false;
  if(nameInput){
    nameInput.value=S.name||"";
    nameInput.setAttribute("placeholder", t("setup.namePh"));
  }
  if(setupEditMode){
    if(badge) badge.textContent=t("setup.editBadge");
    if(head) head.textContent=t("setup.editHead");
    if(intro) intro.textContent=t("setup.editIntro");
    if(why) why.hidden=true;
    if(btn) btn.textContent=t("setup.save");
  } else {
    if(badge) badge.textContent=t("setup.badge");
    if(head) head.textContent=t("setup.head");
    if(intro) intro.textContent=t("setup.intro");
    if(why){ why.hidden=false; why.textContent=t("setup.why"); }
    if(btn) btn.textContent=t("setup.goFirst");
    renderSetupProfileFeedback();
  }
}
function openFirstSetup(){
  setupEditMode=false;
  S.team=""; S.role=""; save();
  renderTeams(); renderRoles();
  if($("playerName")) $("playerName").value=S.name||"";
  renderSetupUi();
  show("screenSetup");
}
function openEditSetup(){
  setupEditMode=true;
  renderTeams(); renderRoles();
  if($("playerName")) $("playerName").value=S.name||"";
  renderSetupUi();
  show("screenSetup");
}

/* ==========================================================
   UX ENHANCEMENTS (v67)
   ========================================================== */
var THEME_GLOSSARY={phishing:"phishing",password:"mfa",ot:"scada",data:"dlp",device:"homolog",remote:"vpn",bec:"bec",port:"recon"};
function ensureUxState(){
  if(!S.tipsSeen) S.tipsSeen={map:false,daily:false,boss:false};
  if(!S.glossaryFavs) S.glossaryFavs=[];
  if(!S.glossaryLearned) S.glossaryLearned={};
  if(!S.glossaryReview) S.glossaryReview=[];
  if(!S.glossaryReviewMeta) S.glossaryReviewMeta={};
  if(!S.glossaryLearnedXp) S.glossaryLearnedXp={};
  if(S.glossaryQuizDone===undefined) S.glossaryQuizDone=0;
}
function setSimpleUi(on){
  S.simpleUi=!!on; save(); applySimpleUi(); refreshHud();
  var b=$("optSimpleUiSettings");
  if(b) b.checked=S.simpleUi;
}
function setEasyRead(on){
  S.a11y.easyRead=!!on;
  if(on){
    S.a11y.contrast=true; S.a11y.large=true; S.a11y.spacing=true;
    toast(L()==="pt"?"Leitura fácil ativada":"Easy reading enabled");
  } else {
    S.a11y.contrast=false; S.a11y.large=false; S.a11y.spacing=false;
    toast(t("settings.easyReadOff"));
  }
  save(); applyA11y(); syncEasyReadUi();
}
function syncEasyReadUi(){
  var on=!!(S.a11y&&S.a11y.easyRead);
  var a=$("optEasyReadSettings");
  if(a) a.checked=on;
}
function applyEasyReadPreset(){ setEasyRead(!(S.a11y&&S.a11y.easyRead)); }
function updateNavBadges(){
  ensureDaily();
  var badge=$("navDailyBadge"), btn=$("navDailyBtn");
  var pending=!S.daily.done.mission;
  var pendingW=weeklyPendingCount();
  if(badge){
    var showBadge=pending||pendingW>0;
    badge.hidden=!showBadge;
    if(showBadge){
      if(pending&&pendingW>0) badge.textContent=pendingW>9?"9+":String(pendingW);
      else if(pending) badge.textContent="!";
      else badge.textContent=pendingW>9?"9+":String(pendingW);
    }
  }
  if(btn){
    var tip=t("nav.tip.missions");
    if(pending) tip+=" — "+t("nav.badgeDaily");
    else if(pendingW) tip+=" — "+pendingW+" "+t("nav.badgeWeekly");
    btn.setAttribute("aria-label",tip);
    btn.setAttribute("title",tip);
  }
}
function showContextTip(key){
  ensureUxState();
  var el=$("ctxTip_"+key); if(!el||S.tipsSeen[key]) return;
  el.hidden=false;
  if(key==="map") el.classList.add("map-fit-tip");
}
function dismissContextTip(key){
  ensureUxState();
  S.tipsSeen[key]=true; save();
  var el=$("ctxTip_"+key); if(el) el.hidden=true;
}
function renderWeekProgressBar(){
  ensureWeekly(); ensureDaily();
  var host=$("weekProgressBar"), fill=$("weekProgressFill"), lab=$("weekProgressLabel"), unlock=$("weekProgressUnlock");
  if(!host) return;
  var wp=S.weekly.prog||{}, done=weeklyGoalsDoneCount(), total=WEEKLY.length;
  var correct=wp.correct||0, campaign=wp.campaign||0, boss=wp.boss||0;
  var score=Math.min(100,Math.round((correct/20*25)+(campaign/3*25)+(boss/1*25)+((wp.theme||0)/8*25)));
  if(fill) fill.style.width=score+"%";
  if(lab){
    if(uxLegacy()) lab.textContent=correct+"/20 · "+campaign+"/3 · "+(S.daily.done.mission?(L()==="pt"?"missão ✅":"mission ✅"):(L()==="pt"?"missão pendente":"mission pending"));
    else lab.textContent=t("home.weekGoalsCount").replace("{done}",String(done)).replace("{total}",String(total));
  }
  if(unlock){
    if(uxLegacy()) unlock.textContent="";
    else{
      var micro=getWeekMicroGoal();
      unlock.textContent=micro.key==="done"?"":t("home.weekNextUnlock").replace("{goal}",micro.text);
    }
  }
  host.setAttribute("aria-label",t("home.weekBarAria"));
  host.setAttribute("aria-valuenow",String(score));
}
function openWeeklyScreen(){ show("screenWeekly"); }
function renderWeeklyGoalsChecklist(){
  ensureWeekly(); ensureStreak();
  var host=$("weeklyGoalsChecklist"); if(!host) return;
  var wp=S.weekly.prog||{}, streakDays=S.streak.count||0;
  var items=[
    {ok:streakDays>=5, txt:t("weekly.checkDaily"), val:streakDays+"/5"},
    {ok:(wp.campaign||0)>=3, txt:t("weekly.checkCampaign"), val:(wp.campaign||0)+"/3"},
    {ok:(wp.boss||0)>=1, txt:t("weekly.checkBoss"), val:(wp.boss||0)+"/1"}
  ];
  host.innerHTML='<div class="wg-title">'+t("profile.weeklyGoals")+'</div>';
  items.forEach(function(it){
    host.innerHTML+='<div class="wg-item'+(it.ok?" done":"")+'"><span>'+(it.ok?"✅":"⬜")+'</span><span class="wg-txt">'+it.txt+'</span><span class="wg-val">'+it.val+'</span></div>';
  });
}
function renderFirstDayHint(){
  var el=$("firstDayHint"); if(el){ el.hidden=true; el.textContent=""; }
}
function openGlossaryForTerm(id, fromQuiz, theme){
  if(fromQuiz===undefined) fromQuiz=!!($("screenQuiz")&&$("screenQuiz").classList.contains("active"));
  glossaryFromQuiz=fromQuiz;
  var ret=$("quizGlossaryReturn"); if(ret) ret.hidden=!fromQuiz;
  var g=GLOSSARY.filter(function(x){return x.id===id;})[0];
  if(g&&g.cat) glossaryActiveCat=g.cat;
  else if(theme){
    var tg=THEME_GLOSSARY[theme];
    var tgObj=tg?GLOSSARY.filter(function(x){return x.id===tg;})[0]:null;
    if(tgObj&&tgObj.cat) glossaryActiveCat=tgObj.cat;
  }
  toggleGlossaryMenu(true);
  var search=$("glossarySearch");
  if(search&&g) search.value=g.term;
  renderGlossaryCatChips();
  selectGlossaryTerm(id, false);
}
function toggleGlossaryFav(id){
  ensureUxState();
  var i=S.glossaryFavs.indexOf(id);
  if(i>=0) S.glossaryFavs.splice(i,1); else S.glossaryFavs.push(id);
  save(); renderGlossaryFavs(); renderGlossaryMeta($("glossarySearch")?$("glossarySearch").value:"");
}
function renderGlossaryFavs(){
  var host=$("glossaryFavsList"); if(!host) return;
  ensureUxState();
  if(!S.glossaryFavs.length){ host.innerHTML='<p class="muted glossary-favs-empty">'+t("settings.glossaryFavsEmpty")+'</p>'; return; }
  host.innerHTML="";
  S.glossaryFavs.forEach(function(id){
    var g=GLOSSARY.filter(function(x){return x.id===id;})[0]; if(!g) return;
    var b=document.createElement("button");
    b.type="button"; b.className="glossary-fav-chip";
    b.textContent=g.term;
    b.addEventListener("click",function(){ openGlossaryForTerm(id); });
    host.appendChild(b);
  });
}
function themePreview(th){
  document.body.classList.remove("theme-default","theme-light","theme-dark");
  if(th!=="default") document.body.classList.add("theme-"+th);
  setTimeout(function(){ applyTheme(); },1200);
}
function renderQuizContext(){
  var el=$("quizContextChip"); if(!el) return;
  var mode=cur.mode, label="", ico="🎯";
  if(mode==="daily"){ ico="📅"; label=(L()==="pt"?"Missão diária":"Daily mission")+" · "+(cur.i+1)+"/"+cur.questions.length; }
  else if(mode==="review"){ ico="📚"; label=t("pedagogy.reviewMode")+" · "+(cur.i+1)+"/"+cur.questions.length; }
  else if(mode==="themeDrill"){ ico=cur.country?cur.country.flag:"🎯"; label=t("pedagogy.drillMode")+" · "+(cur.i+1)+"/"+cur.questions.length; }
  else if(mode==="campaign"){ ico="🗺️"; label=(L()==="pt"?"Campanha":"Campaign")+" · "+(cur.country?cur.country.flag+" "+tt(cur.country.name):"")+" · "+(cur.i+1)+"/"+cur.questions.length; }
  else { label=(cur.i+1)+"/"+cur.questions.length; }
  el.innerHTML='<span aria-hidden="true">'+ico+'</span> '+label;
}
function renderQuizGlossaryHint(theme){
  var el=$("quizGlossaryHint"); if(!el) return;
  var gid=THEME_GLOSSARY[theme];
  if(!gid){ el.hidden=true; return; }
  var g=GLOSSARY.filter(function(x){return x.id===gid;})[0];
  if(!g){ el.hidden=true; return; }
  el.hidden=false;
  el.innerHTML='<button type="button" class="quiz-gloss-btn" id="quizGlossBtn">'+t("quiz.glossaryTip")+': <b>'+g.term+'</b></button>';
  var btn=$("quizGlossBtn");
  if(btn) btn.onclick=function(e){ e.stopPropagation(); var th=cur.questions&&cur.questions[cur.i]?cur.questions[cur.i].theme:null; openGlossaryForTerm(gid, true, th); };
}
function returnFromGlossaryToQuiz(){
  toggleGlossaryMenu(false);
  glossaryFromQuiz=false;
  var rh=$("quizGlossaryReturn"); if(rh) rh.hidden=true;
  show("screenQuiz");
  var opts=$("options"); if(opts){ var first=opts.querySelector(".opt:not([disabled])"); if(first) first.focus(); }
}
function renderSessionFeedback(win,acc){
  var host=$("sessionFeedback"); if(!host) return;
  host.hidden=false;
  ensureStreak();
  var streakMsg=streakPlayedToday()?(S.streak.count<=1?t("session.streakStart"):t("session.streakKept")):"";
  var xpEst=cur.correct*10;
  host.innerHTML='<div class="session-feedback-inner"><div class="session-feedback-ico">'+(win?"🏆":"💪")+'</div><div><div class="session-feedback-title">'+t("session.title")+'</div><div class="session-feedback-acc">'+(L()==="pt"?"Precisão":"Accuracy")+': <b>'+acc+'%</b></div>'+(streakMsg?'<div class="session-feedback-streak">'+streakMsg+'</div>':'')+'<div class="session-feedback-xp">'+t("session.xpGain").replace("{n}",String(xpEst))+'</div></div></div>';
}
function shareCertificate(){
  renderCertificatePreview();
  var c=$("certCanvas"); if(!c||!c.toBlob){ toast(L()==="pt"?"Gere a prévia primeiro":"Generate preview first"); return; }
  var fname=certViewMode==="card"?"guardiao-carta.png":"guardiao-certificado.png";
  c.toBlob(function(blob){
    if(!blob) return;
    if(navigator.share&&navigator.canShare&&navigator.canShare({files:[new File([blob],fname,{type:"image/png"})]})){
      navigator.share({files:[new File([blob],fname,{type:"image/png"})],title:t("profile.certTitle")}).catch(function(){});
    } else {
      var a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=fname; a.click(); URL.revokeObjectURL(a.href);
      toast(L()==="pt"?"Imagem salva — compartilhe pelo seu app de fotos":"Image saved — share from your gallery");
    }
  });
}
function renderMapExplorerHint(){
  var el=$("mapExplorerHint"); if(!el) return;
  var next=nextExpeditionCountry();
  if(next) el.textContent=(L()==="pt"?"Próximo: ":"Next: ")+next.flag+" "+tt(next.name);
}
function pulseNextCountry(){
  var next=nextExpeditionCountry();
  setMapHitHighlight(next?next.id:null);
}
function renderManagerKpisSimple(){
  var host=$("mgrKpis"); if(!host) return;
  var teams=TEAMS.length, active=0, i;
  for(i=0;i<TEAMS.length;i++){ if(S.teamScores&&S.teamScores[TEAMS[i].id]) active++; }
  var weak=weakestThemeKey(), weakName=weak?tt(THEMES[weak]):"—";
  var avgStreak=S.streak?S.streak.best||0:0;
  host.innerHTML='<div class="stat"><div class="v">'+active+'/'+teams+'</div><div class="l">'+t("mgr.kpiAdoption")+'</div></div><div class="stat"><div class="v">'+weakName+'</div><div class="l">'+t("mgr.kpiWeak")+'</div></div><div class="stat"><div class="v">🔥 '+avgStreak+'</div><div class="l">'+t("mgr.kpiStreak")+'</div></div>';
}
function getRecommendedBossId(){
  var i,b,st;
  for(i=0;i<BOSSES.length;i++){ b=BOSSES[i]; st=S.bossStats[b.id]; if(!st||!st.best) return b.id; }
  return BOSSES[0]?BOSSES[0].id:null;
}

/* ==========================================================
   BIND / INIT
   ========================================================== */
/* -------------------- ONBOARDING -------------------- */
var ONBOARD_STEPS=[
  {ico:"🌐",type:"lang",titleKey:"onboard.langT",bodyKey:"onboard.langB"},
  {ico:"♿",type:"a11y",titleKey:"onboard.a11yT",bodyKey:"onboard.a11yB"},
  {ico:"👤",type:"profile",titleKey:"onboard.profileT",bodyKey:"onboard.profileB"},
  {ico:"📅",type:"play",titleKey:"onboard.playT",bodyKey:"onboard.playB"},
  {ico:"▶️",type:"ready",titleKey:"onboard.readyT",bodyKey:"onboard.readyB"}
];
var onboardStep=0, onboardReplay=false;
function closeOnboarding(skipped){
  releaseFocusTrap();
  S.onboardingDone=true;
  S.offlineHintSeen=true;
  save();
  onboardReplay=false;
  var ov=$("onboardOverlay"); if(ov) ov.hidden=true;
  document.body.classList.remove("onboard-open");
  if(skipped&&!setupComplete()){
    openFirstSetup();
    return;
  }
  try{ renderNextStep(); }catch(e){}
}
function renderOnboarding(){
  var step=ONBOARD_STEPS[onboardStep], isSetup=step.type==="setup", isLang=step.type==="lang", isA11y=step.type==="a11y";
  var isFeature=step.type==="play"||step.type==="ready"||step.type==="profile";
  var langPanel=$("onboardLangPanel"), a11yPanel=$("onboardA11yPanel"), feat=$("onboardFeature"), body=$("onboardBody"), mission=$("onboardMission");
  if($("onboardTitle")) $("onboardTitle").textContent=t(step.titleKey||"onboard.step");
  if(feat) feat.hidden=isLang||isA11y;
  if(body){ body.hidden=!isLang; if(isLang) body.textContent=t(step.bodyKey); }
  if(mission){
    if(isLang||isA11y) mission.textContent="";
    else if(step.type==="ready") mission.textContent=t(step.bodyKey)+"\n\n"+t("onboard.offlineNote");
    else mission.textContent=t(step.bodyKey);
  }
  if(langPanel) langPanel.hidden=!isLang;
  if(a11yPanel) a11yPanel.hidden=!isA11y;
  if(isLang){
    document.querySelectorAll("#onboardLangPanel .lang-card").forEach(function(b){ b.setAttribute("aria-pressed",b.getAttribute("data-lang")===S.lang?"true":"false"); });
  } else if(isA11y){
    if($("onboardOptVoice")) $("onboardOptVoice").checked=!!S.a11y.voice;
    if($("onboardOptContrast")) $("onboardOptContrast").checked=!!S.a11y.contrast;
    if($("onboardOptSigns")) $("onboardOptSigns").checked=!!S.a11y.signs;
    if($("onboardOptMotion")) $("onboardOptMotion").checked=!!S.a11y.motion;
  } else if(isFeature) {
    var ico=$("onboardIco"); if(ico) ico.textContent=step.ico;
  }
  if($("onboardStepLabel")) $("onboardStepLabel").textContent=t("onboard.step")+" "+(onboardStep+1)+"/"+ONBOARD_STEPS.length;
  var dots=$("onboardDots");
  if(dots){
    dots.innerHTML="";
    ONBOARD_STEPS.forEach(function(_,i){
      var d=document.createElement("button");
      d.type="button";
      d.className="onboard-dot"+(i===onboardStep?" on":"");
      d.setAttribute("role","tab");
      d.setAttribute("aria-label",t("onboard.step")+" "+(i+1)+"/"+ONBOARD_STEPS.length);
      d.setAttribute("aria-current",i===onboardStep?"step":"false");
      d.addEventListener("click",function(){ onboardStep=i; renderOnboarding(); });
      dots.appendChild(d);
    });
  }
  if($("onboardNextBtn")){
    var last=onboardStep>=ONBOARD_STEPS.length-1;
    $("onboardNextBtn").textContent=last?(onboardReplay?(L()==="pt"?"Fechar":"Close"):t("onboard.startSetup")):t("onboard.next");
  }
}
function showOnboarding(force){
  if(!force){
    if(S.onboardingDone) return;
    if(/[?&]v=testpy\b/.test(location.search||"")) return;
  }
  onboardReplay=!!force;
  onboardStep=0; renderOnboarding();
  var ov=$("onboardOverlay"); if(!ov) return;
  ov.hidden=false; document.body.classList.add("onboard-open");
  trapFocus(ov.querySelector(".onboard-modal"), $("onboardNextBtn"));
  if($("onboardNextBtn")) $("onboardNextBtn").focus();
}
function onboardNext(){
  var step=ONBOARD_STEPS[onboardStep];
  if(step&&step.type==="a11y"){
    if($("onboardOptVoice")) S.a11y.voice=$("onboardOptVoice").checked;
    if($("onboardOptContrast")) S.a11y.contrast=$("onboardOptContrast").checked;
    if($("onboardOptSigns")) S.a11y.signs=$("onboardOptSigns").checked;
    if($("onboardOptMotion")) S.a11y.motion=$("onboardOptMotion").checked;
    save(); applyA11y();
  }
  if(onboardStep<ONBOARD_STEPS.length-1){ onboardStep++; renderOnboarding(); return; }
  var firstTime=!S.onboardingDone;
  closeOnboarding();
  if(firstTime&&!onboardReplay){
    if(S.simpleUi===undefined) S.simpleUi=true;
    save(); applyA11y(); applySimpleUi();
    openFirstSetup();
  }
}

function bind(){
  function on(id,ev,fn){ var el=$(id); if(el) el.addEventListener(ev,fn); return el; }

  document.querySelectorAll(".lang-card").forEach(function(b){ b.addEventListener("click",function(){ setLang(b.getAttribute("data-lang")); }); });
  if($("optVoice")) on("optVoice","change",function(){ S.a11y.voice=this.checked; save(); applyA11y(); if(this.checked) speak(L()==="pt"?"Narração por voz ativada.":"Voice narration enabled."); });
  if($("optContrast")) on("optContrast","change",function(){ S.a11y.contrast=this.checked; save(); applyA11y(); });
  if($("optLarge")) on("optLarge","change",function(){ S.a11y.large=this.checked; save(); applyA11y(); });
  if($("optMotion")) on("optMotion","change",function(){ S.a11y.motion=this.checked; save(); applyA11y(); });
  if($("optSigns")) on("optSigns","change",function(){ S.a11y.signs=this.checked; save(); applyA11y(); });
  on("optLinks","change",function(){ S.a11y.links=this.checked; save(); applyA11y(); });
  on("optSpacing","change",function(){ S.a11y.spacing=this.checked; save(); applyA11y(); });
  on("optLetterSpace","change",function(){ S.a11y.letterSpace=this.checked; save(); applyA11y(); });
  on("optDyslexia","change",function(){ S.a11y.dyslexia=this.checked; save(); applyA11y(); });
  on("optReadingMode","change",function(){ S.a11y.readingMode=this.checked; save(); applyA11y(); });
  on("structureBtn","click",function(e){ e.stopPropagation(); showPageStructure(); toggleA11yMenu(false); });
  on("colorblindBtn","click",function(){ cycleColorblind(); });
  if($("resetA11yBtn")) on("resetA11yBtn","click",function(){ resetA11yDefaults(); });
  on("resetA11yMenuBtn","click",function(){ resetA11yDefaults(); toggleA11yMenu(false); });
  on("glossaryBtn","click",function(e){ e.stopPropagation(); toggleGlossaryMenu(); });
  on("glossaryMenuClose","click",function(e){ e.stopPropagation(); toggleGlossaryMenu(false); });
  on("quizGlossaryReturn","click",returnFromGlossaryToQuiz);
  on("toolbarMoreBtn","click",function(e){ e.stopPropagation(); toggleToolbarMore(); });
  document.querySelectorAll("#toolbarMoreMenu [data-toolbar-action]").forEach(function(b){
    b.addEventListener("click",function(e){
      e.stopPropagation();
      toggleToolbarMore(false);
      var act=b.getAttribute("data-toolbar-action");
      if(act==="demo"){ var db=$("demoMenuBtn"); if(db&&!db.hidden) db.click(); }
      else if(act==="settings") toggleSettingsMenu(true);
    });
  });
  on("settingsBtn","click",function(e){ e.stopPropagation(); toggleSettingsMenu(); });
  on("settingsMenuClose","click",function(e){ e.stopPropagation(); toggleSettingsMenu(false); });
  on("settingsOpenA11yBtn","click",function(e){ e.stopPropagation(); toggleSettingsMenu(false); toggleA11yMenu(true); if($("a11yBtn")) $("a11yBtn").focus(); });
  on("settingsOpenGuideBtn","click",function(e){ e.stopPropagation(); toggleSettingsMenu(false); showOnboarding(true); });
  on("settingsOpenShopBtn","click",function(e){ e.stopPropagation(); toggleSettingsMenu(false); renderShop(); show("screenShop"); });
  on("themeSelect","change",function(e){ e.stopPropagation(); themePreview(this.value); setTheme(this.value); });
  on("glossarySearch","input",function(e){ e.stopPropagation(); syncGlossaryFromSearch(); });
  on("glossarySearch","change",function(e){ e.stopPropagation(); syncGlossaryFromSearch(); });
  on("glossaryPrev","click",function(e){ e.preventDefault(); e.stopPropagation(); navigateGlossaryTerm(-1); });
  on("glossaryNext","click",function(e){ e.preventDefault(); e.stopPropagation(); navigateGlossaryTerm(1); });
  on("glossaryPrevM","click",function(e){ e.preventDefault(); e.stopPropagation(); navigateGlossaryTerm(-1); });
  on("glossaryNextM","click",function(e){ e.preventDefault(); e.stopPropagation(); navigateGlossaryTerm(1); });
  on("glossaryExploreBtn","click",function(e){ e.stopPropagation(); startGlossaryExplore(); });
  on("glossaryQuizClose","click",function(e){ e.stopPropagation(); closeGlossaryQuiz(); });
  on("hudStreakBtn","click",function(e){ e.stopPropagation(); toggleStreakPopover(); });
  on("streakPopClose","click",function(e){ e.stopPropagation(); toggleStreakPopover(false); });
  var a11yMenuEl=$("a11yMenu"), settingsMenuEl=$("settingsMenu"), glossaryMenuEl=$("glossaryMenu"), streakPopEl=$("streakPopover");
  if(a11yMenuEl) a11yMenuEl.addEventListener("click",function(e){ e.stopPropagation(); });
  if(settingsMenuEl) settingsMenuEl.addEventListener("click",function(e){ e.stopPropagation(); });
  if(glossaryMenuEl) glossaryMenuEl.addEventListener("click",function(e){ e.stopPropagation(); });
  window.addEventListener("resize",function(){ var gm=$("glossaryMenu"); if(gm&&!gm.hidden) positionGlossaryMenu(); });
  window.addEventListener("scroll",function(){ var gm=$("glossaryMenu"); if(gm&&!gm.hidden) positionGlossaryMenu(); },true);
  if(streakPopEl) streakPopEl.addEventListener("click",function(e){ e.stopPropagation(); });
  wireToolbarTouch("glossaryBtn",function(e){ e.stopPropagation(); toggleGlossaryMenu(); });
  wireToolbarTouch("settingsBtn",function(e){ e.stopPropagation(); toggleSettingsMenu(); });
  wireToolbarTouch("a11yBtn",function(e){ e.stopPropagation(); toggleA11yMenu(); });
  wireToolbarTouch("hudStreakBtn",function(e){ e.stopPropagation(); toggleStreakPopover(); });

  on("onboardSkipBtn","click",function(){ closeOnboarding(true); });
  on("onboardNextBtn","click",onboardNext);
  on("onboardOverlay","click",function(e){ if(e.target===$("onboardOverlay")) closeOnboarding(true); });

  on("homeStartBtn","click",function(){
    if(setupComplete()){ playNow(); return; }
    openFirstSetup();
  });
  on("nextStepBtn","click",playNow);
  on("homeStickyBtn","click",playNow);
  on("nextStepWeeklyBtn","click",openWeeklyScreen);
  on("setupBannerBtn","click",openFirstSetup);
  on("heroExpandBtn","click",function(){ S.heroExpanded=!S.heroExpanded; save(); applyHeroCompact(); });
  on("fontDownBtn","click",function(){ S.a11y.fontScale=(S.a11y.fontScale||0)-1; save(); applyFontScale(); });
  on("fontUpBtn","click",function(){ S.a11y.fontScale=(S.a11y.fontScale||0)+1; save(); applyFontScale(); });
  on("hudStatsSummary","click",function(){ renderProfile(); show("screenProfile"); });
  on("hudStatsSummary","keydown",function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); renderProfile(); show("screenProfile"); } });
  if($("optManager")){ $("optManager").checked=!!S.managerMode; on("optManager","change",function(){ setManagerMode(this.checked); }); }
  if($("optFocusLearn")){ $("optFocusLearn").checked=!!S.focusLearn; on("optFocusLearn","change",function(){ setFocusLearn(this.checked); }); }
  on("setupGoBtn","click",function(){
    if($("playerName")) S.name=$("playerName").value.trim();
    if(!S.team){ toast(t("setup.teamRequired")); return; }
    if(!S.role){ toast(t("setup.roleRequired")); return; }
    save();
    if(setupEditMode){
      toast(t("setup.saved"));
      updateSetupBanner();
      show("screenHome");
      renderNextStep();
      return;
    }
    setupStartToast();
    playNow();
  });
  on("playerName","input",function(){ S.name=this.value; });

  on("mapDetailClose","click",resetMapView);
  on("mapZoomInFloat","click",function(e){ e.stopPropagation(); zoomTo(view.x+view.w/2,view.y+view.h/2,.8); });
  on("mapZoomOutFloat","click",function(e){ e.stopPropagation(); zoomTo(view.x+view.w/2,view.y+view.h/2,1.25); });
  on("mapZoomResetFloat","click",function(e){ e.stopPropagation(); resetMapView(); });
  bindMapCountryNavArrows();
  on("quitDialogCancel","click",hideQuitDialog);
  on("quitDialogBackdrop","click",hideQuitDialog);
  on("quitDialogConfirm","click",function(){ var fn=quitCallback; hideQuitDialog(); if(fn) fn(); });

  document.querySelectorAll(".lang-switch-btn").forEach(function(b){
    b.addEventListener("click",function(){ setLang(b.getAttribute("data-lang")); });
  });
  on("a11yBtn","click",function(e){ e.stopPropagation(); toggleA11yMenu(); });
  on("a11yMenuClose","click",function(e){ e.stopPropagation(); toggleA11yMenu(false); });
  on("a11yBackdrop","click",function(){ toggleA11yMenu(false); toggleSettingsMenu(false); toggleGlossaryMenu(false); });
  document.addEventListener("click",function(e){
    var am=$("a11yMenu"), sm=$("settingsMenu"), gm=$("glossaryMenu"), sp=$("streakPopover");
    if(am&&!am.hidden){ if(e.target.closest&&(e.target.closest(".a11y-menu-wrap")||e.target.closest("#a11yMenu"))) return; toggleA11yMenu(false); }
    if(sm&&!sm.hidden){ if(e.target.closest&&(e.target.closest(".settings-menu-wrap")||e.target.closest("#settingsMenu"))) return; toggleSettingsMenu(false); }
    if(gm&&!gm.hidden){ if(e.target.closest&&(e.target.closest("#glossaryMenu")||e.target.closest("#glossaryBtn"))) return; toggleGlossaryMenu(false); }
    if(sp&&!sp.hidden){ if(e.target.closest&&(e.target.closest(".streak-hud-wrap")||e.target.closest("#streakPopover"))) return; toggleStreakPopover(false); }
    var tm=$("toolbarMoreMenu");
    if(tm&&!tm.hidden){ if(e.target.closest&&e.target.closest(".toolbar-overflow-wrap")) return; toggleToolbarMore(false); }
  });
  wireA11yMenuKeyboard();
  document.querySelectorAll("#a11yMenu .am-toggle").forEach(function(b){ b.addEventListener("click",function(e){ e.stopPropagation(); var k=b.getAttribute("data-opt"); if(k==="colorblind"){ cycleColorblind(); return; } S.a11y[k]=!S.a11y[k]; if(k==="contrast"||k==="large"||k==="spacing") S.a11y.easyRead=false; save(); applyA11y(); syncEasyReadUi(); if(k==="voice"&&S.a11y.voice) speak(L()==="pt"?"Narração por voz ativada.":"Voice narration enabled."); if(k==="signs"&&S.a11y.signs) speak(L()==="pt"?"Hand Talk e Libras ativados.":"Hand Talk and ASL enabled."); }); });

  on("speakBtn","click",function(){ var q=cur.questions[cur.i]; if(q) speak(tt(q.q)); });
  on("nextBtn","click",nextQuestion);
  on("prevBtn","click",prevQuestion);
  on("quitBtn","click",quizQuit);
  wireQuizNavButtons();
  on("resultMapBtn","click",returnToMap);

  on("bossQuitBtn","click",bossQuit);
  on("bossPrevBtn","click",bossPrev);
  on("bossNext","click",bossNext);
  on("bossResultBackBtn","click",function(){ renderBossList(); show("screenBossList"); });
  on("bossReplayBtn","click",function(){ if(bossCur.lastBossId) startBoss(bossCur.lastBossId); });

  on("dailyStartBtn","click",startDaily);
  on("weeklyMapBtn","click",function(){ openMap(null,true); });
  on("weekProgressBar","click",openWeeklyScreen);
  on("settingsEditProfileBtn","click",function(e){ e.stopPropagation(); toggleSettingsMenu(false); openEditSetup(); });
  on("optEasyReadSettings","change",function(e){ e.stopPropagation(); setEasyRead(this.checked); });
  on("optSimpleUiSettings","change",function(e){ e.stopPropagation(); setSimpleUi(this.checked); });
  on("profileEditSetupBtn","click",openEditSetup);
  on("profileWeeklyBtn","click",openWeeklyScreen);
  on("profileShopBtn","click",function(){ renderShop(); show("screenShop"); });
  on("certShareBtn","click",shareCertificate);
  document.querySelectorAll(".ctx-tip-dismiss").forEach(function(b){ b.addEventListener("click",function(){ dismissContextTip(b.getAttribute("data-tip")); }); });
  on("profileResetBtn","click",resetProgress);
  on("certGenerateBtn","click",renderCertificatePreview);
  on("certViewCardBtn","click",function(){ setCertView("card"); });
  on("certViewFullBtn","click",function(){ setCertView("full"); });
  on("certDownloadBtn","click",downloadCertificate);
  on("certPrintBtn","click",printCertificate);
  setCertView("card");
  on("mgrExportTeams","click",exportTeams);
  on("mgrExportThemes","click",exportThemes);

  [["onboardOptVoice","voice"],["onboardOptContrast","contrast"],["onboardOptSigns","signs"],["onboardOptMotion","motion"]].forEach(function(pair){
    var el=$(pair[0]); if(!el) return;
    el.addEventListener("change",function(){ S.a11y[pair[1]]=this.checked; save(); applyA11y(); });
  });

  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"){
      var qd=$("quitDialog"); if(qd&&!qd.hidden){ hideQuitDialog(); return; }
      var sm=$("settingsMenu"); if(sm&&!sm.hidden){ toggleSettingsMenu(false); return; }
      var gm=$("glossaryMenu"); if(gm&&!gm.hidden){ toggleGlossaryMenu(false); return; }
      var sp=$("streakPopover"); if(sp&&!sp.hidden){ toggleStreakPopover(false); return; }
      var am=$("a11yMenu"); if(am&&!am.hidden){ toggleA11yMenu(false); return; }
      var tmm=$("toolbarMoreMenu"); if(tmm&&!tmm.hidden){ toggleToolbarMore(false); return; }
      var ov=$("onboardOverlay"); if(ov&&!ov.hidden){ closeOnboarding(true); return; }
      if($("screenQuiz")&&$("screenQuiz").classList.contains("active")){ quizQuit(); return; }
      if($("mapDetail")&&!$("mapDetail").hidden){ closeMapDetail(); return; }
      var tip=$("mapTooltip"); if(tip&&!tip.hidden){ tip.hidden=true; if(typeof OrbitaWorldMap!=="undefined") OrbitaWorldMap.clearSelection(); return; }
    }
  });
  on("mapSearch","input",function(){ mapSearchQuery=this.value; applyMapSearch(); });
}
function dismissBlockingUI(){
  try{
    var ov=$("onboardOverlay");
    if(ov&&!ov.hidden){ closeOnboarding(); }
    toggleA11yMenu(false);
    toggleSettingsMenu(false);
    toggleGlossaryMenu(false);
    toggleStreakPopover(false);
    var tip=$("mapTooltip"); if(tip) tip.hidden=true;
    if(typeof OrbitaWorldMap!=="undefined"&&OrbitaWorldMap.clearSelection) OrbitaWorldMap.clearSelection();
    document.body.classList.remove("nav-hidden");
  }catch(e){}
}
var navWired=false, lastNavTap=0;
function wireToolbarTouch(id,handler){
  var el=$(id); if(!el) return;
  var last=0;
  el.addEventListener("touchend",function(ev){
    var now=Date.now();
    if(now-last<400) return;
    last=now;
    ev.preventDefault();
    ev.stopPropagation();
    handler(ev);
  },{passive:false});
}
function wireQuizNavButtons(){
  var lastTap=0;
  ["quitBtn","prevBtn","nextBtn","bossQuitBtn","bossPrevBtn","bossNext"].forEach(function(id){
    var el=$(id); if(!el) return;
    el.addEventListener("touchend",function(ev){
      var now=Date.now();
      if(now-lastTap<500) return;
      lastTap=now;
      ev.preventDefault();
      ev.stopPropagation();
      el.click();
    },{passive:false});
  });
}
function wireBottomNav(){
  if(navWired) return;
  navWired=true;
  function runNav(id,e){
    var now=Date.now();
    if(now-lastNavTap<400) return;
    lastNavTap=now;
    if(e&&e.preventDefault) e.preventDefault();
    if(e&&e.stopPropagation) e.stopPropagation();
    dismissBlockingUI();
    if(id==="navMapBtn") returnToMap();
    else if(id==="navBossBtn"){ hydrateNorthernBoss(); renderBossList(); show("screenBossList"); }
    else if(id==="navDailyBtn") show("screenDaily");
    else if(id==="navStatsBtn"){ renderProfile(); show("screenProfile"); }
    else if(id==="navHomeBtn") show("screenHome");
    else if(id==="navManagerBtn"){ renderManager(); show("screenManager"); }
  }
  window.__gdvRunNav=runNav;
  ["navHomeBtn","navDailyBtn","navMapBtn","navBossBtn","navStatsBtn","navManagerBtn"].forEach(function(nid){
    var el=$(nid);
    if(!el) return;
    el.addEventListener("click",function(ev){ runNav(nid,ev); });
    el.addEventListener("touchend",function(ev){ runNav(nid,ev); },{passive:false});
  });
  window.addEventListener("resize",function(){
    syncBottomShellHeight();
    if($("screenMap")&&$("screenMap").classList.contains("map-screen-fit")) measureMapViewport();
    if($("screenBoss")&&$("screenBoss").classList.contains("active")) renderBossChainVisual();
  },{passive:true});
  window.addEventListener("orientationchange",function(){
    setTimeout(function(){
      if($("screenBoss")&&$("screenBoss").classList.contains("active")) renderBossChainVisual();
    },120);
  },{passive:true});
}
function init(){
  try{
  sanitizeA11y(); ensureManagerMode(); ensureUxState();
  initUxFromUrl(); applyUxMode();
  dismissBlockingUI();
  applyI18n(); applyA11y(); applyTheme(); applySimpleUi(); applyCosmetics(); applyFocusLearn(); applyProductionUi(); ensureDaily(); ensureWeekly(); ensureTeamScores(); ensureStreak(); refreshHud();
  requestAnimationFrame(syncBottomShellHeight);
  applyHeroCompact(); updateSetupBanner(); renderA11yCatalog();
  updateNavBadges();
  try{ renderStreakCard(); }catch(e){ console.error(e); }
  try{ renderWeekCard(); }catch(e){ console.error(e); }
  try{ renderDaily(); }catch(e){ console.error(e); }
  try{ renderNextStep(); }catch(e){ console.error(e); }
  renderHomeHowStrip(); renderMissionsFocus(); renderUxBanner();
  renderHomeLoopPreview(); updateHomeCtaLayout();
  updateManagerNav();
  try{ updateHeroCaption(); }catch(e){ console.error(e); }
  document.querySelectorAll(".lang-card").forEach(function(x){ x.setAttribute("aria-pressed",x.getAttribute("data-lang")===S.lang?"true":"false"); });
  bind();
  try{ bindMapPanZoom(); }catch(e){ console.error(e); }
  ensureBossStats(); hydrateNorthernBoss(); checkMedals(); showOnboarding();
  if("speechSynthesis" in window){ try{ window.speechSynthesis.getVoices(); }catch(e){} }
  }catch(err){
    console.error("init",err);
    try{ bind(); }catch(e2){ console.error("bind recovery",e2); }
  }
}
function progressPct(){
  ensureDaily(); ensureWeekly();
  var map=Object.keys(S.done).length/Math.max(1,COUNTRIES.length)*30;
  var boss=bossCompletedCount()/Math.max(1,BOSSES.length)*24;
  var week=0, wp=S.weekly.prog||{};
  WEEKLY.forEach(function(w){ week+=Math.min(1,(wp[w.id]||0)/w.goal); });
  week=week/Math.max(1,WEEKLY.length)*20;
  var daily=S.daily.done.mission?10:0;
  var onboard=(S.onboardingDone?2:0)+(setupComplete()?2:0);
  var streak=Math.min(12,Math.round(((S.streak&&S.streak.best)||0)*12/25));
  return Math.min(100,Math.round(map+boss+week+daily+onboard+streak));
}
window.gdvDemoApi={
  getState:function(){ return S; },
  getDef:function(){ return DEF; },
  save:save,
  storeKey:STORE_KEY,
  toast:toast,
  lang:L,
  show:show,
  countryIds:function(){ return COUNTRIES.map(function(c){ return c.id; }); },
  bossesCount:function(){ return BOSSES.length; },
  bossIds:function(){ return BOSSES.map(function(b){ return b.id; }); },
  bossCompletedCount:bossCompletedCount,
  bossMetrics:bossDefaultMetrics,
  bossSaveRun:bossSaveRun,
  xpForLevel:xpForLevel,
  xpForMaxLevel:xpForMaxLevel,
  fillThemeStats:function(pct){
    var acc=Math.max(0,Math.min(100,pct|0)), c=Math.round(acc/5), t=20;
    S.themeStats={};
    Object.keys(THEMES).forEach(function(k){ S.themeStats[k]={c:c,t:t}; });
  },
  fillThemeStatsMixed:function(map){
    S.themeStats={};
    Object.keys(THEMES).forEach(function(k){
      var acc=map&&map[k]!=null?Math.max(0,Math.min(100,map[k]|0)):70;
      var t=20, c=Math.max(0,Math.round(acc/100*t));
      S.themeStats[k]={c:c,t:t};
    });
  },
  seedMissed:function(items){
    ensureMissed();
    var today=todayNum();
    (items||[]).forEach(function(it){
      if(!it||!it.id) return;
      S.missed[it.id]={interval:0,streak:0,theme:it.theme||"phishing",nextReview:today,lastSeen:today-1};
    });
  },
  seedGlossary:function(termIds, quizzes){
    S.glossaryLearned=S.glossaryLearned||{};
    (termIds||[]).forEach(function(id){ S.glossaryLearned[id]=true; });
    if(quizzes) S.glossaryQuizDone=quizzes;
  },
  computeNextStep:computeNextStep,
  progressPct:progressPct,
  journeyCompletionPct:journeyCompletionPct,
  ensureDaily:ensureDaily,
  ensureWeekly:ensureWeekly,
  bumpWeekly:bumpWeekly,
  todayKey:todayKey,
  weekKey:weekKey,
  checkMedals:checkMedals,
  medalsEarned:medalsEarned,
  chainById:chainById,
  toggleSettingsMenu:toggleSettingsMenu,
  toggleGlossaryMenu:toggleGlossaryMenu,
  closeOverlays:function(){ dismissBlockingUI(); },
  refreshAll:function(){
    refreshHud(); applyCosmetics(); renderNextStep(); renderWeekCard(); renderDaily(); renderWeekly();
    renderWeekProgressBar(); renderFirstDayHint(); updateSetupBanner(); updateNavBadges(); updateManagerNav();
    renderHomeHowStrip(); renderMissionsFocus(); renderUxBanner(); applyUxMode();
    checkMedals(); renderBossList();
    if($("screenMap")&&$("screenMap").classList.contains("active")){ try{ drawMap(); renderMapExpedition(); }catch(e){} }
    if($("screenProfile")&&$("screenProfile").classList.contains("active")) renderProfile();
    if($("screenShop")&&$("screenShop").classList.contains("active")) renderShop();
  },
  nav:{
    home:function(){ show("screenHome"); },
    map:function(){ openMap(null,true,true); },
    daily:function(){ renderDaily(); renderWeekly(); show("screenDaily"); },
    boss:function(){ renderBossList(); show("screenBossList"); },
    profile:function(){ renderProfile(); show("screenProfile"); },
    shop:function(){ renderShop(); show("screenShop"); },
    setup:function(){ openFirstSetup(); },
    manager:function(){ renderManager(); show("screenManager"); },
    review:function(){ show("screenReview"); if(typeof window.initReviewBank==="function") window.initReviewBank(); }
  }
};
if(typeof window.initDemoMenu==="function") window.initDemoMenu(window.gdvDemoApi);
window.__gdvStartBoss=function(id){ startBoss(id); };
window.__gdvCmapScene=cmapScene;
window.__gdvOffmapScene=offmapScene;
window.__gdvChainById=chainById;
wireBottomNav();
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
else init();
})();
