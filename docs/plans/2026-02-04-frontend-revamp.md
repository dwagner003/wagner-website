# Frontend Revamp Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the portfolio site into a dark/techy single-page experience with terminal aesthetics, skill visualizations, animated experience timeline, and live GitHub stats.

**Architecture:** Single-page scrolling site with distinct sections (Hero → Skills → Experience → GitHub → Footer). Books remains a separate route at `/books`. All sections share dark theme with neon accents and terminal-inspired typography.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Vite, React Router 7, Intersection Observer for scroll animations, GitHub GraphQL API for stats.

---

## Phase 1: Foundation - Dark Theme & Layout Structure

### Task 1: Update Tailwind Theme for Dark/Techy Aesthetic

**Files:**

- Modify: `/home/dwagner003/dev/wagner-website/src/index.css`

**Step 1: Replace theme colors with dark palette**

```css
@import 'tailwindcss';

@theme {
  /* Dark background colors */
  --color-bg-primary: #0a0a0f;
  --color-bg-secondary: #12121a;
  --color-bg-card: rgba(18, 18, 26, 0.8);

  /* Neon accent colors */
  --color-neon-cyan: #00f5ff;
  --color-neon-green: #39ff14;
  --color-neon-purple: #bf00ff;

  /* Text colors */
  --color-text-primary: #e4e4e7;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #71717a;

  /* Terminal colors */
  --color-terminal-green: #4ade80;
  --color-terminal-prompt: #22d3ee;

  /* Glow effects */
  --shadow-neon-cyan: 0 0 20px rgba(0, 245, 255, 0.3);
  --shadow-neon-green: 0 0 20px rgba(57, 255, 20, 0.3);
}

/* Base dark background */
body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

/* Terminal font */
@font-face {
  font-family: 'JetBrains Mono';
  src: url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
}

.font-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}
```

**Step 2: Verify styles load**

Run: `cd /home/dwagner003/dev/wagner-website && npm run dev`
Expected: Site loads with dark background

**Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add dark theme with neon accents and terminal colors"
```

---

### Task 2: Create Reusable UI Components

**Files:**

- Create: `/home/dwagner003/dev/wagner-website/src/components/ui/GlowCard.tsx`
- Create: `/home/dwagner003/dev/wagner-website/src/components/ui/SectionHeading.tsx`
- Create: `/home/dwagner003/dev/wagner-website/src/components/ui/TerminalText.tsx`

**Step 1: Create GlowCard component**

```tsx
interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'green' | 'purple';
}

