import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common'; 
// Importa el módulo de iconos
import { MatIconModule } from '@angular/material/icon'; 

@Component({
  selector: 'app-landingpage',
  standalone: true,
  // Añade MatIconModule a los imports
  imports: [RouterModule, CommonModule, MatIconModule],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css'
})
export class LandingpageComponent implements OnInit {
  isChildRoute: boolean = false; 

  constructor(private router: Router) {} 

  ngOnInit(): void {
    this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
            this.isChildRoute = event.url.includes('/landing/') && event.url !== '/landing';
        }
    });
  }
}