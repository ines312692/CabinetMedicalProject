import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      this.enableDarkMode();
    }
  }

  private enableDarkMode() {
    document.body.classList.add('dark');
  }

  toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark');
    console.log('Dark mode:', isDark);
  }
}
