import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContactSection } from './ContactSection';

describe('ContactSection', () => {
  it('should render the section heading', () => {
    render(<ContactSection />);
    expect(screen.getByText('// get_in_touch')).toBeInTheDocument();
  });

  it('should render the email link', () => {
    render(<ContactSection />);
    const emailLink = screen.getByText('devinwagner003@gmail.com');
    expect(emailLink).toHaveAttribute('href', 'mailto:devinwagner003@gmail.com');
  });

  it('should render GitHub and LinkedIn buttons', () => {
    render(<ContactSection />);
    const githubLink = screen.getByLabelText('GitHub');
    const linkedinLink = screen.getByLabelText('LinkedIn');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/dwagner003');
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/dtwagner55/');
  });

  it('should have descriptive text', () => {
    render(<ContactSection />);
    expect(screen.getByText(/Interested in working together/i)).toBeInTheDocument();
  });

  it('should render terminal-style echo command', () => {
    render(<ContactSection />);
    expect(screen.getByText(/echo \$EMAIL/)).toBeInTheDocument();
  });
});
