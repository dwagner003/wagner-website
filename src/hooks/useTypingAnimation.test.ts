import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTypingAnimation } from './useTypingAnimation';

describe('useTypingAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockLines = [
    { command: 'hello', output: 'world' },
    { command: 'foo', output: 'bar' },
  ];

  it('should return empty displayedLines initially', () => {
    const { result } = renderHook(() => useTypingAnimation(mockLines));

    expect(result.current.displayedLines).toEqual([]);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.currentLineIndex).toBe(0);
  });

  it('should start typing the first command character after typingSpeed ms', async () => {
    const { result } = renderHook(() => useTypingAnimation(mockLines, 50));

    await act(async () => {
      vi.advanceTimersByTime(50);
    });

    expect(result.current.displayedLines[0]?.command).toBe('h');
  });

  it('should type multiple characters sequentially', async () => {
    const { result } = renderHook(() => useTypingAnimation(mockLines, 10));

    // Type first character
    await act(async () => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.displayedLines[0]?.command).toBe('h');

    // Type second character
    await act(async () => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.displayedLines[0]?.command).toBe('he');

    // Type third character
    await act(async () => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.displayedLines[0]?.command).toBe('hel');
  });

  it('should handle empty lines array', () => {
    const { result } = renderHook(() => useTypingAnimation([]));

    expect(result.current.displayedLines).toEqual([]);
    expect(result.current.isComplete).toBe(true);
  });

  it('should return isComplete as false when lines exist but not typed', () => {
    const { result } = renderHook(() => useTypingAnimation(mockLines));

    expect(result.current.isComplete).toBe(false);
  });

  it('should track currentLineIndex starting at 0', () => {
    const { result } = renderHook(() => useTypingAnimation(mockLines));

    expect(result.current.currentLineIndex).toBe(0);
  });

  it('should use default typing speed of 50ms', async () => {
    const { result } = renderHook(() => useTypingAnimation(mockLines));

    // Should not have typed yet at 49ms
    await act(async () => {
      vi.advanceTimersByTime(49);
    });
    expect(result.current.displayedLines.length).toBe(0);

    // Should have typed at 50ms
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.displayedLines[0]?.command).toBe('h');
  });
});
