import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { GitHubIcon, LinkedInIcon } from './icons';

describe('GitHubIcon', () => {
  it('should render an SVG with default size', () => {
    const { container } = render(<GitHubIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-5', 'h-5');
  });

  it('should accept a custom className', () => {
    const { container } = render(<GitHubIcon className="w-8 h-8" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-8', 'h-8');
  });
});

describe('LinkedInIcon', () => {
  it('should render an SVG with default size', () => {
    const { container } = render(<LinkedInIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-5', 'h-5');
  });

  it('should accept a custom className', () => {
    const { container } = render(<LinkedInIcon className="w-10 h-10" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-10', 'h-10');
  });
});
