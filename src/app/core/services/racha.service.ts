import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RachaService {
  private historialPorUsuario: { [userId: string]: {
    racha: number;
    historialRachas: { fecha: string, duracion: number, logro: string }[];
  } } = {};
  public socket!: Socket
  private readonly API_URL = 'http://localhost:5000';

  constructor(private authService: AuthService,) {
    this.inicializarSocket();
  }
  private formatearDatos(datosAgrupados: any[]): { [key: string]: number } {
    const datos: { [key: string]: number } = {};
    datosAgrupados.forEach(sensor => {
        const clave = this.mapearNombreSensor(sensor._id); // Convierte "Temperatura" → "temperatura_suelo"
        datos[clave] = sensor.valor;
    });
    return datos;
}

private mapearNombreSensor(nombreOriginal: string): string {
  const mapeo: { [key: string]: string } = {
    'Humedad Suelo': 'humedadsuelo',
    'Humedad Aire': 'humedadaire',
    'Temperatura': 'temperatura',
    'Luz': 'luz'
  };
  return mapeo[nombreOriginal] || nombreOriginal.toLowerCase();
}

  private inicializarSocket() {
    try {
      this.socket = io(this.API_URL, {
        auth: {
          token: this.authService.getToken() // Opcional: envía el token JWT
        },
        transports: ['websocket'], // Fuerza WebSocket (mejor para producción)
        reconnection: true, // Reconexión automática
        reconnectionAttempts: 5, // Intentos de reconexión
        reconnectionDelay: 1000 // Retardo entre intentos (ms)
      });

      // Eventos de conexión/error
      this.socket.on('connect', () => {
        console.log('Conectado al servidor de sockets');
      });

      this.socket.on('connect_error', (err) => {
        console.error('Error de conexión:', err.message);
      });

      // Escucha eventos del servidor
      this.socket.on('actualizarSensores', (datosJson: string) => {
        const sensores = this.procesarDatosJson(datosJson);
        this.actualizarRacha(sensores);
      });

    } catch (err) {
      console.error('Error al inicializar socket:', err);
      // Puedes inicializar un mock aquí si falla la conexión real
      this.inicializarSocketMock();
    }
  }
  private inicializarSocketMock() {
    this.socket = {
      on: (event: string, callback: (data: string) => void) => {
        if (event === 'actualizarSensores') {
          setInterval(() => {
            const mockData = JSON.stringify([
              { nombre: 'Humedad Suelo', valor: 60, unidad: '%' },
              { nombre: 'Humedad Aire', valor: 50, unidad: '%' },
              { nombre: 'Temperatura Suelo', valor: 22, unidad: '°C' },
              { nombre: 'Temperatura Aire', valor: 25, unidad: '°C' },
              { nombre: 'Luz', valor: 300, unidad: 'lux' }
            ]);
            callback(mockData);
          }, 5000);
        }
      },
      off: (event: string) => console.log(`Socket mock desconectado: ${event}`),
      disconnect: () => {}
    } as Socket;
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
      const clave = this.mapearNombreSensor(sensor.nombre);
      valores[clave] = sensor.valor;
    });
    console.log('Datos procesados:', valores); // Log para verificar los datos procesados
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
      sensores['humedadsuelo'] >= 18 && sensores['humedadsuelo'] <= 25 &&
      sensores['temperatura'] >= 20 && sensores['temperatura'] <= 28 &&
      sensores['humedadaire'] >= 40 && sensores['humedadaire'] <= 70 &&
      sensores['luz'] >= 200 && sensores['luz'] <= 500
    );
  }

  private definirLogro(duracion: number): string {
    if (duracion >= 7) return 'Consiguió el máximo de riego diario.';
    if (duracion >= 5) return 'Regó con precisión durante la semana.';
    return 'Mantuvo su planta estable por varios días.';
  }
  public getDatosSensores$(): Observable<{ [key: string]: number }> {
    return new Observable(observer => {
      this.socket.on('actualizarSensores', (datosJson: string) => {
        const sensores = this.procesarDatosJson(datosJson);
        observer.next(sensores);
      });
    });
  }
  
}