import { Component,OnInit,OnDestroy } from '@angular/core';
import { SocketService } from '../../core/services/socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export default class DashboardComponent {
  sensorData = {
    luz: { valor: 0, unidad: '%', estado: 'Óptima' },
    temperatura: { valor: 0, unidad: '°C', estado: 'Normal' },
    humedad: { valor: 0, unidad: '%', estado: 'Buena' },
    ph: { valor: 0, unidad: '', estado: 'Neutral' }
  };

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.socketService.onSensorData((data: any) => {
    
      this.processSensorData(data);
    });
  }

  processSensorData(data: any[]) {
    data.forEach(sensor => {
      switch(sensor.nombre) {
        case 'Luz':
          this.sensorData.luz.valor = sensor.valor;
          this.sensorData.luz.estado = this.getLightStatus(sensor.valor);
          break;
        case 'Temperatura':
          this.sensorData.temperatura.valor = sensor.valor;
          this.sensorData.temperatura.estado = `${sensor.valor}°C`;
          break;
        case 'Humedad Aire':
          this.sensorData.humedad.valor = sensor.valor;
          break;
        // Añade más casos según tus sensores
      }
    });
  }

  getLightStatus(value: number): string {
    if (value < 30) return 'Baja';
    if (value < 70) return 'Óptima';
    return 'Alta';
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }
}
