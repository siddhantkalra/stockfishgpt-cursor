#!/usr/bin/env python3

import subprocess
from datetime import datetime

HEADER = """# 📌 Changelog – StockfishGPT

All notable changes to this project will be documented in this file.

> This changelog is auto-generated using Git. Changes to this file itself are excluded.

---
"""

def get_commits():
    log = subprocess.run(
        [
            "git",
            "log",
            "--pretty=format:%H|%ad|%s",
            "--date=short",
            "--no-merges"
        ],
        stdout=subprocess.PIPE,
        text=True
    ).stdout.splitlines()
    
    commits = []
    for entry in log:
        sha, date, msg = entry.split("|", 2)
        # Skip commits that only touch CHANGELOG.md
        diff = subprocess.run(["git", "show", "--name-only", "--pretty=format:", sha],
                              stdout=subprocess.PIPE, text=True).stdout
        if "CHANGELOG.md" in diff and diff.strip() == "CHANGELOG.md":
            continue
        commits.append((sha[:7], date, msg))
    return commits

def format_changelog(commits):
    log_by_date = {}
    for sha, date, msg in commits:
        if date not in log_by_date:
            log_by_date[date] = []
        log_by_date[date].append(f"- {msg} (`{sha}`)")
    
    body = ""
    for date in sorted(log_by_date.keys(), reverse=True):
        body += f"\n## [{date}]\n\n" + "\n".join(log_by_date[date]) + "\n"
    return HEADER + body

if __name__ == "__main__":
    commits = get_commits()
    with open("CHANGELOG.md", "w") as f:
        f.write(format_changelog(commits))
    print("✅ CHANGELOG.md updated!")
