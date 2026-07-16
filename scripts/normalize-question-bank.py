"""Normaliza banco: 4 alternativas, dicas pessoais sem prefixo redundante."""
import hashlib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PT_PREFIX = "Na vida pessoal: "
EN_PREFIX = "In personal life: "

FOURTH_BY_THEME = {
    "phishing": [
        ("Encaminho para o grupo da equipe para todos decidirem juntos", "Forward it to the team group so everyone decides together"),
        ("Clico só para ver a página e fecho em seguida", "Click just to see the page and close right after"),
        ("Aguardo o fim do dia para ver se alguém mais relata", "Wait until end of day to see if others report it"),
        ("Salvo o link para abrir quando estiver menos ocupado", "Save the link to open when I'm less busy"),
    ],
    "password": [
        ("Reutilizo a senha antiga com um caractere a mais", "Reuse the old password with one more character"),
        ("Anoto a nova senha em um arquivo de texto no desktop", "Write the new password in a text file on the desktop"),
        ("Adio a troca até o sistema bloquear de novo", "Postpone the change until the system locks again"),
        ("Compartilho com o colega de turno para não esquecer", "Share it with my shift colleague so we don't forget"),
    ],
    "ot": [
        ("Autorizo acesso temporário sem abrir chamado formal", "Allow temporary access without opening a formal ticket"),
        ("Reinicio o equipamento sem avisar para normalizar rápido", "Reboot the equipment without telling anyone to normalize quickly"),
        ("Peço ao colega a senha de admin para resolver na hora", "Ask a colleague for the admin password to fix it now"),
        ("Testo a solução em produção para ganhar tempo", "Test the fix in production to save time"),
    ],
    "data": [
        ("Copio para um pendrive pessoal para trabalhar em casa", "Copy to a personal USB to work from home"),
        ("Envio por mensagem instantânea para agilizar a resposta", "Send via instant message to speed up the reply"),
        ("Publico em pasta compartilhada ampla da equipe", "Publish in a wide team shared folder"),
        ("Imprimo e deixo na mesa para revisão presencial", "Print it and leave it on the desk for in-person review"),
    ],
    "device": [
        ("Desativo o bloqueio automático para não perder tempo", "Disable auto-lock so I don't lose time"),
        ("Instalo o app e reviso permissões depois", "Install the app and review permissions later"),
        ("Uso o mesmo tablet para apps pessoais e operacionais", "Use the same tablet for personal and operational apps"),
        ("Deixo o dispositivo desbloqueado porque volto em minutos", "Leave the device unlocked because I'll be back in minutes"),
    ],
    "remote": [
        ("Acesso sistemas pelo Wi-Fi do hotel sem proteção extra", "Access systems on hotel Wi-Fi without extra protection"),
        ("Compartilho a VPN com um colega que esqueceu a senha", "Share the VPN with a colleague who forgot the password"),
        ("Trabalho no notebook pessoal sem separar contas", "Work on a personal laptop without separating accounts"),
        ("Desativo a VPN porque a conexão ficou lenta", "Disable the VPN because the connection got slow"),
    ],
    "bec": [
        ("Autorizo pagamento parcial hoje e valido o restante depois", "Authorize partial payment today and validate the rest later"),
        ("Atualizo os dados bancários no sistema antes de confirmar", "Update bank details in the system before confirming"),
        ("Peço para reenviar o e-mail com assinatura digital", "Ask them to resend the email with a digital signature"),
        ("Respondo no mesmo thread pedindo urgência máxima", "Reply in the same thread asking for maximum urgency"),
    ],
    "port": [
        ("Acompanho a pessoa sem crachá para agilizar a visita", "Escort the person without a badge to speed up the visit"),
        ("Deixo passar porque parece funcionário de outra área", "Let them through because they look like staff from another area"),
        ("Tiro foto também para comparar depois com a equipe", "Take a photo too to compare later with the team"),
        ("Peço para voltar amanhã com documento impresso", "Ask them to return tomorrow with a printed document"),
    ],
}

