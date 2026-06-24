"""Fix max-statements-per-line ONLY in .ts files (not .tsx).
For .tsx files with JSX inline handlers, this is too risky to automate."""
import json, subprocess, os, re

def split_line(filepath: str, line_num: int) -> bool:
    with open(filepath) as f:
        lines = f.readlines()
    
    if line_num < 1 or line_num > len(lines):
        return False
    
    idx = line_num - 1
    line = lines[idx]
    content = line.rstrip('\n')
    
    # Skip JSX-like content
    if '<' in content and '/>' in content:
        return False
    if '===' in content and 'style=' in content:
        return False
    if '${' in content and '}' in content:
        return False
    if 'onClick' in content or 'onKeyDown' in content or 'onMouse' in content:
        return False
    
    indent = len(content) - len(content.lstrip())
    indent_str = content[:indent]
    body = content[indent:]
    
    # Split by semicolons respecting parens/strings
    parts = []
    depth = 0
    in_str = None
    current = []
    for ch in body:
        if in_str:
            if ch == in_str:
                in_str = None
            current.append(ch)
            continue
        if ch in ('"', "'", '`'):
            in_str = ch
            current.append(ch)
            continue
        if ch in '({[':
            depth += 1
            current.append(ch)
            continue
        if ch in ')}]':
            depth -= 1
            current.append(ch)
            continue
        if ch == ';' and depth <= 1:
            parts.append(''.join(current).strip())
            current = []
            continue
        current.append(ch)
    remainder = ''.join(current).strip()
    if remainder:
        parts.append(remainder)
    
    if len(parts) < 3:
        return False
    
    # Check wrapping braces
    wrapped = False
    if parts[0].startswith('{') and parts[-1].endswith('}'):
        wrapped = True
        parts[0] = parts[0][1:].strip()
        parts[-1] = parts[-1][:-1].strip()
    
    inner = indent_str + '  '
    result = []
    if wrapped:
        result.append(indent_str + '{')
    for p in parts:
        p = p.strip()
        if p:
            result.append(inner + p)
    if wrapped:
        result.append(indent_str + '}')
    
    lines[idx] = '\n'.join(result) + '\n'
    with open(filepath, 'w') as f:
        f.writelines(lines)
    return True

def main():
    r = subprocess.run(
        ['npx', 'eslint', 'src/', '--format', 'json'],
        capture_output=True, text=True, cwd='/home/z/my-project', timeout=180
    )
    data = json.loads(r.stdout)
    
    fixes = 0
    for item in data:
        fp = item['filePath']
        if fp.endswith('.tsx'):
            continue  # Skip JSX files - too risky
        for m in item['messages']:
            if 'max-statements-per-line' in m.get('ruleId', ''):
                if split_line(fp, m['line']):
                    rel = os.path.relpath(fp, '/home/z/my-project')
                    print(f"  {rel}:{m['line']}")
                    fixes += 1
    
    print(f"\nFixed {fixes} lines in .ts files")

if __name__ == '__main__':
    main()