import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router'; // <-- Añade ActivatedRoute
import { Propiedad as PropiedadModel } from '../../models/Propiedad';
import { PropiedadService } from '../../services/propiedad.service';

import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-propiedad',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTableModule,
    MatSnackBarModule
  ],
  templateUrl: './propiedad.html',
  styleUrls: ['./propiedad.css'] 
})
export class Propiedad implements OnInit {
  
  listaPropiedades: PropiedadModel[] = [];
  displayedColumns: string[] = ['imagen', 'tipo', 'direccion', 'precio', 'acciones']; 
  
  isUserFlow: boolean = false; 
  titulo: string = 'Gestión de Propiedades (Admin)'; 

  constructor(
    private pS: PropiedadService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    
    if (this.route.snapshot.data['isUserFlow']) {
      this.isUserFlow = true;
      this.titulo = 'Paso 1: Selecciona una Propiedad';
      this.displayedColumns = ['imagen', 'tipo', 'direccion', 'precio', 'seleccionar']; 
    }

    this.cargarPropiedades();
  }

  cargarPropiedades(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.pS.list().subscribe(data => {
        this.listaPropiedades = data;
      });
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta propiedad?')) {
      this.pS.delete(id).subscribe(() => {
        this.snackBar.open('Propiedad eliminada.', 'Cerrar', { duration: 3000 });
        this.cargarPropiedades();
      });
    }
  }
}