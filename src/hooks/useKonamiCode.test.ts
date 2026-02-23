import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKonamiCode } from './useKonamiCode';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
];

function pressKey(code: string) {
  window.dispatchEvent(new KeyboardEvent('keydown', { code }));
}

function enterKonamiCode() {
  KONAMI_CODE.forEach(pressKey);
}

describe('useKonamiCode', () => {
  const callback = vi.fn<() => void>();

  beforeEach(() => {
    callback.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call callback when Konami code is entered', () => {
    renderHook(() => useKonamiCode(callback));

    enterKonamiCode();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not call callback for partial sequence', () => {
    renderHook(() => useKonamiCode(callback));

    // Only enter first 5 keys
    KONAMI_CODE.slice(0, 5).forEach(pressKey);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should not call callback for wrong sequence', () => {
    renderHook(() => useKonamiCode(callback));

    // Enter wrong sequence
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyA', 'KeyB'].forEach(pressKey);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should call callback again after sequence is reset', () => {
    renderHook(() => useKonamiCode(callback));

    enterKonamiCode();
    expect(callback).toHaveBeenCalledTimes(1);

    enterKonamiCode();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should detect code even with extra keys pressed before', () => {
    renderHook(() => useKonamiCode(callback));

    // Press some random keys first
    pressKey('KeyX');
    pressKey('KeyY');
    pressKey('KeyZ');

    // Then enter the Konami code
    enterKonamiCode();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useKonamiCode(callback));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('should add event listener on mount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

    renderHook(() => useKonamiCode(callback));

    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    addEventListenerSpy.mockRestore();
  });
});
