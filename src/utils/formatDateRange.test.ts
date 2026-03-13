import { describe, it, expect } from 'vitest';
import { formatDateRange, statusColors } from './formatDateRange';

describe('formatDateRange', () => {
  it('should format same-year range', () => {
    expect(formatDateRange('2026-07-01', '2026-07-03')).toBe('Jul 1 - Jul 3, 2026');
  });

  it('should format cross-year range', () => {
    expect(formatDateRange('2026-12-30', '2027-01-02')).toBe('Dec 30, 2026 - Jan 2, 2027');
  });
});

describe('statusColors', () => {
  it('should have colors for all statuses', () => {
    expect(statusColors.planned).toBeDefined();
    expect(statusColors.confirmed).toBeDefined();
    expect(statusColors.completed).toBeDefined();
  });
});
