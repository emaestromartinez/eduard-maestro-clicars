import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  darkMode = signal(false);

  constructor() {
    this.initTheme();

    effect(() => {
      if (this.darkMode()) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    });
  }

  toggleDarkMode() {
    this.darkMode.set(!this.darkMode());
    sessionStorage.setItem('darkMode', JSON.stringify(this.darkMode()));
  }

  initTheme() {
    const saved = sessionStorage.getItem('darkMode');
    const isDark =
      saved !== null
        ? JSON.parse(saved)
        : window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.darkMode.set(isDark);
  }
}
