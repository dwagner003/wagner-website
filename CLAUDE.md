# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website with a cyberpunk/terminal aesthetic. React SPA built with TypeScript, Vite, and Tailwind CSS. Deployed on Vercel.

## Commands

| Task                  | Command                                    |
| --------------------- | ------------------------------------------ |
| Dev server            | `npm run dev` (port 5173)                  |
| Build                 | `npm run build` (runs tsc + vite build)    |
| Lint                  | `npm run lint`                             |
| Format                | `npm run format`                           |
| Format check          | `npm run format:check`                     |
| Unit tests            | `npm run test`                             |
| Unit tests (watch)    | `npm run test:watch`                       |
| Unit tests + coverage | `npm run test:coverage`                    |
| Single test file      | `npx vitest run src/path/to/file.test.tsx` |
| E2E tests             | `npm run test:e2e`                         |
| E2E tests (UI mode)   | `npm run test:e2e:ui`                      |
| All tests             | `npm run test:all`                         |

## Architecture

**Stack:** React 19 + TypeScript + Vite + Tailwind CSS 4 + React Router + TanStack React Query

**Source layout (`src/`):**

- `components/layout/` — Navbar, Layout wrapper
- `components/sections/` — Page sections (Hero, Skills, Experience, GitHub, Contact, Footer)
- `components/ui/` — Reusable primitives (GlowCard, TerminalText, SectionHeading, icons)
- `pages/` — Page-level components (HomePage, NotFoundPage)
- `routes/` — Route definitions (AppRoutes.tsx)
- `hooks/` — Custom hooks (useTheme, useKonamiCode, useTypingAnimation, useGitHubStats, useIntersectionObserver)
- `services/` — API layer (GitHub API with localStorage caching, 24h TTL)
- `data/content.ts` — All static portfolio content (skills, experiences, social links, terminal lines)

**Theme system:** Two themes controlled via `data-theme` attribute on `<html>`. CSS custom variables defined in `src/index.css` using Tailwind's `@theme` block. Default theme is dark cyberpunk; synthwave theme is toggled via Konami Code easter egg (↑↑↓↓←→←→BA).

**Routing:** SPA with React Router. Routes: `/` (home), `/home` (redirects to `/`), `/*` (404 page). Vercel rewrites all paths to `index.html`.

## Testing

- **Unit tests:** Vitest with jsdom environment and Testing Library. Setup in `src/test/setup.ts` mocks IntersectionObserver and matchMedia.
- **E2E tests:** Playwright in `e2e/` directory. Two projects: desktop Chromium and mobile (iPhone 12).
- **Coverage thresholds:** 80% per-file minimum for statements, branches, functions, and lines.
- **CI bundle size limit:** JS assets must be under 650KB (includes Leaflet map chunk).

## Code Quality

- **Commits:** Conventional Commits enforced by CommitLint. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`.
- **Pre-commit hooks (Husky):** lint-staged (ESLint + Prettier), type check, unit tests, and E2E tests all run before commit.
- **Prettier:** Single quotes, 2-space indent, trailing commas (es5), 100 char line width, semicolons.
- **Accessibility:** ESLint jsx-a11y plugin enforced. Skip-to-content link, focus indicators, reduced-motion support.

## Styling Conventions

Use Tailwind utility classes referencing theme variables (e.g., `text-[var(--color-neon-cyan)]`, `bg-[var(--color-bg-primary)]`). Colors are defined as CSS custom variables in `src/index.css` so they respond to theme changes. Font is JetBrains Mono throughout.
