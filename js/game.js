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
var DEF = { lang:"pt", name:"", team:"mina", role:"admin",
  xp:0, coins:0, score:0, lives:3, avatar:"🛡️", resilience:100,
  a11y:{voice:false, contrast:false, large:false, motion:false, signs:false, fontScale:0, links:false, spacing:false, letterSpace:false, dyslexia:false, colorblind:"none", readingMode:false},
  done:{}, themeStats:{}, medals:{}, owned:{}, equipped:{avatar:"🛡️",frame:"default",skin:"default"},
  bossDone:{}, bossStats:{}, onboardingDone:false, daily:{date:"",done:{}}, weekly:{week:"",prog:{}}, teamScores:{},
  chainDone:{}, streak:{count:0,lastDate:"",best:0}, missed:{}, reports:0, managerMode:false, focusLearn:false, simpleUi:true, theme:"default" };
var S = merge(load(), DEF);

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
  "home.badge":{pt:"Operações globais • Cyber Security",en:"Global operations • Cyber Security"},
  "home.title":{pt:'Você é o <span class="accent">Guardião Cibernético</span>',en:'You are the <span class="accent">Cyber Guardian</span>'},
  "home.desc":{pt:"Treino simples para tomar decisões certas em segurança digital — proteja a operação da Orbita no mundo todo.",en:"Simple training to make the right digital security decisions — protect Orbita's operations worldwide."},
  "home.mission":{pt:"🎯 <b>Sua missão:</b> identificar riscos em minas, plantas, portos e escritórios. Enfrente crises simuladas, explore o mapa mundial e evolua como guardião digital.",en:"🎯 <b>Your mission:</b> spot risks across mines, plants, ports and offices. Face simulated crises, explore the world map and grow as a digital guardian."},
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
  "settings.glossaryPh":{pt:"Ex.: MFA, DLP, phishing…",en:"e.g. MFA, DLP, phishing…"},
  "settings.glossaryPick":{pt:"Escolha um termo",en:"Choose a term"},
  "settings.glossaryFun":{pt:"No seu dia a dia",en:"In your daily life"},
  "settings.openA11y":{pt:"♿ Acessibilidade",en:"♿ Accessibility"},
  "hud.tip.settings":{pt:"Configurações — tema, glossário e mais",en:"Settings — theme, glossary and more"},
  "a11y.shortLabel":{pt:"Acessibilidade",en:"Accessibility"},
  "a11y.sec.read":{pt:"Leitura e narração",en:"Reading & narration"},
  "a11y.sec.visual":{pt:"Visual e cores",en:"Visual & colors"},
  "a11y.sec.text":{pt:"Texto e tipografia",en:"Text & typography"},
  "a11y.sec.signs":{pt:"Libras / ASL",en:"Sign language"},
  "home.start":{pt:"▶️ Começar",en:"▶️ Start"},
  "home.playNow":{pt:"▶️ Jogar agora",en:"▶️ Play now"},
  "home.weekLine":{pt:"Semana: {theme} · Acertos {correct}/20 · Campanhas {campaign}/3 · Missão {daily}",en:"Week: {theme} · Correct {correct}/20 · Campaigns {campaign}/3 · Mission {daily}"},
  "home.map":{pt:"🗺️ Mapa da Operação",en:"🗺️ Operations Map"},
  "home.install":{pt:"⬇️ Instalar app",en:"⬇️ Install app"},
  "home.heroIronTip":{pt:"Toque para explorar a cadeia operacional em Desafios / Crises.",en:"Tap to explore the operational chain in Challenges / Crises."},
  "home.chain":{pt:"⛓️ Cadeia de Produção",en:"⛓️ Production Chain"},
  "home.weekTitle":{pt:"Minha semana",en:"My week"},
  "home.weekSub":{pt:"Metas da semana e próximo passo recomendado.",en:"Weekly goals and your recommended next step."},
  "home.weekPlay":{pt:"Jogar agora →",en:"Play now →"},
  "home.nextStart":{pt:"Comece por aqui",en:"Start here"},
  "home.nextContinue":{pt:"Continue de onde parou",en:"Continue where you left off"},
  "home.nextDaily":{pt:"Sua missão diária está esperando",en:"Your daily mission is waiting"},
  "home.nextDailySub":{pt:"5 situações rápidas mantêm sua ofensiva e priorizam o que você errou.",en:"5 quick scenarios keep your streak and prioritize what you missed."},
  "home.nextCampaignSub":{pt:"Sua expedição continua — proteja o próximo país no mapa e avance na meta semanal.",en:"Your expedition continues — protect the next country on the map and advance your weekly goal."},
  "home.nextBoss":{pt:"Enfrente uma crise",en:"Face a crisis"},
  "home.nextBossSub":{pt:"Desafios / Crises estilo mesa elevam sua maturidade operacional.",en:"Tabletop Challenges / Crises raise your operational maturity."},
  "home.nextReview":{pt:"Revise seus erros",en:"Review your mistakes"},
  "home.nextReviewSub":{pt:"Você tem {n} itens em revisão espaçada prontos para hoje.",en:"You have {n} items in spaced review ready for today."},
  "home.nextGoDaily":{pt:"▶️ Jogar diária",en:"▶️ Play daily"},
  "home.nextGoMap":{pt:"🗺️ Abrir mapa",en:"🗺️ Open map"},
  "home.nextGoBoss":{pt:"🎯 Ver Desafios / Crises",en:"🎯 See Challenges / Crises"},
  "home.nextGoReview":{pt:"📚 Revisar agora",en:"📚 Review now"},
  "home.weekTheme":{pt:"Tema da semana",en:"Week theme"},
  "home.weekCorrect":{pt:"Acertos semanais",en:"Weekly correct"},
  "home.weekCampaign":{pt:"Campanhas",en:"Campaigns"},
  "home.weekDaily":{pt:"Diária",en:"Daily"},
  "home.weekBoss":{pt:"Crise",en:"Crisis"},
  "mode.mapchain.h":{pt:"Cadeia em Desafios / Crises",en:"Chain in Challenges / Crises"},
  "mode.mapchain.t":{pt:"Aventura Carajás → China em etapas — proteja cada elo da logística de ferro.",en:"Carajás → China adventure in stages — protect each iron logistics link."},
  "map.reset":{pt:"Ver mundo",en:"View world"},
  "map.detailChain":{pt:"Etapa da cadeia",en:"Chain stage"},
  "map.chainImpact":{pt:"Impacto na cadeia",en:"Chain impact"},
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
  "streak.title":{pt:"🔥 Ofensiva",en:"🔥 Streak"},
  "streak.sub":{pt:"Jogue todo dia para manter sua sequência e ganhar bônus.",en:"Play every day to keep your streak and earn bonuses."},
  "streak.days":{pt:"dias seguidos",en:"day streak"},
  "streak.best":{pt:"Recorde",en:"Best"},
  "streak.today":{pt:"✅ Ofensiva mantida hoje!",en:"✅ Streak kept today!"},
  "streak.risk":{pt:"⚠️ Jogue hoje para não perder sua ofensiva!",en:"⚠️ Play today to keep your streak!"},
  "streak.new":{pt:"🔥 Ofensiva iniciada! Dia 1.",en:"🔥 Streak started! Day 1."},
  "streak.up":{pt:"🔥 Ofensiva: ",en:"🔥 Streak: "},
  "streak.lost":{pt:"Ofensiva reiniciada.",en:"Streak reset."},
  "hud.tip.lang":{pt:"Idioma do jogo — toque na bandeira PT ou EN.",en:"Game language — tap the PT or EN flag."},
  "hud.tip.langPt":{pt:"Jogar em Português",en:"Play in Portuguese"},
  "hud.tip.langEn":{pt:"Jogar em Inglês",en:"Play in English"},
  "lang.switchLabel":{pt:"Idioma do jogo",en:"Game language"},
  "hud.tip.title":{pt:"Seu título na carreira — evolui conforme você acumula XP nas missões.",en:"Your career title — grows as you earn XP from missions."},
  "hud.tip.lives":{pt:"Vidas restantes — você perde uma ao errar em situações críticas; recupere jogando bem.",en:"Lives remaining — you lose one on critical mistakes; recover by playing well."},
  "hud.tip.streak":{pt:"Ofensiva — dias seguidos jogando; mantenha a sequência para bônus de moedas.",en:"Streak — consecutive days played; keep it going for coin bonuses."},
  "hud.tip.level":{pt:"Nível do guardião — sobe a cada 50 XP; desbloqueia conquistas.",en:"Guardian level — increases every 50 XP; unlocks achievements."},
  "hud.tip.xp":{pt:"Pontos de experiência (XP) — ganhos em campanhas, diárias, semanais e Desafios / Crises.",en:"Experience points (XP) — earned in campaigns, dailies, weeklies and Challenges / Crises."},
  "hud.tip.coins":{pt:"Moedas — moeda do jogo para comprar avatares, molduras e temas na loja.",en:"Coins — in-game currency to buy avatars, frames and themes in the shop."},
  "hud.tip.score":{pt:"Pontuação geral — soma do seu desempenho em acertos e missões concluídas.",en:"Overall score — sum of your performance in correct answers and completed missions."},
  "hud.tip.maturity":{pt:"Maturidade operacional — média em Desafios / Crises.",en:"Operational maturity — average across Challenges / Crises."},
  "hud.tip.fontDown":{pt:"Diminuir fonte — reduz o tamanho do texto em toda a interface.",en:"Decrease font — reduces text size across the interface."},
  "hud.tip.fontScale":{pt:"Tamanho atual da fonte — 0 é o padrão; use A− e A+ para ajustar.",en:"Current font size — 0 is default; use A− and A+ to adjust."},
  "hud.tip.fontUp":{pt:"Aumentar fonte — amplia o tamanho do texto em toda a interface.",en:"Increase font — enlarges text size across the interface."},
  "hud.tip.contrast":{pt:"Alto contraste — alterna cores fortes para facilitar a leitura.",en:"High contrast — toggles strong colors for easier reading."},
  "hud.tip.a11y":{pt:"Menu de acessibilidade — idioma, voz, Libras, contraste, fonte e mais opções.",en:"Accessibility menu — language, voice, sign language, contrast, font and more."},
  "hud.tip.voice":{pt:"Narração por voz — lê em voz alta cenários e opções do quiz.",en:"Voice narration — reads scenarios and quiz options aloud."},
  "streak.bonus":{pt:"Bônus de ofensiva!",en:"Streak bonus!"},
  "streak.bonusXp":{pt:"Bônus de ofensiva! +{n} XP",en:"Streak bonus! +{n} XP"},
  "manager.demo":{pt:"ℹ️ Piloto local — métricas reais deste dispositivo para sua equipe. Integração corporativa agregada requer backend/LMS.",en:"ℹ️ Local pilot — real metrics from this device for your team. Corporate aggregation requires backend/LMS."},
  "manager.yourTeam":{pt:"Sua equipe (dados reais)",en:"Your team (real data)"},
  "manager.pending":{pt:"Outras equipes — aguardando dados agregados corporativos",en:"Other teams — awaiting corporate aggregated data"},
  "manager.recTitle":{pt:"💡 Recomendações pedagógicas",en:"💡 Pedagogical recommendations"},
  "manager.recEmpty":{pt:"Jogue campanhas, diárias ou Desafios / Crises para gerar recomendações.",en:"Play campaigns, dailies or Challenges / Crises to generate recommendations."},
  "pedagogy.recTitle":{pt:"🎯 Plano de estudo sugerido",en:"🎯 Suggested study plan"},
  "pedagogy.recWeak":{pt:"Reforce o tema",en:"Strengthen theme"},
  "pedagogy.recPlay":{pt:"Jogar agora",en:"Play now"},
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
  "profile.streakStat":{pt:"Ofensiva",en:"Streak"},
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
  "setup.namePh":{pt:"Seu nome ou apelido",en:"Your name or nickname"},
  "setup.badge":{pt:"🗺️ Expedição global",en:"🗺️ Global expedition"},
  "setup.head":{pt:"Prepare sua missão de treino",en:"Prepare your training mission"},
  "setup.intro":{pt:"Explore o mapa país a país — cada região traz situações de cyber security ligadas à operação da Orbita. Equipe e papel personalizam os cenários.",en:"Explore the map country by country — each region brings cyber security scenarios tied to Orbita's operations. Team and role personalize the scenarios."},
  "setup.teamTitle":{pt:"Equipe",en:"Team"},
  "setup.teamSub":{pt:"Ranking anônimo — celebramos a evolução do time, nunca expomos quem errou.",en:"Anonymous ranking — we celebrate team growth, never exposing who erred."},
  "setup.roleTitle":{pt:"Papel no dia a dia",en:"Your day-to-day role"},
  "setup.roleSub":{pt:"As situações do mapa se adaptam à sua rotina (escritório, campo, OT ou liderança).",en:"Map scenarios adapt to your routine (office, field, OT or leadership)."},
  "setup.go":{pt:"▶️ Iniciar expedição no mapa",en:"▶️ Start expedition on map"},
  "setup.teamRequired":{pt:"Escolha uma equipe para continuar.",en:"Choose a team to continue."},
  "setup.roleRequired":{pt:"Escolha um papel para continuar.",en:"Choose a role to continue."},
  "setup.managerTitle":{pt:"🧭 Modo gestor",en:"🧭 Manager mode"},
  "setup.managerSub":{pt:"Ative se você acompanha métricas da equipe. O painel aparece no menu Mais.",en:"Enable if you track team metrics. The panel appears in the More menu."},
  "setup.managerLabel":{pt:"Exibir painel do gestor",en:"Show manager panel"},
  "setup.prefsTitle":{pt:"⚙️ Preferências",en:"⚙️ Preferences"},
  "setup.prefsSub":{pt:"Ajuste o jogo ao seu perfil. Você pode mudar depois no Progresso.",en:"Adjust the game to your profile. You can change it later in Progress."},
  "setup.focusLabel":{pt:"🎯 Foco em aprender",en:"🎯 Focus on learning"},
  "setup.focusDesc":{pt:"Reduz ênfase em moedas e recompensas cosméticas para focar no conteúdo.",en:"Reduces emphasis on coins and cosmetic rewards to focus on content."},
  "footer.brand":{pt:"Guardião Cibernético",en:"Cyber Guardian"},
  "daily.srsDue":{pt:"{n} revisões espaçadas priorizadas na missão de hoje",en:"{n} spaced reviews prioritized in today's mission"},
  "map.vwmTitle":{pt:"A Orbita no mundo",en:"Orbita in the world"},
  "map.vwmHelper":{pt:"Toque num país para iniciar a expedição",en:"Tap a country to start the expedition"},
  "map.zoomToggle":{pt:"🔍 Ajustar zoom",en:"🔍 Adjust zoom"},
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
  "profile.reviewTitle":{pt:"📚 Revisão",en:"📚 Review"},
  "profile.reviewSub":{pt:"Treine seus erros ou consulte o banco de perguntas para autores.",en:"Train your mistakes or open the question bank for authors."},
  "profile.reviewTrain":{pt:"📚 Treinar meus erros",en:"📚 Train my mistakes"},
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
  "onboard.setupT":{pt:"1) Idioma e acessibilidade",en:"1) Language & accessibility"},
  "onboard.setupB":{pt:"Escolha o idioma e, se quiser, ative narração por voz, contraste ou Libras. Você pode mudar depois no menu ♿ do topo.",en:"Choose your language and optionally enable voice narration, contrast or sign language. You can change these later in the top ♿ menu."},
  "onboard.playT":{pt:"2) Como funciona",en:"2) How it works"},
  "onboard.playB":{pt:"Explore países no mapa, faça a missão diária e enfrente crises simuladas. Cada acerto fortalece a operação — erros mostram o que revisar.",en:"Explore countries on the map, play the daily mission and face simulated crises. Each correct answer strengthens operations — mistakes show what to review."},
  "onboard.readyT":{pt:"3) Pronto para jogar",en:"3) Ready to play"},
  "onboard.readyB":{pt:"Toque em Jogar agora na tela inicial. O jogo sugere sempre o melhor próximo passo para você.",en:"Tap Play now on the home screen. The game always suggests your best next step."},
  "quiz.personal":{pt:"💡 Na sua vida",en:"💡 In your life"},
  "progress.hub":{pt:"🔗 Como os modos se conectam",en:"🔗 How modes connect"},
  "progress.hubSub":{pt:"Tudo alimenta o mesmo progresso: XP, temas, conquistas, resiliência e certificado.",en:"Everything feeds the same progress: XP, themes, achievements, resilience and certificate."},
  "progress.reviewBank":{pt:"📋 Revisar banco de perguntas",en:"📋 Review question bank"},
  "progress.map":{pt:"Mapa",en:"Map"},
  "progress.mapD":{pt:"Campanhas por país no mapa mundial.",en:"Country campaigns on the world map."},
  "progress.daily":{pt:"Diária",en:"Daily"},
  "progress.dailyD":{pt:"5 situações (2 revisões de erros + temas fracos). Mantém ofensiva.",en:"5 scenarios (2 error reviews + weak themes). Keeps streak."},
  "progress.boss":{pt:"Desafios / Crises",en:"Challenges / Crises"},
  "progress.bossD":{pt:"Cadeia Norte + crises simuladas estilo mesa. Alimenta maturidade, conquistas e selo do certificado.",en:"Northern Chain + tabletop simulated crises. Feeds maturity, achievements and certificate seal."},
  "progress.weekly":{pt:"Semanal",en:"Weekly"},
  "progress.weeklyD":{pt:"Metas que somam automaticamente enquanto você joga qualquer modo acima.",en:"Goals that add up automatically as you play any mode above."},
  "daily.title":{pt:"📅 Missões Diárias",en:"📅 Daily Missions"},
  "daily.play":{pt:"▶️ Jogar missão do dia",en:"▶️ Play today's mission"},
  "weekly.title":{pt:"🏆 Desafios Semanais",en:"🏆 Weekly Challenges"},
  "weekly.intro":{pt:"Metas maiores que renovam toda semana. Progridem enquanto você joga campanhas, diárias e Desafios / Crises.",en:"Bigger goals that refresh every week. They progress as you play campaigns, dailies and Challenges / Crises."},
  "weekly.play":{pt:"🗺️ Jogar campanha",en:"🗺️ Play a campaign"},
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
  "profile.radarSub":{pt:"Seus pontos fortes e fracos por área de segurança.",en:"Your strengths and weaknesses by security area."},
  "profile.ach":{pt:"🏅 Conquistas",en:"🏅 Achievements"},
  "profile.certTitle":{pt:"📜 Certificado",en:"📜 Certificate"},
  "profile.certSub":{pt:"Gere seu certificado a qualquer momento com seu progresso atual — não é necessário concluir o jogo.",en:"Generate your certificate anytime with your current progress — no need to finish the game."},
  "profile.certAria":{pt:"Prévia do certificado de participação",en:"Participation certificate preview"},
  "profile.certGenerate":{pt:"🔄 Atualizar prévia",en:"🔄 Refresh preview"},
  "profile.certDownload":{pt:"⬇️ Baixar PNG",en:"⬇️ Download PNG"},
  "profile.certPrint":{pt:"🖨️ Imprimir",en:"🖨️ Print"},
  "profile.certAch":{pt:"Conquistas",en:"Achievements"},
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
  "nav.weekly":{pt:"Semanal",en:"Weekly"},
  "nav.shop":{pt:"Loja",en:"Shop"},
  "nav.stats":{pt:"Progresso",en:"Progress"},
  "nav.manager":{pt:"Gestor",en:"Manager"},
  "nav.tip.home":{pt:"Início — idioma, acessibilidade e começar",en:"Home — language, accessibility and start"},
  "nav.tip.map":{pt:"Mapa — campanhas por país",en:"Map — country campaigns"},
  "nav.tip.daily":{pt:"Missões diárias",en:"Daily missions"},
  "nav.tip.more":{pt:"Mais opções — início e gestor",en:"More options — home and manager"},
  "nav.tip.boss":{pt:"Desafios / Crises — crises simuladas estilo mesa com storytelling",en:"Challenges / Crises — tabletop simulated crises with storytelling"},
  "nav.tip.weekly":{pt:"Desafios semanais",en:"Weekly challenges"},
  "nav.tip.shop":{pt:"Loja de avatares e temas",en:"Avatar and theme shop"},
  "nav.tip.stats":{pt:"Seu progresso e medalhas",en:"Your progress and medals"},
  "nav.tip.manager":{pt:"Painel do gestor",en:"Manager dashboard"},
  "footer.txt":{pt:"conscientização em Cyber Security e Segurança da Informação — Orbita.",en:"Cyber Security and Information Security awareness — Orbita."}
};
function t(key){ var e=UI[key]; return e? (e[L()]||e.pt) : key; }
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
  var dl=$("glossaryDatalist");
  if(dl){
    dl.innerHTML="";
    GLOSSARY.forEach(function(g){ var op=document.createElement("option"); op.value=g.term+" — "+tt(g.name); dl.appendChild(op); });
  }
  renderGlossarySelect();
}
function applyHudTips(){
  var map={
    langSwitch:"hud.tip.lang", langPtBtn:"hud.tip.langPt", langEnBtn:"hud.tip.langEn",
    hudTitle:"hud.tip.title", hudLives:"hud.tip.lives",
    hudStreak:"hud.tip.streak", hudLevelChip:"hud.tip.level", hudXpChip:"hud.tip.xp",
    hudCoinsChip:"hud.tip.coins", hudScoreChip:"hud.tip.score", hudMaturityChip:"hud.tip.maturity",
    a11yBtn:"hud.tip.a11y", voiceBtn:"hud.tip.voice", settingsBtn:"hud.tip.settings",
    onboardOpenBtn:"onboard.reopenTip"
  };
  for(var id in map){ var el=$(id); if(el) el.setAttribute("title", t(map[id])); }
}
function setLang(lang){
  if(lang!=="pt"&&lang!=="en") return;
  S.lang=lang; save();
  document.querySelectorAll(".lang-card").forEach(function(x){ x.setAttribute("aria-pressed",x.getAttribute("data-lang")===lang?"true":"false"); });
  applyI18n(); renderTeams(); renderRoles(); refreshHud(); applySignLanguage(); renderGlossarySelect();
  var ov=$("onboardOverlay"); if(ov&&!ov.hidden) renderOnboarding();
  if($("screenMap").classList.contains("active")){ drawMap(); renderMapExpedition(); }
}

