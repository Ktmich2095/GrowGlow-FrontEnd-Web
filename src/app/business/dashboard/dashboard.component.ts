import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../core/services/web-socket.service';

interface SensorData {
  nombre: string;
  valor: number;
  unidad: string;
  fecha: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  private roots: { [key: string]: am5.Root } = {};
  private charts: { [key: string]: am5percent.PieChart } = {};
  private series: { [key: string]: am5percent.PieSeries } = {};
  private labels: { [key: string]: am5.Label } = {};
  private updateInterval: any;
  private animationIntervals: { [key: string]: any } = {};
  lastUpdate: Date = new Date();

  private colors: { [key: string]: am5.Color } = {
    temperatura: am5.color(0xe74c3c), // Rojo para Temperatura
    humedadaire: am5.color(0x3498db), // Azul para Humedad del Aire
    humedadsuelo: am5.color(0x2ecc71), // Verde para Humedad del Suelo
    luz: am5.color(0xf39c12) // Naranja para Luz
  };

  private units: { [key: string]: string } = {
    Temperatura: '°C',
    HumedadAire: '%',
    HumedadSuelo: '%',
    Luz: 'lux'
  };

  constructor(private http: HttpClient, private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.setupRealTimeUpdates(); // Conexión a WebSocket
  }

  ngAfterViewInit(): void {
    this.initializeCharts();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.clearIntervals();
    this.webSocketService.disconnect(); // Cierra la conexión WebSocket
    Object.values(this.roots).forEach(root => root.dispose());
  }

  private setupRealTimeUpdates(): void {
    this.webSocketService.listen<SensorData[]>('sensor-data').subscribe({
      next: (data: SensorData[]) => {
        this.processSensorData(data); // Actualiza las gráficas con los datos recibidos
      },
      error: (err) => console.error('Error en WebSocket:', err),
      complete: () => console.log('Conexión WebSocket cerrada'),
    });
  }

  private processSensorData(data: SensorData[]): void {
    this.lastUpdate = new Date();
    data.forEach(sensor => {
      this.animateToNewValue(sensor);
    });
  }

  private initializeCharts(): void {
    const sensors = ['temperatura', 'humedadaire', 'humedadsuelo', 'luz'];
    sensors.forEach(sensor => this.createProgressChart(sensor));
  }

  private loadInitialData(): void {
    const staticData: SensorData[] = [
      { nombre: "Temperatura", valor: 25, unidad: "°C", fecha: new Date().toISOString() },
      { nombre: "Humedad Aire", valor: 60, unidad: "%", fecha: new Date().toISOString() },
      { nombre: "Humedad Suelo", valor: 40, unidad: "%", fecha: new Date().toISOString() },
      { nombre: "Luz", valor: 1200, unidad: "lux", fecha: new Date().toISOString() }
    ];

    console.log('Cargando datos iniciales:', staticData);

    staticData.forEach(sensor => {
      this.updateProgressChart(sensor);
    });
  }

  private animateToNewValue(data: SensorData): void {
    const normalizedName = data.nombre.replace(/\s+/g, '').toLowerCase();
    const series = this.series[normalizedName];
    const label = this.labels[normalizedName];

    if (!series || !label) {
      console.error(`No se encontró la serie o etiqueta para: ${normalizedName}`);
      return;
    }

    let currentValue = (series.data.values[0] as { value: number })?.value || 0;
    const targetValue = Math.min(data.valor, 100); // Limita el progreso al 100%
    const duration = 2000;
    const steps = 60;
    const increment = (targetValue - currentValue) / steps;
    let step = 0;

    this.animationIntervals[normalizedName] = setInterval(() => {
      if (step >= steps) {
        clearInterval(this.animationIntervals[normalizedName]);
        return;
      }

      currentValue += increment;
      const progress = Math.round(currentValue);
      const remaining = 100 - progress;

      series.data.setAll([
        { category: "Progreso", value: progress, color: this.colors[normalizedName] }, // Color único para el progreso
        { category: "Restante", value: remaining, color: am5.color(0xe0e0e0) } // Color gris claro para la parte restante
      ]);

      label.set("text", `[bold]${progress}%[/]`);
      step++;
    }, duration / steps);
  }

  private updateProgressChart(data: SensorData): void {
    const normalizedName = data.nombre.replace(/\s+/g, '').toLowerCase();
    const series = this.series[normalizedName];
    const label = this.labels[normalizedName];

    if (!series || !label) {
      console.error(`No se encontró la serie o etiqueta para: ${normalizedName}`);
      return;
    }

    const progress = Math.min(data.valor, 100); // Limita el progreso al 100%
    const remaining = 100 - progress;

    series.data.setAll([
      { category: "Progreso", value: progress, color: this.colors[normalizedName] }, // Color único para el progreso
      { category: "Restante", value: remaining, color: am5.color(0xe0e0e0) } // Color gris claro para la parte restante
    ]);

    label.set("text", `[bold]${progress}%[/]`);
  }

  private formatSensorValue(value: number, unit: string): string {
    return value.toString();
  }

  private clearIntervals(): void {
    Object.values(this.animationIntervals).forEach(interval => clearInterval(interval));
  }

  private createProgressChart(sensor: string): void {
    const root = am5.Root.new(`chart-${sensor}`);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        innerRadius: am5.percent(70) // Ajusta el radio interno para crear el efecto de dona
      })
    );

    // Datos iniciales para mostrar progreso
    series.data.setAll([
      { category: "Progreso", value: 0, color: this.colors[sensor] }, // Color único para el progreso
      { category: "Restante", value: 100, color: am5.color(0xe0e0e0) } // Color gris claro para la parte restante
    ]);

    const label = chart.seriesContainer.children.push(
      am5.Label.new(root, {
        text: "0%",
        centerX: am5.p50,
        centerY: am5.p50,
        fontSize: 20
      })
    );

    this.roots[sensor] = root;
    this.charts[sensor] = chart;
    this.series[sensor] = series;
    this.labels[sensor] = label;
  }
}