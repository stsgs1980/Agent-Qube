'use client'

/**
 * Shared syntax highlighting for CSS and JSX code blocks.
 * Merged from layout-explorer.tsx and grid-preview.tsx.
 */

// ─── Syntax Colors ───────────────────────────────────────────

const C = {
  green:  '#86EFAC',
  yellow: '#FDE68A',
  gray:   '#94A3B8',
  blue:   '#7DD3FC',
  red:    '#F87171',
}

// ─── Single-line Syntax Highlight ────────────────────────────

export function SyntaxLine({ line }: { line: string }) {
  // CSS property: indent + prop + colon + value + semicolon
  const propMatch = line.match(/^(\s*)([\w-]+)(:\s*)(.+)(;?)$/)
  if (propMatch) {
    const [, indent, prop, colon, value, semi] = propMatch
    return <>{indent}<span style={{ color: C.green }}>{prop}</span><span style={{ color: C.gray }}>{colon}</span><span style={{ color: C.yellow }}>{value}</span>{semi && <span style={{ color: C.gray }}>{semi}</span>}</>
  }

  // JSX tag: <Component ...> or </Component>
  const tagMatch = line.match(/^(\s*)(<)(\/?)(\w[\w.]*)(\s.*?)(\/?>)$/)
  if (tagMatch) {
    const [, indent, open, slash, tag, attrs, close] = tagMatch
    return <>{indent}<span style={{ color: C.gray }}>{open}</span><span style={{ color: slash ? C.red : C.green }}>{slash}</span><span style={{ color: C.blue }}>{tag}</span><span style={{ color: C.yellow }}>{attrs}</span><span style={{ color: C.gray }}>{close}</span></>
  }

  // CSS selector: .class {
  const selMatch = line.match(/^(\.)([\w-]+)(\s*\{)$/)
  if (selMatch) {
    const [, dot, name, brace] = selMatch
    return <><span style={{ color: C.yellow }}>{dot}</span><span style={{ color: C.green }}>{name}</span><span style={{ color: C.gray }}>{brace}</span></>
  }

  // Closing brace
  if (line.trim() === '}') return <span style={{ color: C.gray }}>{'  }'}</span>

  // Grid template areas string
  const areasMatch = line.match(/^(\s*)(".*")$/)
  if (areasMatch) {
    const [, indent, areas] = areasMatch
    return <>{indent}<span style={{ color: C.yellow }}>{areas}</span></>
  }

  return <span>{line}</span>
}

// ─── Code Block Highlighting ─────────────────────────────────

export function CodeHighlight({ code }: { code: string }) {
  return <>{code.split('\n').map((line, i) => <div key={i}><SyntaxLine line={line} /></div>)}</>
}
