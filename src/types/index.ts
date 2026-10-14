export type ThemeMode = 'dark' | 'light';

export interface ProfilerRecord {
  id: string;
  phase: 'mount' | 'update' | 'nested-update';
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

export interface ProductItem {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
}

export interface LabItem {
  id: string;
  title: string;
  complexity: 'O(1)' | 'O(n)' | 'O(n^2)';
  priority: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  completed: boolean;
  score: number;
  createdAt: string;
}

export type LabAction =
  | { type: 'ADD_ITEM'; payload: Omit<LabItem, 'id' | 'createdAt' | 'completed'> }
  | { type: 'TOGGLE_ITEM'; payload: { id: string } }
  | { type: 'DELETE_ITEM'; payload: { id: string } }
  | { type: 'SET_FILTER_PRIORITY'; payload: string }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'RESET_STATE' }
  | { type: 'BULK_SEED'; payload: LabItem[] };

export interface LabState {
  items: LabItem[];
  filterPriority: string;
  historyCount: number;
  lastAction: string;
}
