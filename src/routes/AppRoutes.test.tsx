import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './AppRoutes';

// Mock HomePage
vi.mock('../pages/HomePage', () => ({
  default: () => <div data-testid="home-page">HomePage</div>,
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithRoute = (route: string) =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <AppRoutes />
      </MemoryRouter>
    </QueryClientProvider>
  );

describe('AppRoutes', () => {
  it('should render HomePage on "/" route', () => {
    renderWithRoute('/');
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('should redirect "/home" to "/"', () => {
    renderWithRoute('/home');
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('should redirect unknown paths to "/"', () => {
    renderWithRoute('/unknown-page');
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
});
