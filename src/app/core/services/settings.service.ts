// settings.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<any>({
    notifications: true,
    newsletter: true,
    theme: 'light'
  });

  settings$ = this.settingsSubject.asObservable();

  constructor() {
    // Cargar configuración guardada al iniciar
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      this.settingsSubject.next(JSON.parse(savedSettings));
    }
  }

  updateSettings(newSettings: any) {
    const current = this.settingsSubject.value;
    const updated = {...current, ...newSettings};
    this.settingsSubject.next(updated);
    localStorage.setItem('appSettings', JSON.stringify(updated));
    
    // Aplicar tema inmediatamente
    if (newSettings.theme) {
      this.applyTheme(newSettings.theme);
    }
  }

  private applyTheme(theme: string) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}