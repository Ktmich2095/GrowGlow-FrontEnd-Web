import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {
  email : string = ''
  password : string = ''
  constructor(private authService:AuthService, private router: Router) { 
  }
  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response && response.token) {
          console.log('Autenticación exitosa:', response);
          localStorage.setItem('auth_token', response.token);
          this.router.navigateByUrl('/dashboard');
        } else {
          console.error('Token no recibido');
          alert('Hubo un error al recibir el token.');
        }
      },
      error: (error) => {
        console.error('Error durante el login:', error);
        alert('Credenciales inválidas. Inténtalo nuevamente.');
      }
    }); 
}



  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToForgotPassword(event: Event): void {
    event.preventDefault(); // Esto previene la acción por defecto del formulario
    this.router.navigate(['/forgot-password']); // Redirige a la página de olvido de contraseña
  }
}
