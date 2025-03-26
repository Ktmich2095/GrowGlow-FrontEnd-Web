import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  register() {
  const newUser = { nombre: this.name, email: this.email, password: this.password };

  this.http.post<any>('http://localhost:5000/api/usuarios/register', newUser)
    .subscribe(response => {
      if (this.password === this.confirmPassword) {
        console.log('Usuario registrado:', response);
        // Asegúrate de que el nombre se guarde en localStorage
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userName', response.user.nombre); // Guardar el nombre
        }
        window.alert('¡Registro exitoso! Serás redirigido al login.');
        this.router.navigate(['/login']);
      } else {
        console.log("Las contraseñas no coinciden");
      }
    }, error => {
      console.error('Error al registrar usuario:', error);
      window.alert('Hubo un error al registrarte. Por favor, inténtalo nuevamente.');
    });
}

  
}
