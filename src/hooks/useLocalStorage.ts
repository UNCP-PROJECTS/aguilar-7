import { useState, useEffect } from 'react';

// IA: Sincronización desfasada entre storage de navegador y estado reactivo
// Solución manual: Custom Hook useLocalStorage con inicialización perezosa (lazy init) y captura de errores JSON

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Manejar cuota excedida o modo privado de navegador
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
