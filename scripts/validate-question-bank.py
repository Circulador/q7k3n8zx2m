import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

for rel in ["questions-data.js", "country-questions-data.js", "chain-data.js", "bosses-data.js"]:
    t = (ROOT / "js" / rel).read_text(encoding="utf-8")
    opts = re.findall(r"opts:\[(.*?)\],correct:", t, re.S)
    lt4 = sum(1 for o in opts if len(re.findall(r"\{pt:", o)) < 4)
    prefix = t.count("Na vida pessoal:")
    print(f"{rel}: blocks={len(opts)} lt4={lt4} prefix={prefix}")
