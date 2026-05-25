# Code-Realm Analysis — Lessons for @stsgs/ui Theme Engine

> Created: 2025-07-14
> Source: https://github.com/stsgs1980/Code-Realm
> Purpose: Extract useful patterns from Code-Realm for our Theme Engine

---

## 1. Code-Realm Overview

**Code Realm** — интерактивная галерея кода: 23 секции, 50+ инструментов, ретро-терминальная эстетика.

```
Tech Stack: Next.js 16 + TypeScript 5 + Tailwind CSS 4 + Framer Motion 12 + shadcn/ui + Bun
```

### Структура проекта

```
src/
  app/
    globals.css              — 4500+ строк (shadcn :root/.dark + ВСЕ анимации + эффекты)
    layout.tsx               — ThemeProvider (next-themes) + Geist шрифты
    page.tsx                 — Главная страница, импортирует 23 секции
  components/
    theme-provider.tsx       — Обёртка NextThemesProvider
    theme-toggle.tsx         — Кнопка dark/light (Sun/Moon, Framer Motion)
    showcases/               — 6 компонентов (terminal, brutalism, glitch, devex, code-art, retro-terminal)
    generators/              — 6 компонентов (gradient, palette, shadow, border, animation, css-filters)
    editors/                 — 4 компонента (code-playground, svg-editor, css-snippets, markdown-preview)
    tools/                   — 7 компонентов (base64, unit-converter, regex, json, typography, flexbox, 3d, responsive)
    ui/                      — shadcn/ui компоненты
  hooks/
    use-mobile.ts            — Responsive breakpoint hook
    use-toast.ts             — Toast notification hook
  lib/
    sections-registry.ts     — Реестр секций (SectionConfig[])
    utils.ts                 — cn() утилита
    db.ts                    — Prisma клиент
```

---

## 2. Что изучили — ключевые файлы

### 2.1 theme-provider.tsx

```typescript
'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }: React.ComponentProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

**Вывод**: Это просто обёртка `next-themes`. Минимальная — только dark/light. У нас совсем другие требования.

### 2.2 theme-toggle.tsx

```typescript
'use client';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  // ... Framer Motion анимация: круглый floating button, Sun/Moon иконки
}
```

**Что берём**: 
- ✅ `useSyncExternalStore` для SSR-safe mounting (zero hydration mismatches)
- ✅ Framer Motion анимация при переключении (smooth transition)
- ✅ `mounted` guard — не рендерить до mount (убирает flash)

**Что НЕ берём**:
- ❌ `next-themes` — слишком простой для нашей Dual Theme System
- ❌ Только dark/light toggle — у нас context-based recommendation

### 2.3 globals.css (4500+ строк!)

```
@import "tailwindcss";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));

@theme inline { ... }        -- Tailwind v4 маппинг

:root { ... }                 -- shadcn/ui light (oklch)
.dark { ... }                 -- shadcn/ui dark (oklch)

@layer base { ... }           -- border-border, bg-background

/* ===== АНИМАЦИИ (30+ keyframes) ===== */
@keyframes blink { ... }
@keyframes glitch-1 { ... }
@keyframes glitch-2 { ... }
@keyframes glitch-skew { ... }
@keyframes boot-fadein { ... }
@keyframes amber-blink { ... }
@keyframes float-code { ... }
@keyframes scroll-bounce { ... }
... и ещё 20+ анимаций
```

**Проблема**: Это именно тот монолит, который мы решили НЕ делать. 4500+ строк в одном файле.

**Что берём**:
- ✅ Структура `@theme inline` для Tailwind v4 маппинга
- ✅ `@custom-variant dark` паттерн
- ✅ WCAG reduced-motion support

**Что НЕ берём**:
- ❌ Монолит globals.css — у нас per-file CSS с `[data-theme]`
- ❌ Только `:root`/`.dark` — у нас 5+ presets с уникальными токенами

### 2.4 sections-registry.ts — РЕЕСТР СЕКЦИЙ

```typescript
export interface SectionConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  category: 'showcase' | 'generator' | 'editor' | 'tool';
  description: string;
}

