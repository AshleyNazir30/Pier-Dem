import { describe, it, expect, beforeEach, vi } from 'vitest';
import { themeStore } from '../../stores/themeStore';

describe('ThemeStore', () => {
  beforeEach(() => {
    themeStore.theme = 'light';
    document.documentElement.classList.remove('dark');
    vi.clearAllMocks();
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      themeStore.theme = 'light';
      themeStore.toggleTheme();
      expect(themeStore.theme).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      themeStore.theme = 'dark';
      themeStore.toggleTheme();
      expect(themeStore.theme).toBe('light');
    });

    it('should add dark class to document when switching to dark', () => {
      themeStore.theme = 'light';
      themeStore.toggleTheme();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove dark class from document when switching to light', () => {
      themeStore.theme = 'dark';
      document.documentElement.classList.add('dark');
      themeStore.toggleTheme();
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('setTheme', () => {
    it('should set theme to dark', () => {
      themeStore.setTheme('dark');
      expect(themeStore.theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should set theme to light', () => {
      themeStore.theme = 'dark';
      document.documentElement.classList.add('dark');
      themeStore.setTheme('light');
      expect(themeStore.theme).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('isDark', () => {
    it('should return true when theme is dark', () => {
      themeStore.theme = 'dark';
      expect(themeStore.isDark).toBe(true);
    });

    it('should return false when theme is light', () => {
      themeStore.theme = 'light';
      expect(themeStore.isDark).toBe(false);
    });
  });
});
