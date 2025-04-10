import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io("http://localhost:5000/api/sensores", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }

  listen<T>(eventName: string): Observable<T> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: T) => {
        subscriber.next(data);
      });

      this.socket.on('error', (err: any) => {
        subscriber.error(err);
      });

      this.socket.on('disconnect', () => {
        console.warn('WebSocket desconectado');
      });

      return () => {
        this.socket.off(eventName);
      };
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}