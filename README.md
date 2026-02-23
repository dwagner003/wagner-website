# Wagner Website

Personal portfolio website with a cyberpunk/terminal aesthetic.

[![CI](https://github.com/dwagner003/wagner-website/actions/workflows/ci.yml/badge.svg)](https://github.com/dwagner003/wagner-website/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/dwagner003/wagner-website/graph/badge.svg)](https://codecov.io/gh/dwagner003/wagner-website)

## Features

- Terminal-style hero section with typing animation
- Dark theme with neon accents
- Responsive design (mobile, tablet, desktop)
- Konami Code easter egg (↑↑↓↓←→←→BA) toggles synthwave theme

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Build:** Vite
- **Testing:** Vitest (unit), Playwright (e2e)
- **CI/CD:** GitHub Actions, Vercel

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test                 # Unit tests
npm run test:coverage    # Unit tests with coverage
npm run test:e2e         # E2E tests

# Build for production
npm run build
```

## Quality Gates

- **Pre-commit hooks:** Lint, type check, unit tests, e2e tests
- **Coverage threshold:** 80% per file (statements, branches, functions, lines)
- **Conventional commits:** Enforced via commitlint

## License

MIT
