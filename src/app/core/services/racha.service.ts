import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class RachaService {
  private racha: number = 0;
  private historialRachas: { fecha: string, duracion: number, logro: string }[] = [];

  constructor() {}

  obtenerRacha(): number {
    return this.racha;
  }

  obtenerHistorial(): { fecha: string, duracion: number, logro: string }[] {
    return this.historialRachas;
  }

  actualizarRacha(sensores: { humedad: number, temperatura: number, fertilizante: number }) {
    if (
      sensores.humedad >= 40 && sensores.humedad <= 70 &&
      sensores.temperatura >= 18 && sensores.temperatura <= 25 &&
      sensores.fertilizante >= 1 && sensores.fertilizante <= 2
    ) {
      this.racha++;
    } else {
      // Guardar la racha en el historial antes de reiniciarla
      if (this.racha > 0) {
        this.historialRachas.push({
          fecha: new Date().toISOString().split('T')[0], // Guardar solo la fecha
          duracion: this.racha,
          logro: this.definirLogro(this.racha)
        });
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
