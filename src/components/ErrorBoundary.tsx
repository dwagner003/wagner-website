import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-bg-primary)]">
          <div className="text-center">
            <div className="font-mono text-4xl sm:text-6xl font-bold text-[var(--color-neon-cyan)] mb-4">
              ERROR
            </div>
            <div className="font-mono text-sm sm:text-base text-[var(--color-text-muted)] mb-2">
              <span className="text-[var(--color-terminal-prompt)]">$</span> cat /var/log/error
            </div>
            <div className="font-mono text-sm sm:text-base text-red-400 mb-8">
              Segmentation fault (core dumped)
            </div>
            <button
              onClick={() => window.location.reload()}
              className="font-mono text-sm px-6 py-3 border border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] rounded hover:bg-[var(--color-neon-cyan)]/10 transition-colors"
            >
              sudo reboot
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