/* -------------------- EQUIPES / TEAMS -------------------- */
var TEAMS = [
  {id:"mina", ico:"⛏️", pt:"Mina", en:"Mine"},
  {id:"ferrovia", ico:"🚂", pt:"Ferrovia", en:"Railway"},
  {id:"porto", ico:"🚢", pt:"Porto", en:"Port"},
  {id:"corporativo", ico:"🏢", pt:"Corporativo", en:"Corporate"},
  {id:"ti", ico:"💻", pt:"TI & Segurança", en:"IT & Security"},
  {id:"ot", ico:"🏭", pt:"Automação (OT)", en:"Automation (OT)"}
];

var ROLE_THEMES={admin:["phishing","password","data","bec","device"],field:["port","ot","device","phishing","data"],ot:["ot","device","password","phishing","port"],leader:["bec","data","phishing","remote","ot"]};
var ROLES = [
  {id:"admin", ico:"🏢", pt:"Administrativo", en:"Office", ptd:"E-mails, planilhas, sistemas", end:"Emails, spreadsheets, systems"},
  {id:"field", ico:"⛏️", pt:"Operação/Campo", en:"Field/Operations", ptd:"Mina, ferrovia, porto", end:"Mine, railway, port"},
  {id:"ot",    ico:"🏭", pt:"Automação (OT)", en:"Automation (OT)", ptd:"Sistemas industriais/ICS", end:"Industrial systems/ICS"},
  {id:"leader",ico:"🧭", pt:"Liderança", en:"Leadership", ptd:"Gestão e decisões", end:"Management & decisions"}
];

