import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Propiedad } from '../../../models/Propiedad'; 
import { PropiedadService } from '../../../services/propiedad.service';

@Component({
  selector: 'app-crearpropiedad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crearpropiedad.component.html',
  styleUrls: ['./crearpropiedad.component.css']
})
export class CrearpropiedadComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  propiedad: Propiedad = new Propiedad();
  
  isEditMode: boolean = false; 
  idToEdit: number = 0; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private pS: PropiedadService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
   
    this.form = this.fb.group({
      tipo_propiedad: ['', Validators.required],
      direccion: ['', Validators.required],
      precio_propiedad: [null, [
          Validators.required, 
          Validators.min(58000), 
          Validators.max(419600),
          
      ]],
      url_imagen: [''] 
    });

   
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.isEditMode = true;
        this.idToEdit = +params.get('id')!;
        this.pS.listId(this.idToEdit).subscribe(data => {
          this.form.patchValue(data); 
        });
      }
    });
  }

  aceptar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.propiedad.tipo_propiedad = this.form.value.tipo_propiedad;
    this.propiedad.direccion = this.form.value.direccion;
    this.propiedad.precio_propiedad = this.form.value.precio_propiedad;
    this.propiedad.url_imagen = this.form.value.url_imagen;

    if (this.isEditMode) {
      
      this.propiedad.id_propiedad = this.idToEdit;
      this.pS.update(this.propiedad).subscribe(() => { 
        this.router.navigate(['/admin/propiedades']);
      });
      
    } else {
    
      this.pS.insert(this.propiedad).subscribe(() => { 
        this.router.navigate(['/admin/propiedades']);
      });
    }
  }

  
  
  getTitulo(): string {
    return this.isEditMode ? 'Editar Propiedad' : 'Registrar Nueva Propiedad';
  }

  getBotonPrincipal(): string {
    return this.isEditMode ? 'Actualizar' : 'Guardar';
  }

  cancelar() {
    this.router.navigate(['/admin/propiedades']);
  }
}