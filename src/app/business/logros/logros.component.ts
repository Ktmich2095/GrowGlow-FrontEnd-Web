import { Component } from '@angular/core';
import { RachaService } from '../../core/services/racha.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logros',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './logros.component.html',
  styleUrl: './logros.component.css'
})
export class LogrosComponent {
  rachaActual: number = 0;
  historial: { fecha: string, duracion: number, logro: string }[] = [];
  sensores = {
    humedad: 50,
    temperatura: 22,
    fertilizante: 1.5
  };

  private intervalId: any;

  constructor(private rachaService: RachaService) {}

  ngOnInit() {
    this.rachaActual = this.rachaService.obtenerRacha();
    this.historial = this.rachaService.obtenerHistorial();

    // Actualizar la racha automáticamente cada 10 segundos
    this.intervalId = setInterval(() => {
      this.rachaService.actualizarRacha(this.sensores);
      this.rachaActual = this.rachaService.obtenerRacha();
      this.historial = this.rachaService.obtenerHistorial();
    }, 10000); // Se ejecuta cada 10 segundos
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  verificarSensores() {
    this.rachaService.actualizarRacha(this.sensores);
    this.rachaActual = this.rachaService.obtenerRacha();
    this.historial = this.rachaService.obtenerHistorial();
  }
}
