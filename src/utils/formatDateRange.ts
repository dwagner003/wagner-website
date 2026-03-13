import type { CampingTrip } from '../services/trips';

export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start + 'T00:00:00');
  const endDate = new Date(end + 'T00:00:00');
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const yearOpts: Intl.DateTimeFormatOptions = { ...opts, year: 'numeric' };

  if (startDate.getFullYear() === endDate.getFullYear()) {
    return `${startDate.toLocaleDateString('en-US', opts)} - ${endDate.toLocaleDateString('en-US', yearOpts)}`;
  }
  return `${startDate.toLocaleDateString('en-US', yearOpts)} - ${endDate.toLocaleDateString('en-US', yearOpts)}`;
}

export const statusColors: Record<CampingTrip['status'], string> = {
  planned: 'bg-[var(--color-neon-cyan)]/10 text-[var(--color-neon-cyan)]',
  confirmed: 'bg-[var(--color-neon-green)]/10 text-[var(--color-neon-green)]',
  completed: 'bg-[var(--color-neon-purple)]/10 text-[var(--color-neon-purple)]',
};
