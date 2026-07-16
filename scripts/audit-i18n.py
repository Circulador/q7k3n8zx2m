"""Find PT/EN i18n gaps in game data files."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "js"

TERM_EN = {
    "Controle de acesso": "Access control",
    "Antivírus": "Antivirus",
    "Vazamento de dados": "Data leak",
    "Criptografia": "Encryption",
    "Senha": "Password",
    "Segurança portuária": "Port security",
    "Engenharia social": "Social engineering",
    "Fraude PIX": "PIX fraud",
    "Resposta a incidentes": "Incident response",
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
    "Firmware": "Firmware",
    "Acesso remoto": "Remote access",
    "Ponte TI→OT": "IT→OT bridge",
    "Playbook": "Playbook",
    "Classificação de dados": "Data classification",
    "Zero Trust": "Zero Trust",
    "Typosquatting": "Typosquatting",
    "Baiting": "Baiting",
    "Deepfake": "Deepfake",
    "Juice jacking": "Juice jacking",
    "Backdoor": "Backdoor",
}


def audit_file(path: Path):
    text = path.read_text(encoding="utf-8")
    issues = []
    for m in re.finditer(r"\{pt:\"((?:\\.|[^\"])*)\"", text):
        start = m.start()
        end = text.find("}", start)
        if end < 0:
            continue
        block = text[start : end + 1]
        if "en:" not in block:
            issues.append(("missing_en", m.group(1)[:80]))
        else:
            em = re.search(r"en:\"((?:\\.|[^\"])*)\"", block)
            if em and not em.group(1).strip():
                issues.append(("empty_en", m.group(1)[:80]))
    return issues


def main():
    for rel in [
        "questions-data.js",
        "country-questions-data.js",
        "chain-data.js",
        "bosses-data.js",
        "glossary-data.js",
    ]:
        path = ROOT / rel
        issues = audit_file(path)
        print(f"{rel}: {len(issues)} issues")
        for kind, sample in issues[:8]:
            print(f"  [{kind}] {sample}")


if __name__ == "__main__":
    main()
