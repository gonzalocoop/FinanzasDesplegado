import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const seguridadGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
    const lService = inject(LoginService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);   
    if (!isPlatformBrowser(platformId)) {
      return true;
    }
    const rpta = lService.verificar();
    if(!rpta){
      router.navigate(['/iniciosesion']);
      return false;
    }
    return rpta;

};