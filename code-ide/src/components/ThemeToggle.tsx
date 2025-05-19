import { Moon, Sun } from 'lucide-react';
import styles from './ThemeToggle.module.css';
import type { Theme } from '../App'; // Assuming Theme is exported from App.tsx

interface ThemeToggleProps {
  className?: string;
  currentTheme: Theme;
  onToggleTheme: () => void;
}

export function ThemeToggle({ className, currentTheme, onToggleTheme }: ThemeToggleProps) {
  const isDark = currentTheme === 'dark';

  return (
    <div
      className={`${styles.toggleContainer} ${isDark ? styles.dark : styles.light} ${className || ''}`}
      onClick={onToggleTheme}
      role="button"
      tabIndex={0}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggleTheme(); }}
    >
      <div className={styles.iconsWrapper}>
        {/* Sun Icon (visible in dark, moves to left in light) */}
        <Sun 
          className={`${styles.icon} ${styles.sun} ${isDark ? styles.activeIcon : styles.inactiveIconDark}`}
          strokeWidth={1.5}
        />
        {/* Moon Icon (visible in light, moves to right in dark) */}
        <Moon 
          className={`${styles.icon} ${styles.moon} ${!isDark ? styles.activeIcon : styles.inactiveIconLight}`}
          strokeWidth={1.5}
        />
      </div>
      {/* The moving part / knob */}
      <div className={styles.knob}></div>
    </div>
  );
} 