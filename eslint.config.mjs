import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Version sync check ─────────────────────────────────────────────────────
// Ensures src/lib/version.ts APP_VERSION matches package.json "version".

function readPkgVersion() {
  try {
    const raw = readFileSync(resolve(__dirname, 'package.json'), 'utf-8');
    return JSON.parse(raw).version;
  } catch {
    return null;
  }
}

function readSrcVersion() {
  try {
    const raw = readFileSync(resolve(__dirname, 'src/lib/version.ts'), 'utf-8');
    const m = raw.match(/APP_VERSION\s*=\s*['"]([^'"]+)['"]/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

const pkgVersion = readPkgVersion();
const srcVersion = readSrcVersion();
const versionsMatch = pkgVersion && srcVersion && pkgVersion === srcVersion;

// ─── Architectural guards ─────────────────────────────────────────────────────
// All set to "warn" so they surface in CI without breaking the build.
// Promote to "error" once the codebase is clean.

const antiMonolithRules = {
  // File size: warn at 350 lines, hard cap at 500
  "max-lines": ["warn", { max: 350, skipBlankLines: true, skipComments: true }],

  // Function size: warn at 60 lines
  "max-lines-per-function": ["warn", { max: 60, skipBlankLines: true, skipComments: true }],

  // Cyclomatic complexity: warn at 15
  complexity: ["warn", { max: 15 }],

  // Nesting depth: warn at 4
  "max-depth": ["warn", { max: 4 }],

  // Function parameters: warn at 5
  "max-params": ["warn", { max: 5 }],

  // Callback hell: max 3 nested callbacks
  "max-nested-callbacks": ["warn", { max: 3 }],

  // Multiple const on one line is idiomatic JS
  "max-statements-per-line": ["warn", { max: 2 }],
};

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // ─── Anti-monolith (architectural) ───
      ...antiMonolithRules,

      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/prefer-as-const": "off",
      "@typescript-eslint/no-unused-disable-directive": "off",
      
      // React rules
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
      "react-compiler/react-compiler": "off",
      
      // Next.js rules
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      
      // General JavaScript rules
      "prefer-const": "off",
      "no-unused-vars": "off",
      "no-console": "off",
      "no-debugger": "off",
      "no-empty": "off",
      "no-irregular-whitespace": "off",
      "no-case-declarations": "off",
      "no-fallthrough": "off",
      "no-mixed-spaces-and-tabs": "off",
      "no-redeclare": "off",
      "no-undef": "off",
      "no-unreachable": "off",
      "no-useless-escape": "off",
    },
  },

  // ─── shadcn/ui: auto-generated, exempt from size rules ────────────────────
  {
    files: ["src/components/ui/**"],
    rules: {
      "max-lines": "off",
      "max-lines-per-function": "off",
    },
  },

  // ─── Stricter rules for app/ and components/ (not lib/ or ui/) ─────────────
  {
    files: ["src/app/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}"],
    ignores: ["src/components/ui/**"],
    rules: {
      // Page/component files: tighter file limit (300 lines)
      "max-lines": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],
      // Functions in components: 50 lines
      "max-lines-per-function": ["warn", { max: 50, skipBlankLines: true, skipComments: true }],
    },
  },

  // ─── Custom plugin: no-stale-version ──────────────────────────────────────
  {
    plugins: {
      'version-check': {
        rules: {
          'no-stale-version': {
            meta: { type: 'problem', docs: { description: 'Ensure package.json version matches src/lib/version.ts' } },
            create(context) {
              if (versionsMatch) return {}
              return {
                Program() {
                  context.report({
                    loc: { line: 1, column: 0 },
                    message: `Version mismatch: package.json="${pkgVersion}" vs version.ts="${srcVersion}". Run: npm version patch`,
                  })
                },
              }
            },
          },
        },
      },
    },
    rules: {
      'version-check/no-stale-version': versionsMatch ? 'off' : 'warn',
    },
    files: ['src/lib/version.ts'],
  },

  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "examples/**", "skills"]
  },
];

export default eslintConfig;