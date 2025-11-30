import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MonedaService } from '../../../services/moneda.service';
import { Moneda } from '../../../models/Moneda';
import { PreciocorrespondienteService } from '../../../services/preciocorrespondiente.service';
import { PrecioCorrespondiente } from '../../../models/PrecioCorrespondiente';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-costos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule],
  templateUrl: './costos.component.html',
  styleUrls: ['./costos.component.css']
})
export class CostosComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  idPropiedadRecibida: number = 0;
  listaMonedas: Moneda[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private mS: MonedaService, 
    private pcS: PreciocorrespondienteService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    
    this.idPropiedadRecibida = +this.route.snapshot.paramMap.get('idPropiedad')!;

 
    this.form = this.fb.group({
      tipo_moneda: [null, Validators.required], 
      costos_notariales: [null, [Validators.required, Validators.min(0)]],
      registros_publicos: [null, [Validators.required, Validators.min(0)]],
      costos_transaccion: [null, [Validators.required, Validators.min(0)]]
    });

    // 3. Cargar monedas
    this.loadMonedas();
  }

  loadMonedas() {
    if (isPlatformBrowser(this.platformId)) {
      this.mS.list().subscribe(data => {
        this.listaMonedas = data;
      });
    }
  }

  aceptar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }


    this.pcS.generarPrecioCorrespondiente(
      this.form.value.costos_notariales,
      this.form.value.registros_publicos,
      this.form.value.costos_transaccion,
      this.idPropiedadRecibida,
      this.form.value.tipo_moneda
    ).subscribe({
      next: (nuevoPrecio: PrecioCorrespondiente) => {
        this.snackBar.open('Costos registrados. Continuando al crédito...', 'Cerrar', { duration: 3000 });
      
        this.router.navigate(['/creditoMiVivienda/nuevo/', nuevoPrecio.id_precio_correspondiente]);
      },
      error: (err) => {
         console.error('Error al generar el PrecioCorrespondiente:', err);
         this.snackBar.open('Error al guardar costos.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancelar() {
  
    this.router.navigate(['/seleccionar-propiedad']);
  }
}