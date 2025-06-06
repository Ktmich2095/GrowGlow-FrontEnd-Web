import { Component, OnInit, OnDestroy } from '@angular/core';
import { RachaService } from '../../core/services/racha.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logros',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './logros.component.html',
  styleUrl: './logros.component.css'
})
export class LogrosComponent implements OnInit, OnDestroy {
  rachaActual: number = 0;
  historial: { fecha: string, duracion: number, logro: string }[] = [];

  constructor(private rachaService: RachaService) {}

  ngOnInit() {
    this.actualizarDatos();
    
    this.rachaService.socket.on('actualizarSensores', () => {
      this.actualizarDatos();
    });
  }

  private actualizarDatos() {
    this.rachaActual = this.rachaService.obtenerRacha();
    this.historial = [...this.rachaService.obtenerHistorial()];
  }

  ngOnDestroy() {
    this.rachaService.socket.off('actualizarSensores');
  }
}