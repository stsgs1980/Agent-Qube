"""Fix ALL remaining max-statements-per-line by reading eslint JSON output and splitting lines."""
import json, subprocess, re, os

def split_multi_stmt_line(line: str) -> str:
    """Split a line with 3+ statements into multiple lines."""
    stripped = line.rstrip('\n')
    indent = len(stripped) - len(stripped.lstrip())
    indent_str = stripped[:indent]
    content = stripped[indent:]

    # Skip comments, imports, exports
    if content.startswith('//') or content.startswith('*') or '//' in content.split("'")[0]:
        return line
    if content.strip().startswith(('import ', 'export ', 'return ')):
        # But handle return lines with multiple statements after them
        if not content.strip().startswith('return '):
            return line

    # Count actual statement separators (semicolons not inside parens/strings)
    depth = 0
    in_string = None
    semi_positions = []
    for i, ch in enumerate(content):
        if in_string:
            if ch == in_string and (i == 0 or content[i-1] != '\\'):
                in_string = None
            continue
        if ch in ('"', "'", '`'):
            in_string = ch
            continue
        if ch in '({[':
            depth += 1
        elif ch in ')}]':
            depth -= 1
        if ch == ';' and depth <= 1:
            semi_positions.append(i)

    # Need 3+ statements = 2+ semicolons
    if len(semi_positions) < 2:
        return line

    # Split by semicolons
    parts = []
    prev = 0
    for pos in semi_positions:
        part = content[prev:pos+1].strip()
        if part:
            parts.append(part)
        prev = pos + 1
    # Remainder after last semicolon
    remainder = content[prev:].strip()
    if remainder:
        parts.append(remainder)

    if len(parts) < 3:
        return line

    # Check if wrapped in braces
    wrapped = False
    opening_brace = -1
    closing_brace = -1
    if parts[0].startswith('{'):
        wrapped = True
        parts[0] = parts[0][1:].strip()
    if parts[-1].endswith('}'):
        parts[-1] = parts[-1][:-1].strip()

    inner = indent_str + '  '
    lines = []
    if wrapped:
        lines.append(indent_str + '{')
    for p in parts:
        p = p.strip()
        if p:
            lines.append(inner + p)
    if wrapped:
        lines.append(indent_str + '}')
    return '\n'.join(lines) + '\n'

def main():
    r = subprocess.run(
        ['npx', 'eslint', 'src/', '--format', 'json'],
        capture_output=True, text=True, cwd='/home/z/my-project', timeout=180
    )
    data = json.loads(r.stdout)

    # Get all lines with max-statements-per-line
    fixes = {}  # filepath -> set of line numbers
    for item in data:
        fp = item['filePath']
        for m in item['messages']:
            if 'max-statements-per-line' in m.get('ruleId', ''):
                if fp not in fixes:
                    fixes[fp] = set()
                fixes[fp].add(m['line'])

    total = 0
    for fp, lines_set in sorted(fixes.items()):
        with open(fp) as f:
            all_lines = f.readlines()
        
        new_lines = []
        for i, l in enumerate(all_lines, 1):
            if i in lines_set:
                fixed = split_multi_stmt_line(l)
                if fixed != l:
                    new_lines.append(fixed)
                    total += 1
                    continue
            new_lines.append(l)
        
        with open(fp, 'w') as f:
            f.writelines(new_lines)
        
        rel = os.path.relpath(fp, '/home/z/my-project')
        print(f"  {rel}")

    print(f"\nFixed {total} lines")

if __name__ == '__main__':
    main()