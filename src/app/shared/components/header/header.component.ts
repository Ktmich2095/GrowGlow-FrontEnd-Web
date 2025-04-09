import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface SensorData {
  nombre: string;
  valor: number;
  unidad: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  notificationsVisible: boolean = false; // Controla la visibilidad de la ventana flotante
  notifications: string[] = []; // Lista de notificaciones
  sensorData: SensorData[] = []; // Datos simulados de sensores
  careTips: string[] = [ // Lista de recordatorios de cuidado
    'Recuerda regar tus orquídea regularmente.',
    'Asegúrate de que tus orquídea reciba suficiente luz solar.',
    'Verifica que la humedad del suelo sea adecuada.',
    'No olvides fertilizar tus plantas una vez al mes.',
    'Limpia las hojas de tus plantas para que puedan respirar mejor.'
  ];

  constructor(private router: Router) {
    // Simulación de datos iniciales de sensores
    this.sensorData = [
      { nombre: 'Temperatura', valor: 25, unidad: '°C' },
      { nombre: 'Humedad Aire', valor: 60, unidad: '%' },
      { nombre: 'Humedad Suelo', valor: 40, unidad: '%' },
      { nombre: 'Luz', valor: 1200, unidad: 'lux' }
    ];
  }

  ngOnInit(): void {
    // Simulación de actualizaciones en tiempo real para sensores
    setInterval(() => {
      this.sensorData.forEach(sensor => {
        sensor.valor += Math.random() * 10 - 5;

        if (sensor.nombre === 'Temperatura' && (sensor.valor < 15 || sensor.valor > 35)) {
          this.addNotification(`La ${sensor.nombre} está fuera de rango: ${sensor.valor.toFixed(1)} ${sensor.unidad}`);
        }
        if (sensor.nombre === 'Humedad Aire' && (sensor.valor < 30 || sensor.valor > 70)) {
          this.addNotification(`La ${sensor.nombre} está fuera de rango: ${sensor.valor.toFixed(1)} ${sensor.unidad}`);
        }
        if (sensor.nombre === 'Humedad Suelo' && (sensor.valor < 20 || sensor.valor > 60)) {
          this.addNotification(`La ${sensor.nombre} está fuera de rango: ${sensor.valor.toFixed(1)} ${sensor.unidad}`);
        }
        if (sensor.nombre === 'Luz' && (sensor.valor < 500 || sensor.valor > 2000)) {
          this.addNotification(`El nivel de ${sensor.nombre} está fuera de rango: ${sensor.valor.toFixed(1)} ${sensor.unidad}`);
        }
      });
    }, 5000); // Actualiza cada 5 segundos

    // Genera recordatorios de cuidado cada 30 segundos
    setInterval(() => {
      const randomTip = this.careTips[Math.floor(Math.random() * this.careTips.length)];
      this.addNotification(randomTip);
    }, 30000); // Cada 30 segundos
  }

  toggleNotifications(): void {
    this.notificationsVisible = !this.notificationsVisible; // Alterna la visibilidad
  }

  dismissNotifications(): void {
    this.notificationsVisible = false; // Oculta la ventana flotante
  }

  addNotification(message: string): void {
    this.notifications.push(message);
    if (this.notifications.length > 10) {
      this.notifications.shift(); // Mantén un máximo de 10 notificaciones
    }
  }

  logout(): void {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}
