import type { LabState, LabAction, LabItem } from '../types';

export const initialLabItems: LabItem[] = [
  {
    id: 'HK-101',
    title: 'Validar ciclo de vida y doble invocación en StrictMode',
    complexity: 'O(1)',
    priority: 'Alta',
    completed: true,
    score: 95,
    createdAt: '14/10/2026, 10:15',
  },
  {
    id: 'HK-102',
    title: 'Refactorizar Fetch con AbortController y async/await',
    complexity: 'O(n)',
    priority: 'Crítica',
    completed: true,
    score: 100,
    createdAt: '14/10/2026, 10:45',
  },
  {
    id: 'HK-103',
    title: 'Separar ThemeContext y NotificationContext por dominio',
    complexity: 'O(1)',
    priority: 'Media',
    completed: false,
    score: 88,
    createdAt: '14/10/2026, 11:20',
  },
  {
    id: 'HK-104',
    title: 'Memorizar cómputo analítico con useMemo y callbacks',
    complexity: 'O(n^2)',
    priority: 'Alta',
    completed: false,
    score: 92,
    createdAt: '14/10/2026, 11:50',
  },
  {
    id: 'HK-105',
    title: 'Encapsular useFetch y useLocalStorage en Custom Hooks',
    complexity: 'O(n)',
    priority: 'Baja',
    completed: true,
    score: 85,
    createdAt: '14/10/2026, 12:10',
  },
];

export const initialLabState: LabState = {
  items: initialLabItems,
  filterPriority: 'Todas',
  historyCount: initialLabItems.length,
  lastAction: 'INITIAL_LOAD',
};

// IA: Lógica dispersa con múltiples useStates acoplados que causan inconsistencias de estado
// Solución manual: Refactorizar hacia useReducer con acciones tipadas, transiciones inmutables y trazabilidad

export function labReducer(state: LabState, action: LabAction): LabState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem: LabItem = {
        id: `HK-${Math.floor(100 + Math.random() * 900)}`,
        title: action.payload.title,
        complexity: action.payload.complexity,
        priority: action.payload.priority,
        score: action.payload.score,
        completed: false,
        createdAt: new Date().toLocaleTimeString(),
      };
      return {
        ...state,
        items: [newItem, ...state.items],
        historyCount: state.historyCount + 1,
        lastAction: `ADD_ITEM (${newItem.id})`,
      };
    }

    case 'TOGGLE_ITEM': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, completed: !item.completed } : item
        ),
        lastAction: `TOGGLE_ITEM (${action.payload.id})`,
      };
    }

    case 'DELETE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
        lastAction: `DELETE_ITEM (${action.payload.id})`,
      };
    }

    case 'SET_FILTER_PRIORITY': {
      return {
        ...state,
        filterPriority: action.payload,
        lastAction: `FILTER_CHANGE (${action.payload})`,
      };
    }

    case 'CLEAR_COMPLETED': {
      return {
        ...state,
        items: state.items.filter((item) => !item.completed),
        lastAction: 'CLEAR_COMPLETED',
      };
    }

    case 'RESET_STATE': {
      return {
        ...initialLabState,
        lastAction: 'RESET_STATE',
      };
    }

    case 'BULK_SEED': {
      return {
        ...state,
        items: [...action.payload, ...state.items],
        historyCount: state.historyCount + action.payload.length,
        lastAction: `BULK_SEED (+${action.payload.length} items)`,
      };
    }

    default:
      return state;
  }
}
