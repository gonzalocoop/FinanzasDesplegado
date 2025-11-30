import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Usuarios } from '../../models/Usuarios';
import { Roles } from '../../models/Roles'; 
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegistrarusuarioService } from '../../services/registrarusuario.service';
import { Observable } from 'rxjs';
import { map, of } from 'rxjs';

@Component({
  selector: 'app-registrarusuario',
  standalone: true,

  imports: [
    ReactiveFormsModule, 
    CommonModule,       
    RouterModule       
  ],
  templateUrl: './registrarusuario.component.html',
  styleUrl: './registrarusuario.component.css'
})
export class RegistrarusuarioComponent implements OnInit {
  form: FormGroup= new FormGroup({});
  usuario: Usuarios = new Usuarios();
  id: number = 0; 

  
  // CAMBIAR ESTE NÚMERO SI ES DIFERENTE (ej. 1, 3, etc.)
  readonly ID_ROL_USUARIO: number = 2; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reS: RegistrarusuarioService
  ) {}

  
  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
      localStorage.clear();
    }

  
    this.form = this.fb.group({
   
      hnombre_cliente: ['', [Validators.required, Validators.maxLength(50)]],
      hdni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[0-9]*$')]],
      hedad: [null, [Validators.required, Validators.min(18), Validators.max(100)]],
      hestado_civil: [null, Validators.required],
      hingreso_mensual: [null, [Validators.required, Validators.min(1500)]],
      
   
      hcorreo: ['', [Validators.required, Validators.pattern(/^[^@]+@[^@]+\.[^@]+$/)]],
      husername: ['', [Validators.required, Validators.maxLength(20)], [this.usernameRepetido.bind(this)]],
      hpassword: ['', Validators.required],
      
 
    });
  }

  aceptar() {
    if (this.form.valid) {
      
      this.usuario.nombre_cliente = this.form.value.hnombre_cliente;
      this.usuario.dni = this.form.value.hdni;
      this.usuario.edad = this.form.value.hedad;
      this.usuario.estado_civil = this.form.value.hestado_civil;
      this.usuario.ingreso_mensual = this.form.value.hingreso_mensual;
      this.usuario.correo = this.form.value.hcorreo;
      this.usuario.username = this.form.value.husername;
      this.usuario.password = this.form.value.hpassword;      
      this.usuario.rol.id_rol = this.ID_ROL_USUARIO; 
      this.usuario.activo = true; 

      this.reS.insert(this.usuario).subscribe((data) => {
        this.reS.listUsuarios();
        alert("¡Cuenta creada exitosamente!, ahora inicie sesión");
        this.router.navigate(['iniciosesion']);
      });

    } else {
      this.form.markAllAsTouched();
    }
  }

  
  usernameRepetido(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null); 
    }
    return this.reS.listUsuarios().pipe(
      map((usuarios) => {
        const existe = usuarios.some(
          (usuario) =>
            usuario.username === control.value && usuario.id_usuario != this.id
        );
        return existe ? { usernameRepetido: true } : null;
      })
    );
  }
}