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
import { UsuariosService } from '../../../services/usuarios.service';
import { QueryPropiedadxUserDTO } from '../../../models/QueryPropiedadxUserDTO';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-propiedad-xuser',
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
    MatIcon
  ],
  templateUrl: './propiedad-xuser.html',
  styleUrl: './propiedad-xuser.css',
})
export class PropiedadXUser implements OnInit {
  id_usuario: number = 0; 
  propiedades: QueryPropiedadxUserDTO[] = [];
  haRealizadoBusqueda: boolean = false; 

  constructor(private usuarioService: UsuariosService) {}

  ngOnInit(): void {
  }

  cargarPropiedades(): void {
    this.haRealizadoBusqueda = true;
    
    if (!this.id_usuario || this.id_usuario <= 0) {
      this.propiedades = []; 
      return; 
    }

    this.usuarioService.propiedadesfinanciadasporusuario(this.id_usuario).subscribe({
      next: (data: QueryPropiedadxUserDTO[]) => {
        this.propiedades = data;
      },
      error: (e) => {
        console.error('Error al obtener propiedades financiadas:', e);
        this.propiedades = [];
      }
    });
  }

  // Función para resetear el estado al cambiar el input (Se mantiene)
  limpiarBusqueda() {
    this.haRealizadoBusqueda = false;
    this.propiedades = [];
  }
}