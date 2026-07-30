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
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/ban-ts-comment": ["warn", { "ts-ignore": "allow-with-description" }],
      "@typescript-eslint/prefer-as-const": "warn",
      "@typescript-eslint/no-unused-disable-directive": "warn",
      
      // React rules
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react/no-unescaped-entities": "warn",
      "react/display-name": "off",
      "react/prop-types": "off",
      "react-compiler/react-compiler": "off",
      
      // Next.js rules
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      
      // General JavaScript rules
      "prefer-const": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["error", "warn"] }],
      "no-debugger": "warn",
      "no-empty": "warn",
      "no-irregular-whitespace": "warn",
      "no-case-declarations": "warn",
      "no-fallthrough": "warn",
      "no-mixed-spaces-and-tabs": "warn",
      "no-redeclare": "warn",
      "no-undef": "off",
      "no-unreachable": "warn",
      "no-useless-escape": "warn",
      "react/no-children-prop": "warn",
    },
  },

  // ─── shadcn/ui: auto-generated, exempt from size rules ────────────────────
  {
    files: ["src/components/ui/**"],
    rules: {
      "max-lines": "off",
      "max-lines-per-function": "off",
      "complexity": "off",
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