# Dicas mais situacionais e menos óbvias (por id do BANK)
REWRITE_PERSONAL = {
    "q_phish_01": (
        "E-mail com prazo de 2 horas para 'reconfirmar senha'? O padrão de pressão também aparece em mensagens pessoais — vale pausar antes de clicar.",
        "Email with a 2-hour deadline to 'reconfirm your password'? That pressure pattern shows up in personal messages too — pause before clicking.",
    ),
    "q_phish_02": (
        "Site com nome parecido ao oficial (netfl1x, orbita-login…)? No celular, olhar o endereço completo evita cair no mesmo truque.",
        "Site with a lookalike name (netfl1x, orbita-login…)? On your phone, checking the full address avoids the same trick.",
    ),
    "q_phish_03": (
        "SMS de 'entrega retida' pedindo taxa? O mesmo formato de cobrança inesperada circula em golpes de encomenda.",
        "'Delivery on hold' SMS asking for a fee? The same unexpected-charge format circulates in parcel scams.",
    ),
    "q_pass_01": (
        "Uma senha forte repetida no streaming, banco e e-mail? Se uma vazar, as outras caem em sequência.",
        "One strong password reused for streaming, bank, and email? If one leaks, the others fall in sequence.",
    ),
    "q_pass_02": (
        "Código de verificação sem você ter tentado entrar? Alguém pode estar testando sua senha em outro lugar.",
        "Verification code when you didn't try to log in? Someone may be testing your password elsewhere.",
    ),
    "q_bec_01": (
        "Pedido de transferência urgente e sigiloso? No dia a dia, mudança de conta por mensagem também pede confirmação por voz.",
        "Urgent, confidential transfer request? In daily life, account changes by message also deserve voice confirmation.",
    ),
    "q_phish_05": (
        "Qual sinal pesa mais: urgência + link + remetente estranho. Esse trio também ajuda a filtrar mensagens pessoais suspeitas.",
        "Which sign weighs most: urgency + link + unknown sender. That trio also helps filter suspicious personal messages.",
    ),
}


def pick_variant(key, theme, pool):
    h = int(hashlib.md5(key.encode("utf-8")).hexdigest(), 16)
    items = pool.get(theme) or pool["ot"]
    return items[h % len(items)]


def strip_prefix(text, prefix):
    if text.startswith(prefix):
        return text[len(prefix) :].strip()
    return text.strip()


def clean_all_personal(text):
    def repl(m):
        pt = strip_prefix(m.group(1), PT_PREFIX)
        en = strip_prefix(m.group(2), EN_PREFIX)
        if pt:
            pt = pt[0].upper() + pt[1:]
        if en:
            en = en[0].upper() + en[1:]
        return f'personal:{{pt:"{pt}",en:"{en}"}}'

    return re.sub(
        r'personal:\{pt:"((?:[^"\\]|\\.)*)",en:"((?:[^"\\]|\\.)*)"\}',
        repl,
        text,
    )


def rewrite_bank_personal(text):
    for qid, (pt, en) in REWRITE_PERSONAL.items():
        pat = rf'(\{{id:"{qid}"[\s\S]*?personal:\{{)pt:"(?:[^"\\]|\\.)*",en:"(?:[^"\\]|\\.)*"(\}})'
        repl = rf'\1pt:"{pt}",en:"{en}"\2'
        text = re.sub(pat, repl, text, count=1)
    return text


def infer_theme_from_context(ctx):
    m = re.search(r'theme:"([a-z]+)"', ctx)
    if m:
        return m.group(1)
    qm = re.search(r'q:\{pt:"((?:[^"\\]|\\.)*)"', ctx)
    if not qm:
        return "ot"
    t = qm.group(1).lower()
    if re.search(r"e-mail|email|link|macro|smishing|sms|phishing", t):
        return "phishing"
    if re.search(r"senha|password|mfa|credencial", t):
        return "password"
    if re.search(r"pagamento|transfer|banco|fornecedor|ceo|bec|bitcoin|conta|pix", t):
        return "bec"
    if re.search(r"dados|lgpd|vazamento|planilha|relat|privacidade", t):
        return "data"
    if re.search(r"crach|porto|terminal|drone|fotograf|porta|badge", t):
        return "port"
    if re.search(r"vpn|wi-fi|remoto|viagem|hotspot|aeroporto", t):
        return "remote"
    if re.search(r"tablet|app|dispositivo|notebook|pen drive|usb|firmware|celular", t):
        return "device"
    return "ot"


def extract_q_from_context(ctx):
    m = re.search(r'q:\{pt:"((?:[^"\\]|\\.)*)"', ctx)
    return m.group(1) if m else ""


