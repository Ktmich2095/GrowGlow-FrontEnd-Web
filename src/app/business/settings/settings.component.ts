import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settings = {
    email: 'usuario@email.com',
    newPassword: '',
    notifications: true,
    newsletter: false,
    theme: 'light'
  };
  
  showPassword = false;
  passwordError = '';
  saving = false;
  showSuccess = false;

  ngOnInit() {
    // Cargar configuración guardada al iniciar
    this.loadSettings();
  }

  // Cargar configuración desde localStorage
  loadSettings() {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        this.settings = { ...this.settings, ...parsedSettings };
        
        // Aplicar tema guardado
        this.applyTheme(this.settings.theme);
      } catch (e) {
        console.error('Error al cargar configuración:', e);
      }
    }
  }

  // Alternar visibilidad de contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Validar contraseña
  validatePassword(): boolean {
    if (this.settings.newPassword && this.settings.newPassword.length < 6) {
      this.passwordError = 'La contraseña debe tener al menos 6 caracteres';
      return false;
    }
    this.passwordError = '';
    return true;
  }

  // Guardar los cambios de configuración
  async saveChanges() {
    if (!this.validatePassword()) return;
    
    this.saving = true;
    
    try {
      // Simular llamada a API (reemplazar con tu lógica real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Guardar en localStorage
      localStorage.setItem('userSettings', JSON.stringify({
        email: this.settings.email,
        notifications: this.settings.notifications,
        newsletter: this.settings.newsletter,
        theme: this.settings.theme
      }));
      
      // Mostrar feedback
      this.showSuccess = true;
      setTimeout(() => this.showSuccess = false, 3000);
      
      // Limpiar contraseña después de guardar
      if (this.settings.newPassword) {
        this.settings.newPassword = '';
      }
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      alert('Error al guardar la configuración');
    } finally {
      this.saving = false;
    }
  }

  // Cambiar el tema de la aplicación
  changeTheme(theme: string) {
    this.settings.theme = theme;
    this.applyTheme(theme);
    
    // Guardar preferencia (sin esperar a guardar cambios)
    const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    currentSettings.theme = theme;
    localStorage.setItem('userSettings', JSON.stringify(currentSettings));
  }

  // Aplicar tema al documento
  private applyTheme(theme: string) {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    
    // Actualizar meta tag para theme-color
    const themeColor = theme === 'dark' ? '#1F2937' : '#FFFFFF';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
  }
}