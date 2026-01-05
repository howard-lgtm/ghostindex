export const theme = {
  brand: {
    name: 'GhostIndex',
  },
  colors: {
    primary: {
      DEFAULT: '#020617', // slate-950
      foreground: '#f8fafc',
    },
    action: {
      DEFAULT: '#4f46e5', // indigo-600
      hover: '#4338ca', // indigo-700
      foreground: '#ffffff',
    },
    warning: {
      DEFAULT: '#f59e0b', // amber-500
      hover: '#d97706', // amber-600
      foreground: '#ffffff',
    },
  },
} as const;

export type Theme = typeof theme;
