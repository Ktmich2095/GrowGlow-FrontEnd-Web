import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private sensorDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(this.generateRandomSensorData());

  constructor() {
    interval(3000).subscribe(() => {
      this.sensorDataSubject.next(this.generateRandomSensorData());
    });
  }

  private generateRandomSensorData(): any {
    return {
      luz: {
        valor: Math.floor(Math.random() * 100),
        unidad: '%',
        estado: Math.random() * 100 >= 50 ? 'Óptimo' : 'Bajo',
      },
      temperatura: {
        valor: Math.floor(Math.random() * 10 + 20),
        unidad: '°C',
        estado: 'Normal',
      },
      humedadSuelo: {
        valor: Math.floor(Math.random() * 50 + 30),
        unidad: '%',
        estado: 'Adecuado',
      },
      humedadAire: {
        valor: Math.floor(Math.random() * 50 + 30),
        unidad: '%',
        estado: 'Óptimo',
      },
    };
  }

  public observeSensorData(): Observable<any> {
    return this.sensorDataSubject.asObservable();
  }
}
