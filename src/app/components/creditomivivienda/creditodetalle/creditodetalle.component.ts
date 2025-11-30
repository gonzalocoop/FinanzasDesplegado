import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser, DatePipe, DecimalPipe } from '@angular/common'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreditomiviviendaService } from '../../../services/creditomivivienda.service';
import { CreditoMiVivienda } from '../../../models/CreditoMiVivienda';

@Component({
  selector: 'app-credito-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    DatePipe, 
    DecimalPipe 
  ],
  templateUrl: './creditodetalle.component.html',
  styleUrls: ['./creditodetalle.component.css']
})
export class CreditoDetalleComponent implements OnInit {
  
  credito: CreditoMiVivienda | undefined;
  isLoading: boolean = true;
  idCredito: number = 0;

  constructor(
    private route: ActivatedRoute,
    private cmvS: CreditomiviviendaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
  
    this.idCredito = +this.route.snapshot.paramMap.get('idCredito')!;
    
   
    if (this.idCredito && isPlatformBrowser(this.platformId)) {
      this.cmvS.listId(this.idCredito).subscribe(data => {
        this.credito = data;
        this.isLoading = false;
      });
    }
  }

  
  goBack() {
    window.history.back();
  }
}