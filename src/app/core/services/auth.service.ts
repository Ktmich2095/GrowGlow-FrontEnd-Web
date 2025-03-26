import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api/usuarios';
  private readonly userKey = 'currentUser';
  private readonly tokenKey = 'authToken';
  private readonly userNameKey = 'userName'; // Nueva clave para el nombre
  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          localStorage.setItem('userName', response.user.nombre); // Guardar nombre al hacer login
        } else {
          console.warn('No se recibió token en la respuesta.');
        }
      })
    );
  }
  

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user)); // Guardamos la info del usuario
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem(this.tokenKey) : null;
  }
  

  getUser(): { nombre: string } | null {
    const userName = localStorage.getItem(this.userNameKey);
    return userName ? { nombre: userName } : null;  // Retorna el nombre si existe, sino null
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() < payload.exp * 1000;
    } catch (e) {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey); // Limpiar también la info del usuario
    this.router.navigate(['/login']);
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/forgot-password`, { email });
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.API_URL}/check-email`, { email });
  }

  resetPassword(email: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/reset-password`, { email, password });
  }
}
