import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CreditoMiVivienda } from '../../models/CreditoMiVivienda';
import { CreditomiviviendaService } from '../../services/creditomivivienda.service';
import { LoginService } from '../../services/login.service';
import { concatMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { CronogramaService } from '../../services/cronograma.service';

@Component({
  selector: 'app-creditomivivienda',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatIconModule, 
    MatButtonModule, 
    MatSnackBarModule,
    MatProgressSpinnerModule 
  ],
  templateUrl: './creditomivivienda.html',
  styleUrls: ['./creditomivivienda.css'] 
})
export class Creditomivivienda implements OnInit {
  
  listaCreditos: CreditoMiVivienda[] = [];
 
  isAdmin: boolean = false;
  isLoading: boolean = false; 

  constructor(
    private cmvS: CreditomiviviendaService,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private router: Router,
    private cronoS: CronogramaService, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isAdmin = (this.loginService.showRole() === 'ADMINISTRADOR');
    this.cargarCreditos();
  }

  cargarCreditos(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoading = true;
      this.cmvS.list().subscribe(data => {
        if (this.isAdmin) {
          this.listaCreditos = data; 
        } else {
        
          const username = localStorage.getItem('username');
          this.listaCreditos = data.filter(c => c.usuario?.username === username);
        }
        this.isLoading = false;
      });
    }
  }

 
  verCronograma(idCredito: number): void {
    this.isLoading = true; 
    this.snackBar.open('Verificando cronograma...', 'Cerrar', { duration: 15000 });

    this.cronoS.getCronogramaPorCredito(idCredito).pipe(
      switchMap(cronogramaExistente => {
        
        if (cronogramaExistente.length > 0) {
          this.snackBar.open('Cronograma encontrado. Abriendo...', 'Cerrar', { duration: 2000 });
          return of(true); 
        } 
        
        this.snackBar.open('Generando cronograma por primera vez, por favor espere...', 'Cerrar', { duration: 15000 });
        return this.cmvS.generarTEM(idCredito).pipe(
          concatMap(() => this.cmvS.generarCronograma(idCredito)),
          concatMap(() => this.cmvS.calcularVanTir(idCredito)),
          concatMap(() => this.cmvS.convertirTasasAnuales(idCredito))
        );
      })
    ).subscribe({
      next: () => {
        this.isLoading = false; 
        this.router.navigate(['/credito', idCredito, 'cronograma']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error en el proceso de cronograma:', err);
        this.snackBar.open('Error al generar o verificar el cronograma. Revise la consola.', 'Cerrar', { duration: 5000 });
      }
    });
  }
  // ---

  eliminar(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este crédito?')) {
      this.cmvS.delete(id).subscribe(() => {
        this.snackBar.open('Crédito eliminado.', 'Cerrar', { duration: 3000 });
        this.cargarCreditos();
      });
    }
  }

  volverAlMenu() {
    
    const returnUrl = this.isAdmin ? '/admin/propiedades' : '/homes'; 
    this.router.navigate([returnUrl]);
  }
}