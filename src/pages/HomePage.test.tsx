import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './HomePage';

// Mock all section components to isolate HomePage test
vi.mock('../components/sections', () => ({
  HeroSection: () => <div data-testid="hero-section">HeroSection</div>,
  SkillsSection: () => <div data-testid="skills-section">SkillsSection</div>,
  ExperienceSection: () => <div data-testid="experience-section">ExperienceSection</div>,
  GitHubSection: () => <div data-testid="github-section">GitHubSection</div>,
  Footer: () => <div data-testid="footer">Footer</div>,
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

describe('HomePage', () => {
  const renderHomePage = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </QueryClientProvider>
    );

  it('should render all sections', () => {
    renderHomePage();

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('skills-section')).toBeInTheDocument();
    expect(screen.getByTestId('experience-section')).toBeInTheDocument();
    expect(screen.getByTestId('github-section')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render sections in correct order', () => {
    const { container } = renderHomePage();
    const sections = container.querySelectorAll('[data-testid]');
    const order = Array.from(sections).map((s) => s.getAttribute('data-testid'));

    expect(order).toEqual([
      'hero-section',
      'skills-section',
      'experience-section',
      'github-section',
      'footer',
    ]);
  });
});
