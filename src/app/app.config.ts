import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { JwtModule } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';
import { NoopAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

// Token getter para SSR
export function tokenGetter() {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    return sessionStorage.getItem('token');
  }
  return null;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()), 

    // Condicional: si estamos en el navegador usamos animaciones, si no (SSR) usamos noop
    typeof window !== 'undefined' ? provideAnimations() : importProvidersFrom(NoopAnimationsModule),

    provideCharts(withDefaultRegisterables()),

    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['portalfinanza.azurewebsites.net/'],
          disallowedRoutes: [
            'https://portalfinanza.azurewebsites.net//login', 
            'https://portalfinanza.azurewebsites.net/registrarusuario',
            'https://portalfinanza.azurewebsites.net/registrarusuario/listarusuarios',
            'https://portalfinanza.azurewebsites.net/registrarusuario/listarroles',
            'https://portalfinanza.azurewebsites.net/api/v1/authentication/**',
            'https://portalfinanza.azurewebsites.net/v3/api-docs/**',
            'https://portalfinanza.azurewebsites.net/swagger-ui.html',
            'https://portalfinanza.azurewebsites.net/swagger-ui/**',
            'https://portalfinanza.azurewebsites.net/swagger-resources/**',
            'https://portalfinanza.azurewebsites.net/webjars/**'
          ],
        },
      })
    )
  ],
};