/* -------------------- PROGRESSÃO / TITLES -------------------- */
var TITLES = [
  {xp:0,   ico:"🌱", pt:"Estagiário", en:"Intern"},
  {xp:60,  ico:"🛡️", pt:"Guardião Jr.", en:"Junior Guardian"},
  {xp:150, ico:"⚔️", pt:"Guardião Pleno", en:"Guardian"},
  {xp:300, ico:"🎖️", pt:"Guardião Sênior", en:"Senior Guardian"},
  {xp:500, ico:"👑", pt:"Mestre da Segurança", en:"Security Master"}
];
function currentTitle(){ var tI=TITLES[0]; for(var i=0;i<TITLES.length;i++) if(S.xp>=TITLES[i].xp) tI=TITLES[i]; return tI; }
function levelOf(){ return Math.floor(S.xp/50)+1; }

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
    desc:{pt:"A Orbita atua no Brasil de forma integrada, combinando mineração, logística e energia. Produz principalmente minério de ferro e metais como níquel e cobre, e opera ferrovias, portos e trens que conectam as operações aos mercados globais — com presença em iniciativas socioambientais e culturais nos territórios onde está presente.",en:"In Brazil, Orbita operates in an integrated way, combining mining, logistics and energy. It mainly produces iron ore and metals such as nickel and copper, and runs railways, ports and trains connecting operations to global markets — with a relevant presence in social, environmental and cultural initiatives in the territories where it operates."},
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
  {id:"first", ico:"🎖️", name:{pt:"Primeira Campanha",en:"First Campaign"}, test:function(){ return Object.keys(S.done).length>=1; }},
  {id:"perfect", ico:"💯", name:{pt:"Campanha Perfeita",en:"Perfect Campaign"}, test:function(){ for(var k in S.done) if(S.done[k]>=100) return true; return false; }},
  {id:"explorer", ico:"🧭", name:{pt:"Explorador Global",en:"Global Explorer"}, test:function(){ return Object.keys(S.done).length>=5; }},
  {id:"worldwide", ico:"🌎", name:{pt:"Guardião Mundial",en:"Worldwide Guardian"}, test:function(){ return Object.keys(S.done).length>=COUNTRIES.length; }},
  {id:"boss", ico:"🐉", name:{pt:"Caçador de Crises",en:"Crisis Hunter"}, test:function(){ return bossCompletedCount()>=1; }},
  {id:"bossAll", ico:"🛡️", name:{pt:"Cadeia Protegida",en:"Chain Protected"}, test:function(){ return bossCompletedCount()>=BOSSES.length; }},
  {id:"bossLegend", ico:"👑", name:{pt:"Resiliência Lendária",en:"Legendary Resilience"}, test:function(){ return bossHasTier("legendary"); }},
  {id:"bossResil", ico:"💎", name:{pt:"Guardião Resiliente",en:"Resilient Guardian"}, test:function(){ return bossAvgIndex()>=75||bossGoldCount()>=3; }},
  {id:"rich", ico:"⭐", name:{pt:"Veterano",en:"Veteran"}, test:function(){ return S.xp>=250 || medalsEarned()>=5; }},
  {id:"streak7", ico:"🔥", name:{pt:"Ofensiva 7 dias",en:"7-day streak"}, test:function(){ return (S.streak&&S.streak.best>=7)||(S.streak&&S.streak.count>=7); }},
  {id:"streak30", ico:"💥", name:{pt:"Ofensiva 30 dias",en:"30-day streak"}, test:function(){ return S.streak&&S.streak.best>=30; }},
  {id:"master", ico:"👑", name:{pt:"Mestre da Segurança",en:"Security Master"}, test:function(){ return S.xp>=500; }}
];

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
var NAVMAP={screenMap:"navMapBtn",screenBossList:"navBossBtn",screenDaily:"navDailyBtn",screenProfile:"navStatsBtn",screenHome:"navHomeBtn",screenManager:"navManagerBtn"};
var NAV_MORE_SCREENS=["screenHome","screenManager"];
var NAV_HIDE=["screenQuiz","screenBoss","screenResult","screenSetup","screenBossResult"];
function toggleNavMore(open){
  var sheet=$("navMoreSheet"), btn=$("navMoreBtn");
  if(!sheet) return;
  var showSheet=open===undefined?!sheet.hidden:!!open;
  sheet.hidden=!showSheet;
  if(btn) btn.setAttribute("aria-expanded",showSheet?"true":"false");
}
function updateManagerNav(){
  var showMgr=!!S.managerMode;
  var btn=$("navManagerBtn"); if(btn) btn.hidden=!showMgr;
}
function show(id){
  stopSpeak();
  toggleNavMore(false);
  if(id!=="screenMap" && typeof glStop==="function") glStop();
  document.querySelectorAll(".screen").forEach(function(s){ s.classList.remove("active"); });
  var el=$(id); if(el) el.classList.add("active");
  if(id==="screenHome"){ renderNextStep(); renderWeekCard(); }
  window.scrollTo({top:0,behavior:S.a11y.motion?"auto":"smooth"});
  document.querySelectorAll(".bottom-nav button").forEach(function(b){ b.classList.remove("on"); });
  if(NAVMAP[id]){ var nb=$(NAVMAP[id]); if(nb) nb.classList.add("on"); }
  document.querySelectorAll(".nav-more-item").forEach(function(b){ b.classList.remove("on"); });
  if(NAV_MORE_SCREENS.indexOf(id)>=0&&NAVMAP[id]){ var mi=$(NAVMAP[id]); if(mi) mi.classList.add("on"); }
  document.body.classList.toggle("nav-hidden",NAV_HIDE.indexOf(id)>=0);
  announce(el?(el.getAttribute("aria-label")||""):"");
}
function announce(m){ var live=$("a11yLive"); if(!live) return; live.textContent=""; setTimeout(function(){ live.textContent=m; },40); }
function toast(m){ var w=$("toastWrap"); if(!w) return; w.innerHTML=""; var d=document.createElement("div"); d.className="toast"; d.textContent=m; w.appendChild(d); setTimeout(function(){ if(d.parentNode) d.remove(); },2200); }

