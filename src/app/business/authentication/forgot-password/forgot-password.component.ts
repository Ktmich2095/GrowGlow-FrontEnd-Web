import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  isLoading: boolean = false;
  message: string = '';
  isError: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  submitRequest(): void {
    if (!this.email) {
      this.showMessage('Por favor ingresa tu correo electrónico', true);
      return;
    }
  
    this.isLoading = true;
    this.message = '';
    this.isError = false;
  
    this.authService.requestPasswordReset(this.email).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage(response.message);
        } else {
          this.showMessage(response.message, true);
        }
      },
      error: (error) => {
        this.showMessage('No existe una cuenta vinculada con el correo proporcionado', true);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private showMessage(msg: string, isError: boolean = false): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }
}