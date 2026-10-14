import { useState, useEffect } from 'react';

// IA: Re-renders excesivos en cada pulsación de teclado en inputs de búsqueda
// Solución manual: Custom Hook useDebounce que retrasa la actualización del valor hasta estabilizar el tipeo

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
