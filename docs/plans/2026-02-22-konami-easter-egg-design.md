# Konami Code Easter Egg Design

**Date:** 2026-02-22
**Status:** Approved

## Overview

Add a Konami Code easter egg that toggles between the default cyan theme and a synthwave pink/purple theme.

## User Experience

1. User enters Konami Code: ↑↑↓↓←→←→BA
2. Theme smoothly transitions to synthwave colors
3. Theme persists in localStorage across sessions
4. Entering the code again toggles back to default theme

## Implementation Approach

**CSS Variables Swap** - Add a `data-theme="synthwave"` attribute to `<html>` and define alternate CSS variable values. This integrates with the existing `--color-*` variable system.

## Color Palette

| Variable                  | Default (Cyan) | Synthwave |
| ------------------------- | -------------- | --------- |
| `--color-neon-cyan`       | `#00f5ff`      | `#ff00ff` |
| `--color-terminal-green`  | `#00ff88`      | `#ff66b2` |
| `--color-terminal-prompt` | `#a855f7`      | `#00ffff` |
| `--color-bg-primary`      | `#0a0a0f`      | `#1a0a1f` |
| `--color-bg-secondary`    | `#12121a`      | `#1f0a2a` |

## Components

### 1. useKonamiCode Hook

- Listens for keydown events
- Tracks key sequence against Konami Code pattern
- Calls callback when sequence matches
- Cleans up event listeners

### 2. useTheme Hook

- Reads/writes theme preference to localStorage
- Applies `data-theme` attribute to document
- Provides toggle function

### 3. CSS Theme Definitions

- Add `[data-theme="synthwave"]` selector block to index.css
- Override color variables with synthwave palette
- Add transition on `:root` for smooth color changes

### 4. Integration

- Initialize theme hooks in App.tsx or Layout.tsx
- Connect Konami Code detection to theme toggle

## Files to Create/Modify

- `src/hooks/useKonamiCode.ts` - New hook
- `src/hooks/useTheme.ts` - New hook
- `src/index.css` - Add synthwave theme variables
- `src/App.tsx` or `src/components/layout/Layout.tsx` - Wire up hooks

## Testing

- Manual: Enter Konami Code, verify theme changes
- Verify localStorage persistence on refresh
- Verify toggle works both directions
