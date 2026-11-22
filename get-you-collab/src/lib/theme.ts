"use client";

export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "gyc_theme_v1";

class ThemeStore {
  private theme: Theme = "light";
  private listeners: Set<(theme: Theme) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
        if (saved === "light" || saved === "dark") {
          this.theme = saved;
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          this.theme = "dark";
        }
      } catch {
        // Fallback to light
      }
      this.applyTheme(this.theme);
    }
  }

  public getTheme(): Theme {
    return this.theme;
  }

  public setTheme(newTheme: Theme) {
    this.theme = newTheme;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch {
        // Storage disabled
      }
      this.applyTheme(newTheme);
    }
    this.notify();
  }

  public toggleTheme() {
    this.setTheme(this.theme === "light" ? "dark" : "light");
  }

  private applyTheme(theme: Theme) {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }

  public subscribe(listener: (theme: Theme) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.theme);
      } catch (err) {
        console.error("Theme listener error:", err);
      }
    });
  }
}

export const themeStore = new ThemeStore();
