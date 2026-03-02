import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { GitHubIcon, LinkedInIcon } from '../ui';

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
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
      ref={navRef}
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${scrolled || mobileMenuOpen ? 'bg-[var(--color-bg-secondary)]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}
      `}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link
          to="/"
          className="font-mono text-lg sm:text-xl font-bold text-[var(--color-neon-cyan)] hover:text-[var(--color-neon-green)] transition-colors"
        >
          {'<DW />'}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="font-mono text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] transition-colors"
            >
              {link.label}
            </button>
          ))}

          <a
            href="https://github.com/dwagner003"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] transition-colors p-2"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            href="https://www.linkedin.com/in/dtwagner55/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] transition-colors p-2"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[var(--color-bg-secondary)]/95 backdrop-blur-md border-t border-[var(--color-neon-cyan)]/20">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="block w-full text-left font-mono text-base text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] transition-colors py-2"
              >
                {link.label}
              </button>
            ))}
            <div className="flex gap-4 pt-3 border-t border-[var(--color-neon-cyan)]/20">
              <a
                href="https://github.com/dwagner003"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] transition-colors p-2"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/dtwagner55/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] transition-colors p-2"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
