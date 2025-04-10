import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class RachaService {
  private historialPorUsuario: { [userId: string]: {
    racha: number;
    historialRachas: { fecha: string, duracion: number, logro: string }[];
  } } = {};
  public socket!: Socket

  constructor(private authService: AuthService,) {
    this.inicializarSocket();
  }

  private inicializarSocket() {
    // Simular conexión al servidor de sockets
    this.socket = {
      on: (event: string, callback: (data: string) => void) => {
        if (event === 'actualizarSensores') {
          setInterval(() => {
            const datosJson = JSON.stringify([
              { nombre: 'temperatura_suelo', valor: Math.random() > 0.5 ? 22 : 30, unidad: '°C' },
              { nombre: 'temperatura_aire', valor: 25, unidad: '°C' },
              { nombre: 'humedad_aire', valor: 60, unidad: '%' },
              { nombre: 'luz', valor: 300, unidad: 'lux' }
            ]);
            callback(datosJson);
            const sensores = this.procesarDatosJson(datosJson);
            this.actualizarRacha(sensores);
          }, 5000);
        }
      },
      off: (event: string) => {
        console.log(`Socket event '${event}' desconectado.`);
      }
    } as any;
  }

  private getUsuarioActualId(): string | null {
    return this.authService.getUsuarioId();
  }

  obtenerRacha(): number {
    const userId = this.getUsuarioActualId();
    if (!userId) return 0;
    return this.historialPorUsuario[userId]?.racha || 0;
  }

  obtenerHistorial(): { fecha: string, duracion: number, logro: string }[] {
    const userId = this.getUsuarioActualId();
    if (!userId) return [];
    return this.historialPorUsuario[userId]?.historialRachas || [];
  }

  private procesarDatosJson(datosJson: string): { [key: string]: number } {
    const sensores = JSON.parse(datosJson);
    const valores: { [key: string]: number } = {};
    sensores.forEach((sensor: { nombre: string; valor: number }) => {
      valores[sensor.nombre] = sensor.valor;
    });
    return valores;
  }

  private actualizarRacha(sensores: { [key: string]: number }) {
    const userId = this.getUsuarioActualId();
    if (!userId) return;

    // Inicializar datos del usuario si no existen
    if (!this.historialPorUsuario[userId]) {
      this.historialPorUsuario[userId] = {
        racha: 0,
        historialRachas: []
      };
    }

    const usuarioData = this.historialPorUsuario[userId];
    
    if (this.condicionesOptimas(sensores)) {
      usuarioData.racha++;
      // Podrías llamar aquí a tu backend para guardar el progreso
      // this.authService.actualizarActividad(userId).subscribe();
    } else {
      if (usuarioData.racha > 0) {
        usuarioData.historialRachas.unshift({
          fecha: new Date().toISOString().split('T')[0],
          duracion: usuarioData.racha,
          logro: this.definirLogro(usuarioData.racha)
        });
        
        if (usuarioData.historialRachas.length > 5) {
          usuarioData.historialRachas.pop();
        }
      }
      usuarioData.racha = 0;
    }
  }

  private condicionesOptimas(sensores: { [key: string]: number }): boolean {
    return (
      sensores['temperatura_suelo'] >= 18 && sensores['temperatura_suelo'] <= 25 &&
      sensores['temperatura_aire'] >= 20 && sensores['temperatura_aire'] <= 28 &&
      sensores['humedad_aire'] >= 40 && sensores['humedad_aire'] <= 70 &&
      sensores['luz'] >= 200 && sensores['luz'] <= 500
    );
  }

  private definirLogro(duracion: number): string {
    if (duracion >= 7) return 'Consiguió el máximo de riego diario.';
    if (duracion >= 5) return 'Regó con precisión durante la semana.';
    return 'Mantuvo su planta estable por varios días.';
  }
}