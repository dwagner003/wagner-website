import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlowCard } from './GlowCard';

describe('GlowCard', () => {
  it('should render children', () => {
    render(<GlowCard>Test content</GlowCard>);

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should apply default cyan glow styles', () => {
    render(<GlowCard>Content</GlowCard>);

    const card = screen.getByText('Content').closest('div');
    expect(card?.className).toContain('border-[var(--color-neon-cyan)]');
  });

  it('should apply green glow styles', () => {
    render(<GlowCard glowColor="green">Content</GlowCard>);

    const card = screen.getByText('Content').closest('div');
    expect(card?.className).toContain('border-[var(--color-neon-green)]');
  });

  it('should apply purple glow styles', () => {
    render(<GlowCard glowColor="purple">Content</GlowCard>);

    const card = screen.getByText('Content').closest('div');
    expect(card?.className).toContain('border-[var(--color-neon-purple)]');
  });

  it('should apply custom className', () => {
    render(<GlowCard className="custom-class">Content</GlowCard>);

    const card = screen.getByText('Content').closest('div');
    expect(card?.className).toContain('custom-class');
  });

  it('should have base styling classes', () => {
    render(<GlowCard>Content</GlowCard>);

    const card = screen.getByText('Content').closest('div');
    expect(card?.className).toContain('bg-[var(--color-bg-card)]');
    expect(card?.className).toContain('rounded-lg');
    expect(card?.className).toContain('p-6');
  });
});
