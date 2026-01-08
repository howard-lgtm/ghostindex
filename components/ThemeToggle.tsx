'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (!mounted) {
    return (
      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-panel hover:bg-panel2 transition-colors"
        aria-label="Toggle theme"
      >
        <Moon className="h-4 w-4" style={{ color: 'var(--text-dim)' }} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-panel hover:bg-panel2 transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" style={{ color: 'var(--text-dim)' }} />
      ) : (
        <Moon className="h-4 w-4" style={{ color: 'var(--text-dim)' }} />
      )}
    </button>
  );
}
