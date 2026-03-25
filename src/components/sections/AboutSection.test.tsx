import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutSection } from './AboutSection';

describe('AboutSection', () => {
  it('should render the section heading', () => {
    render(<AboutSection />);
    expect(screen.getByText('about_me')).toBeInTheDocument();
  });

  it('should render the greeting', () => {
    render(<AboutSection />);
    expect(screen.getByText("Hey, I'm Devin.")).toBeInTheDocument();
  });

  it('should render bio paragraphs', () => {
    render(<AboutSection />);
    expect(screen.getByText(/Senior Software Engineer based in Denver/)).toBeInTheDocument();
    expect(screen.getByText(/exploring Colorado's trails/)).toBeInTheDocument();
  });

  it('should render the terminal command', () => {
    render(<AboutSection />);
    expect(screen.getByText('cat about.md')).toBeInTheDocument();
  });

  it('should have the about section id', () => {
    const { container } = render(<AboutSection />);
    expect(container.querySelector('#about')).toBeInTheDocument();
  });
});
