import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  darkMode = signal(false);

  constructor() {
    this.initTheme();
  }

  toggleDarkMode() {
    const newValue = !this.darkMode();
    this.darkMode.set(newValue);
    document.body.classList.toggle('dark', newValue);
    localStorage.setItem('darkMode', JSON.stringify(newValue));
  }

  initTheme() {
    const saved = localStorage.getItem('darkMode');
    const isDark =
      saved !== null
        ? JSON.parse(saved)
        : window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.darkMode.set(isDark);
    document.body.classList.toggle('dark', isDark);
  }
}
