import { Component, OnInit } from '@angular/core';
import { QueryAnalisisRentabilidad } from '../../../models/QueryAnalisisRentabilidad';
import { UsuariosService } from '../../../services/usuarios.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-analisis-rentabilidad',
  standalone: true,
  imports: [BaseChartDirective,MatNativeDateModule,MatTableModule,MatFormFieldModule,FormsModule,MatInputModule, MatSelectModule,MatDatepickerModule,MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './analisis-rentabilidad.html',
  styleUrl: './analisis-rentabilidad.css',
})
export class AnalisisRentabilidad implements OnInit{
 // 1. DATA TABLA
  displayedColumns: string[] = ['cliente', 'tir', 'cok', 'margen', 'estado', 'van'];
  analisis: QueryAnalisisRentabilidad[] = [];

  // 2. KPIs (Tarjetas)
  kpiTotalCreditos: number = 0;
  kpiPorcentajeRentable: number = 0;
  kpiMargenPromedio: number = 0;

  // ==========================================
  // 3. CONFIGURACIÓN CHART.JS
  // ==========================================

  // --- A) Gráfico de Dona (Distribución) ---
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Estado de la Cartera' }
    }
  };
  public doughnutChartType: ChartType = 'doughnut';
  
  // Datos iniciales vacíos
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  };

  // --- B) Gráfico de Barras (Top Rentabilidad) ---
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Ocultamos leyenda porque cada barra es un cliente
      title: { display: true, text: 'Top 5 Clientes Más Rentables (TIR)' }
    }
  };
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'TIR (%)', backgroundColor: '#4CAF50' }]
  };


  constructor(private usuarioService: UsuariosService) {}

  ngOnInit(): void {
    // Al iniciar, cargamos todo automáticamente
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.usuarioService.analisisderentabilidadporcreditodeusuario()
      .subscribe({
        next: (data: QueryAnalisisRentabilidad[]) => {
          this.analisis = data;
          this.calcularIndicadores(data);
          this.procesarGraficosChartJs(data); // <--- Método nuevo
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
  }

  calcularIndicadores(data: QueryAnalisisRentabilidad[]) {
    if (!data.length) return;
    this.kpiTotalCreditos = data.length;
    const rentables = data.filter(d => d.estado_credito === 'Rentable').length;
    this.kpiPorcentajeRentable = (rentables / this.kpiTotalCreditos) * 100;
    
    // Sumar margenes (convirtiendo a número)
    const sumaMargen = data.reduce((acc, curr) => acc + Number(curr.margen_rentabilidad), 0);
    this.kpiMargenPromedio = sumaMargen / this.kpiTotalCreditos;
  }

  // Lógica específica para transformar datos a formato Chart.js
  procesarGraficosChartJs(data: QueryAnalisisRentabilidad[]) {
    
    // 1. PROCESAR DONUT (Contar estados)
    let countRentable = 0;
    let countNeutro = 0;
    let countNoRentable = 0;

    data.forEach(item => {
      if (item.estado_credito === 'Rentable') countRentable++;
      else if (item.estado_credito === 'Neutro') countNeutro++;
      else countNoRentable++;
    });

    // Asignamos al objeto de Chart.js
    this.doughnutChartData = {
      labels: ['Rentable', 'Neutro', 'No Rentable'],
      datasets: [
        { 
          data: [countRentable, countNeutro, countNoRentable],
          backgroundColor: ['#4CAF50', '#FFC107', '#F44336'], // Verde, Amarillo, Rojo
          hoverBackgroundColor: ['#388E3C', '#FFA000', '#D32F2F']
        }
      ]
    };

    // 2. PROCESAR BARRAS (Top 5)
    // Ordenar por TIR descendente
    const top5 = [...data]
      .sort((a, b) => Number(b.tir) - Number(a.tir))
      .slice(0, 5);

    this.barChartData = {
      labels: top5.map(d => d.nombre_cliente), // Nombres abajo
      datasets: [
        { 
          data: top5.map(d => Number(d.tir) * 100), // TIR en %
          label: 'Rentabilidad (TIR)',
          backgroundColor: '#3F51B5', // Azul índigo
          barThickness: 40
        }
      ]
    };
  }
}
