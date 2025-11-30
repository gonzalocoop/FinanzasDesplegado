import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CreditoMiVivienda } from '../../../models/CreditoMiVivienda';
import { CreditomiviviendaService } from '../../../services/creditomivivienda.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuarios } from '../../../models/Usuarios';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-crearcreditomivivienda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule],
  templateUrl: './crearcreditomivivienda.component.html',
  styleUrls: ['./crearcreditomivivienda.component.css']
})
export class CrearcreditomiviviendaComponent implements OnInit {
  form: FormGroup= new FormGroup({});
  
  isUserFlow: boolean = false;
  isEditMode: boolean = false;
  idPrecioCorrespondienteRecibido: number = 0; 
  idCreditoParaEditar: number = 0;

  currentUser: Usuarios | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cmvS: CreditomiviviendaService,
    private uS: UsuariosService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

 ngOnInit(): void {
    this.form = this.fb.group({
      fecha_inicio: [new Date().toISOString().split('T')[0], Validators.required],
     
      tipo_tasa: ['Nominal', Validators.required],
      tasa_interes: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      cok: [null, [Validators.required, Validators.min(0)]], 
      
      
      numero_cuotas: [null, [
          Validators.required, 
          Validators.min(60), 
          Validators.max(300)
      ]],
      
      peridiocidad_tasa: ['Mensual', Validators.required],
      tipo_capitalizacion: ['Nulo', Validators.required],
      tipo_gracia: ['Ninguno', Validators.required],
      
      
      duracion_gracia_meses: [0, [Validators.required, Validators.min(0)]],
    });

    this.form.get('tipo_gracia')?.valueChanges.subscribe(valor => {
      const controlDuracion = this.form.get('duracion_gracia_meses');

      if (valor === 'Ninguno') {
        
        controlDuracion?.setValue(0);
        controlDuracion?.setValidators([Validators.required, Validators.min(0), Validators.max(0)]);
        controlDuracion?.disable(); 
      } else {
        
        controlDuracion?.enable();
        controlDuracion?.setValidators([Validators.required, Validators.min(6)]);
      }
      controlDuracion?.updateValueAndValidity();
    });


    this.route.paramMap.subscribe(params => {
      if (params.has('id')) { 
        this.isEditMode = true;
        this.idCreditoParaEditar = +params.get('id')!;
        this.cmvS.listId(this.idCreditoParaEditar).subscribe(data => {
        
      
          const formData = {
            ...data,
            tasa_interes: data.tasa_interes, 
            cok: data.cok 
          };
          this.form.patchValue(formData); 
        });
      } else if (params.has('idPrecioCorrespondiente')) { 
        this.isUserFlow = true;
        this.idPrecioCorrespondienteRecibido = +params.get('idPrecioCorrespondiente')!; 
      }
    });

    this.loadCurrentUser();
  }

  loadCurrentUser() {
     if (isPlatformBrowser(this.platformId)) {
      const username = localStorage.getItem('username'); 
      if (username) {
        this.uS.findByUsername(username).subscribe(user => { this.currentUser = user; });
      } else {
        console.error("No se encontró el username en localStorage.");
      }
     }
  }

  aceptar() {
    if (this.form.invalid || !this.currentUser) {
       this.snackBar.open('Formulario inválido o no se pudo cargar el usuario.', 'Cerrar', { duration: 3000 });
       this.form.markAllAsTouched();
       return;
    }

   
    const payload = { ...this.form.value };
    

    if (this.isEditMode) {
      let creditoAActualizar = new CreditoMiVivienda();
      creditoAActualizar = { ...creditoAActualizar, ...payload }; 
      creditoAActualizar.id_credito = this.idCreditoParaEditar;
      creditoAActualizar.usuario = this.currentUser;
      
      this.cmvS.update(creditoAActualizar).subscribe(() => {
        this.snackBar.open('Crédito actualizado.', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/admin/creditos']);
      });

    } else {
      if (this.isUserFlow) {
        
        
        this.cmvS.registrarCreditoMiVivienda(
          payload, 
          this.idPrecioCorrespondienteRecibido,
          this.currentUser.id_usuario
        ).subscribe({
          next: () => {
            this.snackBar.open('¡Crédito registrado exitosamente!', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/homes']);
          },
          error: (err) => {
            console.error('Error al registrar el crédito:', err);
            this.snackBar.open('Error al registrar el crédito. Revisa la consola.', 'Cerrar', { duration: 5000 });
          }
        });

      } else {
        alert('Flujo de admin crear crédito necesita un selector de propiedad/precio (no implementado).');
        return; 
      }
    }
  }

  getTitulo(): string {
    if (this.isEditMode) { return 'Editar Crédito Mivivienda'; } 
    else if (this.isUserFlow) { return `Paso 3: Registrar Crédito (Cálculo ID: ${this.idPrecioCorrespondienteRecibido})`; } 
    else { return 'Registrar Nuevo Crédito (Admin)'; }
  }

  cancelar() {
    const returnUrl = this.isUserFlow ? '/homes' : '/admin/creditos';
    this.router.navigate([returnUrl]);
  }
}