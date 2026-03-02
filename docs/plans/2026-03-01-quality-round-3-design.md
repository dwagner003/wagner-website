# Quality Improvements Round 3 — Design

## Items

### 1. Contact CTA (email: devinwagner003@gmail.com)

- Add contact section before footer with email link + GitHub + LinkedIn
- Terminal-styled: `$ mailto devinwagner003@gmail.com`

### 4. OG Image

- Verify og-image.png exists in public/; generate SVG-based fallback if needed

### 5. Skill Icon Accessibility

- Add `role="img"` and `aria-label` to all 7 SVG icons in SkillsSection

### 6. Error Boundary

- Create ErrorBoundary component with terminal-themed fallback UI
- Wrap app in App.tsx

### 7. Vite Optimization

- Add rollup chunk splitting (vendor, react, router, query)
- Add build sourcemap configuration

### 8. Cache Headers (Vercel)

- Add Cache-Control: immutable for /assets/\*
- Add Cache-Control: must-revalidate for index.html

### 9. ESLint a11y

- Install and configure eslint-plugin-jsx-a11y

### 10. Image Optimization

- Add loading="lazy" where applicable
- Ensure images have proper alt text

### 12. Extract Hardcoded Data

- Create src/data/content.ts with experience, skills, terminal lines
- Import from components instead of inline definitions

### 13. GitHub Loading UX

- Replace "..." with skeleton pulse placeholders
- Add aria-busy for loading states

### 14. Back to Top Button

- Floating button visible after scrolling past hero
- Smooth scroll to top, terminal-styled

### 15. Animation Consistency

- Extract timing constants to shared file
- Standardize transition durations

### 16. JSON-LD Structured Data

- Add Person schema to index.html

### 17. Font Loading

- Add fallback font stack in CSS for JetBrains Mono

### 18. Focus Indicators

- Add :focus-visible styles with neon cyan glow ring

### 19. Mobile Menu Accessibility

- Add Escape key handler to close menu
- Trap focus within open mobile menu

### 20. useTypingAnimation Cleanup

- Extract magic numbers (300ms, 500ms, 40ms) to named constants

### Skipped

- #2 (Featured Projects) — user deferred
- #3 (Unused .env files) — user excluded
- #11 (Light theme) — too architectural; will improve synthwave contrast instead
- #21 (Resume download) — user deferred