export const SECTIONS: SectionConfig[] = [
  { id: 'terminal', label: 'Terminal', icon: Terminal, color: '#10b981', category: 'showcase', ... },
  { id: 'devex', label: 'DevEx', icon: Monitor, color: '#06b6d4', category: 'showcase', ... },
  // ... 23 entries
];
```

**Что берём**:
- ✅ **Registry pattern** — плоский массив конфигураций с типизированным интерфейсом
- ✅ **category** группировка (у нас будет mode: dark/light)
- ✅ **id** как ключ (у нас preset name)
- ✅ **icon + color** для визуализации (у нас accent color + preview swatch)

**Отличие от нашего плана**:
- Code-Realm: `Array<SectionConfig>` — плоский массив, поиск через `.find()`
- Мы: `Map<string, PresetDefinition>` — Map для O(1) доступа, `registerPreset()` для добавления

### 2.5 Palette Generator (palette.tsx) — КЛЮЧЕВОЙ ФАЙЛ

Это полноценный генератор палитр с:
- **7 алгоритмов гармонии**: complementary, analogous, triadic, split-complementary, monochromatic, tetradic, random
- **HSL слайдеры** для точной настройки
- **WCAG AA/AAA проверка контраста**
- **3 формата экспорта**: CSS, Tailwind, JSON
- **Lock механизм**: можно зафиксировать цвет и перегенерировать остальные

**Что берём**:
- ✅ **Color harmony algorithms** — логика генерации гармоничных палитр из базы
- ✅ **WCAG contrast checking** — интеграция в наш `recommendTheme()`
- ✅ **Export форматы** — CSS variables, Tailwind config, JSON tokens
- ✅ **HSL моделирование** — для нашего будущего Token Fine-Tuning (слайдеры)

**Что НЕ берём**:
- ❌ Standalone генератор — у нас палитра встроена в Theme Engine
- ❌ `useState` heavy pattern (у них много стейта) — мы используем registry + CSS vars

### 2.6 page.tsx — Архитектура страницы

```typescript
'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';

// 23 прямых импорта секций
import { RetroTerminalPrototype } from '@/components/showcases/retro-terminal';
import { TerminalSection } from '@/components/showcases/terminal';
// ...

// Хардкод цветов в page.tsx!
const DARK_BG = '#0a0a0a';
const CARD_BG = '#111111';
const WHITE = '#f0f0f0';
const YELLOW = '#f5c542';
const AMBER = '#d4a017';
const GRAY = '#888888';
```

**Проблема**: Цвета захардкожены в page.tsx вместо использования дизайн-токенов. Это то, чего мы должны избежать.

---

## 3. Сравнение: Code-Realm vs @stsgs/ui

| Аспект | Code-Realm | @stsgs/ui (наш) |
|--------|-----------|-----------------|
| **Тематическая система** | next-themes (dark/light toggle) | Dual Theme (Studio + Project, 5+ presets) |
| **CSS переменные** | `:root` / `.dark` (2 варианта) | `[data-theme]` per preset (5+ вариантов) |
| **Переключение тем** | Ручной toggle Sun/Moon | Context-based recommendation + manual override |
| **Генерация палитр** | Standalone Palette Generator | Интегрирована в Theme Engine |
| **WCAG проверка** | В Palette Generator | Встроена в каждый preset |
| **Масштаб** | 1 тема (dark/light) | 5+ пресетов, открытый registry |
| **globals.css** | 4500+ строк монолит | Per-file CSS, slim globals |
| **Токены** | Не используются (hardcoded colors) | Design tokens через ThemeTokens interface |
| **Registry** | SectionConfig[] (плоский массив) | Map<string, PresetDefinition> (O(1) доступ) |
| **SSR** | useSyncExternalStore | Planned (adopt from Code-Realm) |
| **Анимация переключения** | Framer Motion crossfade | Planned (adopt from Code-Realm) |

---

## 4. Что БЕРЁМ из Code-Realm

### 4.1 SSR-safe Mounting Pattern
```typescript
// Из Code-Realm theme-toggle.tsx
function useMounted() {
  return useSyncExternalStore(
    () => () => {},       // subscribe (no-op)
    () => true,           // getSnapshot (client)
    () => false           // getServerSnapshot (SSR)
  );
}
```
→ Добавим в наш `useLayoutTheme()` для устранения hydration mismatch

### 4.2 Registry Pattern (упрощённый)
```typescript
// Из Code-Realm sections-registry.ts
export interface SectionConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  category: 'showcase' | 'generator' | 'editor' | 'tool';
  description: string;
}
```
→ Наш вариант: `PresetDefinition` с `id`, `label`, `mode`, `accent`, `pair`, `tokens`, `description`

### 4.3 Color Harmony Algorithms
```typescript
// Из Code-Realm palette.tsx
function getComplementary(h, s, l): PaletteColor[] { ... }
function getAnalogous(h, s, l): PaletteColor[] { ... }
function getTriadic(h, s, l): PaletteColor[] { ... }
// ...
```
→ Используем для `recommendTheme()` — генерация рекомендаций на основе цветовой гармонии

### 4.4 WCAG Contrast Checking
```typescript
// Из Code-Realm palette.tsx — проверка контраста
```
→ Каждый наш preset уже проходит WCAG проверку (есть контрастные ratio в комментариях)

### 4.5 Smooth Theme Transition
```typescript
// Из Code-Realm theme-toggle.tsx — Framer Motion
<motion.button
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  whileHover={{ scale: 1.12 }}
  whileTap={{ scale: 0.92 }}
