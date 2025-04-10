import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RachaService } from '../../core/services/racha.service';

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
  private animationIntervals: { [key: string]: any } = {};
  lastUpdate: Date = new Date();
  currentValues: { [key: string]: number } = {
    temperatura: 0,
    humedadaire: 0,
    humedadsuelo: 0,
    luz: 0
  };

  private colors: { [key: string]: am5.Color } = {
    temperatura: am5.color(0xe74c3c),
    humedadaire: am5.color(0x3498db),
    humedadsuelo: am5.color(0x2ecc71),
    luz: am5.color(0xf39c12)
  };

  private maxValues: { [key: string]: number } = {  
    temperatura: 30,     
    humedadaire: 70,     
    humedadsuelo: 60,   
    luz: 1500            
  };
  

  constructor(private http: HttpClient, private rachaService: RachaService) {}

  ngOnInit(): void {
    this.setupRealTimeUpdates();
  }

  ngAfterViewInit(): void {
    this.initializeCharts();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.clearIntervals();
    Object.values(this.roots).forEach(root => root.dispose());
  }

  private setupRealTimeUpdates(): void {
    this.rachaService.getDatosSensores$().subscribe({
      next: (sensores: { [key: string]: number }) => {
        console.log('Datos brutos recibidos del socket:', sensores);
        this.lastUpdate = new Date();
        const mappedData = this.mapToSensorDataArray(sensores);
        console.log('Datos mapeados para gráficos:', mappedData);
        this.processSensorData(mappedData);
      },
      error: (err) => console.error('Error en socket:', err)
    });
  }

  private mapToSensorDataArray(sensores: { [key: string]: number }): SensorData[] {
    return [
      { 
        nombre: 'temperatura', 
        valor: sensores['temperatura'] || 0, 
        unidad: '°C', 
        fecha: new Date().toISOString() 
      },
      { 
        nombre: 'humedadaire', 
        valor: sensores['humedadaire'] || 0, 
        unidad: '%', 
        fecha: new Date().toISOString() 
      },
      { 
        nombre: 'humedadsuelo', 
        valor: sensores['humedadsuelo'] || 0, 
        unidad: '%', 
        fecha: new Date().toISOString() 
      },
      { 
        nombre: 'luz', 
        valor: sensores['luz'] || 0, 
        unidad: 'lux', 
        fecha: new Date().toISOString() 
      }
    ];
  }

  private processSensorData(data: SensorData[]): void {
    console.log('Datos procesados para gráficos:', data); 
    data.forEach(sensor => {
      const key = sensor.nombre.toLowerCase();
      console.log('Procesando sensor:', key, sensor);
      if (Math.abs(this.currentValues[key] - sensor.valor) > 0.5) {
        this.animateToNewValue(sensor);
      }
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

    staticData.forEach(sensor => {
      this.updateProgressChart(sensor);
    });
  }

  private animateToNewValue(data: SensorData): void {
    console.log('Animando al nuevo valor:', data);

    const normalizedName = data.nombre.toLowerCase();
    const series = this.series[normalizedName];
    const label = this.labels[normalizedName];

    if (!series || !label) return;

    const maxValue = this.maxValues[normalizedName] || 100; 

    const targetPercentage = Math.min((data.valor / maxValue) * 100, 100);

    const currentValue = (series.data.values[0] as { value: number })?.value || 0;

    if (this.animationIntervals[normalizedName]) {
      clearInterval(this.animationIntervals[normalizedName]);
    }

    this.currentValues[normalizedName] = data.valor;

    const duration = 1000; 
    const steps = 30;
    const increment = (targetPercentage - currentValue) / steps;
    let step = 0;

    this.animationIntervals[normalizedName] = setInterval(() => {
      if (step >= steps) {
        clearInterval(this.animationIntervals[normalizedName]);
        return;
      }

      const progress = currentValue + increment * step;
      const remaining = 100 - progress;

      series.data.setAll([
        { category: 'Progreso', value: progress, color: this.colors[normalizedName] },
        { category: 'Restante', value: remaining, color: am5.color(0xe0e0e0) }
      ]);

      label.set('text', `[bold]${Math.round(progress)}%[/]`);

      if (progress > 100) {
        label.set('fill', am5.color(0xe74c3c)); 
      } else {
        label.set('fill', am5.color(0x2d3436)); 
      }

      step++;
    }, duration / steps);
  }

  private updateProgressChart(data: SensorData): void {
    const normalizedName = data.nombre.toLowerCase();
    const series = this.series[normalizedName];
    const label = this.labels[normalizedName];

    if (!series || !label) return;

    const maxValue = this.maxValues[normalizedName] || 100; 

    const progress = Math.min((data.valor / maxValue) * 100, 100);
    const remaining = 100 - progress;

    series.data.setAll([
      { category: 'Progreso', value: progress, color: this.colors[normalizedName] },
      { category: 'Restante', value: remaining, color: am5.color(0xe0e0e0) }
    ]);

    label.set('text', `[bold]${Math.round(progress)}%[/]`);

    if (data.valor > maxValue) {
      label.set('fill', am5.color(0xe74c3c)); 
    } else {
      label.set('fill', am5.color(0x2d3436)); 
    }
  }

  private clearIntervals(): void {
    Object.values(this.animationIntervals).forEach(interval => {
      if (interval) clearInterval(interval);
    });
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
        innerRadius: am5.percent(70)
      })
    );

    series.data.setAll([
      { category: "Progreso", value: 0, color: this.colors[sensor] },
      { category: "Restante", value: 100, color: am5.color(0xe0e0e0) }
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