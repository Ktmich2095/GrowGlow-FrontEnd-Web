import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api/usuarios';
  private readonly tokenKey = 'auth_token'; // Clave consistente
  private readonly userNameKey = 'userName';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Método para registro que puede ser usado desde el servicio
  register(userData: any): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/register`, userData).pipe(
      catchError(error => throwError(error))
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/login`, { email, password }).pipe(
      tap(response => {
        if (response?.token && response?.usuario) {
          this.setAuthData(response.token, response.usuario.nombre);
        }
      }),
      catchError(error => throwError(error))
    );
  }

  setAuthData(token: string, userName: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userNameKey, userName);
    }
  }

  setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  setCurrentUser(userName: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.userNameKey, userName);
    }
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.tokenKey) : null;
  }
  getUsuarioId(): string | null {
    if (!this.isBrowser) return null;
    
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || null; // Asume que el payload del token incluye el ID del usuario como 'id'
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }

  getUserName(): string | null {
    return this.isBrowser ? localStorage.getItem(this.userNameKey) : null;
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) return false;
    
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (e) {
      return false;
    }
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userNameKey);
      this.router.navigate(['/login']);
    }
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
  getRachaByUsuario(usuarioId: string) {
    return this.httpClient.get(`${this.API_URL}/${usuarioId}/racha`);
  }

  actualizarActividad(usuarioId: string) {
    return this.httpClient.put(`${this.API_URL}/${usuarioId}/racha`, {});
  }
}
