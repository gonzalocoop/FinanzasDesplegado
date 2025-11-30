import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ResumenFinancieroUsuarioDTO } from '../../../models/ResumenFinancieroUsuarioDTO';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { UsuariosService } from '../../../services/usuarios.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resumenfiancierousuario',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './resumenfiancierousuario.html',
  styleUrl: './resumenfiancierousuario.css',
})
export class Resumenfiancierousuario implements OnInit{
  datos: ResumenFinancieroUsuarioDTO = new ResumenFinancieroUsuarioDTO();
  cargando: boolean = true;
  tieneDatos: boolean = false;

  // ============================================
  // CONFIGURACIÓN GRÁFICO 1: DONA (Estructura)
  // ============================================
  public doughnutType: ChartType = 'doughnut'; // Tipo explícito
  public doughnutData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  
  public doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', 
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Distribución Total del Costo' }
    }
  };

  // ============================================
  // CONFIGURACIÓN GRÁFICO 2: LÍNEA (Amortización)
  // ============================================
  public lineType: ChartType = 'line'; // Tipo explícito
  public lineData: ChartData<'line'> = { labels: [], datasets: [] };

  public lineOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.4 }, // Hace la línea curva y suave
      point: { radius: 2 }    // Puntos pequeños para que se vea limpio
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
      x: { grid: { display: false } }
    },
    plugins: {
      legend: { display: false }, // No hace falta leyenda si solo hay una línea
      title: { display: true, text: 'Proyección de Saldo Deudor' }
    }
  };

  constructor(private usuarioService: UsuariosService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log("Valor actual del ID:", this.datos.id_usuario);
    const idUrl = +this.route.snapshot.paramMap.get('id')!; // Aquí obtienes el ID real del login
    this.cargarDatos(idUrl);
  }

  cargarDatos(id: number) {
    this.cargando = true;
    this.usuarioService.resumenfinancieroUsuario(id).subscribe({
      next: (lista: ResumenFinancieroUsuarioDTO[]) => {
        if (lista && lista.length > 0) {
          this.datos = lista[0];
          this.tieneDatos = true;
          
          // Generamos los dos gráficos
          this.generarGraficoDona();
          this.generarGraficoLinea();
        } else {
          this.tieneDatos = false;
        }
        this.cargando = false;
      },
      error: (e) => {
        console.error("Error:", e);
        this.cargando = false;
      }
    });
  }

  // GRÁFICO 1: Datos Reales del SQL
  generarGraficoDona() {
    const inicial = Number(this.datos.cuotaInicial);
    const capital = Number(this.datos.montoPrestamo);
    const intereses = Number(this.datos.totalintereses); // Dato directo del Cronograma

    this.doughnutData = {
      labels: ['Tu Inicial', 'Préstamo (Capital)', 'Intereses (Costo)'],
      datasets: [{
        data: [inicial, capital, intereses],
        backgroundColor: ['#4CAF50', '#2196F3', '#FF5252'], // Verde, Azul, Rojo
        hoverBackgroundColor: ['#66BB6A', '#42A5F5', '#FF8A80'],
        borderWidth: 0
      }]
    };
  }

  // GRÁFICO 2: Proyección Matemática
  generarGraficoLinea() {
    // Generamos la curva visualmente usando los datos básicos
    // Esto evita traer miles de filas del backend solo para pintar una línea
    const periodos = Number(this.datos.numeroCuotas);
    const saldoInicial = Number(this.datos.montoPrestamo);
    
    // Arrays para el gráfico
    const labels = [];
    const dataPoints = [];

    // Lógica simple de línea recta descendente para visualización (Opcional: usar fórmula francesa real)
    // Para efectos visuales de "Saldo bajando", una proyección lineal es suficiente y rápida
    for (let i = 0; i <= periodos; i += (periodos / 10)) { // Tomamos 10 puntos de referencia
      const mesActual = Math.round(i);
      labels.push(`Mes ${mesActual}`);
      
      // Cálculo de saldo remanente estimado
      const saldoEstimado = saldoInicial * (1 - (i / periodos));
      dataPoints.push(saldoEstimado > 0 ? saldoEstimado : 0);
    }

    // Aseguramos que el último punto sea 0
    if(dataPoints[dataPoints.length -1] !== 0) {
       labels.push(`Mes ${periodos}`);
       dataPoints.push(0);
    }

    this.lineData = {
      labels: labels,
      datasets: [{
        label: 'Saldo de Deuda',
        data: dataPoints,
        borderColor: '#2196F3',       // Línea Azul
        backgroundColor: 'rgba(33, 150, 243, 0.2)', // Relleno azul suave
        fill: true,                   // Rellenar el área bajo la línea
      }]
    };
  }
}

