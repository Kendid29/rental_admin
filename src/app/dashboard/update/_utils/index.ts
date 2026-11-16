export type ChipColorType =
  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

export const getActionColor = (action?: string): ChipColorType => {
  switch (action?.toLowerCase()) {
    case 'created':
    case 'create':
      return 'success';
    case 'updated':
    case 'update':
      return 'info';
    case 'deleted':
    case 'delete':
      return 'error';
    case 'restored':
    case 'restore':
      return 'warning';
    default:
      return 'default';
  }
};

export const getMethodColor = (method?: string): ChipColorType => {
  switch (method?.toUpperCase()) {
    case 'POST':
      return 'success';
    case 'PUT':
    case 'PATCH':
      return 'warning';
    case 'DELETE':
      return 'error';
    case 'GET':
      return 'info';
    default:
      return 'default';
  }
};

export const getMethodBadgeClass = (method?: string): string => {
  switch (method?.toUpperCase()) {
    case 'GET':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'POST':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'PUT':
    case 'PATCH':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'DELETE':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    default:
      return 'bg-stone-100 text-stone-700 border-stone-200';
  }
};

export const ACTION_OPTIONS = [
  { label: 'All Actions', value: '' },
  { label: 'Created', value: 'created' },
  { label: 'Updated', value: 'updated' },
  { label: 'Deleted', value: 'deleted' },
  { label: 'Restored', value: 'restored' },
];
