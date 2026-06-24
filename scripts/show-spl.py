import re, sys
from collections import defaultdict

warnings = []
with open('/tmp/spl-parsed.txt') as f:
    lines = f.read().strip().split('\n')

i = 0
while i < len(lines) - 1:
    path = lines[i].strip()
    if path.endswith(('.tsx', '.ts')) and 'max-statements-per-line' in lines[i+1]:
        m = re.search(r'(\d+):(\d+)\s+warning\s+This line has (\d+) statements', lines[i+1])
        if m:
            warnings.append((path, int(m.group(1)), int(m.group(2)), int(m.group(3))))
        i += 2
    else:
        i += 1

print(f'Total: {len(warnings)} warnings across {len(set(w[0] for w in warnings))} files')

by_file = defaultdict(list)
for path, lineno, col, stmts in warnings:
    by_file[path].append((lineno, col, stmts))

for path in sorted(by_file.keys()):
    entries = sorted(by_file[path])
    with open(path) as f:
        flines = f.readlines()
    print(f'\n=== {path} ===')
    for lineno, col, stmts in entries:
        idx = lineno - 1
        if idx < len(flines):
            line = flines[idx].rstrip()
            print(f'  L{lineno} ({stmts}st): {line[:150]}')
