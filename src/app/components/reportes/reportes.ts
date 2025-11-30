import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ResumenFinancieroUsuarioDTO } from '../../models/ResumenFinancieroUsuarioDTO';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuarios } from '../../models/Usuarios';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterModule,MatToolbarModule,MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit{
  isLogged = false;
  idUsuarioActual: number = 0;
  showWelcomeMessage = true;
  selectedUser: string = localStorage.getItem("username") ?? "";
  currentUser: Usuarios | undefined;
  role: string = '';
  constructor(private route: ActivatedRoute,private router: Router,private loginService: LoginService,private uS: UsuariosService,
     @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  


  ngOnInit(): void {
    // Cargamos la sesión
  this.isLogged = this.loginService.verificar();
  this.role = this.loginService.showRole();
  this.loadCurrentUser();
  
  }
  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }
  isAdmin() {
  return this.role === 'ADMINISTRADOR';
  }

  isStudent() {
  return this.role === 'USUARIO';
  }

  loadCurrentUser() {
  if (isPlatformBrowser(this.platformId)) {
    const username = localStorage.getItem('username'); 
    if (username) {
      this.uS.findByUsername(username).subscribe(user => { 
        if (user) { // <-- valida que user no sea undefined
          this.currentUser = user;
          this.idUsuarioActual = this.currentUser.id_usuario;
        } else {
          console.error("No se pudo cargar el usuario desde el servicio.");
        }
      });
    } else {
      console.error("No se encontró el username en localStorage.");
    }
  }
}

}
