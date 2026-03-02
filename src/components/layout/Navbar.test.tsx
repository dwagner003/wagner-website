import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const renderNavbar = (initialRoute = '/') =>
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Navbar />
      </MemoryRouter>
    );

  it('should render the logo', () => {
    renderNavbar();
    expect(screen.getByText('<DW />')).toBeInTheDocument();
  });

  it('should show nav links on home page', () => {
    renderNavbar('/');
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('should show nav links on /home route', () => {
    renderNavbar('/home');
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
  });

  it('should not show section nav links on non-home pages', () => {
    renderNavbar('/other');
    expect(screen.queryByText('Skills')).not.toBeInTheDocument();
    expect(screen.queryByText('Experience')).not.toBeInTheDocument();
  });

  it('should have GitHub and LinkedIn social links', () => {
    renderNavbar();
    const githubLinks = screen.getAllByLabelText('GitHub');
    const linkedinLinks = screen.getAllByLabelText('LinkedIn');
    expect(githubLinks.length).toBeGreaterThan(0);
    expect(linkedinLinks.length).toBeGreaterThan(0);
    expect(githubLinks[0]).toHaveAttribute('href', 'https://github.com/dwagner003');
    expect(linkedinLinks[0]).toHaveAttribute('href', 'https://www.linkedin.com/in/dtwagner55/');
  });

  it('should toggle mobile menu on button click', () => {
    renderNavbar();
    const menuButton = screen.getByLabelText('Toggle menu');

    // Menu should be closed initially - nav links appear only in desktop (hidden sm:flex)
    // Click to open mobile menu
    fireEvent.click(menuButton);

    // After opening, there should be duplicate nav link buttons (desktop + mobile)
    const skillsButtons = screen.getAllByText('Skills');
    expect(skillsButtons.length).toBe(2);
  });

  it('should close mobile menu when a nav link is clicked', () => {
    renderNavbar();
    const menuButton = screen.getByLabelText('Toggle menu');

    fireEvent.click(menuButton);
    const skillsButtons = screen.getAllByText('Skills');
    // Click the mobile menu link (last one)
    fireEvent.click(skillsButtons[skillsButtons.length - 1]);

    // Mobile menu should close - only desktop links remain
    expect(screen.getAllByText('Skills')).toHaveLength(1);
  });

  it('should add scrolled styles on scroll', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation');

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);

    expect(nav.className).toContain('backdrop-blur-md');
  });

  it('should scroll to section when nav link is clicked', () => {
    const mockScrollIntoView = vi.fn();
    const mockElement = { scrollIntoView: mockScrollIntoView };
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as unknown as HTMLElement);

    renderNavbar();
    fireEvent.click(screen.getByText('Skills'));

    expect(document.getElementById).toHaveBeenCalledWith('skills');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('should scroll to experience section', () => {
    const mockScrollIntoView = vi.fn();
    vi.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView: mockScrollIntoView,
    } as unknown as HTMLElement);

    renderNavbar();
    fireEvent.click(screen.getByText('Experience'));

    expect(document.getElementById).toHaveBeenCalledWith('experience');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('should scroll to github section', () => {
    const mockScrollIntoView = vi.fn();
    vi.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView: mockScrollIntoView,
    } as unknown as HTMLElement);

    renderNavbar();
    fireEvent.click(screen.getByText('GitHub'));

    expect(document.getElementById).toHaveBeenCalledWith('github');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('should handle scrollToSection when element does not exist', () => {
    vi.spyOn(document, 'getElementById').mockReturnValue(null);

    renderNavbar();

    // Should not throw
    expect(() => fireEvent.click(screen.getByText('Skills'))).not.toThrow();
  });

  it('should close mobile menu on outside click', () => {
    renderNavbar();
    const menuButton = screen.getByLabelText('Toggle menu');

    // Open mobile menu
    fireEvent.click(menuButton);
    expect(screen.getAllByText('Skills')).toHaveLength(2);

    // Click outside the nav
    fireEvent.click(document.body);

    // Mobile menu should close
    expect(screen.getAllByText('Skills')).toHaveLength(1);
  });

  it('should clean up scroll listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderNavbar();

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
