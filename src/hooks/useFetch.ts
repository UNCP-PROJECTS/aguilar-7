import { useState, useEffect, useCallback, useRef } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  durationMs: number | null;
}

// IA: Dependencias omitidas y memory leaks por peticiones en vuelo al desmontar el componente
// Solución manual: Implementar AbortController en useEffect con función de limpieza y validación de 'AbortError'

export function useFetch<T>(url: string, immediate: boolean = true) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: immediate,
    error: null,
    durationMs: null,
  });

  const [trigger, setTrigger] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(() => {
    setTrigger((prev) => prev + 1);
  }, []);

  const abortCurrent = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  useEffect(() => {
    if (!immediate && trigger === 0) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const startTime = performance.now();

    setState((prev) => ({ ...prev, loading: true, error: null }));

    async function executeFetch() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
        const json = await response.json();
        const duration = Math.round(performance.now() - startTime);

        setState({
          data: json,
          loading: false,
          error: null,
          durationMs: duration,
        });
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // Petición cancelada intencionalmente o por desmontaje; no registrar error de red
          setState((prev) => ({
            ...prev,
            loading: false,
            error: 'Petición abortada de manera segura por AbortController (Clean up).',
          }));
          return;
        }

        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al consultar la API';
        setState({
          data: null,
          loading: false,
          error: errorMessage,
          durationMs: Math.round(performance.now() - startTime),
        });
      }
    }

    executeFetch();

    // Función de limpieza obligatoria para prevenir fugas de memoria
    return () => {
      controller.abort();
    };
  }, [url, trigger, immediate]);

  return {
    ...state,
    refetch,
    abortCurrent,
  };
}
