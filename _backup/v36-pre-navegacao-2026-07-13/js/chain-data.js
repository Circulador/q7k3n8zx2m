/* Cadeia de produção — Carajás → China (PT/EN) */
var CHAINS = [
 {id:"carajas", ico:"⛏️",
  name:{pt:"Sistema Norte — Carajás → China",en:"Northern System — Carajás → China"},
  cap:{pt:"Sistema Norte da Vale (Pará/Maranhão): mina S11D 'Eliezer Batista' (capacidade ~90 Mt/ano, minério de alto teor ~66% Fe), britagem e Transportador de Correia de Longa Distância, usina de processamento a seco (sem barragem), Estrada de Ferro Carajás (892 km), Terminal de Ponta da Madeira (São Luís/MA, ~230 Mt/ano) e navios Valemax rumo à China — destino de mais de 60% das vendas de minério de ferro da Vale.",en:"Vale's Northern System (Pará/Maranhão): S11D 'Eliezer Batista' mine (~90 Mtpy capacity, high-grade ore ~66% Fe), crushing and the Long-Distance Conveyor, dry processing plant (no tailings dam), Carajás Railway (892 km), Ponta da Madeira Terminal (São Luís/MA, ~230 Mtpy) and Valemax vessels bound for China — destination of over 60% of Vale's iron-ore sales."},
  stages:[
   {id:"mina", ico:"⛏️", name:{pt:"1. Mina S11D (Carajás)",en:"1. S11D Mine (Carajás)"},
    desc:{pt:"Extração a seco em Carajás (PA) por escavadeiras e caminhões fora de estrada. A usina móvel fica na cava — sem uso de barragem.",en:"Dry extraction in Carajás (PA) by shovels and off-road haul trucks. The mobile plant sits in the pit — with no tailings dam."},
    qs:[
     {theme:"ot",diff:2,q:{pt:"Um operador acha um pen drive perto do painel do caminhão autônomo e quer 'ver o conteúdo'. O correto é:",en:"An operator finds a USB stick near the autonomous truck's panel and wants to 'check the contents'. The right move is:"},
      opts:[{pt:"Conectar no painel para identificar o dono",en:"Plug it into the panel to find the owner"},{pt:"Não conectar em nada e entregar à Segurança/TI",en:"Don't plug it anywhere and hand it to Security/IT"},{pt:"Levar para o refeitório e testar no notebook pessoal",en:"Take it to the canteen and test it on a personal laptop"}],correct:1,
      why:{pt:"Pen drives 'perdidos' são iscas para infectar sistemas de mina (OT). Uma infecção pode parar a extração. Nunca conecte; entregue à Segurança.",en:"'Lost' USB sticks are bait to infect mine (OT) systems. An infection can halt extraction. Never plug it in; hand it to Security."}},
     {theme:"device",diff:1,q:{pt:"Um app de terceiros promete 'otimizar a rota dos caminhões' e pede acesso ao tablet operacional. Você:",en:"A third-party app promises to 'optimize truck routes' and asks for access to the operational tablet. You:"},
      opts:[{pt:"Instalo, pode aumentar a produção",en:"Install it, it could boost production"},{pt:"Não instalo software não homologado; sigo só apps aprovados pela Vale",en:"Don't install unapproved software; use only Vale-approved apps"},{pt:"Instalo só para testar hoje",en:"Install it just to test for today"}],correct:1,
      why:{pt:"Shadow IT em equipamentos de campo abre portas para malware e vazamento. Use apenas software homologado.",en:"Shadow IT on field equipment opens doors to malware and leaks. Use only approved software."}}
    ]},
   {id:"britagem", ico:"🪨", name:{pt:"2. Britagem primária",en:"2. Primary crushing"},
    desc:{pt:"O minério é fragmentado em pedaços menores por britadores móveis.",en:"Ore is fragmented into smaller pieces by mobile crushers."},
    qs:[
     {theme:"ot",diff:3,q:{pt:"Um fornecedor liga pedindo acesso remoto imediato ao britador 'para um ajuste urgente', fora da janela de manutenção. Você:",en:"A supplier calls asking for immediate remote access to the crusher 'for an urgent tweak', outside the maintenance window. You:"},
      opts:[{pt:"Libero na hora, é o fornecedor oficial",en:"Grant it right away, it's the official supplier"},{pt:"Valido pelo canal oficial e só libero acesso aprovado e monitorado",en:"Validate via the official channel and only allow approved, monitored access"},{pt:"Passo minha senha para ele acessar",en:"Give them my password so they can log in"}],correct:1,
      why:{pt:"Acesso remoto a OT é vetor comum de ataque. Exija validação, aprovação e monitoramento — nunca compartilhe senhas.",en:"Remote access to OT is a common attack vector. Require validation, approval and monitoring — never share passwords."}},
     {theme:"password",diff:2,q:{pt:"O painel do britador ainda usa a senha padrão de fábrica 'admin/admin'. O que fazer?",en:"The crusher panel still uses the factory default password 'admin/admin'. What to do?"},
      opts:[{pt:"Deixar assim, é rede interna",en:"Leave it, it's an internal network"},{pt:"Reportar e trocar por senha forte e única, com MFA quando possível",en:"Report and change it to a strong, unique password, with MFA when possible"},{pt:"Anotar num quadro na sala de controle",en:"Write it on a board in the control room"}],correct:1,
      why:{pt:"Senhas padrão são as primeiras que invasores testam. Troque por credenciais fortes e únicas.",en:"Default passwords are the first thing attackers try. Replace them with strong, unique credentials."}}
    ]},
   {id:"tcld", ico:"🎢", name:{pt:"3. Correia TCLD",en:"3. TCLD conveyor"},
    desc:{pt:"Transportador de Correia de Longa Distância (~9,5 km) leva o minério até a usina.",en:"Long-Distance Conveyor (~9.5 km) carries ore to the plant."},
    qs:[
     {theme:"ot",diff:2,q:{pt:"Sensores da correia enviam leituras estranhas e há comandos que ninguém reconhece no supervisório. Primeiro passo?",en:"The conveyor sensors send odd readings and there are commands nobody recognizes on the SCADA. First step?"},
      opts:[{pt:"Ignorar, deve ser falha do sensor",en:"Ignore it, must be a sensor glitch"},{pt:"Acionar o plano de resposta e isolar o segmento OT afetado",en:"Trigger the response plan and isolate the affected OT segment"},{pt:"Reiniciar tudo sem avisar",en:"Reboot everything without telling anyone"}],correct:1,
      why:{pt:"Comandos desconhecidos podem indicar invasão. Acione a resposta a incidentes e isole o segmento para proteger pessoas e a operação.",en:"Unknown commands may signal a breach. Trigger incident response and isolate the segment to protect people and the operation."}},
     {theme:"ot",diff:3,q:{pt:"Por que a rede da correia (OT) deve ficar segmentada da rede administrativa (TI)?",en:"Why should the conveyor (OT) network be segmented from the administrative (IT) network?"},
      opts:[{pt:"Só para a internet ficar mais rápida",en:"Only to make the internet faster"},{pt:"Para conter ataques e impedir que uma invasão em TI atinja a produção",en:"To contain attacks and stop an IT breach from reaching production"},{pt:"Não precisa, é tudo a mesma rede",en:"No need, it's all one network"}],correct:1,
      why:{pt:"A segmentação evita que malware da TI alcance os sistemas que movem o minério — protegendo a continuidade.",en:"Segmentation prevents IT malware from reaching the systems that move the ore — protecting continuity."}}
    ]},
   {id:"usina", ico:"🏭", name:{pt:"4. Usina de processamento",en:"4. Processing plant"},
    desc:{pt:"Peneiramento, britagem secundária/terciária e regularização geram o produto final.",en:"Screening, secondary/tertiary crushing and regularization produce the final product."},
    qs:[
     {theme:"phishing",diff:2,q:{pt:"Na sala de controle da usina aparece um e-mail 'da engenharia' com anexo 'novos_parametros.xlsm' pedindo para habilitar macros. Você:",en:"In the plant control room an email 'from engineering' arrives with an attachment 'new_parameters.xlsm' asking to enable macros. You:"},
      opts:[{pt:"Habilito as macros, veio da engenharia",en:"Enable macros, it came from engineering"},{pt:"Não habilito; confirmo o remetente pelo canal oficial e reporto se for suspeito",en:"Don't enable; confirm the sender via the official channel and report if suspicious"},{pt:"Encaminho para os colegas abrirem também",en:"Forward it so colleagues open it too"}],correct:1,
      why:{pt:"Macros são um vetor clássico de malware. Confirme a origem por outro canal antes de abrir qualquer anexo executável.",en:"Macros are a classic malware vector. Confirm the origin through another channel before opening any executable attachment."}},
     {theme:"device",diff:1,q:{pt:"Ao sair do console do supervisório para o almoço, você deve:",en:"When leaving the SCADA console for lunch, you should:"},
      opts:[{pt:"Deixar logado, volto rápido",en:"Stay logged in, I'll be right back"},{pt:"Bloquear a sessão e nunca deixar o console aberto sem supervisão",en:"Lock the session and never leave the console open unattended"},{pt:"Só apagar o monitor",en:"Just switch off the monitor"}],correct:1,
      why:{pt:"Um console aberto permite comandos indevidos na produção em segundos. Bloqueie sempre a sessão.",en:"An open console allows improper production commands in seconds. Always lock the session."}}
    ]},
   {id:"patio", ico:"📦", name:{pt:"5. Pátio & carregamento",en:"5. Yard & loading"},
    desc:{pt:"O produto é estocado e a estação de carregamento abastece os vagões.",en:"Product is stockpiled and the loading station fills the wagons."},
    qs:[
     {theme:"port",diff:2,q:{pt:"Um 'técnico' sem crachá pede acesso à sala de sistemas do carregamento alegando manutenção urgente. Você:",en:"A 'technician' with no badge asks for access to the loading systems room claiming urgent maintenance. You:"},
      opts:[{pt:"Deixo entrar, parece apressado",en:"Let them in, they seem in a hurry"},{pt:"Não deixo; verifico identidade e autorização com a Segurança",en:"Don't let them in; verify identity and authorization with Security"},{pt:"Empresto meu crachá",en:"Lend them my badge"}],correct:1,
      why:{pt:"Tailgating e falta de crachá são invasão física. Valide identidade e autorização antes de qualquer acesso.",en:"Tailgating and a missing badge are physical intrusion. Validate identity and authorization before any access."}},
     {theme:"data",diff:2,q:{pt:"Você precisa enviar o relatório de carregamento com dados operacionais. O caminho seguro é:",en:"You need to send the loading report with operational data. The safe way is:"},
      opts:[{pt:"Pelo e-mail pessoal, para agilizar",en:"Via personal email, to be quick"},{pt:"Pelas ferramentas corporativas autorizadas, com acesso restrito",en:"Via authorized corporate tools with restricted access"},{pt:"Postar no grupo de mensagens da equipe",en:"Post it in the team's messaging group"}],correct:1,
      why:{pt:"Dados operacionais só trafegam em ferramentas corporativas com controle de acesso.",en:"Operational data should only travel through corporate tools with access control."}}
    ]},
   {id:"ferrovia", ico:"🚂", name:{pt:"6. Ferrovia Carajás (EFC)",en:"6. Carajás Railway (EFC)"},
    desc:{pt:"O trem percorre 892 km pela Estrada de Ferro Carajás — um dos maiores trens de carga do mundo. Desafio real: religar locomotivas em reserva técnica.",en:"The train runs 892 km on the Carajás Railway — one of the world's longest freight trains. Real challenge: restarting locomotives in technical reserve."},
    qs:[
     {theme:"ot",diff:3,q:{pt:"Desafio 'reserva técnica': para religar uma locomotiva parada, um site não oficial promete um 'app de diagnóstico da bateria'. O sinal de internet é fraco e alguém sugere o hotspot pessoal. Você:",en:"'Technical reserve' challenge: to restart a stopped locomotive, an unofficial site offers a 'battery diagnostic app'. Signal is weak and someone suggests a personal hotspot. You:"},
      opts:[{pt:"Baixo o app e uso o hotspot pessoal para agilizar",en:"Download the app and use the personal hotspot to speed things up"},{pt:"Uso só ferramentas homologadas e a conexão oficial; aciono o Help Desk pelo procedimento",en:"Use only approved tools and the official connection; call the Help Desk via the proper procedure"},{pt:"Peço a senha do sistema a um colega por telefone",en:"Ask a colleague for the system password by phone"}],correct:1,
      why:{pt:"Sob pressão operacional, apps e redes não oficiais viram porta de entrada para ataques em OT ferroviário. Siga o procedimento e use meios homologados.",en:"Under operational pressure, unofficial apps and networks become entry points for attacks on rail OT. Follow the procedure and use approved means."}},
     {theme:"ot",diff:2,q:{pt:"Sistemas eletrônicos (câmera, rádio, sensores) descarregam a bateria da locomotiva. Um técnico oferece um 'firmware acelerado' baixado por conta própria. O correto:",en:"Electronic systems (camera, radio, sensors) drain the locomotive battery. A technician offers a self-downloaded 'accelerated firmware'. The correct action:"},
      opts:[{pt:"Aplicar o firmware, resolve o problema da bateria",en:"Apply the firmware, it fixes the battery issue"},{pt:"Recusar firmware não oficial; só atualizações validadas pela Vale/fabricante",en:"Refuse unofficial firmware; only updates validated by Vale/the manufacturer"},{pt:"Aplicar em uma locomotiva para testar",en:"Apply it to one locomotive to test"}],correct:1,
      why:{pt:"Firmware não oficial pode conter backdoors e comprometer o controle da locomotiva. Use apenas atualizações validadas.",en:"Unofficial firmware may contain backdoors and compromise locomotive control. Use only validated updates."}}
    ]},
   {id:"porto", ico:"🚢", name:{pt:"7. Terminal de Ponta da Madeira",en:"7. Ponta da Madeira Terminal"},
    desc:{pt:"Em São Luís (MA), um dos maiores terminais de minério do mundo (~230 Mt/ano, carregamento de até 16.000 t/h) embarca o minério nos navios.",en:"In São Luís (MA), one of the world's largest ore terminals (~230 Mtpy, loading up to 16,000 t/h) loads the ore onto ships."},
    qs:[
     {theme:"ot",diff:2,q:{pt:"O sistema do carregador de navios (shiploader) mostra uma tela pedindo 'atualização' com um link externo. Você:",en:"The shiploader system shows a screen asking for an 'update' via an external link. You:"},
      opts:[{pt:"Clico no link para atualizar logo",en:"Click the link to update right away"},{pt:"Não clico; confirmo com a equipe de automação/TI pelo canal oficial",en:"Don't click; confirm with the automation/IT team via the official channel"},{pt:"Adio a decisão e deixo a tela aberta",en:"Postpone and leave the screen open"}],correct:1,
      why:{pt:"Falsos avisos de atualização em telas OT são golpes. Nunca clique; valide pela equipe oficial.",en:"Fake update prompts on OT screens are scams. Never click; validate with the official team."}},
     {theme:"port",diff:3,q:{pt:"Um drone não identificado sobrevoa o terminal filmando a sala de controle. Você:",en:"An unidentified drone flies over the terminal filming the control room. You:"},
      opts:[{pt:"Ignoro, drones são comuns",en:"Ignore it, drones are common"},{pt:"Reporto imediatamente à Segurança — pode ser reconhecimento para um ataque",en:"Report it to Security immediately — it may be reconnaissance for an attack"},{pt:"Tiro foto e posto nas redes sociais",en:"Take a photo and post it on social media"}],correct:1,
      why:{pt:"Reconhecimento físico costuma preceder ataques. Reporte atividades suspeitas e nunca exponha detalhes da operação online.",en:"Physical reconnaissance often precedes attacks. Report suspicious activity and never expose operation details online."}}
    ]},
   {id:"china", ico:"🇨🇳", name:{pt:"8. Rota marítima & entrega na China",en:"8. Sea route & delivery in China"},
    desc:{pt:"Navios Valemax cruzam o Atlântico e o Índico até portos chineses, onde o minério é misturado (blending) e distribuído. A China responde por mais de 60% das vendas de minério da Vale.",en:"Valemax vessels cross the Atlantic and Indian oceans to Chinese ports, where ore is blended and distributed. China accounts for over 60% of Vale's iron-ore sales."},
    qs:[
     {theme:"bec",diff:3,q:{pt:"Um 'armador' envia por e-mail novos dados bancários para o frete, pedindo pagamento urgente e sigiloso. Você:",en:"A 'shipowner' emails new bank details for the freight, asking for an urgent, confidential payment. You:"},
      opts:[{pt:"Pago logo para o navio não atrasar",en:"Pay quickly so the ship isn't delayed"},{pt:"Confirmo a mudança pelo contato oficial já cadastrado e sigo a aprovação",en:"Confirm the change via the official contact on file and follow the approval flow"},{pt:"Respondo o e-mail pedindo confirmação",en:"Reply to the email asking for confirmation"}],correct:1,
      why:{pt:"Mudança de conta + urgência + sigilo = golpe do CEO/BEC. Valide sempre por canal oficial conhecido.",en:"Account change + urgency + secrecy = CEO/BEC scam. Always validate via a known official channel."}},
     {theme:"data",diff:2,q:{pt:"Um contato pede a programação completa de navios e volumes 'para um estudo de mercado'. Você:",en:"A contact asks for the full ship schedule and volumes 'for a market study'. You:"},
      opts:[{pt:"Envio, é informação de logística",en:"Send it, it's just logistics info"},{pt:"Não envio dados sensíveis; valido a necessidade e a autorização pelo canal oficial",en:"Don't send sensitive data; validate the need and authorization via the official channel"},{pt:"Envio só uma parte",en:"Send just part of it"}],correct:1,
      why:{pt:"Programação de embarque é informação estratégica. Compartilhe só com autorização e pelos canais corretos.",en:"Shipping schedules are strategic information. Share only with authorization and through the right channels."}}
    ]}
  ]}
];
