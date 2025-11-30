import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuarios } from '../../models/Usuarios';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  usuario: Usuarios = new Usuarios();
  currentUser: string = "";

  constructor(
    private fb: FormBuilder,
    private uS: UsuariosService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    
    this.form = this.fb.group({
      id_usuario: [''], 
      username: [{value: '', disabled: true}], 
      nombre_cliente: ['', Validators.required],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      edad: ['', [Validators.required, Validators.min(18)]],
      estado_civil: ['', Validators.required],
      ingreso_mensual: ['', [Validators.required, Validators.min(0)]],
      correo: ['', [Validators.required, Validators.email]],
 
      password: ['', Validators.required] 
    });

   
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = localStorage.getItem('username') || '';
      if (this.currentUser) {
        this.uS.findByUsername(this.currentUser).subscribe(data => {
          if (data) {
            this.usuario = data;
           
            this.form.patchValue({
              id_usuario: data.id_usuario,
              username: data.username,
              nombre_cliente: data.nombre_cliente,
              dni: data.dni,
              edad: data.edad,
              estado_civil: data.estado_civil,
              ingreso_mensual: data.ingreso_mensual,
              correo: data.correo,
              password: data.password 
            });
          }
        });
      }
    }
  }

  aceptar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

 
    this.usuario.nombre_cliente = this.form.value.nombre_cliente;
    this.usuario.dni = this.form.value.dni;
    this.usuario.edad = this.form.value.edad;
    this.usuario.estado_civil = this.form.value.estado_civil;
    this.usuario.ingreso_mensual = this.form.value.ingreso_mensual;
    this.usuario.correo = this.form.value.correo;
    this.usuario.password = this.form.value.password;
    


    this.uS.update(this.usuario).subscribe({
      next: () => {
        this.snackBar.open('¡Perfil actualizado correctamente!', 'Cerrar', { duration: 3000 });
       
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        this.snackBar.open('Error al actualizar. Verifique los datos.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancelar() {
    this.router.navigate(['/homes']);
  }
}