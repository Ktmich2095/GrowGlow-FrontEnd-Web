// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private apiUrl = 'http://192.168.3.10:5000'; // ⚠️ Reemplaza con tu IP

  constructor() {
    this.socket = io(this.apiUrl);
  }

  onSensorData(callback: (data: any) => void) {
    this.socket.on('sensorData', callback);
  }
  // Desconectar
  disconnect() {
    this.socket.disconnect();
  }
}