import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CronogramaService } from '../../services/cronograma.service';
import { CronogramaPagos } from '../../models/CronogramaPagos'; 

@Component({
  selector: 'app-cronogramapagos',
  standalone: true, 
  imports: [
    CommonModule, 
    RouterModule, 
    MatTableModule, 
    MatIconModule, 
    MatButtonModule
  ],
  templateUrl: './cronogramapagos.html',
  styleUrls: ['./cronogramapagos.css'] 
})
export class Cronogramapagos implements OnInit {
  
  cronograma: CronogramaPagos[] = [];
  idCredito: number = 0;

  displayedColumns: string[] = [
    'numero_cuota', 
    'fecha_cuota', 
    'saldo_restante', 
    'amortizacion_cuota', 
    'interes_cuota', 
    'seguro_desgravamen', 
    'seguro_bien', 
    'cuota_fija'
  ];

  constructor(
    private route: ActivatedRoute,
    private cS: CronogramaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
 
    this.idCredito = +this.route.snapshot.paramMap.get('idCredito')!;
    

    if (this.idCredito && isPlatformBrowser(this.platformId)) {
      this.cS.getCronogramaPorCredito(this.idCredito).subscribe(data => {
        this.cronograma = data;
      });
    }
  }
}