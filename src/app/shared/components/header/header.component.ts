import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RachaService } from '../../../core/services/racha.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  notificationsVisible: boolean = false;
  notifications: string[] = [];
  sensorData: { [key: string]: number } = {};
  careTips: string[] = [
    'Recuerda regar tus orquídea regularmente.',
    'Asegúrate de que tus orquídea reciba suficiente luz solar.',
    'Verifica que la humedad del suelo sea adecuada.',
    'No olvides fertilizar tus plantas una vez al mes.',
    'Limpia las hojas de tus plantas para que puedan respirar mejor.'
  ];

  private sensorSubscription: any;

  constructor(private router: Router, private rachaService: RachaService) {}

  ngOnInit(): void {
    // Se suscribe a los datos de los sensores en tiempo real
    this.sensorSubscription = this.rachaService.getDatosSensores$().subscribe((sensores) => {
      console.log('Datos de sensores recibidooooos:', sensores); // Log para verificar los datos
      this.sensorData = sensores as { [key: string]: number };

      // Verifica condiciones fuera de rango y agrega notificaciones
      for (let [key, value] of Object.entries(this.sensorData)) {
        if (key === 'temperatura' && (value < 20 || value > 28)) {
          this.addNotification(`El sensor de temperatura está fuera de rango: ${value}°C`);
        } else if (key === 'humedadaire' && (value < 50 || value > 70)) {
          this.addNotification(`El sensor de humedad del aire está fuera de rango: ${value}%`);
        } else if (key === 'humedadsuelo' && (value < 40 || value > 60)) {
          this.addNotification(`El sensor de humedad del suelo está fuera de rango: ${value}%`);
        } else if (key === 'luz' && (value < 500 || value > 2000)) {
          this.addNotification(`El sensor de luz está fuera de rango: ${value} lux`);
        }
      }
    });

    // Genera recordatorios de cuidado cada 30 segundos
    setInterval(() => {
      const randomTip = this.careTips[Math.floor(Math.random() * this.careTips.length)];
      this.addNotification(randomTip);
    }, 30000 * 60); // Cada 30 segundos
  }

  ngOnDestroy(): void {
    // Se desuscribe al salir del componente para evitar fugas de memoria
    if (this.sensorSubscription) {
      this.sensorSubscription.unsubscribe();
    }
  }

  toggleNotifications(): void {
    this.notificationsVisible = !this.notificationsVisible;
  }

  dismissNotifications(): void {
    this.notificationsVisible = false;
  }

  addNotification(message: string): void {
    this.notifications.push(message);
    if (this.notifications.length > 5) {
      this.notifications.shift(); // Mantén un máximo de 10 notificaciones
    }
  }

  logout(): void {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}
