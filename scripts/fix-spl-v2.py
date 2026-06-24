import re, sys
from collections import defaultdict


def split_at_depth0(text, sep):
    parts = []
    current = ''
    depth = 0
    for ch in text:
        if ch in ('{', '[', '('):
            depth += 1
            current += ch
        elif ch in ('}', ']', ')'):
            depth -= 1
            current += ch
        elif ch == sep and depth == 0:
            parts.append(current)
            current = ''
        else:
            current += ch
    if current:
        parts.append(current)
    return parts


def try_split_arrow_callback(line, indent, child):
    arrow_pos = line.rfind('=>')
    if arrow_pos < 0:
        return None
    after_arrow = line[arrow_pos+2:].strip()
    if not after_arrow.startswith('{'):
        return None
    depth = 0
    brace_start = None
    brace_end = None
    for j, ch in enumerate(after_arrow):
        if ch == '{':
            if depth == 0:
                brace_start = j
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and brace_start is not None:
                brace_end = j
                break
    if brace_end is None:
        return None
    inner = after_arrow[brace_start+1:brace_end].strip()
    if not inner:
        return None
    parts = split_at_depth0(inner, ';')
    if len(parts) <= 2:
        return None
    prefix = line[:arrow_pos+2].rstrip()
    result_lines = [prefix + ' {']
    for part in parts:
        p = part.strip()
        if p:
            result_lines.append(f'{child}{p};')
    result_lines.append(indent + '}')
    suffix = after_arrow[brace_end+1:].strip()
    if suffix:
        result_lines[-1] += ' ' + suffix
    return result_lines


def try_split_block_oneline(line, indent, child):
    braces = []
    depth = 0
    for j, ch in enumerate(line):
        if ch == '{':
            if depth == 0:
                braces.append((j, None))
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and braces:
                start, _ = braces[-1]
                braces[-1] = (start, j)
    for bstart, bend in braces:
        if bstart is None or bend is None:
            continue
        inner = line[bstart+1:bend].strip()
        parts = split_at_depth0(inner, ';')
        if len(parts) <= 2:
            continue
        prefix = line[:bstart+1]
        suffix = line[bend:]
        result = [prefix]
        for part in parts:
            p = part.strip()
            if p:
                result.append(f'{child}{p};')
        result.append(indent + '}')
        if suffix.strip() and suffix.strip() != '}':
            extra = suffix.strip()[1:].strip()
            if extra:
                result[-1] += ' ' + extra
        return result
    return None


def try_split_setter_callback(line, indent, child):
    return try_split_arrow_callback(line, indent, child)


def try_split_semicolons(line, indent):
    parts = split_at_depth0(line, ';')
    if len(parts) <= 2:
        return None
    parts = [p.strip() for p in parts if p.strip()]
    if len(parts) <= 2:
        return None
    result = []
    for i, p in enumerate(parts):
        if i == 0:
            result.append(p + ';')
        else:
            result.append(indent + p + ';')
    return result


warnings = []
with open('/tmp/spl-parsed.txt') as f:
    raw = f.read().strip().split('\n')

i = 0
while i < len(raw) - 1:
    path = raw[i].strip()
    if path.endswith(('.tsx', '.ts')) and 'max-statements-per-line' in raw[i+1]:
        m = re.search(r'(\d+):(\d+)\s+warning\s+This line has (\d+) statements', raw[i+1])
        if m:
            warnings.append((path, int(m.group(1)), int(m.group(2)), int(m.group(3))))
        i += 2
    else:
        i += 1

print(f'Parsed {len(warnings)} warnings')

by_file = defaultdict(list)
for path, lineno, col, stmts in warnings:
    by_file[path].append((lineno, col, stmts))

fixed_total = 0

for path in sorted(by_file.keys()):
    entries = sorted(by_file[path], reverse=True)
    with open(path) as f:
        flines = f.readlines()
    changed = False
    for lineno, col, stmts in entries:
        idx = lineno - 1
        if idx >= len(flines):
            continue
        original = flines[idx].rstrip('\n')
        indent = re.match(r'^(\s*)', original).group(1)
        child = indent + '  '
        new_lines = try_split_arrow_callback(original, indent, child)
        if new_lines and len(new_lines) > 1:
            flines[idx:idx+1] = [l + '\n' for l in new_lines]
            changed = True
            fixed_total += 1
            continue
        new_lines = try_split_block_oneline(original, indent, child)
        if new_lines and len(new_lines) > 1:
            flines[idx:idx+1] = [l + '\n' for l in new_lines]
            changed = True
            fixed_total += 1
            continue
        new_lines = try_split_setter_callback(original, indent, child)
        if new_lines and len(new_lines) > 1:
            flines[idx:idx+1] = [l + '\n' for l in new_lines]
            changed = True
            fixed_total += 1
            continue
        new_lines = try_split_semicolons(original, indent)
        if new_lines and len(new_lines) > 1:
            flines[idx:idx+1] = [l + '\n' for l in new_lines]
            changed = True
            fixed_total += 1
            continue
        print(f'  UNFIXED: {path}:{lineno} ({stmts}st): {original[:80]}')
    if changed:
        with open(path, 'w') as f:
            f.writelines(flines)
        print(f'  Fixed: {path}')

print(f'\nTotal fixed: {fixed_total}/{len(warnings)}')