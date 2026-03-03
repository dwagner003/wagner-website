import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BackToTop } from './BackToTop';

describe('BackToTop', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  it('should not render when at top of page', () => {
    render(<BackToTop />);
    expect(screen.queryByLabelText('Scroll to top')).not.toBeInTheDocument();
  });

  it('should render after scrolling past 500px', () => {
    render(<BackToTop />);
    Object.defineProperty(window, 'scrollY', { value: 600, writable: true });
    fireEvent.scroll(window);
    expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument();
  });

  it('should scroll to top when clicked', () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    render(<BackToTop />);
    Object.defineProperty(window, 'scrollY', { value: 600, writable: true });
    fireEvent.scroll(window);

    fireEvent.click(screen.getByLabelText('Scroll to top'));
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('should hide when scrolled back to top', () => {
    render(<BackToTop />);

    Object.defineProperty(window, 'scrollY', { value: 600, writable: true });
    fireEvent.scroll(window);
    expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument();

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    fireEvent.scroll(window);
    expect(screen.queryByLabelText('Scroll to top')).not.toBeInTheDocument();
  });
});