/* -------------------- ACESSIBILIDADE -------------------- */
var A11Y_DEFAULT={voice:false,contrast:false,large:false,motion:false,signs:false,fontScale:0,links:false,spacing:false,letterSpace:false,dyslexia:false,colorblind:"none",readingMode:false};
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
  ["voice","contrast","large","motion","signs","links","spacing","letterSpace","dyslexia","readingMode"].forEach(function(k){
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
  var vb=$("voiceBtn"); if(vb){ var ic=vb.querySelector("span"); if(ic) ic.textContent=S.a11y.voice?"🔊":"🔈"; else vb.textContent=S.a11y.voice?"🔊":"🔈"; }
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
var GLOSSARY=[
  {id:"mfa",term:"MFA",name:{pt:"Autenticação multifator",en:"Multi-factor authentication"},def:{pt:"Confirma sua identidade com mais de uma prova — senha + código do celular, por exemplo.",en:"Confirms your identity with more than one proof — password plus phone code, for example."},fun:{pt:"É como entrar na portaria da mina: crachá + digitar um código que chega no seu celular. Só o crachá não basta.",en:"Like entering the mine gate: badge plus a code on your phone. The badge alone is not enough."}},
  {id:"dlp",term:"DLP",name:{pt:"Prevenção de vazamento de dados",en:"Data loss prevention"},def:{pt:"Ferramentas que impedem envio indevido de informações sensíveis — por e-mail, pendrive ou nuvem.",en:"Tools that block improper sharing of sensitive data — via email, USB or cloud."},fun:{pt:"Imagine um fiscal na saída do escritório que avisa: 'esse PDF com dados de produção não pode ir para seu e-mail pessoal'.",en:"Imagine a guard at the office exit saying: 'that production PDF cannot go to your personal email'."}},
  {id:"phishing",term:"Phishing",name:{pt:"Golpe por mensagem falsa",en:"Fake message scam"},def:{pt:"Mensagem que imita banco, TI ou colega para roubar senha ou clicar em link malicioso.",en:"A message mimicking your bank, IT or a colleague to steal passwords or click malicious links."},fun:{pt:"É o 'e-mail da diretoria urgente' pedindo gift card — só que a diretoria nunca pediu.",en:"The 'urgent email from leadership' asking for gift cards — except leadership never asked."}},
  {id:"ransomware",term:"Ransomware",name:{pt:"Sequestro digital",en:"Digital hostage-taking"},def:{pt:"Malware que criptografa arquivos e exige pagamento para liberar o acesso.",en:"Malware that encrypts files and demands payment to restore access."},fun:{pt:"Como alguém trancar o armário de EPIs e cobrar para devolver a chave — só que são seus relatórios e planilhas.",en:"Like someone locking the PPE cabinet and charging for the key — except it's your reports and spreadsheets."}},
  {id:"vpn",term:"VPN",name:{pt:"Rede privada virtual",en:"Virtual private network"},def:{pt:"Túnel criptografado entre seu dispositivo e a rede da empresa.",en:"Encrypted tunnel between your device and the company network."},fun:{pt:"É o corredor seguro entre sua casa e o escritório — em vez de andar pela rua exposta com documentos na mão.",en:"A secure corridor from home to the office — instead of walking the open street with documents in hand."}},
  {id:"firewall",term:"Firewall",name:{pt:"Barreira de rede",en:"Network barrier"},def:{pt:"Filtra tráfego entre redes, bloqueando acessos não autorizados.",en:"Filters traffic between networks, blocking unauthorized access."},fun:{pt:"Portaria da planta: só entra quem tem autorização; o resto fica do lado de fora.",en:"Plant security gate: only authorized people enter; everyone else stays outside."}},
  {id:"scada",term:"SCADA",name:{pt:"Supervisão de processos industriais",en:"Industrial process supervision"},def:{pt:"Sistema que monitora e comanda equipamentos em mina, usina ou ferrovia.",en:"System that monitors and controls equipment in mines, plants or railways."},fun:{pt:"O painel onde o operador vê se o britador, a esteira ou a bomba estão ok — como o painel do carro, mas da operação inteira.",en:"The dashboard where operators see if crushers, belts or pumps are OK — like a car dashboard for the whole operation."}},
  {id:"ot",term:"OT",name:{pt:"Tecnologia operacional",en:"Operational technology"},def:{pt:"Sistemas que controlam máquinas e processos físicos — distinto do TI de escritório.",en:"Systems controlling physical machines and processes — distinct from office IT."},fun:{pt:"TI cuida do e-mail; OT cuida do que mexe minério, vapor e trem. São vizinhos que precisam conversar.",en:"IT handles email; OT handles what moves ore, steam and trains. Neighbors that must talk to each other."}},
  {id:"bec",term:"BEC",name:{pt:"Fraude do e-mail do executivo",en:"Business email compromise"},def:{pt:"Golpe em que criminosos fingem ser diretores ou fornecedores para pedir pagamentos.",en:"Scam where criminals pose as executives or vendors to request payments."},fun:{pt:"O 'gerente' pedindo transferência urgente num sábado — mas o número da conta mudou. Sempre confirme por outro canal.",en:"The 'manager' requesting an urgent transfer on Saturday — but the account number changed. Always confirm another way."}},
  {id:"zerotrust",term:"Zero Trust",name:{pt:"Confiança zero",en:"Zero Trust"},def:{pt:"Modelo que não presume confiança só por estar na rede — valida identidade e contexto sempre.",en:"Model that never trusts you just because you're on the network — always validates identity and context."},fun:{pt:"Mesmo dentro da empresa, cada acesso é como passar de novo na catraca — não basta 'já conheço você'.",en:"Even inside the company, each access is like swiping the turnstile again — 'I know you' is not enough."}},
  {id:"patch",term:"Patch",name:{pt:"Atualização de correção",en:"Security update"},def:{pt:"Correção de falha em sistema ou aplicativo para fechar brecha explorável.",en:"Fix for a flaw in software to close an exploitable gap."},fun:{pt:"Remendo no capacete após recall — parece chato, mas evita acidente. Patch é o remendo digital.",en:"A helmet recall fix — tedious but prevents accidents. A patch is the digital fix."}},
  {id:"backup",term:"Backup",name:{pt:"Cópia de segurança",en:"Safety copy"},def:{pt:"Cópia dos dados para recuperar após falha, ransomware ou erro humano.",en:"Data copy to recover after failure, ransomware or human error."},fun:{pt:"Segunda chave do armário de documentos guardada com segurança — se perder a primeira, a operação não para.",en:"A second key to the document cabinet kept safe — lose the first and work still continues."}},
  {id:"malware",term:"Malware",name:{pt:"Software malicioso",en:"Malicious software"},def:{pt:"Programa criado para prejudicar, espionar ou tomar controle do dispositivo.",en:"Program designed to harm, spy on or take control of a device."},fun:{pt:"Como um 'aplicativo grátis' que na verdade copia sua agenda de contatos — só que na empresa pode parar a linha.",en:"Like a 'free app' that copies your contacts — except at work it can stop the line."}},
  {id:"soc",term:"SOC",name:{pt:"Centro de operações de segurança",en:"Security operations center"},def:{pt:"Equipe que monitora alertas 24/7 e coordena resposta a incidentes.",en:"Team monitoring alerts 24/7 and coordinating incident response."},fun:{pt:"A central de monitoramento da segurança — como a sala que vê câmeras da planta, mas para alertas digitais.",en:"Security's monitoring room — like the plant camera hub, but for digital alerts."}},
  {id:"spear",term:"Spear phishing",name:{pt:"Phishing direcionado",en:"Targeted phishing"},def:{pt:"Golpe personalizado para uma pessoa ou equipe específica, com detalhes críveis.",en:"Personalized scam aimed at a specific person or team with believable details."},fun:{pt:"Não é spam genérico — é mensagem com seu nome, sua obra e seu projeto. Por isso engana mais.",en:"Not generic spam — a message with your name, site and project. That's why it fools more people."}}
];
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
function syncGlossaryFromSearch(){
  var search=$("glossarySearch"), sel=$("glossaryPick");
  if(!search||!sel) return;
  var id=glossaryMatchFromSearch(search.value);
  renderGlossarySelect();
  if(id){ sel.value=id; showGlossaryTerm(id); }
}
function glossaryFilter(q){
  q=(q||"").toLowerCase().trim();
  if(!q) return GLOSSARY.slice();
  return GLOSSARY.filter(function(g){
    return g.term.toLowerCase().indexOf(q)>=0 || g.id.indexOf(q)>=0
      || (tt(g.name)||"").toLowerCase().indexOf(q)>=0
      || (tt(g.def)||"").toLowerCase().indexOf(q)>=0;
  });
}
function renderGlossarySelect(filter){
  var sel=$("glossaryPick"), search=$("glossarySearch");
  if(!sel) return;
  var q=search?search.value:"", list=glossaryFilter(q), cur=sel.value;
  sel.innerHTML='<option value="">'+t("settings.glossaryPick")+'</option>';
  list.forEach(function(g){
    var o=document.createElement("option");
    o.value=g.id;
    o.textContent=g.term+" — "+tt(g.name);
    sel.appendChild(o);
  });
  if(cur&&list.some(function(g){ return g.id===cur; })) sel.value=cur;
  else if(list.length===1){ sel.value=list[0].id; showGlossaryTerm(list[0].id); }
  else showGlossaryTerm(sel.value||null);
}
function showGlossaryTerm(id){
  var host=$("glossaryCard"); if(!host) return;
  if(!id){ host.innerHTML='<p class="glossary-empty muted">'+(L()==="pt"?"Escolha ou busque um termo acima.":"Pick or search a term above.")+'</p>'; return; }
  var g=GLOSSARY.filter(function(x){ return x.id===id; })[0];
  if(!g){ host.innerHTML=""; return; }
  host.innerHTML='<div class="glossary-term">'+g.term+'</div><div class="glossary-name">'+tt(g.name)+'</div><p class="glossary-def">'+tt(g.def)+'</p><div class="glossary-fun-k">'+t("settings.glossaryFun")+'</div><p class="glossary-fun">'+tt(g.fun)+'</p>';
}
function toggleSettingsMenu(force){
  var menu=$("settingsMenu"),btn=$("settingsBtn"),bd=$("a11yBackdrop");
  if(!menu) return;
  var open=force!==undefined?!!force:menu.hidden;
  if(open) toggleA11yMenu(false);
  menu.hidden=!open;
  if(btn) btn.setAttribute("aria-expanded",open?"true":"false");
  if(bd){ bd.hidden=!open; bd.setAttribute("aria-hidden",open?"false":"true"); }
  document.body.classList.toggle("settings-menu-open",open);
  if(open){ renderGlossarySelect(); var ts=$("themeSelect"); if(ts) ts.value=S.theme||"default"; }
}
function toggleA11yMenu(force){
  var menu=$("a11yMenu"),btn=$("a11yBtn"),bd=$("a11yBackdrop"); if(!menu) return;
  var open=force!==undefined?!!force:menu.hidden;
  if(open) toggleSettingsMenu(false);
  menu.hidden=!open;
  if(btn) btn.setAttribute("aria-expanded", open?"true":"false");
  if(bd){ bd.hidden=!open; bd.setAttribute("aria-hidden", open?"false":"true"); }
  document.body.classList.toggle("a11y-menu-open", open);
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
function refreshHud(){
  var xp=$("hudXp"), score=$("hudScore"), lvl=$("hudLevel"), title=$("hudTitle");
  if(xp) xp.textContent=S.xp;
  if(score) score.textContent=S.score;
  if(lvl) lvl.textContent=levelOf();
  if(title){ var ti=currentTitle(); title.textContent=ti.ico+" "+tt(ti); }
  ensureStreak();
  var hs=$("hudStreak"); if(hs) hs.textContent="🔥 "+(S.streak.count||0);
  ensureBossStats();
  var avg=bossAvgIndex(), chip=$("hudMaturityChip");
  if(chip) chip.textContent="🛡️ "+avg+"%";
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
function weakestThemeKey(){ var list=[],k; for(k in THEMES){ var a=themeAcc(k); list.push({k:k,acc:a===null?50:a}); } list.sort(function(a,b){ return a.acc-b.acc; }); return list[0]?list[0].k:null; }
function pedagogicalRecommendations(){
  var recs=[], weak=weakestThemeKey();
  if(weak) recs.push({ico:THEMES[weak].ico,txt:t("pedagogy.recWeak")+" "+tt(THEMES[weak]),action:"theme",theme:weak});
  if(Object.keys(S.missed||{}).length) recs.push({ico:"📚",txt:t("pedagogy.reviewErrors"),action:"review"});
  var wt=getWeekTheme(); recs.push({ico:THEMES[wt].ico,txt:(L()==="pt"?"Semana: ":"Week: ")+tt(THEMES[wt]),action:"weekly"});
  if((bossCompletedCount()||0)<1) recs.push({ico:"🎯",txt:L()==="pt"?"Pratique transferência: jogue uma crise":"Practice transfer: play a crisis",action:"boss"});
  return recs.slice(0,4);
}
function renderPedagogyRec(hostId){
  var host=$(hostId); if(!host) return;
  var recs=pedagogicalRecommendations();
  if(!recs.length){ host.innerHTML='<p class="muted">'+t("manager.recEmpty")+'</p>'; return; }
  host.innerHTML='<div class="ped-rec-title">'+t("pedagogy.recTitle")+'</div>';
  recs.forEach(function(r){
    var row=document.createElement("div"); row.className="ped-rec-item";
    row.innerHTML='<span class="ped-rec-ico">'+r.ico+'</span><span class="ped-rec-txt">'+r.txt+'</span>';
    var play=document.createElement("button"); play.className="btn btn-ghost btn-sm"; play.textContent=t("pedagogy.recPlay");
    play.addEventListener("click",function(){
      if(r.action==="review") startReviewErrors();
      else if(r.action==="boss"){ renderBossList(); show("screenBossList"); }
      else if(r.action==="weekly"){ renderWeekly(); show("screenWeekly"); }
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
function initQuizSession(){ cur.sessionLog=[]; cur.qStates={}; cur.optOrder={}; cur.reportPending=false; cur.reportDone=false; var rs=$("reportStep"); if(rs) rs.hidden=true; updateQuizResilienceVisibility(); }
function countQuizCorrect(){ var n=0,i; if(!cur.qStates) return 0; for(i=0;i<cur.questions.length;i++){ if(cur.qStates[i]&&cur.qStates[i].ok) n++; } return n; }
function rebuildSessionLog(){ cur.sessionLog=[]; var i; for(i=0;i<cur.questions.length;i++){ if(cur.qStates[i]) cur.sessionLog.push({q:cur.questions[i],ok:cur.qStates[i].ok,i:i}); } }
function updateQuizNav(){
  var prev=$("prevBtn"), next=$("nextBtn"); if(!prev||!next) return;
  prev.disabled=cur.i<=0||!!cur.reportPending;
  var answered=!!(cur.qStates&&cur.qStates[cur.i]);
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
  rs.innerHTML='<div class="report-title">'+t("report.title")+'</div><p class="report-sub">'+t("report.sub")+'</p><div class="report-btns"></div><p class="report-how">'+t("report.how")+'</p>';
  var box=rs.querySelector(".report-btns");
  [{k:"report.helpdesk"},{k:"report.security"},{k:"report.privacy"}].forEach(function(ch){
    var b=document.createElement("button"); b.className="btn btn-blue btn-sm"; b.textContent=t(ch.k);
    b.addEventListener("click",function(){ completeReport(); }); box.appendChild(b);
  });
  var sk=document.createElement("button"); sk.className="btn btn-ghost btn-sm"; sk.textContent=t("report.skip");
  sk.addEventListener("click",function(){ cur.reportPending=false; rs.hidden=true; updateQuizNav(); $("nextBtn").focus(); });
  box.appendChild(sk);
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
  var qs=allMissedQuestions();
  if(!qs.length){ toast(t("pedagogy.reviewEmpty")); return; }
  cur.mode="review"; cur.country={id:"review",name:{pt:"Revisão dos erros",en:"Mistake review"},flag:"📚"};
  cur.questions=shuffleQuestions(qs.slice()); cur.i=0; cur.correct=0; cur.integrity=100; S.lives=99; initQuizSession();
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
var VW=960,VH=520,mapProcess=null,chainStageActive=null,mapSearchQuery="",view={x:0,y:0,w:VW,h:VH};
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
var mapHitActive=null;
var THREAT_RESILIENCE={phishing:2,password:2,bec:3,malware:5,ransomware:15,ot:20,sap:25,data:3,device:4,remote:3,port:5};
function officialPresenceHTML(gameId){
  if(typeof OrbitaWorldMap==="undefined"||!OrbitaWorldMap.getCountry) return "";
  var off=OrbitaWorldMap.getCountry(gameId,L()); if(!off) return "";
  var h="";
  if(off.activities.length){
    h+='<div class="md-presence"><b>'+t("map.activityTitle")+':</b><div class="presence-row">'
      +off.activities.map(function(id){ return '<span class="presence-chip">'+OrbitaWorldMap.getActivityLabel(id,L())+'</span>'; }).join("")
      +'</div></div>';
  }
  if(off.products.length){
    h+='<div class="md-presence"><b>'+t("map.productsTitle")+':</b><div class="presence-row">'
      +off.products.map(function(id){ return '<span class="presence-chip mineral-chip">'+OrbitaWorldMap.getProductLabel(id,L())+'</span>'; }).join("")
      +'</div></div>';
  }
  return h;
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
  if(typeof OrbitaWorldMap!=="undefined") OrbitaWorldMap.refresh();
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
  if(typeof OrbitaWorldMap!=="undefined"&&OrbitaWorldMap.clearSelection) OrbitaWorldMap.clearSelection();
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
  var activeRoute=mapProcess&&mapProcess!=="iron"?mapProcess:null;
  var routes=SUPPLY_ROUTES.map(function(r){
    var cls=r.cls||"";
    if(activeRoute) cls+=(r.id===activeRoute?" route-active":" route-dim");
    return {pts:r.pts, cls:cls};
  });
  OrbitaWorldMap.drawRoutes(routes);
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
      onCountryClick:function(gameId, fromMap){
        if(!gameId) return;
        setMapHitHighlight(gameId, !fromMap);
        if(!fromMap) openMapDetailCountry(gameId);
      },
      onFilterChange:function(){ renderCountryList(); }
    });
  }
  orbitaMapInitPromise.then(function(){ if(cb) cb(true); }).catch(function(){ if(cb) cb(false); });
}
function finishWorldMapUI(){
  updateViewBox();
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
}
function closeMapDetail(){ mapHitActive=null; setMapHitHighlight(null); chainStageActive=null; setChainStageHighlight(null); var p=$("mapDetail"); if(p) p.hidden=true; var tip=$("mapTooltip"); if(tip) tip.hidden=true; }
function openMapDetailCountry(id){
  var c=COUNTRIES.filter(function(x){return x.id===id;})[0]; if(!c) return;
  cur.country=c;
  mapHitActive=id;
  setMapHitHighlight(id);
  var body=$("mapDetailBody"), panel=$("mapDetail"); if(!body||!panel) return;
  var official=(typeof OrbitaWorldMap!=="undefined"&&OrbitaWorldMap.getCountry)?OrbitaWorldMap.getCountry(id,L()):null;
  var themes=c.themes.map(function(th){ return '<span class="tag">'+tt(THEMES[th])+'</span>'; }).join(" ");
  var nextExp=nextExpeditionCountry();
  var prog=S.done[c.id]? ((L()==="pt"?"Melhor: ":"Best: ")+S.done[c.id]+"%") : (L()==="pt"?"Missão de treino disponível":"Training mission available");
  body.innerHTML='<h3>'+c.flag+' '+(official?official.name:tt(c.name))+'</h3>'
    +(official?'<p class="md-tag md-tag-official">'+official.phrase+'</p>':'')
    +'<p class="md-tag md-tag-train">'+t("map.trainingLabel")+'</p>'
    +officialPresenceHTML(id)
    +'<p class="md-desc">'+tt(c.desc)+'</p>'
    +'<div class="md-chain"><b>'+t("map.chainImpact")+':</b> '+tt(c.chain)+'</div>'
    +'<div class="chip-row">'+themes+'</div>'
    +'<div class="md-progress">'+prog+'</div>'
    +'<button class="btn btn-primary btn-sm" id="mapDetailPlay">'+t("region.start")+'</button>';
  panel.hidden=false;
  $("mapDetailPlay").addEventListener("click",startCampaign);
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
    +'<div class="md-progress">'+st.qs.length+' '+t("chain.scenarios")+' · '+prog+'</div>'
    +'<button class="btn btn-primary btn-sm" id="mapDetailChainPlay">'+t("chain.play")+'</button>';
  panel.hidden=false;
  $("mapDetailChainPlay").addEventListener("click",function(){ startChain(ch.id,st.id); });
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
function zoomTo(cx,cy,f){ var nw=Math.max(200,Math.min(VW,view.w*f)),nh=nw*(VH/VW); view.x=Math.max(0,Math.min(VW-nw,cx-nw/2)); view.y=Math.max(0,Math.min(VH-nh,cy-nh/2)); view.w=nw; view.h=nh; updateViewBox(); }
function resetView(){ setMapProcess(null); }
function focusIronChain(){ openBossChain(true); }
function bindMapPanZoom(){
  var wrap=$("mapStage"),svg=$("mapSvg"),drag=false,sx,sy,ox,oy;
  if(!wrap||!svg) return;
  wrap.addEventListener("pointerdown",function(e){ if(mapChainMode()) return; if(e.target.closest(".map-detail,.cmap-pin,.vwm-country,.vwm-tooltip,.vwm-legend-button")) return; drag=true; wrap.classList.add("dragging"); sx=e.clientX; sy=e.clientY; ox=view.x; oy=view.y; });
  window.addEventListener("pointerup",function(){ drag=false; if(wrap) wrap.classList.remove("dragging"); });
  window.addEventListener("pointermove",function(e){ if(!drag) return; var r=svg.getBoundingClientRect(); var kx=view.w/r.width,ky=view.h/r.height; view.x=Math.max(0,Math.min(VW-view.w,ox-(e.clientX-sx)*kx)); view.y=Math.max(0,Math.min(VH-view.h,oy-(e.clientY-sy)*ky)); updateViewBox(); });
  wrap.addEventListener("wheel",function(e){ if(mapChainMode()) return; e.preventDefault(); var r=svg.getBoundingClientRect(); var mx=view.x+(e.clientX-r.left)/r.width*view.w,my=view.y+(e.clientY-r.top)/r.height*view.h; zoomTo(mx,my,e.deltaY>0?1.2:.83); },{passive:false});
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
}
function openMap(process, reset, focusExpedition){
  if(process==="iron"){ openBossChain(true); return; }
  if(arguments.length>0) mapProcess=process||null;
  normalizeMapProcess();
  if(reset||!mapReady) view={x:0,y:0,w:VW,h:VH};
  ensureMap(); drawMap(); show("screenMap");
  if(focusExpedition){
    var next=nextExpeditionCountry();
    if(next) setTimeout(function(){ focusExpeditionCountry(next.id); }, mapReady?120:480);
  }
}
function returnToMap(){ openMap(null,false); }
var cur={country:null,questions:[],i:0,correct:0,integrity:100,mode:"campaign"};
function shuffle(a){ for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)),t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function shuffleQuestions(qs){ return shuffle(qs.map(function(q,i){ return q; })); }
function weakThemes(n){
  var list=[], th;
  for(th in THEMES){ var a=themeAcc(th); list.push({th:th,acc:a===null?50:a}); }
  list.sort(function(a,b){ return a.acc-b.acc; });
  return list.slice(0,n||3).map(function(x){ return x.th; });
}
function buildCampaign(c){
  var roleThemes=ROLE_THEMES[S.role]||[];
  var pool=fullBank().filter(function(q){
    var countryOk=!q.countries||q.countries.indexOf(c.id)>=0;
    return countryOk&&(c.themes.indexOf(q.theme)>=0||q.countries&&q.countries.indexOf(c.id)>=0);
  });
  var rolePool=pool.filter(function(q){ return !q.roles||q.roles.indexOf(S.role)>=0||roleThemes.indexOf(q.theme)>=0; });
  if(rolePool.length<4) rolePool=pool.length?pool:fullBank().filter(function(q){ return c.themes.indexOf(q.theme)>=0; });
  pool=shuffle(rolePool.slice());
  var picked=pool.slice(0,6);
  if(picked.length<6){ var extra=shuffle(fullBank().filter(function(q){ return picked.indexOf(q)<0&&(!q.countries||q.countries.indexOf(c.id)>=0); }));
    if(extra.length<6-picked.length) extra=extra.concat(shuffle(fullBank().filter(function(q){ return picked.indexOf(q)<0; })));
    picked=picked.concat(extra.slice(0,6-picked.length)); }
  return shuffleQuestions(picked);
}
function buildDaily(){
  var pool=shuffle(fullBank().slice()), weak=weakThemes(2), picked=[], i,q, due=srsDueItems();
  for(i=0;i<due.length&&picked.length<2;i++){ if(picked.indexOf(due[i])<0) picked.push(due[i]); }
  for(i=0;i<weak.length;i++){
    q=pool.filter(function(x){ return x.theme===weak[i]&&picked.indexOf(x)<0; })[0];
    if(q) picked.push(q);
  }
  for(i=0;i<pool.length&&picked.length<5;i++){ if(picked.indexOf(pool[i])<0) picked.push(pool[i]); }
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
  $("sceneText").textContent=tt(q.q);
  renderPersonalBridge(q);
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
  speak(tt(q.q));
}
function setIntegrity(){
  $("integrityVal").textContent=cur.integrity+"%"; var f=$("integrityFill"), bar=f&&f.parentNode;
  if(f){ f.style.width=cur.integrity+"%"; f.style.background=cur.integrity>60?"var(--green)":cur.integrity>30?"var(--gold)":"var(--bad)"; }
  if(bar){ bar.setAttribute("aria-valuenow",cur.integrity); bar.setAttribute("aria-valuemin","0"); bar.setAttribute("aria-valuemax","100"); bar.setAttribute("aria-label",t("quiz.integrity")); }
}
function answer(idx,btn,q){
  if(cur.qStates&&cur.qStates[cur.i]) return;
  $("options").querySelectorAll(".opt").forEach(function(b){ b.disabled=true; });
  var ok=idx===q.correct,fb=$("feedback"),review=cur.mode==="review";
  if(!review){ recordTheme(q.theme,ok); recordMiss(q,ok); }
  else { recordMiss(q,ok); if(ok) addReward(5,2,0); }
  if(ok){ btn.classList.add("correct"); if(!review) addReward(10,5,q.diff*10); fb.className="feedback show good"; fb.innerHTML="✅ <b>"+(L()==="pt"?"Correto!":"Correct!")+"</b> "+tt(q.why); }
  else if(review){ btn.classList.add("wrong"); $("options").querySelectorAll(".opt").forEach(function(b){ if(b.getAttribute("data-correct")==="1") b.classList.add("correct"); }); fb.className="feedback show err"; fb.innerHTML="❌ <b>"+(L()==="pt"?"Revise:":"Review:")+"</b> "+tt(q.why); }
  else{ btn.classList.add("wrong"); $("options").querySelectorAll(".opt").forEach(function(b){ if(b.getAttribute("data-correct")==="1") b.classList.add("correct"); }); cur.integrity=Math.max(0,cur.integrity-20); S.lives=Math.max(0,(S.lives||3)-1); renderLives(); applyResilienceHit(q.theme); fb.className="feedback show err"; fb.innerHTML="❌ <b>"+(L()==="pt"?"Cuidado!":"Careful!")+"</b> "+tt(q.why)+(THREAT_RESILIENCE[q.theme]?" <span class='res-hit'>−"+THREAT_RESILIENCE[q.theme]+"% "+(L()==="pt"?"resiliência":"resilience")+"</span>":""); save(); }
  if(!cur.qStates) cur.qStates={};
  cur.qStates[cur.i]={selectedIdx:idx,ok:ok,feedbackClass:fb.className,feedbackHtml:fb.innerHTML,reportDone:false};
  cur.correct=countQuizCorrect();
  speak((ok?(L()==="pt"?"Correto. ":"Correct. "):(L()==="pt"?"Cuidado. ":"Careful. "))+tt(q.why));
  setIntegrity(); renderQuizResilience(); updateQuizResilienceVisibility();
  if(!review){ bumpWeekly("correct",ok?1:0); if(ok&&q.theme===getWeekTheme()) bumpWeekly("theme",1); }
  if(!ok&&!review&&REPORT_THEMES[q.theme]) showReportPrompt(q);
  else { cur.reportPending=false; updateQuizNav(); $("nextBtn").focus(); }
}
function nextQuestion(){
  if(cur.reportPending) return;
  if(cur.i>=cur.questions.length-1&&cur.qStates&&cur.qStates[cur.i]){ finishCampaign(); return; }
  cur.i++;
  if(cur.i>=cur.questions.length||(cur.mode!=="review"&&(S.lives||0)<=0)){ finishCampaign(); return; }
  renderQuestion();
}
function finishCampaign(){
  rebuildSessionLog();
  cur.correct=countQuizCorrect();
  var c=cur.country,total=cur.questions.length,acc=Math.round(cur.correct/total*100),win=cur.integrity>0&&acc>=60;
  if(cur.mode==="review"){ show("screenProfile"); renderProfile(); toast(L()==="pt"?"📚 Revisão concluída":"📚 Review complete"); return; }
  if(cur.mode==="campaign"){ S.done[c.id]=Math.max(S.done[c.id]||0,acc); bumpWeekly("campaign",1); }
  if(cur.mode==="chain"){ S.chainDone[cur.chainKey]=Math.max(S.chainDone[cur.chainKey]||0,acc); }
  if(cur.mode==="daily"){ markDailyDone(win); recordStreak(); }
  else if(win) recordStreak();
  checkMedals(); save();
  var hero=$("resultHero"); var titlePt=win?"Operação protegida!":"Operação comprometida",titleEn=win?"Operation protected!":"Operation compromised";
  hero.innerHTML='<div class="big">'+(win?"🏆":"⚠️")+'</div><h2>'+(L()==="pt"?titlePt:titleEn)+'</h2><p style="color:var(--steel)">'+c.flag+" "+tt(c.name)+'</p>';
  var lab=L()==="pt"?{a:"Acertos",b:"Precisão",c:"Integridade",d:"XP total"}:{a:"Correct",b:"Accuracy",c:"Integrity",d:"Total XP"};
  $("statsGrid").innerHTML='<div class="stat"><div class="v">'+cur.correct+"/"+total+'</div><div class="l">'+lab.a+'</div></div><div class="stat"><div class="v">'+acc+'%</div><div class="l">'+lab.b+'</div></div><div class="stat"><div class="v">'+cur.integrity+'%</div><div class="l">'+lab.c+'</div></div><div class="stat"><div class="v">'+S.xp+'</div><div class="l">'+lab.d+'</div></div>';
  renderCampaignDebrief(); renderThemeErrors($("themeErrors")); renderMedals($("medalsBox")); renderRank($("rankList"));
  var rmb=$("resultMapBtn");
  if(rmb){
    if(cur.mode==="chain"){ rmb.textContent=L()==="pt"?"⛓️ Voltar a Desafios / Crises":"⛓️ Back to Challenges / Crises"; rmb.onclick=function(){ renderBossList(); show("screenBossList"); }; }
    else { rmb.textContent=t("result.map"); rmb.onclick=returnToMap; }
  }
  show("screenResult"); speak((L()==="pt"?titlePt:titleEn)+". "+(L()==="pt"?"Precisão ":"Accuracy ")+acc+"%.");
  if(win) toast(L()==="pt"?"🏆 "+tt(c.name)+" protegido!":"🏆 "+tt(c.name)+" protected!");
}
function renderThemeErrors(host){
  host.innerHTML=""; var any=false;
  for(var th in S.themeStats){ var a=themeAcc(th); if(a===null) continue; any=true; var d=document.createElement("div"); d.className="theme-err"; d.innerHTML='<span>'+THEMES[th].ico+' '+tt(THEMES[th])+'</span><span>'+a+'%</span>'; host.appendChild(d); }
  if(!any) host.innerHTML='<div class="muted">'+(L()==="pt"?"Jogue para ver suas estatísticas por tema.":"Play to see your stats by theme.")+'</div>';
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
function bossDefaultMetrics(idx){ return {availability:idx,resilience:idx,exposure:100-idx,preparation:idx,maturity:idx,index:idx,tier:"bronze",rankId:"training"}; }
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
  list.forEach(function(b){
    var st=S.bossStats[b.id], best=st&&st.best, tier=best?bossTierInfo(best.tier):null;
    var d=document.createElement("button");
    d.type="button";
    d.setAttribute("data-boss",b.id);
    d.addEventListener("click",function(){ startBoss(b.id); });
    d.className="boss-card boss-card--tabletop boss-card--map";
    var phaseN=b.phases&&b.phases.length?b.phases.length:0;
    var meta=phaseN+" "+(L()==="pt"?"cenas · mapa dinâmico":"scenes · live map")+(b.tag?" · "+tt(b.tag):"");
    if(best) meta+=" · "+(tier?tier.ico:"")+" "+best.index+"%";
    var badge=best?'<span class="bdone" title="'+tt(tier.title)+'">'+tier.ico+'</span>':'<span class="boss-card-play" aria-hidden="true">▶</span>';
    var tagLabel=t("boss.storyMapLabel");
    d.innerHTML='<span class="be">'+b.emoji+'</span><div class="boss-card-body"><span class="boss-card-tag">'+tagLabel+'</span><div class="bt">'+tt(b.name)+'</div><div class="bd">'+tt(b.desc)+'</div><div class="boss-card-meta">'+meta+'</div></div>'+badge;
    host.appendChild(d);
  });
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
  $("streakStatus").textContent=today?t("streak.today"):t("streak.risk");
  card.classList.toggle("streak-active",today);
  card.classList.toggle("streak-risk",!today&&n>0);
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
  if(first&&won){ addReward(50); toast(L()==="pt"?"📅 Diária concluída! +50 XP":"📅 Daily done! +50 XP"); }
  save();
}
function renderDaily(){
  ensureDaily(); renderStreakCard();
  $("dailyDate").textContent=(L()==="pt"?"Hoje: ":"Today: ")+new Date().toLocaleDateString(L()==="pt"?"pt-BR":"en-US");
  var due=srsDueCount(), srs=$("dailySrsNote");
  if(srs){
    if(due>0){ srs.hidden=false; srs.textContent=t("daily.srsDue").replace("{n}",String(due)); }
    else srs.hidden=true;
  }
  var navDaily=$("navDailyBtn");
  if(navDaily){
    var lbl=navDaily.querySelector("span:last-child");
    if(lbl) lbl.textContent=due>0?(t("nav.daily")+" · "+due):t("nav.daily");
  }
  var host=$("dailyList"); host.innerHTML="";
  var done=!!S.daily.done.mission;
  var item=document.createElement("div"); item.className="mission-item"+(done?" done":"");
  item.innerHTML='<span class="mem">'+(done?"✅":"📅")+'</span><div class="mtxt"><div class="mname">'+(L()==="pt"?"Missão do dia — 5 situações":"Daily mission — 5 scenarios")+'</div><div class="mrew">+50 XP • 🔥 '+(L()==="pt"?"mantém ofensiva":"keeps streak")+'</div></div>';
  host.appendChild(item);
  $("dailyStartBtn").disabled=done; $("dailyStartBtn").textContent=done?(L()==="pt"?"✅ Concluída hoje":"✅ Done today"):t("daily.play");
}
var WEEKLY=[
  {id:"correct", goal:20, ico:"🎯", name:{pt:"Acerte 20 situações",en:"Get 20 scenarios right"}},
  {id:"campaign", goal:3, ico:"🗺️", name:{pt:"Complete 3 campanhas",en:"Complete 3 campaigns"}},
  {id:"boss", goal:1, ico:"🎯", name:{pt:"Vença 1 crise",en:"Beat 1 crisis"}},
  {id:"theme", goal:8, ico:"📚", themed:true, name:{pt:"Acerte 8 do tema da semana",en:"Get 8 on the week theme"}}
];
function ensureWeekly(){ if(S.weekly.week!==weekKey()){ S.weekly={week:weekKey(),prog:{}}; save(); } }
function bumpWeekly(id,n){ if(!n) return; ensureWeekly(); S.weekly.prog[id]=(S.weekly.prog[id]||0)+n; var w=WEEKLY.filter(function(x){return x.id===id;})[0]; if(w && S.weekly.prog[id]===w.goal){ addReward(40); toast((L()==="pt"?"🏆 Semanal concluída: ":"🏆 Weekly done: ")+tt(w.name)+" (+40 XP)"); } save(); renderWeekCard(); }
function renderWeekly(){
  ensureWeekly();
  var wt=getWeekTheme();
  $("weeklyWeek").textContent=(L()==="pt"?"Semana ":"Week ")+S.weekly.week+" · "+t("weekly.theme")+": "+THEMES[wt].ico+" "+tt(THEMES[wt]);
  var host=$("weeklyList"); host.innerHTML="";
  WEEKLY.forEach(function(w){
    var p=Math.min(w.goal,S.weekly.prog[w.id]||0),pct=Math.round(p/w.goal*100),done=p>=w.goal;
    var label=tt(w.name);
    if(w.themed) label=(L()==="pt"?"Acerte 8 em ":"Get 8 on ")+tt(THEMES[wt]);
    var d=document.createElement("div"); d.className="mission-item"+(done?" done":"");
    d.innerHTML='<span class="mem">'+(done?"✅":w.ico)+'</span><div class="mtxt"><div class="mname">'+label+'</div><div class="mrew">'+p+"/"+w.goal+' • +40 XP</div><div class="mini-bar"><span class="mf" style="width:'+pct+'%"></span></div></div>';
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
  return (L()==="pt"?"Mantenha a ofensiva e revise temas fracos":"Keep your streak and review weak themes");
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
  if(!S.onboardingDone){ card.hidden=true; if(hero) hero.hidden=false; return; }
  if(hero) hero.hidden=true;
  var ns=computeNextStep();
  var ico=$("nextStepIco"), ti=$("nextStepTitle"), sub=$("nextStepSub"), btn=$("nextStepBtn");
  if(ico) ico.textContent=ns.ico;
  if(ti) ti.textContent=ns.title;
  if(sub) sub.textContent=ns.sub;
  if(btn){ btn.textContent=t("home.playNow"); btn.onclick=playNow; }
  renderWeekLine();
  card.hidden=false;
}
function renderWeekLine(){
  var host=$("nextStepWeek"); if(!host) return;
  ensureWeekly(); ensureDaily();
  var wp=S.weekly.prog||{}, wt=getWeekTheme();
  var daily=S.daily.done.mission?(L()==="pt"?"✅ Feita":"✅ Done"):(L()==="pt"?"Pendente":"Pending");
  host.textContent=t("home.weekLine")
    .replace("{theme}",THEMES[wt].ico+" "+tt(THEMES[wt]))
    .replace("{correct}",String(wp.correct||0))
    .replace("{campaign}",String(wp.campaign||0))
    .replace("{daily}",daily);
}
function setFocusLearn(on){
  S.focusLearn=!!on; save(); applyFocusLearn(); refreshHud();
  var a=$("optFocusLearn"), b=$("optFocusLearnProfile");
  if(a) a.checked=S.focusLearn; if(b) b.checked=S.focusLearn;
}
function setManagerMode(on){
  S.managerMode=!!on; save(); updateManagerNav();
  var a=$("optManager"), b=$("optManagerProfile");
  if(a) a.checked=S.managerMode; if(b) b.checked=S.managerMode;
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
  var tr=document.createElement("button"); tr.className="btn btn-primary btn-sm"; tr.textContent=t("profile.reviewTrain");
  tr.onclick=startReviewErrors; host.appendChild(tr);
  var lk=document.createElement("a"); lk.className="btn btn-ghost btn-sm"; lk.href="review.html"; lk.target="_blank"; lk.rel="noopener"; lk.textContent=t("profile.reviewBank");
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
      '<div class="prog-hub-item"><span class="prog-hub-ico">🐉</span><div><div class="prog-hub-t">'+t("progress.boss")+'</div><div class="prog-hub-d">'+t("progress.bossD")+'</div><div class="prog-hub-m">'+bossCompletedCount()+'/'+BOSSES.length+' · '+chainStagesDone()+'/'+chainTotalStages()+' ⛓️ · '+bossAvgIndex()+'%</div></div></div>'+
      '<div class="prog-hub-item"><span class="prog-hub-ico">🏆</span><div><div class="prog-hub-t">'+t("progress.weekly")+'</div><div class="prog-hub-d">'+t("progress.weeklyD")+'</div><div class="prog-hub-m">'+(wp.theme||0)+'/8 '+tt(THEMES[getWeekTheme()])+'</div></div></div>'+
    '</div>';
}
function renderProfile(){
  var lab=L()==="pt"?{a:"Nível",b:"XP",c:"Países",d:"Desafios / Crises",e:"Ofensiva",f:"Maturidade",g:"Reportes"}:{a:"Level",b:"XP",c:"Countries",d:"Challenges / Crises",e:"Streak",f:"Maturity",g:"Reports"};
  ensureStreak(); ensureBossStats();
  var avg=bossAvgIndex(), br=bossGuardianRank(avg);
  $("profileStats").innerHTML='<div class="stat"><div class="v">'+levelOf()+'</div><div class="l">'+lab.a+'</div></div><div class="stat"><div class="v">'+S.xp+'</div><div class="l">'+lab.b+'</div></div><div class="stat"><div class="v">'+Object.keys(S.done).length+"/"+COUNTRIES.length+'</div><div class="l">'+lab.c+'</div></div><div class="stat"><div class="v">'+bossCompletedCount()+"/"+BOSSES.length+'</div><div class="l">'+lab.d+'</div></div><div class="stat"><div class="v">'+br.ico+' '+avg+'%</div><div class="l">'+lab.f+'</div></div><div class="stat"><div class="v">🔥 '+(S.streak.count||0)+'</div><div class="l">'+lab.e+'</div></div><div class="stat"><div class="v">📢 '+(S.reports||0)+'</div><div class="l">'+lab.g+'</div></div>';
  renderCompletionCard(); renderReviewSection(); renderCertChecklist();
  renderBossProgress(); renderProgressHub(); renderPedagogyRec("pedagogyRec"); drawRadar(); renderRadarTable(); renderThemeErrors($("profileThemes")); renderRank($("profileRank")); renderMedals($("profileMedals")); renderCertificatePreview();
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
function certDrawAchievements(ctx,W,startY,pt){
  checkMedals();
  var earned=MEDALS.filter(function(m){ return !!S.medals[m.id]; }).length;
  var cols=4, cellW=168, cellH=50, padX=(W-cols*cellW)/2;
  ctx.textAlign="center";
  ctx.fillStyle="#005f5c"; ctx.font="700 13px Segoe UI,sans-serif";
  ctx.fillText("🏅 "+t("profile.certAch")+" ("+earned+"/"+MEDALS.length+")", W/2, startY);
  ctx.strokeStyle="#e8e8e8"; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(100,startY+6); ctx.lineTo(W-100,startY+6); ctx.stroke();
  MEDALS.forEach(function(m,i){
    var col=i%cols, row=Math.floor(i/cols);
    var cx=padX+col*cellW+cellW/2;
    var cardX=padX+col*cellW+6, cardY=startY+14+row*cellH;
    var cardW=cellW-12, cardH=cellH-8;
    var got=!!S.medals[m.id];
    ctx.save();
    ctx.globalAlpha=got?1:0.42;
    if(got){ ctx.fillStyle="#f4faf9"; ctx.strokeStyle="#007E7A"; }
    else { ctx.fillStyle="#f5f5f5"; ctx.strokeStyle="#c8d4d8"; }
    ctx.lineWidth=got?1.5:1;
    certRoundRect(ctx,cardX,cardY,cardW,cardH,6);
    ctx.fill(); ctx.stroke();
    ctx.textAlign="center";
    ctx.font=(got?"700":"600")+" 18px Segoe UI Emoji,Segoe UI,sans-serif";
    ctx.fillStyle=got?"#1a1a1a":"#8a9aa0";
    ctx.fillText(m.ico, cx, cardY+22);
    ctx.font=(got?"700":"500")+" 9px Segoe UI,sans-serif";
    var label=certEllipsis(ctx, tt(m.name), cardW-8);
    ctx.fillText(label, cx, cardY+38);
    ctx.restore();
  });
  return startY+14+Math.ceil(MEDALS.length/cols)*cellH+6;
}
function certDrawStats(ctx,W,startY,stats){
  var cols=3, colW=(W-160)/cols, sx=80, rowH=20;
  ctx.textAlign="left"; ctx.font="600 11px Segoe UI,sans-serif";
  stats.forEach(function(row,i){
    var col=i%cols, r=Math.floor(i/cols);
    var x=sx+col*colW, y=startY+r*rowH;
    ctx.fillStyle="#3d4f55"; ctx.fillText(row[0]+":", x, y);
    ctx.fillStyle="#1a1a1a"; ctx.fillText(row[1], x+72, y);
  });
  return startY+Math.ceil(stats.length/cols)*rowH+4;
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
function renderCertificatePreview(){
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
    [L()==="pt"?"Desafios / Crises":"Challenges / Crises", bossCompletedCount()+"/"+BOSSES.length],
    [pt?"Resiliência":"Resilience", resRank.ico+" "+avgRes+"%"],
    [pt?"Ofensiva":"Streak", String(S.streak.count||0)+(pt?" dias":" days")]
  ];
  var achRows=Math.ceil(MEDALS.length/4);
  var H=Math.max(820, 500+achRows*50+120);
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
  y+=14;
  y=certDrawAchievements(ctx,W,y,pt);
  y+=10;
  y=certDrawResilienceSeal(ctx,W,y,pt);
  y+=28;
  ctx.textAlign="center"; ctx.font="italic 10px Segoe UI,sans-serif"; ctx.fillStyle="#3d4f55";
  ctx.fillText(pt?"Reconhece a participação na trilha educativa de Cyber Security da Orbita.":"Recognizes participation in Orbita's Cyber Security learning journey.", W/2, y);
  ctx.font="500 10px Segoe UI,sans-serif"; ctx.fillStyle="#5c706e";
  ctx.fillText(dateStr, W/2, y+18);
  ctx.fillText(pt?"Ferramenta educativa interna — não substitui certificações oficiais.":"Internal educational tool — not an official certification.", W/2, y+34);
}
function downloadCertificate(){
  renderCertificatePreview();
  var cv=$("certCanvas"); if(!cv||!cv.toBlob) return;
  cv.toBlob(function(blob){
    if(!blob) return;
    var url=URL.createObjectURL(blob);
    var a=document.createElement("a");
    a.href=url; a.download="guardiao-orbita-certificado.png";
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
  var demo=$("mgrDemo"); if(demo) demo.textContent=t("manager.demo");
  var acc=overallAcc()||0, oa=Object.keys(S.done).length;
  var lab=L()==="pt"?{a:"Sua taxa de acerto",b:"Campanhas",c:"Desafios / Crises",d:"Reportes",e:"Erros p/ revisar"}:{a:"Your accuracy",b:"Campaigns",c:"Challenges / Crises",d:"Reports",e:"Errors to review"};
  $("mgrKpis").innerHTML='<div class="stat"><div class="v">'+acc+'%</div><div class="l">'+lab.a+'</div></div><div class="stat"><div class="v">'+oa+'</div><div class="l">'+lab.b+'</div></div><div class="stat"><div class="v">'+bossCompletedCount()+'</div><div class="l">'+lab.c+'</div></div><div class="stat"><div class="v">'+(S.reports||0)+'</div><div class="l">'+lab.d+'</div></div><div class="stat"><div class="v">'+Object.keys(S.missed||{}).length+'</div><div class="l">'+lab.e+'</div></div>';
  var host=$("mgrTeams"); host.innerHTML="";
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
function renderTeams(){ var g=$("teamsGrid"); g.innerHTML=""; TEAMS.forEach(function(tm){ var b=document.createElement("button"); b.className="pick"; b.setAttribute("aria-pressed",S.team===tm.id?"true":"false"); b.innerHTML='<div class="pi">'+tm.ico+'</div><div class="pn">'+tt(tm)+'</div>'; b.addEventListener("click",function(){ S.team=tm.id; save(); renderTeams(); }); g.appendChild(b); }); }
function renderRoles(){ var g=$("rolesGrid"); g.innerHTML=""; ROLES.forEach(function(r){ var b=document.createElement("button"); b.className="pick"; b.setAttribute("aria-pressed",S.role===r.id?"true":"false"); b.innerHTML='<div class="pi">'+r.ico+'</div><div class="pn">'+r[L()]+'</div><div class="pd">'+r[L()+"d"]+'</div>'; b.addEventListener("click",function(){ S.role=r.id; save(); renderRoles(); }); g.appendChild(b); }); }

/* ==========================================================
   BIND / INIT
   ========================================================== */
/* -------------------- ONBOARDING -------------------- */
var ONBOARD_STEPS=[
  {ico:"🌐",type:"setup",titleKey:"onboard.setupT",bodyKey:"onboard.setupB"},
  {ico:"🛡️",titleKey:"onboard.playT",bodyKey:"onboard.playB"},
  {ico:"▶️",titleKey:"onboard.readyT",bodyKey:"onboard.readyB"}
];
var onboardStep=0, onboardReplay=false;
function closeOnboarding(){
  S.onboardingDone=true; save();
  onboardReplay=false;
  var ov=$("onboardOverlay"); if(ov) ov.hidden=true;
  document.body.classList.remove("onboard-open");
  try{ renderNextStep(); }catch(e){}
}
function renderOnboarding(){
  var step=ONBOARD_STEPS[onboardStep], isSetup=step.type==="setup", isLang=step.type==="lang", isA11y=step.type==="a11y";
  var langPanel=$("onboardLangPanel"), a11yPanel=$("onboardA11yPanel"), feat=$("onboardFeature"), body=$("onboardBody"), mission=$("onboardMission");
  if($("onboardTitle")) $("onboardTitle").textContent=t(step.titleKey||"onboard.step");
  if(feat) feat.hidden=isSetup||isLang||isA11y;
  if(body){ body.hidden=!(isSetup||isLang||isA11y); if(isSetup||isLang||isA11y) body.textContent=t(step.bodyKey); }
  if(mission) mission.textContent=(isSetup||isLang||isA11y)?"":t(step.bodyKey);
  if(langPanel) langPanel.hidden=!(isSetup||isLang);
  if(a11yPanel){
    a11yPanel.hidden=!(isSetup||isA11y);
    if(isSetup||isA11y){
      var ov=$("onboardOptVoice"), oc=$("onboardOptContrast"), os=$("onboardOptSigns"), om=$("onboardOptMotion");
      if(ov) ov.checked=!!S.a11y.voice;
      if(oc) oc.checked=!!S.a11y.contrast;
      if(os) os.checked=!!S.a11y.signs;
      if(om) om.checked=!!S.a11y.motion;
    }
  }
  if(isSetup||isLang){
    document.querySelectorAll("#onboardLangPanel .lang-card").forEach(function(b){ b.setAttribute("aria-pressed",b.getAttribute("data-lang")===S.lang?"true":"false"); });
  } else if(!isA11y) {
    var ico=$("onboardIco"); if(ico) ico.textContent=step.ico;
  }
  if($("onboardStepLabel")) $("onboardStepLabel").textContent=t("onboard.step")+" "+(onboardStep+1)+"/"+ONBOARD_STEPS.length;
  var dots=$("onboardDots");
  if(dots){
    dots.innerHTML="";
    ONBOARD_STEPS.forEach(function(_,i){ var d=document.createElement("span"); d.className="onboard-dot"+(i===onboardStep?" on":""); dots.appendChild(d); });
  }
  if($("onboardNextBtn")) $("onboardNextBtn").textContent=onboardStep>=ONBOARD_STEPS.length-1?(onboardReplay?(L()==="pt"?"Fechar":"Close"):t("onboard.start")):t("onboard.next");
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
  if($("onboardNextBtn")) $("onboardNextBtn").focus();
}
function onboardNext(){
  if(onboardStep<ONBOARD_STEPS.length-1){ onboardStep++; renderOnboarding(); return; }
  var firstTime=!S.onboardingDone;
  closeOnboarding();
  if(firstTime&&!onboardReplay){
    if(!S.a11y.voice){ S.a11y.voice=true; }
    if(S.simpleUi===undefined) S.simpleUi=true;
    save(); applyA11y(); applySimpleUi();
    renderTeams(); renderRoles();
    if($("playerName")) $("playerName").value=S.name||"";
    show("screenSetup");
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
  on("settingsBtn","click",function(e){ e.stopPropagation(); toggleSettingsMenu(); });
  on("settingsMenuClose","click",function(e){ e.stopPropagation(); toggleSettingsMenu(false); });
  on("settingsOpenA11yBtn","click",function(e){ e.stopPropagation(); toggleSettingsMenu(false); toggleA11yMenu(true); if($("a11yBtn")) $("a11yBtn").focus(); });
  on("themeSelect","change",function(e){ e.stopPropagation(); setTheme(this.value); });
  on("glossaryPick","change",function(e){ e.stopPropagation(); showGlossaryTerm(this.value); });
  on("glossarySearch","input",function(e){ e.stopPropagation(); syncGlossaryFromSearch(); });
  on("glossarySearch","change",function(e){ e.stopPropagation(); syncGlossaryFromSearch(); });
  var a11yMenuEl=$("a11yMenu"), settingsMenuEl=$("settingsMenu");
  if(a11yMenuEl) a11yMenuEl.addEventListener("click",function(e){ e.stopPropagation(); });
  if(settingsMenuEl) settingsMenuEl.addEventListener("click",function(e){ e.stopPropagation(); });
  on("voiceBtn","click",function(){ S.a11y.voice=!S.a11y.voice; save(); applyA11y(); toast(S.a11y.voice?(L()==="pt"?"🔊 Narração ligada":"🔊 Narration on"):(L()==="pt"?"🔈 Narração desligada":"🔈 Narration off")); });

  on("onboardSkipBtn","click",closeOnboarding);
  on("onboardNextBtn","click",onboardNext);
  on("onboardOpenBtn","click",function(){ showOnboarding(true); });
  on("onboardOverlay","click",function(e){ if(e.target===$("onboardOverlay")) closeOnboarding(); });
  document.addEventListener("keydown",function(e){ var ov=$("onboardOverlay"); if(e.key==="Escape"&&ov&&!ov.hidden) closeOnboarding(); });

  on("homeStartBtn","click",function(){
    if(setupComplete()){ playNow(); return; }
    renderTeams(); renderRoles();
    if($("playerName")) $("playerName").value=S.name||"";
    show("screenSetup");
  });
  on("nextStepBtn","click",playNow);
  on("heroIronBtn","click",function(){ openBossChain(true); });
  on("setupBackBtn","click",function(){ show("screenHome"); });
  on("setupGoBtn","click",function(){
    if($("playerName")) S.name=$("playerName").value.trim();
    if(!S.team){ toast(t("setup.teamRequired")); return; }
    if(!S.role){ toast(t("setup.roleRequired")); return; }
    save(); openMap(null,true,true);
  });
  on("playerName","input",function(){ S.name=this.value; });

  on("mapDetailClose","click",closeMapDetail);
  on("zoomIn","click",function(){ zoomTo(view.x+view.w/2,view.y+view.h/2,.8); });
  on("zoomOut","click",function(){ zoomTo(view.x+view.w/2,view.y+view.h/2,1.25); });
  on("zoomReset","click",function(){ resetView(); });
  on("mapZoomToggleBtn","click",function(){
    var row=$("mapToolbarRow"); if(!row) return;
    row.classList.toggle("map-toolbar-collapsed");
    this.setAttribute("aria-expanded",row.classList.contains("map-toolbar-collapsed")?"false":"true");
  });
  on("quitDialogCancel","click",hideQuitDialog);
  on("quitDialogBackdrop","click",hideQuitDialog);
  on("quitDialogConfirm","click",function(){ var fn=quitCallback; hideQuitDialog(); if(fn) fn(); });

  document.querySelectorAll(".lang-switch-btn").forEach(function(b){
    b.addEventListener("click",function(){ setLang(b.getAttribute("data-lang")); });
  });
  on("a11yBtn","click",function(e){ e.stopPropagation(); toggleA11yMenu(); });
  on("a11yMenuClose","click",function(e){ e.stopPropagation(); toggleA11yMenu(false); });
  on("a11yBackdrop","click",function(){ toggleA11yMenu(false); toggleSettingsMenu(false); });
  document.addEventListener("click",function(e){
    var am=$("a11yMenu"), sm=$("settingsMenu");
    if(am&&!am.hidden){ if(e.target.closest&&(e.target.closest(".a11y-menu-wrap")||e.target.closest("#a11yMenu"))) return; toggleA11yMenu(false); }
    if(sm&&!sm.hidden){ if(e.target.closest&&(e.target.closest(".settings-menu-wrap")||e.target.closest("#settingsMenu"))) return; toggleSettingsMenu(false); }
  });
  document.querySelectorAll("#a11yMenu .am-toggle").forEach(function(b){ b.addEventListener("click",function(e){ e.stopPropagation(); var k=b.getAttribute("data-opt"); if(k==="colorblind"){ cycleColorblind(); return; } S.a11y[k]=!S.a11y[k]; save(); applyA11y(); if(k==="voice"&&S.a11y.voice) speak(L()==="pt"?"Narração por voz ativada.":"Voice narration enabled."); if(k==="signs"&&S.a11y.signs) speak(L()==="pt"?"Hand Talk e Libras ativados.":"Hand Talk and ASL enabled."); }); });

  on("speakBtn","click",function(){ var q=cur.questions[cur.i]; if(q) speak(tt(q.q)); });
  on("nextBtn","click",nextQuestion);
  on("prevBtn","click",prevQuestion);
  on("quitBtn","click",quizQuit);
  wireQuizNavButtons();
  on("resultHomeBtn","click",function(){ show("screenHome"); });
  on("resultMapBtn","click",returnToMap);

  on("bossQuitBtn","click",bossQuit);
  on("bossPrevBtn","click",bossPrev);
  on("bossNext","click",bossNext);
  on("bossResultBackBtn","click",function(){ renderBossList(); show("screenBossList"); });
  on("bossReplayBtn","click",function(){ if(bossCur.lastBossId) startBoss(bossCur.lastBossId); });

  on("dailyStartBtn","click",startDaily);
  on("weeklyBackBtn","click",function(){ show("screenHome"); });
  on("weeklyMapBtn","click",function(){ openMap(null,true); });

  on("shopBackBtn","click",function(){ show("screenHome"); });
  on("profileResetBtn","click",resetProgress);
  on("certGenerateBtn","click",renderCertificatePreview);
  on("certDownloadBtn","click",downloadCertificate);
  on("certPrintBtn","click",printCertificate);
  on("mgrExportTeams","click",exportTeams);
  on("mgrExportThemes","click",exportThemes);

  on("profileExportBtn","click",exportProgress);
  on("profileImportBtn","click",function(){ var f=$("profileImportFile"); if(f) f.click(); });
  on("profileImportFile","change",function(){ if(this.files&&this.files[0]) importProgress(this.files[0]); this.value=""; });
  if($("optManagerProfile")){ $("optManagerProfile").checked=!!S.managerMode; on("optManagerProfile","change",function(){ setManagerMode(this.checked); }); }
  [["onboardOptVoice","voice"],["onboardOptContrast","contrast"],["onboardOptSigns","signs"],["onboardOptMotion","motion"]].forEach(function(pair){
    var el=$(pair[0]); if(!el) return;
    el.addEventListener("change",function(){ S.a11y[pair[1]]=this.checked; save(); applyA11y(); });
  });

  document.addEventListener("click",function(e){ var sheet=$("navMoreSheet"); if(!sheet||sheet.hidden) return; if(e.target.closest&&e.target.closest("#navMoreBtn")) return; if(!e.target.closest("#navMoreSheet")) toggleNavMore(false); });
  document.addEventListener("keydown",function(e){ var sheet=$("navMoreSheet"); if(e.key==="Escape"&&sheet&&!sheet.hidden){ toggleNavMore(false); var mb=$("navMoreBtn"); if(mb) mb.focus(); } });

  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"){
      var qd=$("quitDialog"); if(qd&&!qd.hidden){ hideQuitDialog(); return; }
      var sm=$("settingsMenu"); if(sm&&!sm.hidden){ toggleSettingsMenu(false); return; }
      var am=$("a11yMenu"); if(am&&!am.hidden){ toggleA11yMenu(false); return; }
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
    toggleNavMore(false);
    toggleA11yMenu(false);
    toggleSettingsMenu(false);
    var tip=$("mapTooltip"); if(tip) tip.hidden=true;
    if(typeof OrbitaWorldMap!=="undefined"&&OrbitaWorldMap.clearSelection) OrbitaWorldMap.clearSelection();
    document.body.classList.remove("nav-hidden");
  }catch(e){}
}
var navWired=false, lastNavTap=0;
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
    if(id==="navMoreBtn"){
      var willOpen=$("navMoreSheet")&&$("navMoreSheet").hidden;
      toggleNavMore(willOpen);
      if(willOpen){ var first=document.querySelector("#navMoreSheet .nav-more-item:not([hidden])"); if(first) first.focus(); }
      return;
    }
    if(id==="navMapBtn") returnToMap();
    else if(id==="navBossBtn"){ hydrateNorthernBoss(); renderBossList(); show("screenBossList"); }
    else if(id==="navDailyBtn"){ renderDaily(); show("screenDaily"); }
    else if(id==="navWeeklyBtn"){ renderWeekly(); show("screenWeekly"); }
    else if(id==="navShopBtn"){ renderShop(); show("screenShop"); }
    else if(id==="navStatsBtn"){ renderProfile(); show("screenProfile"); }
    else if(id==="navHomeBtn"){ toggleNavMore(false); show("screenHome"); }
    else if(id==="navManagerBtn"){ renderManager(); show("screenManager"); }
  }
  window.__gdvRunNav=runNav;
  ["navMapBtn","navDailyBtn","navBossBtn","navStatsBtn","navMoreBtn","navHomeBtn","navManagerBtn"].forEach(function(nid){
    var el=$(nid);
    if(!el) return;
    el.addEventListener("click",function(ev){ runNav(nid,ev); });
    el.addEventListener("touchend",function(ev){ runNav(nid,ev); },{passive:false});
  });
}
function init(){
  try{
  sanitizeA11y(); ensureManagerMode();
  dismissBlockingUI();
  applyI18n(); applyA11y(); applyTheme(); applySimpleUi(); applyCosmetics(); applyFocusLearn(); ensureDaily(); ensureWeekly(); ensureTeamScores(); ensureStreak(); refreshHud();
  try{ renderStreakCard(); }catch(e){ console.error(e); }
  try{ renderWeekCard(); }catch(e){ console.error(e); }
  try{ renderDaily(); }catch(e){ console.error(e); }
  try{ renderNextStep(); }catch(e){ console.error(e); }
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
window.__gdvStartBoss=function(id){ startBoss(id); };
window.__gdvCmapScene=cmapScene;
window.__gdvOffmapScene=offmapScene;
window.__gdvChainById=chainById;
wireBottomNav();
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
else init();
})();
