import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class RachaService {
  private racha: number = 0;
  private historialRachas: { fecha: string, duracion: number, logro: string }[] = [];
  public socket: Socket;

  constructor() {
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
            console.log('Sensores actualizados:', sensores);
          }, 5000); // Cada 5 segundos
        }
      },
      off: (event: string) => {
        console.log(`Socket event '${event}' desconectado.`);
      }
    } as any; // Simulación de socket
  }

  obtenerRacha(): number {
    return this.racha;
  }

  obtenerHistorial(): { fecha: string, duracion: number, logro: string }[] {
    return this.historialRachas;
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
    if (
      sensores['temperatura_suelo'] >= 18 && sensores['temperatura_suelo'] <= 25 &&
      sensores['temperatura_aire'] >= 20 && sensores['temperatura_aire'] <= 28 &&
      sensores['humedad_aire'] >= 40 && sensores['humedad_aire'] <= 70 &&
      sensores['luz'] >= 200 && sensores['luz'] <= 500
    ) {
      this.racha++;
    } else {
      // Guardar la racha en el historial antes de reiniciarla
      if (this.racha > 0) {
        this.historialRachas.unshift({ // Usamos unshift para agregar al inicio
          fecha: new Date().toISOString().split('T')[0], // Fecha actual
          duracion: this.racha,
          logro: this.definirLogro(this.racha)
        });
        
        // Limitar el historial a 5 elementos
        if (this.historialRachas.length > 5) {
          this.historialRachas.pop(); // Elimina el elemento más antiguo
        }
      }
      this.racha = 0;
    }
  }

  private definirLogro(duracion: number): string {
    if (duracion >= 7) return 'Consiguió el máximo de riego diario.';
    if (duracion >= 5) return 'Regó con precisión durante la semana.';
    return 'Mantuvo su planta estable por varios días.';
  }
}
