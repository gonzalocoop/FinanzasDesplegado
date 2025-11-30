import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType, ChartOptions } from 'chart.js';
import { UsuariosService } from '../../../services/usuarios.service';
import { QueryPrecioCorrespondientePorPropiedadyUsuario } from '../../../models/QueryPrecioCorrespondientePorPropiedadyUsuario';


@Component({
  selector: 'app-precio-correspondiente-por-propiedad-xusuario',
  standalone: true,
  imports: [
    MatNativeDateModule,
    MatTableModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    BaseChartDirective 
  ],
  templateUrl: './precio-correspondiente-por-propiedad-xusuario.html',
  styleUrl: './precio-correspondiente-por-propiedad-xusuario.css',
})
export class PrecioCorrespondientePorPropiedadXUsuario1 implements OnInit{
  id_usuario: number = 0; 
  haRealizadoBusqueda: boolean = false; 
  datosReporte: QueryPrecioCorrespondientePorPropiedadyUsuario[] = [];

  public doughnutChartType: ChartType = 'doughnut';

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Cuota Inicial', 'Monto Financiado', 'Bono', 'Gastos Operativos'],
    datasets: [
      { data: [0, 0, 0, 0], backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0', '#FFCE56'] }
    ]
  };

  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Distribución de Costos' }
    }
  };

  constructor(private usuarioService: UsuariosService) {} 

  ngOnInit(): void {
      
  }


  cargarReporte(): void { 
    this.haRealizadoBusqueda = true;
    if (!this.id_usuario || this.id_usuario <= 0) {
        // Si no hay ID válido, reseteamos los datos del gráfico para mostrar el mensaje de vacío.
        this.resetearGrafico();
        return; 
    }

    this.usuarioService.preciocorrespondienteporpropiedadporusuario(this.id_usuario).subscribe({
      next: (data: QueryPrecioCorrespondientePorPropiedadyUsuario[]) => {
        
        // Guardamos los datos brutos
        this.datosReporte = data;

        if (data.length > 0) {
          const registro = data[0]; 

          const gastosOperativos = 
            registro.costos_notariales + 
            registro.registros_publicos + 
            registro.costos_transaccion;

          this.doughnutChartData = {
            labels: [
              'Cuota Inicial', 
              'Monto Financiado',
              'Bono', 
              'Gastos Operativos' 
            ],
            datasets: [
              { 
                data: [
                  registro.cuota_inicial,
                  registro.precio_calculado,
                  registro.monto_bono,
                  gastosOperativos
                ],
                backgroundColor: [
                  '#36A2EB', 
                  '#FF6384', 
                  '#4BC0C0', 
                  '#FFCE56'  
                ],
                hoverOffset: 4
              }
            ]
          };
          
          console.log(`Moneda: ${registro.nombre_moneda}`);
        } else {
            // Si no hay datos, reseteamos el gráfico para que se cumpla la condición *ngIf="doughnutChartData.datasets[0].data[0] === 0"
            this.resetearGrafico();
        }
      },
      error: (e) => {
          console.error('Error al obtener el precio correspondiente:', e);
          this.resetearGrafico();
      }
    });
  }
  
  // Nuevo: Función para limpiar o resetear la búsqueda
  limpiarBusqueda() {
    this.haRealizadoBusqueda = false;
    this.datosReporte = []; 
    this.resetearGrafico(); // Asegura que el gráfico se oculte
  }

  // Función auxiliar para resetear los datos del gráfico
  private resetearGrafico(): void {
    this.doughnutChartData = {
        labels: this.doughnutChartData.labels, // Mantenemos las etiquetas
        datasets: [{
            data: [0, 0, 0, 0], // Reemplazamos los valores con cero
            backgroundColor: this.doughnutChartData.datasets[0].backgroundColor
        }]
    };
  }
}