export function GlowCard({ children, className = '', glowColor = 'cyan' }: GlowCardProps) {
  const glowStyles = {
    cyan: 'hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] border-[var(--color-neon-cyan)]',
    green: 'hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] border-[var(--color-neon-green)]',
    purple: 'hover:shadow-[0_0_30px_rgba(191,0,255,0.3)] border-[var(--color-neon-purple)]',
  };

  return (
    <div
      className={`
        bg-[var(--color-bg-card)]
        backdrop-blur-sm
        border
        border-opacity-20
        rounded-lg
        p-6
        transition-all
        duration-300
        ${glowStyles[glowColor]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
```

**Step 2: Create SectionHeading component**

```tsx
interface SectionHeadingProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3';
}

export function SectionHeading({ children, as: Component = 'h2' }: SectionHeadingProps) {
  return (
    <Component className="font-mono text-[var(--color-text-muted)] text-lg mb-8">
      <span className="text-[var(--color-neon-cyan)]">//</span> {children}
    </Component>
  );
}
```

**Step 3: Create TerminalText component**

```tsx
interface TerminalTextProps {
  command: string;
  output?: string;
  showCursor?: boolean;
}

export function TerminalText({ command, output, showCursor = false }: TerminalTextProps) {
  return (
    <div className="font-mono">
      <div className="flex items-center gap-2">
        <span className="text-[var(--color-terminal-prompt)]">$</span>
        <span className="text-[var(--color-text-primary)]">{command}</span>
        {showCursor && !output && (
          <span className="animate-pulse text-[var(--color-terminal-green)]">_</span>
        )}
      </div>
      {output && (
        <div className="text-[var(--color-terminal-green)] mt-1 ml-4">
          {'>'} {output}
        </div>
      )}
    </div>
  );
}
```

**Step 4: Create barrel export**

Create `/home/dwagner003/dev/wagner-website/src/components/ui/index.ts`:

```tsx
export { GlowCard } from './GlowCard';
export { SectionHeading } from './SectionHeading';
export { TerminalText } from './TerminalText';
```

**Step 5: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add reusable UI components (GlowCard, SectionHeading, TerminalText)"
```

---

### Task 3: Update Layout Component for Single-Page Structure

**Files:**

- Modify: `/home/dwagner003/dev/wagner-website/src/components/layout/Layout.tsx`

**Step 1: Read current Layout**

Read: `/home/dwagner003/dev/wagner-website/src/components/layout/Layout.tsx`

**Step 2: Update Layout for dark theme**

```tsx
import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/layout/Layout.tsx
git commit -m "feat: update Layout for dark theme"
```

---

### Task 4: Update Navbar for Dark Theme with Sticky Behavior

**Files:**

- Modify: `/home/dwagner003/dev/wagner-website/src/components/layout/Navbar.tsx`

**Step 1: Read current Navbar**

Read: `/home/dwagner003/dev/wagner-website/src/components/layout/Navbar.tsx`

**Step 2: Rewrite Navbar with dark theme and smooth scroll links**

```tsx
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = isHomePage
    ? [
        { label: 'Skills', action: () => scrollToSection('skills') },
        { label: 'Experience', action: () => scrollToSection('experience') },
        { label: 'GitHub', action: () => scrollToSection('github') },
      ]
    : [];

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${scrolled ? 'bg-[var(--color-bg-secondary)]/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}
      `}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="font-mono text-xl font-bold text-[var(--color-neon-cyan)] hover:text-[var(--color-neon-green)] transition-colors"
        >
          {'<DW />'}
        </Link>

        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="font-mono text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] transition-colors"
            >
              {link.label}
            </button>
          ))}

          <Link
            to="/books"
            className="font-mono text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] transition-colors"
          >
            Books
          </Link>

          {isAuthenticated ? (
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="font-mono text-sm px-4 py-2 border border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] rounded hover:bg-[var(--color-neon-cyan)] hover:text-[var(--color-bg-primary)] transition-all"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="font-mono text-sm px-4 py-2 border border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] rounded hover:bg-[var(--color-neon-cyan)] hover:text-[var(--color-bg-primary)] transition-all"
            >
              Login
            </button>
          )}

          {/* Social Links */}
          <a
            href="https://github.com/dwagner003"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] transition-colors"
            aria-label="GitHub"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/devin-wagner"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] transition-colors"
            aria-label="LinkedIn"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat: update Navbar with dark theme, sticky behavior, and smooth scroll"
```

---

## Phase 2: Hero Section with Terminal Animation

### Task 5: Create Terminal Animation Hook

**Files:**

- Create: `/home/dwagner003/dev/wagner-website/src/hooks/useTypingAnimation.ts`

**Step 1: Create typing animation hook**

```tsx
import { useState, useEffect } from 'react';

interface TypedLine {
  command: string;
  output: string;
  delay?: number;
}

export function useTypingAnimation(lines: TypedLine[], typingSpeed = 50) {
  const [displayedLines, setDisplayedLines] = useState<
    { command: string; output: string; complete: boolean }[]
  >([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTypingCommand, setIsTypingCommand] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsComplete(true);
      return;
    }

    const currentLine = lines[currentLineIndex];
    const targetText = isTypingCommand ? currentLine.command : currentLine.output;

    if (currentCharIndex < targetText.length) {
      const timeout = setTimeout(() => {
        if (isTypingCommand) {
          setDisplayedLines((prev) => {
            const updated = [...prev];
            if (!updated[currentLineIndex]) {
              updated[currentLineIndex] = { command: '', output: '', complete: false };
            }
            updated[currentLineIndex].command = targetText.slice(0, currentCharIndex + 1);
            return updated;
          });
        } else {
          setDisplayedLines((prev) => {
            const updated = [...prev];
            updated[currentLineIndex].output = targetText.slice(0, currentCharIndex + 1);
            return updated;
          });
        }
        setCurrentCharIndex((prev) => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else if (isTypingCommand) {
      // Finished typing command, show output instantly
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[currentLineIndex].output = currentLine.output;
          updated[currentLineIndex].complete = true;
          return updated;
        });
        setIsTypingCommand(false);
        setCurrentCharIndex(0);
      }, 300);

      return () => clearTimeout(timeout);
    } else {
      // Move to next line
      const timeout = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
        setIsTypingCommand(true);
      }, currentLine.delay || 500);

      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex, isTypingCommand, lines, typingSpeed]);

  return { displayedLines, isComplete, currentLineIndex };
}
```

**Step 2: Commit**

```bash
git add src/hooks/useTypingAnimation.ts
git commit -m "feat: add useTypingAnimation hook for terminal effect"
```

---

### Task 6: Create Hero Section Component

**Files:**

- Create: `/home/dwagner003/dev/wagner-website/src/components/sections/HeroSection.tsx`

**Step 1: Create HeroSection component**

```tsx
import { useTypingAnimation } from '../../hooks/useTypingAnimation';

const terminalLines = [
  { command: 'whoami', output: 'Devin Wagner' },
  { command: 'cat role.txt', output: 'Full Stack Software Engineer' },
  { command: 'ls skills/', output: 'C#  .NET  Angular  React  MongoDB  AWS' },
  { command: 'cat status.txt', output: 'Building great software in Denver, CO' },
];

export function HeroSection() {
  const { displayedLines, isComplete, currentLineIndex } = useTypingAnimation(terminalLines, 40);

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,245,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Terminal window */}
      <div className="relative z-10 w-full max-w-2xl mx-4">
        <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-neon-cyan)]/20 shadow-[0_0_50px_rgba(0,245,255,0.1)] overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-bg-primary)] border-b border-[var(--color-neon-cyan)]/20">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 font-mono text-sm text-[var(--color-text-muted)]">
              ~/devin-wagner
            </span>
          </div>

          {/* Terminal content */}
          <div className="p-6 font-mono text-sm leading-relaxed">
            {displayedLines.map((line, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-terminal-prompt)]">$</span>
                  <span className="text-[var(--color-text-primary)]">{line.command}</span>
                  {index === currentLineIndex && !line.complete && (
                    <span className="animate-pulse text-[var(--color-terminal-green)]">_</span>
                  )}
                </div>
                {line.output && (
                  <div className="text-[var(--color-terminal-green)] mt-1 ml-4">
                    {'>'} {line.output}
                  </div>
                )}
              </div>
            ))}
            {isComplete && (
              <div className="flex items-center gap-2 mt-4">
                <span className="text-[var(--color-terminal-prompt)]">$</span>
                <span className="animate-pulse text-[var(--color-terminal-green)]">_</span>
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-[var(--color-text-muted)] animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-xs">scroll to explore</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/sections/HeroSection.tsx
git commit -m "feat: add HeroSection with terminal animation"
```

---

## Phase 3: Skills Section

### Task 7: Create Skills Section with Glowing Cards

**Files:**

- Create: `/home/dwagner003/dev/wagner-website/src/components/sections/SkillsSection.tsx`
- Create: `/home/dwagner003/dev/wagner-website/src/hooks/useIntersectionObserver.ts`

**Step 1: Create intersection observer hook**

```tsx
import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
```

**Step 2: Create SkillsSection component**

```tsx
import { SectionHeading } from '../ui';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface Skill {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'cloud';
}

const skills: Skill[] = [
  { name: 'C#', icon: '⌘', category: 'backend' },
  { name: '.NET', icon: '◆', category: 'backend' },
  { name: 'Angular', icon: '△', category: 'frontend' },
  { name: 'React', icon: '⚛', category: 'frontend' },
  { name: 'MongoDB', icon: '◉', category: 'backend' },
  { name: 'NoSQL', icon: '▤', category: 'backend' },
  { name: 'AWS', icon: '☁', category: 'cloud' },
  { name: 'TypeScript', icon: 'TS', category: 'frontend' },
];

export function SkillsSection() {
  const { ref, isVisible } = useIntersectionObserver(0.2);

  return (
    <section id="skills" className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <SectionHeading>tech_stack</SectionHeading>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className={`
                group
                bg-[var(--color-bg-card)]
                backdrop-blur-sm
                border border-[var(--color-neon-cyan)]/20
                rounded-lg
                p-6
                text-center
                transition-all
                duration-500
                hover:border-[var(--color-neon-cyan)]
                hover:shadow-[0_0_30px_rgba(0,245,255,0.2)]
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {skill.icon}
              </div>
              <h3 className="font-mono text-[var(--color-text-primary)] font-medium">
                {skill.name}
              </h3>
              <span className="font-mono text-xs text-[var(--color-text-muted)] mt-2 block">
                {skill.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Commit**

```bash
git add src/hooks/useIntersectionObserver.ts src/components/sections/SkillsSection.tsx
git commit -m "feat: add SkillsSection with animated glowing cards"
```

---

## Phase 4: Experience Timeline

### Task 8: Create Experience Timeline Section

**Files:**

- Create: `/home/dwagner003/dev/wagner-website/src/components/sections/ExperienceSection.tsx`

**Step 1: Create ExperienceSection component**

```tsx
import { SectionHeading } from '../ui';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface Experience {
  title: string;
  company: string;
  period: string;
  highlights: string[];
  tech: string[];
}

const experiences: Experience[] = [
  {
    title: 'Senior Software Engineer',
    company: 'Current Company',
    period: '2022 - Present',
    highlights: [
      'Led development of microservices architecture',
      'Improved system performance by 40%',
      'Mentored junior developers',
    ],
    tech: ['C#', '.NET', 'Angular', 'AWS'],
  },
  {
    title: 'Software Engineer',
    company: 'Previous Company',
    period: '2020 - 2022',
    highlights: [
      'Built full-stack features for enterprise platform',
      'Implemented CI/CD pipelines',
      'Collaborated with cross-functional teams',
    ],
    tech: ['React', 'Node.js', 'MongoDB'],
  },
];

export function ExperienceSection() {
  const { ref, isVisible } = useIntersectionObserver(0.1);

  return (
    <section id="experience" className="py-24 px-6 bg-[var(--color-bg-secondary)]" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <SectionHeading>experience</SectionHeading>

        <div className="relative">
          {/* Timeline line */}
          <div
            className={`
              absolute left-0 md:left-1/2 top-0 bottom-0 w-px
              bg-gradient-to-b from-[var(--color-neon-cyan)] to-transparent
              transition-all duration-1000
              ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
          />

          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`
                relative
                md:w-1/2
                ${index % 2 === 0 ? 'md:pr-12 md:ml-0' : 'md:pl-12 md:ml-auto'}
                mb-12
                pl-8 md:pl-0
                transition-all duration-700
                ${
                  isVisible
                    ? 'opacity-100 translate-x-0'
                    : `opacity-0 ${index % 2 === 0 ? '-translate-x-8' : 'translate-x-8'}`
                }
              `}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Timeline dot */}
              <div
                className={`
                  absolute
                  left-0 md:left-auto
                  ${index % 2 === 0 ? 'md:right-0 md:translate-x-1/2' : 'md:left-0 md:-translate-x-1/2'}
                  top-0
                  w-4 h-4
                  bg-[var(--color-neon-cyan)]
                  rounded-full
                  shadow-[0_0_20px_var(--color-neon-cyan)]
                  -translate-x-1/2 md:translate-x-0
                `}
              />

              {/* Card */}
              <div className="bg-[var(--color-bg-card)] backdrop-blur-sm border border-[var(--color-neon-cyan)]/20 rounded-lg p-6 hover:border-[var(--color-neon-cyan)]/50 transition-colors">
                <h3 className="font-mono text-xl text-[var(--color-text-primary)] font-semibold">
                  {exp.title}
                </h3>
                <p className="font-mono text-[var(--color-neon-cyan)] mt-1">{exp.company}</p>
                <p className="font-mono text-sm text-[var(--color-text-muted)] mt-1">
                  {exp.period}
                </p>

                <ul className="mt-4 space-y-2">
                  {exp.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      className="text-[var(--color-text-secondary)] text-sm flex items-start gap-2"
                    >
                      <span className="text-[var(--color-terminal-green)]">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mt-4">
                  {exp.tech.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-xs px-2 py-1 bg-[var(--color-neon-cyan)]/10 text-[var(--color-neon-cyan)] rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/sections/ExperienceSection.tsx
git commit -m "feat: add ExperienceSection with animated timeline"
```

---

## Phase 5: GitHub Stats Section

### Task 9: Create GitHub Stats Service

**Files:**

- Create: `/home/dwagner003/dev/wagner-website/src/services/github.ts`

**Step 1: Create GitHub API service**

```tsx
const GITHUB_USERNAME = 'dwagner003';

interface GitHubStats {
  publicRepos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

export async function fetchGitHubStats(): Promise<GitHubStats> {
  const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
  if (!response.ok) throw new Error('Failed to fetch GitHub stats');
  const data = await response.json();
  return {
    publicRepos: data.public_repos,
    followers: data.followers,
    following: data.following,
  };
}

export async function fetchPinnedRepos(): Promise<GitHubRepo[]> {
  // GitHub REST API doesn't expose pinned repos directly
  // Fetch recent repos sorted by updated time as fallback
  const response = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=4`
  );
  if (!response.ok) throw new Error('Failed to fetch repos');
  return response.json();
}
```

**Step 2: Create useGitHubStats hook**

Create `/home/dwagner003/dev/wagner-website/src/hooks/useGitHubStats.ts`:

```tsx
import { useQuery } from '@tanstack/react-query';
import { fetchGitHubStats, fetchPinnedRepos } from '../services/github';

export function useGitHubStats() {
  return useQuery({
    queryKey: ['github-stats'],
    queryFn: fetchGitHubStats,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}

export function useGitHubRepos() {
  return useQuery({
    queryKey: ['github-repos'],
    queryFn: fetchPinnedRepos,
    staleTime: 1000 * 60 * 60,
  });
}
```

**Step 3: Commit**

```bash
git add src/services/github.ts src/hooks/useGitHubStats.ts
git commit -m "feat: add GitHub API service and hooks"
```

---

### Task 10: Create GitHub Stats Section Component

**Files:**

- Create: `/home/dwagner003/dev/wagner-website/src/components/sections/GitHubSection.tsx`

**Step 1: Create GitHubSection component**

```tsx
import { SectionHeading } from '../ui';
import { useGitHubStats, useGitHubRepos } from '../../hooks/useGitHubStats';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export function GitHubSection() {
  const { ref, isVisible } = useIntersectionObserver(0.2);
  const { data: stats, isLoading: statsLoading } = useGitHubStats();
  const { data: repos, isLoading: reposLoading } = useGitHubRepos();

  return (
    <section id="github" className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <SectionHeading>github_stats</SectionHeading>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Repositories', value: stats?.publicRepos ?? '--' },
            { label: 'Followers', value: stats?.followers ?? '--' },
            { label: 'Following', value: stats?.following ?? '--' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`
                bg-[var(--color-bg-card)]
                backdrop-blur-sm
                border border-[var(--color-neon-cyan)]/20
                rounded-lg
                p-6
                text-center
                transition-all duration-500
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="font-mono text-4xl text-[var(--color-neon-cyan)] font-bold">
                {statsLoading ? '...' : stat.value}
              </div>
              <div className="font-mono text-sm text-[var(--color-text-muted)] mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Repos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reposLoading ? (
            <div className="col-span-2 text-center text-[var(--color-text-muted)]">
              Loading repositories...
            </div>
          ) : (
            repos?.map((repo, index) => (
              <a
                key={repo.name}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  block
                  bg-[var(--color-bg-card)]
                  backdrop-blur-sm
                  border border-[var(--color-neon-cyan)]/20
                  rounded-lg
                  p-6
                  transition-all duration-500
                  hover:border-[var(--color-neon-cyan)]
                  hover:shadow-[0_0_30px_rgba(0,245,255,0.2)]
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-[var(--color-text-primary)] font-medium">
                    {repo.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
                    <span>★</span>
                    <span className="font-mono text-sm">{repo.stargazers_count}</span>
                  </div>
                </div>
                {repo.description && (
                  <p className="text-[var(--color-text-secondary)] text-sm mt-2 line-clamp-2">
                    {repo.description}
                  </p>
                )}
                {repo.language && (
                  <span className="inline-block font-mono text-xs px-2 py-1 mt-3 bg-[var(--color-neon-cyan)]/10 text-[var(--color-neon-cyan)] rounded">
                    {repo.language}
                  </span>
                )}
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/sections/GitHubSection.tsx
git commit -m "feat: add GitHubSection with live stats and repos"
```

---

## Phase 6: Footer

### Task 11: Create Footer Component

**Files:**

- Create: `/home/dwagner003/dev/wagner-website/src/components/sections/Footer.tsx`

**Step 1: Create Footer component**

```tsx
export function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-[var(--color-neon-cyan)]/10">
      <div className="max-w-6xl mx-auto text-center">
        <div className="font-mono text-[var(--color-text-muted)] mb-6">
          <span className="text-[var(--color-terminal-prompt)]">$</span> echo "Let's connect"
        </div>

        <div className="flex justify-center gap-6 mb-8">
          <a
            href="https://github.com/dwagner003"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all p-2"
            aria-label="GitHub"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/devin-wagner"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all p-2"
            aria-label="LinkedIn"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>

        <div className="font-mono text-sm text-[var(--color-text-muted)]">
          © 2026 Devin Wagner | Built with React + TypeScript
        </div>

        <div className="font-mono text-[var(--color-terminal-prompt)] mt-4">
          $ exit<span className="animate-pulse">_</span>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/sections/Footer.tsx
git commit -m "feat: add Footer with terminal styling"
```

---

## Phase 7: Assemble Homepage & Update Routes

### Task 12: Create Section Barrel Export

**Files:**

- Create: `/home/dwagner003/dev/wagner-website/src/components/sections/index.ts`

**Step 1: Create barrel export**

```tsx
export { HeroSection } from './HeroSection';
export { SkillsSection } from './SkillsSection';
export { ExperienceSection } from './ExperienceSection';
export { GitHubSection } from './GitHubSection';
export { Footer } from './Footer';
```

**Step 2: Commit**

```bash
git add src/components/sections/index.ts
git commit -m "feat: add sections barrel export"
```

---

### Task 13: Rewrite HomePage with All Sections

**Files:**

- Modify: `/home/dwagner003/dev/wagner-website/src/pages/HomePage.tsx`

**Step 1: Read current HomePage**

Read: `/home/dwagner003/dev/wagner-website/src/pages/HomePage.tsx`

**Step 2: Rewrite HomePage**

```tsx
import {
  HeroSection,
  SkillsSection,
  ExperienceSection,
  GitHubSection,
  Footer,
} from '../components/sections';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SkillsSection />
      <ExperienceSection />
      <GitHubSection />
      <Footer />
    </>
  );
}
```

**Step 3: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: rewrite HomePage with all sections"
```

---

### Task 14: Update Routes (Remove Old Pages)

**Files:**

- Modify: `/home/dwagner003/dev/wagner-website/src/routes/AppRoutes.tsx`

**Step 1: Read current routes**

Read: `/home/dwagner003/dev/wagner-website/src/routes/AppRoutes.tsx`

**Step 2: Update routes (remove About, Contact)**

```tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import BooksPage from '../pages/BooksPage';
import BookDetailsPage from '../pages/BookDetailsPage';
import AddBookPage from '../pages/AddBookPage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/books" element={<BooksPage />} />
        <Route
          path="/books/add"
          element={
            <ProtectedRoute>
              <AddBookPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <ProtectedRoute>
              <BookDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
```

**Step 3: Commit**

```bash
git add src/routes/AppRoutes.tsx
git commit -m "feat: update routes - remove old pages, add homepage as root"
```

---

## Phase 8: Restyle Books Section

### Task 15: Update BooksPage with Dark Theme

**Files:**

- Modify: `/home/dwagner003/dev/wagner-website/src/pages/BooksPage.tsx`

**Step 1: Read current BooksPage**

Read: `/home/dwagner003/dev/wagner-website/src/pages/BooksPage.tsx`

**Step 2: Update BooksPage styling**

Apply dark theme classes and terminal-style heading. (Exact changes depend on current file content - update container, backgrounds, and heading to match new theme.)

**Step 3: Commit**

```bash
git add src/pages/BooksPage.tsx
git commit -m "feat: update BooksPage with dark theme"
```

---

### Task 16: Update BookCard with Glowing Card Style

**Files:**

- Modify: `/home/dwagner003/dev/wagner-website/src/components/books/BookCard.tsx`

**Step 1: Read current BookCard**

Read: `/home/dwagner003/dev/wagner-website/src/components/books/BookCard.tsx`

**Step 2: Update BookCard styling**

Apply dark theme with glow effect on hover. (Exact changes depend on current file content.)

**Step 3: Commit**

```bash
git add src/components/books/BookCard.tsx
git commit -m "feat: update BookCard with dark theme and glow effect"
```

---

### Task 17: Update BookList with Dark Theme

**Files:**

- Modify: `/home/dwagner003/dev/wagner-website/src/components/books/BookList.tsx`

**Step 1: Read current BookList**

Read: `/home/dwagner003/dev/wagner-website/src/components/books/BookList.tsx`

**Step 2: Update BookList styling**

Update grid layout and any container styles for dark theme.

**Step 3: Commit**

```bash
git add src/components/books/BookList.tsx
git commit -m "feat: update BookList with dark theme"
```

---

## Phase 9: Cleanup & Final Polish

### Task 18: Delete Unused Pages

**Files:**

- Delete: `/home/dwagner003/dev/wagner-website/src/pages/AboutPage.tsx`
- Delete: `/home/dwagner003/dev/wagner-website/src/pages/ContactPage.tsx`

**Step 1: Delete files**

```bash
rm src/pages/AboutPage.tsx src/pages/ContactPage.tsx
```

**Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove unused AboutPage and ContactPage"
```

---

### Task 19: Add JetBrains Mono Font to index.html

**Files:**

- Modify: `/home/dwagner003/dev/wagner-website/index.html`

**Step 1: Read current index.html**

Read: `/home/dwagner003/dev/wagner-website/index.html`

**Step 2: Add font link in head**

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add JetBrains Mono font"
```

---

### Task 20: Final Test & Verification

**Step 1: Run dev server**

```bash
cd /home/dwagner003/dev/wagner-website && npm run dev
```

**Step 2: Manual verification checklist**

- [ ] Homepage loads with dark theme
- [ ] Terminal animation plays on hero section
- [ ] Skills cards animate on scroll
- [ ] Experience timeline animates on scroll
- [ ] GitHub stats load and display
- [ ] Footer displays correctly
- [ ] Books page accessible at /books
- [ ] Books page has dark theme
- [ ] Navigation works (scroll links + books link)
- [ ] Auth0 login/logout works
- [ ] Mobile responsive

**Step 3: Run build to check for errors**

```bash
npm run build
```

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete frontend revamp - dark theme with terminal aesthetics"
```

---

## Summary

| Phase | Tasks | Description                                            |
| ----- | ----- | ------------------------------------------------------ |
| 1     | 1-4   | Foundation - dark theme, UI components, layout, navbar |
| 2     | 5-6   | Hero section with terminal animation                   |
| 3     | 7     | Skills section with glowing cards                      |
| 4     | 8     | Experience timeline                                    |
| 5     | 9-10  | GitHub stats section                                   |
| 6     | 11    | Footer                                                 |
| 7     | 12-14 | Assemble homepage & update routes                      |
| 8     | 15-17 | Restyle books section                                  |
| 9     | 18-20 | Cleanup & final polish                                 |

**Total: 20 tasks across 9 phases**
