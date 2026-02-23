import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TerminalText } from './TerminalText';

describe('TerminalText', () => {
  it('should render the command', () => {
    render(<TerminalText command="npm install" />);

    expect(screen.getByText('npm install')).toBeInTheDocument();
  });

  it('should render the prompt symbol', () => {
    render(<TerminalText command="ls -la" />);

    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('should render output when provided', () => {
    render(<TerminalText command="pwd" output="/home/user" />);

    expect(screen.getByText(/\/home\/user/)).toBeInTheDocument();
  });

  it('should not render output section when not provided', () => {
    const { container } = render(<TerminalText command="pwd" />);

    // Should only have one div child (the command line)
    const terminalDiv = container.firstChild;
    expect(terminalDiv?.childNodes.length).toBe(1);
  });

  it('should show cursor when showCursor is true and no output', () => {
    render(<TerminalText command="typing..." showCursor />);

    expect(screen.getByText('_')).toBeInTheDocument();
  });

  it('should not show cursor when output is present', () => {
    render(<TerminalText command="done" output="result" showCursor />);

    expect(screen.queryByText('_')).not.toBeInTheDocument();
  });

  it('should not show cursor by default', () => {
    render(<TerminalText command="test" />);

    expect(screen.queryByText('_')).not.toBeInTheDocument();
  });

  it('should have mono font styling', () => {
    const { container } = render(<TerminalText command="test" />);

    expect(container.firstChild).toHaveClass('font-mono');
  });
});
