/* Dicas "Na sua vida" por cena — cada fase do storytelling tem guia pessoal único */
var BOSS_PERSONAL_TIPS={
  ransom:[
    {pt:"Se o PC ou celular pedir resgate, desligue da rede e busque ajuda — nunca pague sem orientação.",en:"If your PC or phone demands ransom, disconnect from the network and get help — never pay without guidance."},
    {pt:"Link suspeito em e-mail de 'atualização'? No trabalho ou em casa, confirme com quem enviou antes de clicar.",en:"Suspicious 'update' email link? At work or home, confirm with the sender before clicking."},
    {pt:"Na smart home, câmeras e roteador na mesma rede do notebook podem espalhar malware — separe redes de visitas.",en:"At home, cameras and router on the same network as your laptop can spread malware — separate guest networks."},
    {pt:"Backup de fotos e documentos no HD externo desconectado salva você como fita offline salva a ferrovia.",en:"Backing up photos and documents to an unplugged external drive saves you like offline tape saves the railway."},
    {pt:"Depois de invasão, troque senhas de e-mail, banco e redes sociais — credencial velha é porta aberta.",en:"After a breach, change email, bank and social passwords — old credentials are an open door."},
    {pt:"Pressa para 'voltar ao normal' em casa ou no trabalho costuma pular passos de segurança — siga o checklist.",en:"Rushing to 'get back to normal' at home or work often skips security steps — follow the checklist."},
    {pt:"Wi-Fi de visitas no roteador sem senha forte é como rede plana no escritório — isole dispositivos IoT.",en:"Guest Wi-Fi on a router without a strong password is like a flat office network — isolate IoT devices."},
    {pt:"Curso rápido de phishing para a família evita que um clique no grupo do WhatsApp comprometa seu notebook.",en:"A quick phishing lesson for family prevents one WhatsApp group click from compromising your laptop."},
    {pt:"Simular 'e se meu celular fosse criptografado?' em casa ajuda a saber quem ligar e o que priorizar.",en:"Simulating 'what if my phone were encrypted?' at home helps you know who to call and what to prioritize."},
    {pt:"Antivírus sozinho não basta — backup testado, senha forte e desconfiança de anexo formam sua resiliência.",en:"Antivirus alone isn't enough — tested backups, strong passwords and attachment skepticism build your resilience."}
  ],
  ceo:[
    {pt:"PIX ou transferência urgente por WhatsApp de 'parente'? Ligue no número que você já tem salvo.",en:"Urgent PIX or transfer on WhatsApp from a 'relative'? Call the number you already have saved."},
    {pt:"E-mail com domínio parecido (banco-x.com vs banco.com) engana no celular — olhe letra por letra.",en:"Email with a lookalike domain (bank-x.com vs bank.com) fools on mobile — check letter by letter."},
    {pt:"Mudança de conta bancária por mensagem, sem ligar no banco oficial, é o mesmo golpe do fornecedor falso.",en:"Bank account change via message without calling official support is the same fake-supplier scam."},
    {pt:"Ninguém legítimo pede senha ou aprovação financeira por WhatsApp — use só app ou site oficial.",en:"No legitimate party asks for passwords or payment approval on WhatsApp — use only official app or site."},
    {pt:"Ligação do 'banco' pedindo código do token? Desligue e ligue você no número do cartão.",en:"'Bank' call asking for token code? Hang up and call the number on your card yourself."},
    {pt:"Pagamentos grandes merecem segunda confirmação — no app do banco, confira beneficiário e valor duas vezes.",en:"Large payments deserve a second confirmation — in your banking app, check payee and amount twice."},
    {pt:"Golpe do parente no feriado acontece em casa também — combine palavra-código com família para urgências.",en:"Holiday relative scams happen at home too — agree on a family code word for real emergencies."},
    {pt:"Fornecedor que muda PIX por e-mail: ligue no telefone do site oficial, não no que veio na mensagem.",en:"Supplier changing PIX by email: call the official website phone, not the one in the message."},
    {pt:"Anote tentativas de golpe que você bloqueou — ajuda a perceber padrões e proteger parentes idosos.",en:"Note scam attempts you blocked — it helps spot patterns and protect elderly relatives."},
    {pt:"Regra de ouro pessoal: dinheiro só sai com confirmação em canal que você iniciou, nunca no que te procuraram.",en:"Personal golden rule: money only leaves after confirmation on a channel you started, never one that contacted you."}
  ],
  otintr:[
    {pt:"Notebook de manutenção com software pirata ou remoto não homologado é porta de entrada — use só apps oficiais.",en:"A maintenance laptop with pirated or unapproved remote software is an entry point — use only official apps."},
    {pt:"Pen drive achado no estacionamento? Não conecte — em casa ou no trabalho, entregue à segurança ou TI.",en:"USB drive found in the parking lot? Don't plug it in — at home or work, hand it to security or IT."},
    {pt:"Dispositivos da smart home na rede de visitas podem abrir brechas — separe redes.",en:"Smart-home devices on guest networks can open gaps — separate networks."},
    {pt:"Antes de religar tudo após vírus no PC, reinstale o sistema e troque senhas — malware pode voltar escondido.",en:"Before reconnecting everything after a PC virus, reinstall and change passwords — malware may return hidden."},
    {pt:"Câmera IP, impressora e videogame na mesma rede do notebook corporativo ampliam o estrago — use VLAN ou Wi-Fi de visitas.",en:"IP camera, printer and console on the same network as your work laptop widen damage — use VLAN or guest Wi-Fi."},
    {pt:"Alarme de incêndio e fechadura digital são OT da sua casa — atualize firmware e não exponha na internet.",en:"Smoke alarm and smart lock are your home OT — update firmware and don't expose them to the internet."},
    {pt:"DMZ em casa = IoT numa rede só para eles; seu notebook e celular ficam em outra.",en:"Home DMZ = IoT on their own network; your laptop and phone stay on another."},
    {pt:"Remova programas de acesso remoto que você não usa (TeamViewer antigo, etc.) — são alvos clássicos.",en:"Remove remote-access programs you don't use (old TeamViewer, etc.) — they're classic targets."},
    {pt:"Combine com família o que fazer se a internet cair após suspeita de invasão — roteador off, senhas trocadas.",en:"Agree with family what to do if internet drops after a suspected breach — router off, passwords changed."},
    {pt:"Governança digital em casa: inventário de aparelhos conectados, senha no roteador e atualização automática ligada.",en:"Digital governance at home: inventory of connected devices, router password and automatic updates enabled."}
  ],
  omphish:[
    {pt:"SMS 'sua encomenda' com link estranho usa a mesma pressa do portal falso — abra o app oficial do correio.",en:"'Your package' SMS with a weird link uses the same urgency as a fake portal — open the official courier app."},
    {pt:"Depois de digitar senha em site duvidoso, troque imediatamente e ative verificação em duas etapas.",en:"After entering a password on a dubious site, change it immediately and enable two-factor authentication."},
    {pt:"Alterar endereço de entrega no app sem conferir pode mandar compra para lugar errado — igual ao navio desviado.",en:"Changing delivery address in an app without checking can send purchases astray — like a diverted ship."},
    {pt:"Quem liga pedindo senha de Wi-Fi ou do roteador se passando por 'suporte' — desligue e ligue você na operadora.",en:"Caller asking for Wi-Fi or router password posing as 'support' — hang up and call your provider yourself."},
    {pt:"Vários membros da família clicaram no mesmo golpe? Troque senhas de todos e avise no grupo com o link falso.",en:"Several family members clicked the same scam? Reset everyone's passwords and warn the group with the fake link."},
    {pt:"Planilha de gastos da família no grupo errado do WhatsApp vaza como manifesto de carga — confira destinatário.",en:"Family expense spreadsheet in the wrong WhatsApp group leaks like a cargo manifest — check recipients."},
    {pt:"Login só com senha em app de compras ou banco é risco no hub e em casa — MFA onde existir.",en:"Password-only login on shopping or banking apps is hub and home risk — use MFA wherever available."},
    {pt:"Lista de compras, agenda e orçamento em apps diferentes sem conferir totais = cadeia desalinhada no bolso.",en:"Shopping lists, calendar and budget in different apps without reconciling = a misaligned chain in your pocket."},
    {pt:"Se caiu em golpe, avisar parentes com fatos e sem culpa ajuda mais que esconder por vergonha.",en:"If you fell for a scam, telling relatives with facts and without blame helps more than hiding in shame."},
    {pt:"Salve contatos oficiais (banco, loja, operadora) na agenda — na dúvida, você sempre inicia o contato.",en:"Save official contacts (bank, store, carrier) in your phone — when in doubt, you always initiate contact."}
  ],
  leakchain:[
    {pt:"Enviou foto de documento ou extrato para contato errado? Avise o banco e a pessoa imediatamente.",en:"Sent a document photo or statement to the wrong contact? Notify the bank and the person immediately."},
    {pt:"Antes de encaminhar PDF com dados de saúde ou finanças, confira destinatário letra por letra.",en:"Before forwarding a PDF with health or finance data, check the recipient letter by letter."},
    {pt:"Planilha de orçamento familiar no e-mail errado ensina: classifique 'só família' antes de compartilhar.",en:"Family budget spreadsheet to the wrong email teaches: label 'family only' before sharing."},
    {pt:"Alerta do Gmail ou Outlook sobre destinatário externo merece pausa — igual DLP no trabalho.",en:"Gmail or Outlook warning about external recipients deserves a pause — like DLP at work."},
    {pt:"Template com rótulo 'confidencial' no nome do arquivo lembra a conferir antes do envio.",en:"A template with a 'confidential' file label reminds you to double-check before sending."},
    {pt:"Vazou dado de amigo ou parente? Avise a pessoa afetada com clareza — transparência reduz dano.",en:"Leaked a friend or relative's data? Tell the affected person clearly — transparency reduces harm."},
    {pt:"Fotos de filhos na escola com nome completo na legenda são dado pessoal sensível — revise álbuns compartilhados.",en:"School photos of children with full names in captions are sensitive personal data — review shared albums."},
    {pt:"Preço que você comentou em grupo pode virar fofoca de mercado — combine o que é privado na família.",en:"A price you mentioned in a group can become gossip — agree what's private in the family."},
    {pt:"Hábito: olhar destinatário, anexo e se é realmente necessário enviar — três segundos evitam arrependimento.",en:"Habit: check recipient, attachment and whether sending is necessary — three seconds prevent regret."},
    {pt:"Canais aprovados em casa: app oficial do banco, não print no Telegram para 'agilizar'.",en:"Approved channels at home: official banking app, not a screenshot on Telegram to 'speed things up'."}
  ],
  portintr:[
    {pt:"Visitante sem identificação na portaria do prédio? Não libere acesso ao Wi-Fi ou à sua sala.",en:"Visitor without ID at your building lobby? Don't grant Wi-Fi or room access."},
    {pt:"Pen drive 'esquecido' na mesa do coworking é isca clássica — não conecte no seu notebook.",en:"'Forgotten' USB at the coworking desk is classic bait — don't plug it into your laptop."},
    {pt:"Malware que busca senha lembra: não salve senha de banco no navegador em PC compartilhado.",en:"Password-hunting malware reminds you: don't save bank passwords in the browser on a shared PC."},
    {pt:"Login estranho na sua conta às 2h? Troque senha, revogue sessões e ative MFA no roteador e e-mail.",en:"Strange login on your account at 2 AM? Change password, revoke sessions and enable MFA on router and email."},
    {pt:"Balança adulterada = confiar em número sem conferir; na vida pessoal, confira extrato e fatura linha a linha.",en:"Tampered scale = trusting numbers without checking; in personal life, review statements line by line."},
    {pt:"Alguém entrou no apartamento atrás de você sem crachá? Tailgating acontece em prédio e em link malicioso.",en:"Someone entered your apartment behind you without a badge? Tailgating happens in buildings and malicious links."},
    {pt:"Segurança física + digital em casa: fechadura, câmera e senha do Wi-Fi conversam — uma falha afeta a outra.",en:"Physical + digital security at home: lock, camera and Wi-Fi password interact — one failure affects the other."},
    {pt:"Fila de tarefas atrasadas não justifica pular verificação de identidade — nem no porto nem no PIX.",en:"A backlog of tasks doesn't justify skipping identity checks — not at the port or for PIX."},
    {pt:"Política de visitas em casa: parentes avisam, entregador não entra, técnico mostra ordem de serviço.",en:"Home visitor policy: relatives announce themselves, couriers don't enter, technicians show work orders."},
    {pt:"Exercício em família: 'e se alguém pedisse senha do Wi-Fi se passando por técnico?' — ensaie a resposta.",en:"Family drill: 'what if someone asked for Wi-Fi password posing as a technician?' — rehearse the answer."}
  ]
};
