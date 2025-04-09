import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    // Conexión con el servidor WebSocket
    this.socket = io("http://localhost:5000/api/sensores", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }

  // Método para escuchar eventos de WebSocket
  listen<T>(eventName: string): Observable<T> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: T) => {
        subscriber.next(data);
      });

      // Manejo de errores
      this.socket.on('error', (err: any) => {
        subscriber.error(err);
      });

      // Manejo de desconexión
      this.socket.on('disconnect', () => {
        console.warn('WebSocket desconectado');
      });

      // Eliminar el listener del evento al completar el Observable
      return () => {
        this.socket.off(eventName);
      };
    });
  }

  // Método para desconectar el socket manualmente
  disconnect(): void {
    this.socket.disconnect();
  }
}