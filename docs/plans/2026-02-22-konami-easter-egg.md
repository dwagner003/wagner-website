# Konami Code Easter Egg Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Konami Code easter egg that toggles between the default cyan theme and a synthwave pink/purple theme.

**Architecture:** Two custom React hooks (`useKonamiCode` for key detection, `useTheme` for theme state/persistence) wired together in the Layout component. CSS variables swap via `data-theme` attribute on `<html>`.

**Tech Stack:** React hooks, CSS custom properties, localStorage, TypeScript

---

## Task 1: Add Synthwave Theme CSS Variables

**Files:**

- Modify: `src/index.css:1-37`

**Step 1: Add transition to :root for smooth color changes**

Add after line 26 (after `@theme` block):

```css
:root {
  transition:
    background-color 0.5s ease,
    color 0.5s ease;
}

* {
  transition:
    background-color 0.5s ease,
    color 0.5s ease,
    border-color 0.5s ease,
    box-shadow 0.5s ease;
}
```

**Step 2: Add synthwave theme override block**

Add before the `body` rule (around line 28):

```css
[data-theme='synthwave'] {
  --color-bg-primary: #1a0a1f;
  --color-bg-secondary: #1f0a2a;
  --color-bg-card: rgba(31, 10, 42, 0.8);
  --color-neon-cyan: #ff00ff;
  --color-neon-green: #ff66b2;
  --color-neon-purple: #00ffff;
  --color-terminal-green: #ff66b2;
  --color-terminal-prompt: #00ffff;
  --shadow-neon-cyan: 0 0 20px rgba(255, 0, 255, 0.3);
  --shadow-neon-green: 0 0 20px rgba(255, 102, 178, 0.3);
}
```

**Step 3: Verify manually**

Open browser DevTools, add `data-theme="synthwave"` to `<html>` element, verify colors change smoothly.

**Step 4: Commit**

```bash
git add src/index.css
git commit -m "feat: add synthwave theme CSS variables"
```

---

## Task 2: Create useKonamiCode Hook

**Files:**

- Create: `src/hooks/useKonamiCode.ts`

**Step 1: Create the hook file**

```typescript
import { useEffect, useCallback, useRef } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
];

export function useKonamiCode(callback: () => void): void {
  const inputRef = useRef<string[]>([]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      inputRef.current = [...inputRef.current, event.code].slice(-KONAMI_CODE.length);

      if (inputRef.current.join(',') === KONAMI_CODE.join(',')) {
        callback();
        inputRef.current = [];
      }
    },
    [callback]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
```

**Step 2: Verify manually**

Temporarily add to App.tsx:

```typescript
import { useKonamiCode } from './hooks/useKonamiCode';
// In AppContent:
useKonamiCode(() => console.log('Konami!'));
```

Test in browser - enter code, check console for "Konami!".

**Step 3: Remove temporary test code**

**Step 4: Commit**

```bash
git add src/hooks/useKonamiCode.ts
git commit -m "feat: add useKonamiCode hook"
```

---

## Task 3: Create useTheme Hook

**Files:**

- Create: `src/hooks/useTheme.ts`

**Step 1: Create the hook file**

```typescript
import { useState, useEffect, useCallback } from 'react';

type Theme = 'default' | 'synthwave';

const THEME_STORAGE_KEY = 'wagner-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'default';
    return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'default';
  });

  useEffect(() => {
    if (theme === 'synthwave') {
      document.documentElement.setAttribute('data-theme', 'synthwave');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'default' ? 'synthwave' : 'default'));
  }, []);

  return { theme, toggleTheme };
}
```

**Step 2: Verify manually**

Temporarily add to App.tsx:

```typescript
import { useTheme } from './hooks/useTheme';
// In AppContent:
const { toggleTheme } = useTheme();
// Add button: <button onClick={toggleTheme}>Toggle</button>
```

Click button, verify theme changes. Refresh page, verify theme persists.

**Step 3: Remove temporary test code**

**Step 4: Commit**

```bash
git add src/hooks/useTheme.ts
git commit -m "feat: add useTheme hook with localStorage persistence"
```

---

## Task 4: Export Hooks from Index

**Files:**

- Create: `src/hooks/index.ts`

**Step 1: Create barrel export file**

```typescript
export { useKonamiCode } from './useKonamiCode';
export { useTheme } from './useTheme';
export { useTypingAnimation } from './useTypingAnimation';
export { useGitHubStats } from './useGitHubStats';
export { useIntersectionObserver } from './useIntersectionObserver';
```

**Step 2: Commit**

```bash
git add src/hooks/index.ts
git commit -m "feat: add hooks barrel export"
```

---

## Task 5: Wire Up Konami Code in Layout

**Files:**

- Modify: `src/components/layout/Layout.tsx`

**Step 1: Read current Layout.tsx**

Read the file to understand current structure.

**Step 2: Add hook imports and wire up**

Add to imports:

```typescript
import { useKonamiCode, useTheme } from '../../hooks';
```

Add inside Layout component (before return):

```typescript
const { toggleTheme } = useTheme();
useKonamiCode(toggleTheme);
```

**Step 3: Verify manually**

Run dev server, enter Konami Code (↑↑↓↓←→←→BA), verify theme toggles to synthwave. Enter again, verify it toggles back. Refresh, verify persistence.

**Step 4: Commit**

```bash
git add src/components/layout/Layout.tsx
git commit -m "feat: wire up Konami Code easter egg to toggle synthwave theme"
```

---

## Task 6: Update HeroSection Import Path

**Files:**

- Modify: `src/components/sections/HeroSection.tsx:1`

**Step 1: Update import to use barrel export**

Change:

```typescript
import { useTypingAnimation } from '../../hooks/useTypingAnimation';
```

To:

```typescript
import { useTypingAnimation } from '../../hooks';
```

**Step 2: Commit**

```bash
git add src/components/sections/HeroSection.tsx
git commit -m "refactor: use hooks barrel export in HeroSection"
```

---

## Task 7: Final Integration Test

**Step 1: Run full verification**

1. Start dev server: `npm run dev`
2. Open browser to localhost
3. Verify default cyan theme displays
4. Enter Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
5. Verify smooth transition to pink/purple synthwave theme
6. Verify all sections look correct with new colors
7. Refresh page - verify synthwave persists
8. Enter Konami Code again - verify toggles back to default
9. Refresh - verify default persists

**Step 2: Run build to ensure no errors**

```bash
npm run build
```

**Step 3: Update CLAUDE_STATUS.md**

Add easter egg to completed items, remove from pending if applicable.

**Step 4: Final commit if any cleanup needed**

---

## Summary

| Task | Description                 | Files                                     |
| ---- | --------------------------- | ----------------------------------------- |
| 1    | Add synthwave CSS variables | `src/index.css`                           |
| 2    | Create useKonamiCode hook   | `src/hooks/useKonamiCode.ts`              |
| 3    | Create useTheme hook        | `src/hooks/useTheme.ts`                   |
| 4    | Create hooks barrel export  | `src/hooks/index.ts`                      |
| 5    | Wire up in Layout           | `src/components/layout/Layout.tsx`        |
| 6    | Update HeroSection import   | `src/components/sections/HeroSection.tsx` |
| 7    | Integration test            | Manual verification                       |