def infer_personal(q_pt, theme, key):
    t = q_pt.lower()
    rules = [
        (r"pen drive|usb|pendrive", ("Achar pendrive na recepção? Não plugue para 'ver o dono' — o risco é o mesmo de na operação.", "Found a USB in the lobby? Don't plug it in to 'find the owner' — same risk as at work.")),
        (r"e-mail|email|anexo|macro|link", ("Mensagem inesperada com anexo no celular? Confirmar a fonte fora do link é hábito que vale igual.", "Unexpected message with an attachment on your phone? Confirming the source outside the link is an equally good habit.")),
        (r"sms|smishing", ("SMS cobrando taxa de entrega? Confira pelo app oficial da loja — o padrão de urgência é familiar.", "SMS charging a delivery fee? Check via the store's official app — the urgency pattern is familiar.")),
        (r"senha|password|mfa|credencial", ("Código de verificação sem você ter pedido login? Trate como alerta, não como incômodo.", "Verification code when you didn't try to log in? Treat it as a warning, not a nuisance.")),
        (r"crach|badge|porta|entrada|técnico sem", ("Visitante sem identificação no condomínio? Confirmar na portaria vale fora do trabalho também.", "Visitor without ID at your building? Checking with reception applies outside work too.")),
        (r"drone|fotograf", ("Alguém filmando a entrada do prédio? Vale avisar portaria — pode ser inofensivo, mas é melhor checar.", "Someone filming your building entrance? Tell reception — it may be harmless, but worth checking.")),
        (r"vpn|wi-fi|hotspot|aeroporto|remoto", ("Wi-Fi público no café? O que você acessa ali define o risco — como na viagem a trabalho.", "Public café Wi-Fi? What you access there defines the risk — like on a work trip.")),
        (r"pagamento|transfer|banco|fornecedor|conta|pix", ("Conta nova pedida por mensagem? Ligue para um número que você já tinha salvo.", "New account requested by message? Call a number you already had saved.")),
        (r"dados|planilha|lgpd|relat|privacidade", ("Documento pessoal no grupo da família? Menos cópias circulando, menor chance de vazamento.", "Personal document in a family group? Fewer copies circulating means less chance of a leak.")),
        (r"backup|restaur", ("Backup do celular antes de trocar de aparelho? Cópia limpa evita perder tudo de uma vez.", "Phone backup before switching devices? A clean copy avoids losing everything at once.")),
        (r"ransom|resgate|malware|criptograf", ("Tela pedindo pagamento para 'destravar'? Desligar da rede e pedir ajuda evita piorar.", "Screen asking for payment to 'unlock'? Disconnect from the network and get help to avoid making it worse.")),
        (r"segment|firewall|rede", ("Rede de visitas separada da smart TV em casa? Menos superfície se um aparelho for comprometido.", "Guest network separated from smart TV at home? Less surface if one device is compromised.")),
        (r"treinamento|conscientiza", ("Parente repassando 'dica quente' no WhatsApp? Desconfiar de urgência protege em qualquer contexto.", "Relative forwarding a 'hot tip' on WhatsApp? Questioning urgency protects in any context.")),
    ]
    for pattern, tip in rules:
        if re.search(pattern, t):
            return tip
    generic = {
        "phishing": ("Pressa + link desconhecido? Pause antes de clicar — o padrão se repete fora do trabalho.", "Urgency + unknown link? Pause before clicking — the pattern repeats outside work."),
        "password": ("Adiar troca de senha até o último dia? Quem espera demais costuma reutilizar padrão fácil.", "Putting off a password change until the last day? Waiting often leads to easy reused patterns."),
        "ot": ("Atalho técnico em casa (roteador, automação)? Validar fonte evita abrir brecha sem perceber.", "Technical shortcut at home (router, automation)? Validating the source avoids unnoticed gaps."),
        "data": ("Foto de documento no grupo? Pense em quem mais pode ver além de quem você enviou.", "Document photo in a group? Think about who else can see beyond who you sent it to."),
        "device": ("Sair da mesa sem bloquear o celular? Segundos bastam para alguém próximo abrir apps.", "Stepping away without locking your phone? Seconds are enough for someone nearby to open apps."),
        "remote": ("Wi-Fi aberto no shopping para 'só checar uma coisa'? O risco acompanha o que você acessa.", "Open mall Wi-Fi to 'just check one thing'? The risk matches what you access."),
        "bec": ("Mudança de dados de pagamento por mensagem? Confirmar por voz com contato antigo ajuda.", "Payment details changed by message? Voice confirmation with an old contact helps."),
        "port": ("Estranho pedindo para 'segurar a porta'? No prédio, como no terminal, confirme antes.", "Stranger asking you to 'hold the door'? At your building, like at a terminal, confirm first."),
    }
    return generic.get(theme, generic["ot"])


def set_opts_count(block, theme, key, target=4):
    count = len(re.findall(r"\{pt:", block))
    if count >= target:
        return block
    pt4, en4 = pick_variant(key, theme, FOURTH_BY_THEME)
    body = block
    if count < target:
        body = re.sub(
            r"(opts:\[[\s\S]*?)(\],correct:)",
            rf'\1,{{pt:"{pt4}",en:"{en4}"}}\2',
            body,
            count=1,
        )
    return body