/>
```
→ Добавим smooth CSS transition при смене `[data-theme]` атрибута

### 4.6 Per-Category Color Coding
```typescript
// Code-Realm: каждая секция имеет свой цвет
{ id: 'terminal', color: '#10b981', category: 'showcase' }
{ id: 'palette', color: '#06b6d4', category: 'generator' }
```
→ Каждый наш preset уже имеет `accent` цвет для идентификации

---

## 5. Что НЕ БЕРЁМ из Code-Realm

### 5.1 next-themes
- Code-Realm использует `next-themes` для dark/light toggle
- У нас: собственный `LayoutThemeProvider` → будет `StudioThemeProvider` + `ProjectThemeProvider`
- Причина: next-themes не поддерживает несколько независимых тем одновременно

### 5.2 Монолит globals.css
- Code-Realm: 4500+ строк в одном файле
- У нас: per-file CSS (`[data-theme="champagne"] { ... }`) + slim globals с `@theme inline`
- Причина: Anti-Monolith правило, масштабируемость (20+ presets)

### 5.3 Hardcoded Colors в компонентах
- Code-Realm: `const DARK_BG = '#0a0a0a'` прямо в page.tsx
- У нас: все цвета через `useLayoutTheme().tokens` или CSS variables
- Причина: single source of truth, context-aware theming

### 5.4 Только dark/light
- Code-Realm: бинарный переключатель (Sun/Moon)
- У нас: 5+ presets с `recommendTheme(context)` + manual override
- Причина: Theme = recommendation by context, not user selection

---

## 6. Влияние на план Theme Engine

### Что добавляем в план:

1. **`useMounted()` hook** — SSR-safe mounting (из theme-toggle.tsx)
2. **Color harmony utils** — `lib/layout/color-harmony.ts` (из palette.tsx)
3. **WCAG contrast utility** — `lib/layout/contrast.ts` (из palette.tsx)
4. **Smooth CSS transition** на `[data-theme]` смене (из theme-toggle.tsx)
5. **Framer Motion** для ThemePresetSelector анимации

### Уточнение порядка шагов:

1. Создать `theme-types.ts` с `PresetDefinition` (включая `icon`, `color` из registry паттерна)
2. Создать `theme-registry.ts` с `registerPreset()`, `getPreset()`, `getByMode()`, `getPair()`
3. Создать `use-mounted.ts` (SSR-safe, из Code-Realm)
4. Создать `color-harmony.ts` и `contrast.ts` (из palette.tsx)
5. Разделить `presets.ts` на отдельные файлы
6. Создать CSS файлы с `[data-theme]` селекторами
7. Рефакторинг `globals.css` — убрать `:root`/`.dark`, добавить `@theme inline` маппинг
8. Рефакторинг `LayoutThemeProvider` → использовать registry + `data-theme`
9. Реализовать `recommendTheme()`
10. Добавить smooth transition при смене темы

---

## 7. Итог

Code-Realm — это отличный **галерейный** проект с красивой эстетикой и богатым функционалом. Но его тематическая система **принципиально проще** нашей:

- **Code-Realm**: 1 тема (dark/light toggle) → для одного продукта
- **@stsgs/ui**: Dual Theme + 5+ presets + recommendation engine → для создания других продуктов

Мы берём из Code-Realm **паттерны** (registry, SSR mounting, color harmony, WCAG), но **не архитектуру** (monolith CSS, next-themes, hardcoded colors).

Самая ценная находка — **Palette Generator** (palette.tsx). Его алгоритмы гармонии и WCAG проверки мы встроим в наш Theme Engine как `recommendTheme()` и контрастную валидацию.
