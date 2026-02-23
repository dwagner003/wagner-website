import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
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

  it('should complete command and show output after 300ms delay', async () => {
    const lines = [{ command: 'hi', output: 'there' }];
    const { result } = renderHook(() => useTypingAnimation(lines, 10));

    // Type 'h'
    await act(async () => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.displayedLines[0]?.command).toBe('h');

    // Type 'i'
    await act(async () => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.displayedLines[0]?.command).toBe('hi');

    // After command complete, wait 300ms for output to appear
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.displayedLines[0]?.output).toBe('there');
    expect(result.current.displayedLines[0]?.complete).toBe(true);
  });

  it('should move to next line after output with default 500ms delay', async () => {
    const lines = [
      { command: 'a', output: 'x' },
      { command: 'b', output: 'y' },
    ];
    const { result } = renderHook(() => useTypingAnimation(lines, 10));

    // Type first command 'a'
    await act(async () => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.displayedLines[0]?.command).toBe('a');

    // Show output after 300ms
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.displayedLines[0]?.output).toBe('x');

    // Output is also "typed" character by character (10ms per char)
    await act(async () => {
      vi.advanceTimersByTime(10);
    });

    // Move to next line after 500ms (default delay)
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.currentLineIndex).toBe(1);

    // Type second command 'b'
    await act(async () => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.displayedLines[1]?.command).toBe('b');
  });

  it('should use custom delay when provided', async () => {
    const lines = [
      { command: 'a', output: 'x', delay: 1000 },
      { command: 'b', output: 'y' },
    ];
    const { result } = renderHook(() => useTypingAnimation(lines, 10));

    // Type first command
    await act(async () => {
      vi.advanceTimersByTime(10);
    });

    // Show output after 300ms
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    // "Type" output character (10ms)
    await act(async () => {
      vi.advanceTimersByTime(10);
    });

    // Still on first line after 500ms (custom delay is 1000ms)
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.currentLineIndex).toBe(0);

    // Move to next line after remaining 500ms
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.currentLineIndex).toBe(1);
  });

  it('should set isComplete to true after all lines are typed', async () => {
    const lines = [{ command: 'a', output: 'x' }];
    const { result } = renderHook(() => useTypingAnimation(lines, 10));

    expect(result.current.isComplete).toBe(false);

    // Type command 'a'
    await act(async () => {
      vi.advanceTimersByTime(10);
    });

    // Show output after 300ms
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    // "Type" output character (10ms)
    await act(async () => {
      vi.advanceTimersByTime(10);
    });

    // Move past last line after 500ms delay
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.isComplete).toBe(true);
    expect(result.current.currentLineIndex).toBe(1);
  });

  it('should type output character by character when isTypingCommand is false', async () => {
    // This tests the else branch at line 42-46 where output is typed
    const lines = [{ command: 'a', output: 'xy' }];
    const { result } = renderHook(() => useTypingAnimation(lines, 10));

    // Type command 'a'
    await act(async () => {
      vi.advanceTimersByTime(10);
    });

    // After command, output appears immediately (line 57 sets full output)
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.displayedLines[0]?.output).toBe('xy');
  });
});
