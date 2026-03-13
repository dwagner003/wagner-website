import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './HomePage';

// Mock all section components to isolate HomePage test
vi.mock('../components/sections', () => ({
  HeroSection: () => <div data-testid="hero-section">HeroSection</div>,
  SkillsSection: () => <div data-testid="skills-section">SkillsSection</div>,
  ExperienceSection: () => <div data-testid="experience-section">ExperienceSection</div>,
  GitHubSection: () => <div data-testid="github-section">GitHubSection</div>,
  ContactSection: () => <div data-testid="contact-section">ContactSection</div>,
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
    expect(screen.getByTestId('contact-section')).toBeInTheDocument();
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
      'contact-section',
      'footer',
    ]);
  });

  it('should scroll to section when hash is present', () => {
    const mockScrollIntoView = vi.fn();
    const mockElement = { scrollIntoView: mockScrollIntoView };
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as unknown as HTMLElement);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/#skills']}>
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(document.getElementById).toHaveBeenCalledWith('skills');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('should not scroll when hash element does not exist', () => {
    vi.spyOn(document, 'getElementById').mockReturnValue(null);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/#nonexistent']}>
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(document.getElementById).toHaveBeenCalledWith('nonexistent');
  });
});
