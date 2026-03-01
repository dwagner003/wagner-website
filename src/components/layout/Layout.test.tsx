import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './Layout';

// Mock the hooks
const mockToggleTheme = vi.fn();
vi.mock('../../hooks', () => ({
  useTheme: () => ({ theme: 'default', toggleTheme: mockToggleTheme }),
  useKonamiCode: vi.fn(),
}));

describe('Layout', () => {
  const renderLayout = (children: React.ReactNode = <div>Test Content</div>) =>
    render(
      <BrowserRouter>
        <Layout>{children}</Layout>
      </BrowserRouter>
    );

  it('should render children', () => {
    renderLayout(<p>Child content here</p>);
    expect(screen.getByText('Child content here')).toBeInTheDocument();
  });

  it('should render the Navbar', () => {
    renderLayout();
    expect(screen.getByText('<DW />')).toBeInTheDocument();
  });

  it('should have the correct background classes', () => {
    const { container } = renderLayout();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('min-h-screen');
  });

  it('should render a skip-to-content link', () => {
    renderLayout();
    const skipLink = screen.getByText('Skip to content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink.tagName).toBe('A');
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('should render main element with id for skip link target', () => {
    renderLayout(<p>Content</p>);
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
  });
});
