import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // Importante para SSR
import { RouterModule } from '@angular/router'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css' 
})
export class HomeComponent implements OnInit {
  
  selectedUser: string = ''; // Inicializamos vacío
  role: string = '';

  constructor(
    private lS: LoginService,
    @Inject(PLATFORM_ID) private platformId: Object // Inyectamos el ID de la plataforma
  ) {}

  ngOnInit(): void {
    // Solo accedemos a localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      // Si no encuentra el nombre, pone 'Usuario' por defecto
      this.selectedUser = localStorage.getItem('username') || 'Usuario';
    }
  }

  verificar() {
    this.role = this.lS.showRole();
    return this.lS.verificar();
  }
}