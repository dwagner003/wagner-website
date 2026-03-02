import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

  it('should display 404 text', () => {
    renderPage();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should show terminal-style error message', () => {
    renderPage();
    expect(
      screen.getByText('bash: cd: /page-not-found: No such file or directory')
    ).toBeInTheDocument();
  });

  it('should have a link back to home', () => {
    renderPage();
    const homeLink = screen.getByText('cd ~');
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
