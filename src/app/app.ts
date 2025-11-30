import { Component, signal } from '@angular/core';

import { RouterModule, RouterOutlet, Router } from '@angular/router'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { LoginService } from './services/login.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,MatToolbarModule,MatIconModule, MatMenuModule, MatButtonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
   title = 'FrontEndFinanzas';

  role: string = '';
  
 
  constructor(
    private lS: LoginService,
    private router: Router
  ) {}

  cerrar() {
    sessionStorage.clear();
    localStorage.clear();
    
  
    this.router.navigate(['/iniciosesion']);
  }

  verificar() {
    this.role = this.lS.showRole();
    return this.lS.verificar();
  }
  isAdmin() {
    return this.role === 'ADMINISTRADOR';
  }

  isStudent() {
    return this.role === 'USUARIO';
  }
}