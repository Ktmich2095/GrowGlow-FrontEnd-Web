import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  isLoading: boolean = false; // Nuevo: para controlar el estado de carga

  constructor(
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone // Inyecta NgZone
  ) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true; 
    const newUser = { 
      nombre: this.name, 
      email: this.email, 
      password: this.password 
    };

    this.http.post<any>('http://localhost:5000/api/usuarios/register', newUser)
      .subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          if (response?.usuario) {
            this.authService.setToken(response.token);
            this.authService.setCurrentUser(response.usuario.nombre);
            
            this.ngZone.run(() => {
              alert('¡Registro exitoso! Serás redirigido al Dashboard.');
              
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 200);
            });
          } else {
            this.errorMessage = 'Respuesta inesperada del servidor';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error en registro:', error);
          this.errorMessage = error.error?.message || 'Error al registrarse. Intente nuevamente.';
          this.isLoading = false;
        }
      });
  }
}