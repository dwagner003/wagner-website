import { useEffect, useCallback, useRef } from 'react';

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

export function useKonamiCode(callback: () => void): void {
  const inputRef = useRef<string[]>([]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      inputRef.current = [...inputRef.current, event.code].slice(-KONAMI_CODE.length);

      if (inputRef.current.join(',') === KONAMI_CODE.join(',')) {
        callback();
        inputRef.current = [];
      }
    },
    [callback]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
