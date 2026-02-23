import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  const originalLocalStorage = window.localStorage;
  let mockLocalStorage: Record<string, string>;

  beforeEach(() => {
    mockLocalStorage = {};

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => mockLocalStorage[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: vi.fn(() => {
          mockLocalStorage = {};
        }),
      },
      writable: true,
    });

    // Reset document attribute
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
    document.documentElement.removeAttribute('data-theme');
    vi.clearAllMocks();
  });

  it('should return default theme initially', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('default');
  });

  it('should toggle theme from default to synthwave', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('synthwave');
  });

  it('should toggle theme from synthwave to default', () => {
    mockLocalStorage['wagner-theme'] = 'synthwave';
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('synthwave');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('default');
  });

  it('should persist theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith('wagner-theme', 'synthwave');
  });

  it('should read theme from localStorage on init', () => {
    mockLocalStorage['wagner-theme'] = 'synthwave';
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('synthwave');
  });

  it('should set data-theme attribute when synthwave', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(document.documentElement.getAttribute('data-theme')).toBe('synthwave');
  });

  it('should remove data-theme attribute when default', () => {
    mockLocalStorage['wagner-theme'] = 'synthwave';
    const { result } = renderHook(() => useTheme());

    // First verify synthwave is set
    expect(document.documentElement.getAttribute('data-theme')).toBe('synthwave');

    act(() => {
      result.current.toggleTheme();
    });

    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  it('should return default for invalid stored value', () => {
    mockLocalStorage['wagner-theme'] = 'invalid-theme';
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('default');
  });

  it('should handle localStorage getItem error gracefully', () => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => {
          throw new Error('localStorage disabled');
        }),
        setItem: vi.fn(),
      },
      writable: true,
    });

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('default');
  });

  it('should handle localStorage setItem error gracefully', () => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(() => {
          throw new Error('localStorage full');
        }),
      },
      writable: true,
    });

    const { result } = renderHook(() => useTheme());

    // Should not throw when toggling
    expect(() => {
      act(() => {
        result.current.toggleTheme();
      });
    }).not.toThrow();

    // Theme should still work in-memory
    expect(result.current.theme).toBe('synthwave');
  });

  it('should return stable toggleTheme function', () => {
    const { result, rerender } = renderHook(() => useTheme());

    const firstToggle = result.current.toggleTheme;
    rerender();
    const secondToggle = result.current.toggleTheme;

    expect(firstToggle).toBe(secondToggle);
  });
});