def insert_boss_personal_lines(text, file_tag):
    lines = text.split("\n")
    out = []
    idx = 0
    for line in lines:
        if re.search(r'^\s+q:\{pt:"', line):
            prev = "\n".join(out[-5:])
            if "personal:" not in prev:
                m = re.search(r'q:\{pt:"((?:[^"\\]|\\.)*)",en:"((?:[^"\\]|\\.)*)"', line)
                if m:
                    theme = infer_theme_from_context("\n".join(out[-30:]) + "\n" + line)
                    pt, en = infer_personal(m.group(1), theme, f"{file_tag}:b{idx}")
                    idx += 1
                    indent = re.match(r"^(\s+)", line).group(1)
                    out.append(f'{indent}personal:{{pt:"{pt}",en:"{en}"}},')
        out.append(line)
    return "\n".join(out)


def insert_missing_personal(text, file_tag):
    idx = 0

    def personal_str(q_pt, theme):
        nonlocal idx
        key = f"{file_tag}:p{idx}"
        idx += 1
        pt, en = infer_personal(q_pt, theme, key)
        return f'personal:{{pt:"{pt}",en:"{en}"}},'

    def repl_inline(m):
        ctx = text[max(0, m.start() - 300) : m.start()]
        if "personal:" in ctx:
            return m.group(0)
        theme, diff = m.group(1), m.group(2)
        q_pt = m.group(3)
        ins = personal_str(q_pt, theme)
        return f'{{theme:"{theme}",diff:{diff},{ins}q:{{pt:"{q_pt}"'

    text = re.sub(
        r'\{theme:"([a-z]+)",diff:(\d+),q:\{pt:"((?:[^"\\]|\\.)*)"',
        repl_inline,
        text,
    )
    return text


def process_opts(text, file_tag):
    idx = 0
    out = []
    last = 0
    for m in re.finditer(r"opts:\[(.*?)\],correct:(\d+)", text, re.S):
        out.append(text[last : m.start()])
        ctx = text[max(0, m.start() - 1500) : m.start()]
        theme = infer_theme_from_context(ctx)
        key = f"{file_tag}:o{idx}"
        idx += 1
        block = m.group(0)
        block = set_opts_count(block, theme, key)
        out.append(block)
        last = m.end()
    out.append(text[last:])
    return "".join(out)


def fix_officechain_stub(text):
    return text.replace(
        'phases:[{scene:{pt:"Início",en:"Start"},q:{pt:"…",en:"…"},opts:[{pt:"A",en:"A"},{pt:"B",en:"B"}],correct:0}]',
        'phases:[{scene:{pt:"Cena 1 — O e-mail",en:"Scene 1 — The email"},'
        'personal:{pt:"Mensagem inesperada com anexo no celular? Confirmar a fonte fora do link é hábito que vale igual.",en:"Unexpected message with an attachment on your phone? Confirming the source outside the link is an equally good habit."},'
        'q:{pt:"Segunda-feira no Rio: e-mail externo com anexo \'folha_pagamento.xlsm\' pedindo para habilitar macros. Primeira ação?",en:"Monday in Rio: external email with \'payroll.xlsm\' attachment asks to enable macros. First action?"},'
        'opts:[{pt:"Habilito as macros para ver o conteúdo",en:"Enable macros to see the content"},'
        '{pt:"Não habilito; confirmo remetente pelo canal oficial e reporto se suspeito",en:"Don\'t enable; confirm sender via official channel and report if suspicious"},'
        '{pt:"Encaminho para colegas abrirem primeiro",en:"Forward so colleagues open it first"},'
        '{pt:"Salvo o anexo para abrir em casa no notebook pessoal",en:"Save the attachment to open at home on a personal laptop"}],correct:1}]',
    )


def process_file(rel_path):
    path = ROOT / rel_path
    text = path.read_text(encoding="utf-8")
    text = clean_all_personal(text)
    if rel_path == "js/questions-data.js":
        text = rewrite_bank_personal(text)
    text = insert_missing_personal(text, rel_path)
    if rel_path == "js/bosses-data.js":
        text = insert_boss_personal_lines(text, rel_path)
    text = process_opts(text, rel_path)
    if rel_path == "js/bosses-data.js":
        text = fix_officechain_stub(text)
    path.write_text(text, encoding="utf-8", newline="\n")
    print(f"OK {rel_path}")


def main():
    for rel in [
        "js/questions-data.js",
        "js/country-questions-data.js",
        "js/chain-data.js",
        "js/bosses-data.js",
    ]:
        process_file(rel)
    print("Done.")


if __name__ == "__main__":
    main()
