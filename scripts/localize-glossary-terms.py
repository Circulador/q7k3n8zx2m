"""Convert glossary term strings to bilingual {pt,en} objects."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "js" / "glossary-data.js"

TERM_EN = {
    "Controle de acesso": "Access control",
    "Antivírus": "Antivirus",
    "Classificação de dados": "Data classification",
    "Vazamento de dados": "Data leak",
    "Criptografia": "Encryption",
    "Resposta a incidentes": "Incident response",
    "Segurança portuária": "Port security",
    "Senha": "Password",
    "Engenharia social": "Social engineering",
    "Fraude PIX": "PIX fraud",
    "Segmentação de rede": "Network segmentation",
    "Reconhecimento": "Reconnaissance",
    "Exercício tabletop": "Tabletop exercise",
    "Reporte de phishing": "Phishing report",
    "Portal falso": "Fake portal",
    "Roubo de credenciais": "Credential theft",
    "Personificação": "Impersonation",
    "Fraude de fornecedor": "Supplier fraud",
    "Macros maliciosas": "Malicious macros",
    "Movimento lateral": "Lateral movement",
    "Gerenciador de senhas": "Password manager",
    "Bloqueio de tela": "Screen lock",
    "Senha padrão de fábrica": "Factory default password",
    "Software homologado": "Approved software",
    "Permissões de app": "App permissions",
    "Exfiltração de dados": "Data exfiltration",
    "Acesso remoto": "Remote access",
    "Ponte TI→OT": "IT→OT bridge",
}


def en_for(pt: str) -> str:
    if pt in TERM_EN:
        return TERM_EN[pt]
    if not re.search(r"[àáâãéêíóôõúç]", pt, re.I):
        return pt
    raise ValueError(f"Missing English term for: {pt}")


def main():
    text = ROOT.read_text(encoding="utf-8")
    seen = set()

    def repl(m):
        pt = m.group(1)
        if pt in seen:
            pass
        seen.add(pt)
        en = en_for(pt)
        if pt == en:
            return f'term:"{pt}"'
        return f'term:{{pt:"{pt}",en:"{en}"}}'

    new = re.sub(r'term:"([^"]+)"', repl, text)
    if new == text:
        print("No changes")
        return
    ROOT.write_text(new, encoding="utf-8", newline="\n")
    print(f"Updated {len(seen)} terms")


if __name__ == "__main__":
    main()
