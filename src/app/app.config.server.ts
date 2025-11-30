
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config'; 


const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

// Aquí se fusionan la config principal (con las rutas) y la del servidor
export const config = mergeApplicationConfig(appConfig, serverConfig);