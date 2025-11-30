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
import { QueryCreditosPorUsuarioConPeriododeGracia } from '../../../models/QueryCreditosPorUsuarioConPeriododeGracia';
import { UsuariosService } from '../../../services/usuarios.service';
@Component({
  selector: 'app-credito-por-usuario-con-periodo-gracia',
  standalone: true,
  imports: [MatNativeDateModule,MatTableModule,MatFormFieldModule,FormsModule,MatInputModule, MatSelectModule,MatDatepickerModule,MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './credito-por-usuario-con-periodo-gracia.html',
  styleUrl: './credito-por-usuario-con-periodo-gracia.css',
})
export class CreditoPorUsuarioConPeriodoGracia implements OnInit{
    id_usuario: number = 0;
    credito: QueryCreditosPorUsuarioConPeriododeGracia[] = []
    haRealizadoBusqueda: boolean = false;
    constructor(private usuarioService:UsuariosService){}
  
    ngOnInit(): void {
      
    }
    cargarCredito(): void {
      this.haRealizadoBusqueda = true;
      if (this.id_usuario) {
        this.usuarioService.creditosporusuarioconperiododegracia(this.id_usuario)
          .subscribe(
            (data: QueryCreditosPorUsuarioConPeriododeGracia[]) => {
              this.credito = data;
            },
            (error) => {
              console.error('Error al obtener la recaudación:', error);
            }
          );
      }
    }
    limpiarBusqueda() {
    this.haRealizadoBusqueda = false;
    this.credito = []; // Opcional: limpiar tabla anterior
    }
}
