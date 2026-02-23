import { makeAutoObservable } from "mobx";

type Theme = "light" | "dark";

class ThemeStore {
  theme: Theme = "light";

  constructor() {
    makeAutoObservable(this);
    this.loadTheme();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    
    if (savedTheme) {
      this.theme = savedTheme;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      this.theme = "dark";
    }
    
    this.applyTheme();
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", this.theme);
    this.applyTheme();
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    localStorage.setItem("theme", theme);
    this.applyTheme();
  }

  private applyTheme() {
    if (this.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  get isDark(): boolean {
    return this.theme === "dark";
  }
}

export const themeStore = new ThemeStore();
