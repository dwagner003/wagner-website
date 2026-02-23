import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeroSection } from '../components/sections/HeroSection';
import { SkillsSection } from '../components/sections/SkillsSection';
import { ExperienceSection } from '../components/sections/ExperienceSection';
import { Footer } from '../components/sections/Footer';

// Mock useTypingAnimation for HeroSection tests
vi.mock('../hooks/useTypingAnimation', () => ({
  useTypingAnimation: () => ({
    displayedLines: [{ command: 'whoami', output: 'Devin Wagner', complete: true }],
    isComplete: false,
    currentLineIndex: 0,
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe('Component Smoke Tests', () => {
  describe('HeroSection', () => {
    it('should render without crashing', () => {
      render(<HeroSection />, { wrapper: TestWrapper });
      expect(screen.getByText('~/devin-wagner')).toBeInTheDocument();
    });

    it('should display terminal prompt', () => {
      render(<HeroSection />, { wrapper: TestWrapper });
      expect(screen.getByText('$')).toBeInTheDocument();
    });

    it('should show scroll indicator', () => {
      render(<HeroSection />, { wrapper: TestWrapper });
      expect(screen.getByText('scroll to explore')).toBeInTheDocument();
    });
  });

  describe('SkillsSection', () => {
    it('should render without crashing', () => {
      render(<SkillsSection />, { wrapper: TestWrapper });
      expect(screen.getByText('tech_stack')).toBeInTheDocument();
    });

    it('should display all skills', () => {
      render(<SkillsSection />, { wrapper: TestWrapper });

      expect(screen.getByText('C#')).toBeInTheDocument();
      expect(screen.getByText('.NET')).toBeInTheDocument();
      expect(screen.getByText('Angular')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('AWS')).toBeInTheDocument();
    });

    it('should display skill categories', () => {
      render(<SkillsSection />, { wrapper: TestWrapper });

      expect(screen.getAllByText('backend').length).toBeGreaterThan(0);
      expect(screen.getAllByText('frontend').length).toBeGreaterThan(0);
      expect(screen.getAllByText('cloud').length).toBeGreaterThan(0);
    });
  });

  describe('ExperienceSection', () => {
    it('should render without crashing', () => {
      render(<ExperienceSection />, { wrapper: TestWrapper });
      expect(screen.getByText('experience')).toBeInTheDocument();
    });

    it('should display job titles', () => {
      render(<ExperienceSection />, { wrapper: TestWrapper });

      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Integration Engineer')).toBeInTheDocument();
    });

    it('should display company names', () => {
      render(<ExperienceSection />, { wrapper: TestWrapper });

      expect(screen.getAllByText('AbsenceSoft').length).toBeGreaterThan(0);
      expect(screen.getByText('Billtrust')).toBeInTheDocument();
    });

    it('should display tech tags', () => {
      render(<ExperienceSection />, { wrapper: TestWrapper });

      expect(screen.getAllByText('C#').length).toBeGreaterThan(0);
      expect(screen.getAllByText('.NET').length).toBeGreaterThan(0);
    });
  });

  describe('Footer', () => {
    it('should render without crashing', () => {
      render(<Footer />, { wrapper: TestWrapper });
      expect(screen.getByText(/Let's connect/)).toBeInTheDocument();
    });

    it('should display copyright', () => {
      render(<Footer />, { wrapper: TestWrapper });
      expect(screen.getByText(/© 2026 Devin Wagner/)).toBeInTheDocument();
    });

    it('should have social links', () => {
      render(<Footer />, { wrapper: TestWrapper });

      const githubLink = screen.getByLabelText('GitHub');
      const linkedinLink = screen.getByLabelText('LinkedIn');

      expect(githubLink).toHaveAttribute('href', 'https://github.com/dwagner003');
      expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/dtwagner55/');
    });

    it('should have exit command', () => {
      render(<Footer />, { wrapper: TestWrapper });
      expect(screen.getByText(/\$ exit/)).toBeInTheDocument();
    });
  });
});
