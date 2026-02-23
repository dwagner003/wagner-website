import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIntersectionObserver } from './useIntersectionObserver';

describe('useIntersectionObserver', () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockCallback: (entries: IntersectionObserverEntry[]) => void;
  let constructorSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();
    constructorSpy = vi.fn();

    // Mock IntersectionObserver as a proper class
    class MockIntersectionObserver {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void, options?: IntersectionObserverInit) {
        mockCallback = callback;
        constructorSpy(callback, options);
      }
      observe = mockObserve;
      disconnect = mockDisconnect;
      unobserve = vi.fn();
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  it('should return a ref and isVisible as false initially', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.ref).toBeDefined();
    expect(result.current.isVisible).toBe(false);
  });

  it('should create an IntersectionObserver with the given threshold', () => {
    renderHook(() => useIntersectionObserver(0.5));

    expect(constructorSpy).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.5 }
    );
  });

  it('should use default threshold of 0.1', () => {
    renderHook(() => useIntersectionObserver());

    expect(constructorSpy).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.1 }
    );
  });

  it('should disconnect observer on unmount', () => {
    const { unmount } = renderHook(() => useIntersectionObserver());

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should set isVisible to true when element intersects', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Simulate intersection
    act(() => {
      mockCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(result.current.isVisible).toBe(true);
  });

  it('should disconnect observer after element becomes visible', () => {
    renderHook(() => useIntersectionObserver());

    // Simulate intersection
    act(() => {
      mockCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should not set isVisible when element is not intersecting', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Simulate non-intersection
    act(() => {
      mockCallback([{ isIntersecting: false } as IntersectionObserverEntry]);
    });

    expect(result.current.isVisible).toBe(false);
  });
});
